param(
  [Parameter(Mandatory = $true)]
  [string]$FotosPath,

  [string]$SpaceId = "2ni9b9hwt4fv",
  [string]$EnvironmentId = "master",
  [string]$ContentTypeId = "fotoDoCarrossel",
  [string]$Locale = "en-US"
)

$ErrorActionPreference = "Stop"

if (-not $env:CONTENTFUL_MANAGEMENT_TOKEN) {
  throw "Defina CONTENTFUL_MANAGEMENT_TOKEN antes de executar."
}

if (-not (Test-Path -LiteralPath $FotosPath)) {
  throw "Pasta de fotos nao encontrada: $FotosPath"
}

$headers = @{
  Authorization = "Bearer $env:CONTENTFUL_MANAGEMENT_TOKEN"
}

$jsonHeaders = @{
  Authorization = "Bearer $env:CONTENTFUL_MANAGEMENT_TOKEN"
  "Content-Type" = "application/vnd.contentful.management.v1+json"
}

$baseUrl = "https://api.contentful.com/spaces/$SpaceId/environments/$EnvironmentId"
$uploadUrl = "https://upload.contentful.com/spaces/$SpaceId/uploads"

function Invoke-ContentfulJson {
  param(
    [string]$Method,
    [string]$Uri,
    [object]$Body = $null,
    [hashtable]$ExtraHeaders = @{}
  )

  $requestHeaders = $jsonHeaders.Clone()
  foreach ($key in $ExtraHeaders.Keys) {
    $requestHeaders[$key] = $ExtraHeaders[$key]
  }

  $params = @{
    Method = $Method
    Uri = $Uri
    Headers = $requestHeaders
  }

  if ($null -ne $Body) {
    $params.Body = ($Body | ConvertTo-Json -Depth 20)
  }

  Invoke-RestMethod @params
}

function Publish-Resource {
  param(
    [string]$Kind,
    [string]$Id,
    [int]$Version
  )

  Invoke-ContentfulJson `
    -Method Put `
    -Uri "$baseUrl/$Kind/$Id/published" `
    -ExtraHeaders @{ "X-Contentful-Version" = "$Version" } | Out-Null
}

function Get-MimeType {
  param([string]$Extension)

  switch ($Extension.ToLowerInvariant()) {
    ".jpg" { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    ".png" { "image/png" }
    ".webp" { "image/webp" }
    default { "application/octet-stream" }
  }
}

$existing = Invoke-ContentfulJson -Method Get -Uri "$baseUrl/entries?content_type=$ContentTypeId&limit=1000"
$maxOrder = 0

foreach ($item in $existing.items) {
  $order = $item.fields.ordem.$Locale
  if ($null -ne $order) {
    $orderNumber = [int]$order
    if ($orderNumber -gt $maxOrder) {
      $maxOrder = $orderNumber
    }
  }
}

$files = Get-ChildItem -LiteralPath $FotosPath -File |
  Where-Object { $_.Extension.ToLowerInvariant() -in @(".jpg", ".jpeg", ".png", ".webp") } |
  Sort-Object Name

$created = @()
$failed = @()
$nextOrder = $maxOrder + 1

foreach ($file in $files) {
  $title = "imagem$nextOrder"
  Write-Host "Enviando $title <- $($file.Name)"

  try {
    $mimeType = Get-MimeType -Extension $file.Extension
    $uploadHeaders = @{
      Authorization = "Bearer $env:CONTENTFUL_MANAGEMENT_TOKEN"
      "Content-Type" = "application/octet-stream"
    }

    $upload = Invoke-RestMethod -Method Post -Uri $uploadUrl -Headers $uploadHeaders -InFile $file.FullName

    $assetBody = @{
      fields = @{
        title = @{ $Locale = $title }
        file = @{
          $Locale = @{
            contentType = $mimeType
            fileName = "$title$($file.Extension.ToLowerInvariant())"
            uploadFrom = @{
              sys = @{
                type = "Link"
                linkType = "Upload"
                id = $upload.sys.id
              }
            }
          }
        }
      }
    }

    $asset = Invoke-ContentfulJson -Method Post -Uri "$baseUrl/assets" -Body $assetBody
    Invoke-ContentfulJson -Method Put -Uri "$baseUrl/assets/$($asset.sys.id)/files/$Locale/process" -ExtraHeaders @{ "X-Contentful-Version" = "$($asset.sys.version)" } | Out-Null

    $processedAsset = $null
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
      Start-Sleep -Seconds 2
      $processedAsset = Invoke-ContentfulJson -Method Get -Uri "$baseUrl/assets/$($asset.sys.id)"
      if ($processedAsset.fields.file.$Locale.url) { break }
    }

    if (-not $processedAsset.fields.file.$Locale.url) {
      throw "Asset nao terminou o processamento."
    }

    Publish-Resource -Kind "assets" -Id $processedAsset.sys.id -Version $processedAsset.sys.version
    $publishedAsset = Invoke-ContentfulJson -Method Get -Uri "$baseUrl/assets/$($asset.sys.id)"

    $entryBody = @{
      fields = @{
        titulo = @{ $Locale = $title }
        ordem = @{ $Locale = $nextOrder }
        imagem = @{
          $Locale = @{
            sys = @{
              type = "Link"
              linkType = "Asset"
              id = $publishedAsset.sys.id
            }
          }
        }
      }
    }

    $entry = Invoke-ContentfulJson -Method Post -Uri "$baseUrl/entries" -Body $entryBody -ExtraHeaders @{ "X-Contentful-Content-Type" = $ContentTypeId }
    Publish-Resource -Kind "entries" -Id $entry.sys.id -Version $entry.sys.version

    $created += [pscustomobject]@{
      Ordem = $nextOrder
      Titulo = $title
      Arquivo = $file.Name
      EntryId = $entry.sys.id
      AssetId = $publishedAsset.sys.id
    }

    $nextOrder++
  }
  catch {
    $failed += [pscustomobject]@{
      Titulo = $title
      Arquivo = $file.Name
      Erro = $_.Exception.Message
    }
  }
}

Write-Host ""
Write-Host "Criadas: $($created.Count)"
Write-Host "Falhas: $($failed.Count)"

if ($failed.Count -gt 0) {
  $failed | Format-Table -AutoSize
  exit 1
}

$created | Select-Object -First 5 | Format-Table -AutoSize
if ($created.Count -gt 5) {
  Write-Host "... ate imagem$($nextOrder - 1)"
}
