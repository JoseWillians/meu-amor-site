
import { useState, useEffect } from 'react'; // Adicionado useEffect
import { client } from './contentfulClient'; // Adicionado
import Contador from './assets/components/Contador.jsx';
import MusicPlayer from './assets/components/MusicPlayer.jsx';
import Carousel from './assets/components/Carousel.jsx';
import IntroScreen from './assets/components/IntroScreen.jsx';
import './App.css';

// O ARRAY ANTIGO 'imagens' FOI REMOVIDO DAQUI

export default function App() {
  const [mostrarMensagem, setMostrarMensagem] = useState(false);
  
  // CÓDIGO ADICIONADO
  const [fotosContentful, setFotosContentful] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  client.getEntries({
    content_type: 'fotoDoCarrossel'
    // A linha 'order' foi removida para focar apenas no embaralhamento
  })
  .then((response) => {
    // ---- TODA A LÓGICA ACONTECE AQUI DENTRO ----

    // 1. Pegamos a lista de fotos que o Contentful nos deu.
    const fotosOriginais = response.items;

    // 2. Embaralhamos essa lista.
    const fotosEmbaralhadas = fotosOriginais.sort(() => Math.random() - 0.5);

    // 3. Salvamos a lista JÁ EMBARALHADA no estado.
    setFotosContentful(fotosEmbaralhadas);

    // 4. Finalizamos o carregamento.
    setLoading(false);
  })
  .catch((error) => {
    console.error("Erro ao buscar fotos do Contentful:", error);
    setLoading(false);
  });
}, []); // O array vazio [] no final é importante
  // FIM DO CÓDIGO ADICIONADO

  const handlePlay = () => {
    setMostrarMensagem(true);
  };

  // CÓDIGO ADICIONADO
  // Transforma o array de objetos do Contentful em um array de URLs
  const imagens = fotosContentful.map(foto => `https:${foto.fields.imagem?.fields?.file?.url}`);

  // Enquanto as fotos carregam, exibe uma mensagem
  if (loading) {
    return <div className="container" style={{justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem'}}>Carregando memórias...💖</div>;
  }
  // FIM DO CÓDIGO ADICIONADO

  return (
    <div className="container">
      <IntroScreen />
      <div className="carousel-container left">
        {/* Nenhuma mudança necessária aqui! */}
        <Carousel imagens={imagens} direction="down" />
      </div>

      <main>
        <h1>❤ Eu te amo ❤</h1>
        <Contador />
        <MusicPlayer onPlay={handlePlay} />
        
        <p className={`mensagem ${mostrarMensagem ? 'visivel' : ''}`}>
          Desde que te conheci, sabíamos que havia algo especial.<br />
          De colegas de sala a amigos.<br />
          De amigos a namorados.<br />
          Com medo de te perder, reprimi um pouco.<br />
          Por sentir demais.<br />
          Por medo de amar.<br />
          Mas como o tempo é belo, nos fez cruzar novamente.<br />
          Te amar é uma escolha,<br />
          Uma escolha da qual não me arrependo.<br />
          Você é a mulher da minha vida.<br />
          Você é luz.<br />
          Te quero de domingo a domingo.<br />
          Te amar é algo único.<br />
          És doce, mas não abuso.<br />
          E, sinceramente, não consigo ser apenas um amigo seu — e cá estamos hoje.<br />
          Tentando fazer disso algo bom.<br />
          Obrigado por ser você.<br />
          Obrigado por entrelaçar minha vida com seus olhos castanhos e seus cabelos cacheados.<br />
          Te amo. <br />
          Feliz Dia dos Namorados.💖<br />
        </p>
      </main>

      <div className="carousel-container right">
        {/* Nenhuma mudança necessária aqui! */}
        <Carousel imagens={imagens} direction="right" />
      </div>
    </div>
  );
}
