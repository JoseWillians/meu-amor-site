import './App.css';
import MusicPlayer from './assets/components/MusicPlayer.jsx';
import Carousel from './assets/components/Carousel.jsx';

const imagens = [
  "Imagem1.jpg", "Imagem2.jpg", "Imagem3.jpg", "Imagem4.jpg", "Imagem5.jpg", "Imagem6.jpg", "Imagem7.jpg", "Imagem8.jpg", "Imagem9.jpg", "Imagem10.jpg", "Imagem11.jpg", "Imagem12.jpg", "Imagem13.jpg", "Imagem14.jpg", "Imagem15.jpg", "Imagem16.jpg", "Imagem17.jpg", "Imagem18.jpg", "Imagem19.jpg", "Imagem20.jpg", "Imagem21.jpg", "Imagem22.jpg", "Imagem23.jpg", "Imagem24.jpg", "Imagem25.jpg", "Imagem26.jpg", "Imagem27.jpg", "Imagem28.jpg", "Imagem29.jpg", "Imagem30.jpg", "Imagem31.jpg", "Imagem32.jpg", "Imagem33.jpg", "Imagem34.jpg", "Imagem35.jpg", "Imagem36.jpg", "Imagem37.jpg", "Imagem38.jpg"
];

export default function App() {
  return (
    <div className="container">
      <div className="carousel-container left">
        <Carousel imagens={imagens} direction="up" />
      </div>

      <main>
        <h1>❤ Eu te amo ❤</h1>
        <MusicPlayer />
        <p className="mensagem">
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
         Te amo. Feliz Dia dos Namorados.💖<br />
        </p>
      </main>

      <div className="carousel-container right">
        <Carousel imagens={imagens} direction="down" />
      </div>
    </div>
  );
}

