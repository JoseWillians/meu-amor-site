import './Carousel.css';

export default function Carousel({ imagens, direction = 'up' }) {
  return (
    <div className={`carousel ${direction}`}>
      <div className="carousel-inner">
        {imagens.concat(imagens).map((img, i) => (
          <img key={i} src={`imagens/${img}`} alt="amor" />
        ))}
      </div>
    </div>
  );
}
