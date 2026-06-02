
import { useCallback, useEffect, useMemo, useState } from 'react';
import { client } from './contentfulClient';
import Contador from './assets/components/Contador.jsx';
import MusicPlayer from './assets/components/MusicPlayer.jsx';
import Carousel from './assets/components/Carousel.jsx';
import IntroScreen from './assets/components/IntroScreen.jsx';
import './App.css';

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
const PHOTO_LIMIT = 80;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const createPreviewHearts = () =>
  Array.from({ length: 34 }, (_, index) => ({
    id: `${Date.now()}-${index}`,
    left: `${randomBetween(6, 94).toFixed(1)}%`,
    top: `${randomBetween(8, 88).toFixed(1)}%`,
    size: `${randomBetween(18, 46).toFixed(0)}px`,
    delay: `${randomBetween(0, 0.45).toFixed(2)}s`,
    duration: `${randomBetween(1.8, 3.6).toFixed(2)}s`,
  }));

const poemBlocks = [
  [
    'Eu não sei dizer em que momento exato tudo mudou,',
    'só sei que, quando percebi, meu mundo já tinha o seu nome.',
    'Você chegou como quem acende a casa por dentro,',
    'com esse jeito doce, forte e inteiro de ser você.',
  ],
  [
    'Desde então, os dias ganharam outro ritmo:',
    'mais riso nas horas simples,',
    'mais calma nos dias difíceis,',
    'mais vontade de ficar.',
  ],
  [
    'Amar você é encontrar beleza no detalhe,',
    'é guardar memórias como quem guarda estrelas no bolso,',
    'é escolher, todos os dias, caminhar do seu lado.',
  ],
  [
    'Obrigado por existir na minha vida,',
    'por entrelaçar seu caminho ao meu',
    'e por fazer do amor um lugar onde eu quero morar.',
  ],
  [
    'Eu te amo, Joanna Cristina.',
    'Hoje, amanhã e em todos os domingos que a vida permitir.',
  ],
];

const carta = [
  'Joanna Cristina,',
  'Se eu pudesse guardar tudo que sinto em algum lugar, eu escolheria exatamente este: um canto nosso, cheio de fotos, música e lembranças pequenas que dizem mais do que qualquer frase pronta.',
  'Eu amo a forma como você atravessa meus dias. Amo seu jeito, seu olhar, sua presença e até as saudades que você deixa quando não está por perto. Você me faz querer ser melhor sem me pedir isso, só por existir do meu lado.',
  'Este site é simples perto do tamanho do que sinto, mas cada detalhe aqui tem um pedaço meu tentando dizer a mesma coisa de jeitos diferentes: eu escolho você, eu cuido de você no meu coração, e eu quero continuar construindo memórias com você.',
  'Obrigado por ser meu amor, minha calma e uma das partes mais bonitas da minha vida.',
  'Com todo amor, José.',
];

const getOptimizedImageUrl = (foto) => {
  const url = foto.fields.imagem?.fields?.file?.url;
  if (!url) return null;

  return `https:${url}?w=1000&fit=fill&fm=webp&q=88`;
};

