import { useState } from 'react';
import './IntroScreen.css';

const IntroScreen = () => {
  const [hide, setHide] = useState(false);
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setHide(true);
    setTimeout(() => setVisible(false), 1000); // tempo da transição
  };

  if (!visible) return null;

  const hearts = Array.from({ length: 20 }, (_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 5;
    const size = Math.random() * 20 + 10;
    
  });

  return (
    <div className={`intro-screen ${hide ? 'fade-out' : ''}`}>
      <div className="intro-box">
        <h1>💘 Feliz Dia dos Namorados! 💘</h1>
        <p>
          Para uma melhor experiência no celular, ative a função <strong>'Versão para computador'</strong><br />
          clicando nos três pontos no canto superior direito.
        </p>
        <p className="small">❤️ Com amor, este site foi feito especialmente para você ❤️</p>
        <button className="intro-btn" onClick={handleClose}>Ver</button>
      </div>
      {hearts}
    </div>
  );
};

export default IntroScreen;