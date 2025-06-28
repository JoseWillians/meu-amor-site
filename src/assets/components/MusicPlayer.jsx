import { useRef, useState, useEffect } from 'react';
import './MusicPlayer.css';

const musicas = [
  {
    src: `${import.meta.env.BASE_URL}musicas/musica1.mp3`,
    titulo: 'Amigo Apaixonado',
    capa: `${import.meta.env.BASE_URL}capas/capa1.jpg`
  },
  {
    src: `${import.meta.env.BASE_URL}musicas/musica2.mp3`,
    titulo: 'Meu Eu Em Você',
    capa: `${import.meta.env.BASE_URL}capas/capa1.jpg`
  },
  {
    src: `${import.meta.env.BASE_URL}musicas/musica3.mp3`,
    titulo: 'Na Linha do Tempo',
    capa: `${import.meta.env.BASE_URL}capas/capa2.jpg`
  },
  {
    src: `${import.meta.env.BASE_URL}musicas/musica4.mp3`,
    titulo: 'Tem Que Ser Você',
    capa: `${import.meta.env.BASE_URL}capas/capa1.jpg`
  },
  {
    src: `${import.meta.env.BASE_URL}musicas/musica5.mp3`,
    titulo: 'Retorno de Saturno',
    capa: `${import.meta.env.BASE_URL}capas/capa3.jpg`
  },
  {
    src: `${import.meta.env.BASE_URL}musicas/musica6.mp3`,
    titulo: 'Mágica',
    capa: `${import.meta.env.BASE_URL}capas/capa4.jpg`
  }
];

export default function MusicPlayer({ onPlay }) {
  const audioRefs = useRef(musicas.map(() => new Audio()));
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    const audio = audioRefs.current[indiceAtual];
    audio.src = musicas[indiceAtual].src;

    const atualizarProgresso = () => {
      if (!audio.duration) return;
      setProgresso((audio.currentTime / audio.duration) * 100);
    };

    const tocarProximaAuto = () => {
      tocarProxima();
    };

    audio.addEventListener('timeupdate', atualizarProgresso);
    audio.addEventListener('ended', tocarProximaAuto);

    return () => {
      audio.removeEventListener('timeupdate', atualizarProgresso);
      audio.removeEventListener('ended', tocarProximaAuto);
    };
  }, [indiceAtual]);

  useEffect(() => {
    // Pausa todas as outras músicas e reinicia o tempo
    audioRefs.current.forEach((audio, index) => {
      if (index !== indiceAtual) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    const audio = audioRefs.current[indiceAtual];
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying, indiceAtual]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (next && onPlay) onPlay(); // <- Notifica o App que começou a tocar
      return next;
    });
  };

  const tocarProxima = () => {
    const audioAtual = audioRefs.current[indiceAtual];
    audioAtual.pause();
    audioAtual.currentTime = 0;

    const proximo = (indiceAtual + 1) % musicas.length;
    setIndiceAtual(proximo);
    setIsPlaying(true);
  };

  const tocarAnterior = () => {
    const audioAtual = audioRefs.current[indiceAtual];
    audioAtual.pause();
    audioAtual.currentTime = 0;

    const anterior = (indiceAtual - 1 + musicas.length) % musicas.length;
    setIndiceAtual(anterior);
    setIsPlaying(true);
  };

  return (
    <div className="music-player">
      <div className="music-info">
        <img
          src={musicas[indiceAtual].capa}
          alt={`Capa da música ${musicas[indiceAtual].titulo}`}
          className="cover"
        />
        <div className="details">
          <div className="title">{musicas[indiceAtual].titulo}</div>
          <div className="artist">Victor&Leo</div>
        </div>
      </div>

      <div className="controls">
        <div className="button-group">
          <button onClick={tocarAnterior}>⏮️</button>
          <button onClick={togglePlayPause}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button onClick={tocarProxima}>⏭️</button>
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progresso}%` }}></div>
        </div>
      </div>
    </div>
  );
}