export default function App() {
  const [mostrarMensagem, setMostrarMensagem] = useState(false);
  const [preview, setPreview] = useState(null);
  const [cartaAberta, setCartaAberta] = useState(false);
  const [previewHearts, setPreviewHearts] = useState([]);
  const [fotosSelecionadas, setFotosSelecionadas] = useState({
    carrossel: [],
    capas: [],
  });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;

    client
      .getEntries({
        content_type: 'fotoDoCarrossel',
        include: 2,
        limit: 1000,
      })
      .then((response) => {
        if (!ativo) return;
        const fotosEmbaralhadas = shuffle(response.items);
        setFotosSelecionadas({
          carrossel: fotosEmbaralhadas.slice(0, PHOTO_LIMIT),
          capas: fotosEmbaralhadas.slice(PHOTO_LIMIT),
        });
      })
      .catch((error) => {
        console.error('Erro ao buscar fotos do Contentful:', error);
        if (ativo) setErro(true);
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const handlePlay = useCallback(() => {
    setMostrarMensagem(true);
  }, []);

  const abrirPreview = useCallback((imagem) => {
    setPreview(imagem);
    setPreviewHearts(createPreviewHearts());
  }, []);

  const fecharPreview = useCallback(() => {
    setPreview(null);
    setPreviewHearts([]);
  }, []);

  useEffect(() => {
    if (!preview && !cartaAberta) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') fecharPreview();
      if (event.key === 'Escape') setCartaAberta(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartaAberta, fecharPreview, preview]);

  const imagens = useMemo(
    () => fotosSelecionadas.carrossel.map(getOptimizedImageUrl).filter(Boolean),
    [fotosSelecionadas.carrossel]
  );

  const capasMusicas = useMemo(
    () => fotosSelecionadas.capas.map(getOptimizedImageUrl).filter(Boolean),
    [fotosSelecionadas.capas]
  );

  if (loading) {
    return (
      <div className="status-page">
        <p>Carregando memórias...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <IntroScreen imagens={imagens.slice(0, 14)} />

      {imagens.length > 0 && (
        <div className="carousel-container left">
          <Carousel imagens={imagens} direction="down" onImageClick={abrirPreview} />
        </div>
      )}

      <main className="love-card">
        <span className="eyebrow">Nossa história</span>
        <h1>Eu te amo</h1>
        <Contador />
        <MusicPlayer capas={capasMusicas} onReady={handlePlay} />

        {imagens.length > 0 && (
          <section className="mobile-gallery" aria-label="Galeria de memórias">
            {imagens.slice(0, 18).map((imagem) => (
              <button type="button" key={imagem} onClick={() => abrirPreview(imagem)} aria-label="Abrir foto em destaque">
                <img src={imagem} alt="" loading="lazy" />
              </button>
            ))}
          </section>
        )}

        {erro && (
          <p className="aviso">
            Não consegui carregar as fotos agora, mas o recado principal continua aqui.
          </p>
        )}
        
        <div className={`mensagem ${mostrarMensagem ? 'visivel' : ''}`}>
          {poemBlocks.map((block, blockIndex) => (
            <p className="poem-block" style={{ '--delay': `${blockIndex * 0.28}s` }} key={block.join('-')}>
              {block.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          ))}

          <button className="letter-button" type="button" onClick={() => setCartaAberta(true)}>
            Ler carta
          </button>
        </div>
      </main>

      {imagens.length > 0 && (
        <div className="carousel-container right">
          <Carousel imagens={imagens} direction="up" onImageClick={abrirPreview} />
        </div>
      )}

      {preview && (
        <div className="photo-preview" role="dialog" aria-modal="true" aria-label="Foto em destaque">
          <button className="preview-backdrop" onClick={fecharPreview} type="button" aria-label="Fechar foto" />
          <div className="preview-stage">
            <div className="preview-hearts" aria-hidden="true">
              {previewHearts.map((heart) => (
                <span
                  className="preview-heart"
                  key={heart.id}
                  style={{
                    '--left': heart.left,
                    '--top': heart.top,
                    '--size': heart.size,
                    '--delay': heart.delay,
                    '--duration': heart.duration,
                  }}
                />
              ))}
            </div>
            <img src={preview} alt="Memória em destaque" />
            <button className="preview-close" onClick={fecharPreview} type="button" aria-label="Fechar preview">×</button>
          </div>
        </div>
      )}

      {cartaAberta && (
        <div className="letter-modal" role="dialog" aria-modal="true" aria-label="Carta de amor">
          <button className="letter-backdrop" onClick={() => setCartaAberta(false)} type="button" aria-label="Fechar carta" />
          <article className="letter-paper">
            <button className="preview-close" onClick={() => setCartaAberta(false)} type="button" aria-label="Fechar carta">×</button>
            <span className="eyebrow">Carta</span>
            <h2>Para você</h2>
            {carta.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        </div>
      )}
    </div>
  );
}
