import { useMemo, useState } from 'react';
import './IntroScreen.css';

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const createHearts = (count) =>
  Array.from({ length: count }, (_, index) => ({
    id: index,
    left: `${randomBetween(4, 94).toFixed(1)}%`,
    top: `${randomBetween(8, 86).toFixed(1)}%`,
    size: `${randomBetween(26, 86).toFixed(0)}px`,
    delay: `${randomBetween(0, 4).toFixed(2)}s`,
    duration: `${randomBetween(8, 15).toFixed(2)}s`,
    photo: index % 3 === 0 || index % 7 === 0,
  }));

const IntroScreen = ({ imagens = [] }) => {
  const [hide, setHide] = useState(false);
  const [visible, setVisible] = useState(true);
  const hearts = useMemo(() => createHearts(28), []);

  const handleClose = () => {
    setHide(true);
    setTimeout(() => setVisible(false), 1000); // tempo da transição
  };

  if (!visible) return null;

  return (
    <div className={`intro-screen ${hide ? 'fade-out' : ''}`}>
      <div className="heart-field" aria-hidden="true">
        {hearts.map((heart, index) => {
          const image = heart.photo ? imagens[index % imagens.length] : null;

          return (
            <span
              className={`floating-heart ${image ? 'with-photo' : ''}`}
              key={heart.id}
              style={{
                '--left': heart.left,
                '--top': heart.top,
                '--size': heart.size,
                '--delay': heart.delay,
                '--duration': heart.duration,
                '--image': image ? `url(${image})` : undefined,
              }}
            />
          );
        })}
      </div>

      <div className="intro-box">
        <span className="intro-kicker">Feito com carinho</span>
        <h1>Feliz Dia dos Namorados!</h1>
        <p>
          Uma página só nossa, com memórias, música e um recado guardado para você.
        </p>
        <p className="small">Com amor, especialmente para você Joanna Cristina.</p>
        <button className="intro-btn" onClick={handleClose}>Abrir</button>
      </div>
    </div>
  );
};

export default IntroScreen;
