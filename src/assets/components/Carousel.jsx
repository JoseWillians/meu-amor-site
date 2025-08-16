import './Carousel.css';

export default function Carousel({ imagens, direction = 'up' }) {
  return (
    <div className={`carousel ${direction}`}>
      <div className="carousel-inner">
        {imagens.concat(imagens).map((img, i) => (
          // A única alteração foi nesta linha, removendo o prefixo "imagens/"
          <img key={i} src={img} alt="Uma linda memória" />
        ))}
      </div>
    </div>
  );
}