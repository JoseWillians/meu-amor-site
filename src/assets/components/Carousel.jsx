import './Carousel.css';

export default function Carousel({ imagens, direction = 'up', onImageClick }) {
  return (
    <div className={`carousel ${direction}`}>
      <div className="carousel-inner">
        {imagens.concat(imagens).map((img, i) => (
          <button
            className="carousel-photo-button"
            key={`${img}-${i}`}
            onClick={() => onImageClick?.(img)}
            type="button"
            aria-label="Abrir foto em destaque"
          >
            <img src={img} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
