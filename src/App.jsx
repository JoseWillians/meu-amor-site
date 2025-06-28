import { useState } from 'react';
import Contador from './assets/components/Contador.jsx';
import MusicPlayer from './assets/components/MusicPlayer.jsx';
import Carousel from './assets/components/Carousel.jsx';
import IntroScreen from './assets/components/IntroScreen.jsx';
import './App.css';

const imagens = [
  "Imagem18.jpg", "Imagem42.jpg", "Imagem59.jpg", "Imagem26.jpg", "Imagem9.jpg", "Imagem43.jpg", "Imagem2.jpg", "Imagem22.jpg", "Imagem24.jpg", "Imagem16.jpg", "Imagem3.jpg", "Imagem60.jpg", "Imagem36.jpg", "Imagem1.jpg", "Imagem31.jpg", "Imagem47.jpg", "Imagem33.jpg", "Imagem19.jpg", "Imagem13.jpg", "Imagem49.jpg", "Imagem23.jpg", "Imagem17.jpg", "Imagem5.jpg", "Imagem20.jpg", "Imagem28.jpg", "Imagem37.jpg", "Imagem44.jpg", "Imagem38.jpg", "Imagem10.jpg", "Imagem55.jpg", "Imagem40.jpg", "Imagem14.jpg", "Imagem30.jpg", "Imagem7.jpg", "Imagem56.jpg", "Imagem11.jpg", "Imagem46.jpg", "Imagem45.jpg", "Imagem34.jpg", "Imagem4.jpg", "Imagem27.jpg", "Imagem32.jpg", "Imagem25.jpg", "Imagem39.jpg", "Imagem15.jpg", "Imagem58.jpg", "Imagem12.jpg", "Imagem6.jpg", "Imagem50.jpg", "Imagem21.jpg", "Imagem53.jpg", "Imagem41.jpg", "Imagem8.jpg", "Imagem48.jpg", "Imagem29.jpg", "Imagem54.jpg", "Imagem35.jpg", "Imagem52.jpg", "Imagem57.jpg", "Imagem51.jpg"
];

export default function App() {
  const [mostrarMensagem, setMostrarMensagem] = useState(false);

  const handlePlay = () => {
    setMostrarMensagem(true);
  };

  return (
    
    <div className="container">
      <IntroScreen />
      <div className="carousel-container left">
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
        <Carousel imagens={imagens} direction="right" />
      </div>
    </div>
  );
}
