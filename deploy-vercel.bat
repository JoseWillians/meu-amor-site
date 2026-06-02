@echo off
setlocal EnableExtensions

cd /d "%~dp0"

set "COMMIT_MSG=%~1"
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=Atualiza site meu amor"

echo.
echo === Validando projeto ===
call npm run lint
if errorlevel 1 goto :fail

call npm run build
if errorlevel 1 goto :fail

echo.
echo === Preparando commit ===
git status --short
git add .
if errorlevel 1 goto :fail

git diff --cached --quiet
if errorlevel 1 (
  git commit -m "%COMMIT_MSG%"
  if errorlevel 1 goto :fail
) else (
  echo Nenhuma mudanca para commitar.
)

echo.
echo === Enviando para GitHub ===
for /f "tokens=*" %%b in ('git branch --show-current') do set "CURRENT_BRANCH=%%b"
git push origin %CURRENT_BRANCH%
if errorlevel 1 goto :fail

echo.
echo === Tentando desativar GitHub Pages ===
where gh >nul 2>nul
if errorlevel 1 (
  echo GitHub CLI nao encontrado. Pulei a etapa de desativar GitHub Pages.
) else (
  gh api -X DELETE repos/JoseWillians/meu-amor-site/pages >nul 2>nul
  if errorlevel 1 (
    echo Nao consegui desativar GitHub Pages pelo gh. Talvez ja esteja desativado ou falte login/permissao.
  ) else (
    echo GitHub Pages desativado.
  )
)

echo.
echo === Deploy na Vercel ===
where vercel >nul 2>nul
if errorlevel 1 (
  call npx vercel --prod
) else (
  call vercel --prod
)
if errorlevel 1 goto :fail

echo.
echo Deploy concluido.
echo Lembre de configurar na Vercel as variaveis VITE_CONTENTFUL_SPACE_ID e VITE_CONTENTFUL_ACCESS_TOKEN.
exit /b 0

:fail
echo.
echo O deploy foi interrompido por erro. Veja a mensagem acima.
exit /b 1
