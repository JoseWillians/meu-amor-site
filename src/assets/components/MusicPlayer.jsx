import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './MusicPlayer.css';

const musicas = [
  {
    src: `${import.meta.env.BASE_URL}musicas/musica1.mp3`,
    titulo: 'Amigo Apaixonado',
    artista: 'Victor & Leo',
  },
  {
    src: `${import.meta.env.BASE_URL}musicas/musica2.mp3`,
    titulo: 'Meu Eu Em Você',
    artista: 'Victor & Leo',
  },
  {
    src: `${import.meta.env.BASE_URL}musicas/musica3.mp3`,
    titulo: 'Na Linha do Tempo',
    artista: 'Victor & Leo',
  },
  {
    src: `${import.meta.env.BASE_URL}musicas/musica4.mp3`,
    titulo: 'Tem Que Ser Você',
    artista: 'Victor & Leo',
  },
  {
    src: `${import.meta.env.BASE_URL}musicas/musica5.mp3`,
    titulo: 'Retorno de Saturno',
    artista: 'Detonautas',
  },
  {
    src: `${import.meta.env.BASE_URL}musicas/musica6.mp3`,
    titulo: 'Mágica',
    artista: 'Calcinha Preta',
  },
  {
    src: `${import.meta.env.BASE_URL}musicas/musica7.mp3`,
    titulo: 'Você Me Faz Tão Bem',
    artista: 'Detonautas',
  },
  {
    src: `${import.meta.env.BASE_URL}musicas/musica8.mp3`,
    titulo: 'Último Romance',
    artista: 'Los Hermanos',
  },
  {
    src: `${import.meta.env.BASE_URL}musicas/musica9.mp3`,
    titulo: 'Me Leva Pra Casa',
    artista: 'Zezé Di Camargo & Luciano',
  },
  {
    src: `${import.meta.env.BASE_URL}musicas/musica10.mp3`,
    titulo: 'Diga Sim Pra Mim',
    artista: 'Isabella Taviani',
  },
  {
    src: `${import.meta.env.BASE_URL}musicas/musica11.mp3`,
    titulo: 'Declaração',
    artista: 'Dorgival Dantas',
  },
];

const embaralhar = (items) => [...items].sort(() => Math.random() - 0.5);
const FIRST_TRACK_TITLE = 'Me Leva Pra Casa';

const aplicarCapas = (capas) =>
  musicas.map((musica, index) => ({
    ...musica,
    capa: capas[index % capas.length],
  }));

const criarFila = (musicasComCapas) => {
  const primeira = musicasComCapas.find((musica) => musica.titulo === FIRST_TRACK_TITLE);
  const restantes = musicasComCapas.filter((musica) => musica.titulo !== FIRST_TRACK_TITLE);
  return primeira ? [primeira, ...embaralhar(restantes)] : embaralhar(musicasComCapas);
};

export default function MusicPlayer({ capas = [], onReady }) {
  const audioRef = useRef(null);
  const fila = useMemo(
    () => criarFila(aplicarCapas(capas.length ? embaralhar(capas) : [`${import.meta.env.BASE_URL}capas/capa1.jpg`])),
    [capas]
  );
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [tempoAtual, setTempoAtual] = useState(0);
  const [duracao, setDuracao] = useState(0);
  const [volume, setVolume] = useState(0.72);
  const musicaAtual = fila[indiceAtual];

  const formatarTempo = (segundos) => {
    if (!Number.isFinite(segundos)) return '0:00';
    const minutos = Math.floor(segundos / 60);
    const resto = Math.floor(segundos % 60).toString().padStart(2, '0');
    return `${minutos}:${resto}`;
  };

  const tocar = useCallback(() => {
    audioRef.current
      ?.play()
      .then(() => {
        setIsPlaying(true);
        onReady?.();
      })
      .catch(() => setIsPlaying(false));
  }, [onReady]);

  const pausar = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const trocarMusica = useCallback(
    (direcao) => {
      setIndiceAtual((indice) => (indice + direcao + fila.length) % fila.length);
      setProgresso(0);
      setIsPlaying(true);
      onReady?.();
    },
    [fila.length, onReady]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const atualizarProgresso = () => {
      if (!audio.duration) return;
      setTempoAtual(audio.currentTime);
      setDuracao(audio.duration);
      setProgresso((audio.currentTime / audio.duration) * 100);
    };

    const atualizarDuracao = () => {
      setDuracao(audio.duration || 0);
    };

    const tocarProxima = () => trocarMusica(1);

    audio.addEventListener('timeupdate', atualizarProgresso);
    audio.addEventListener('loadedmetadata', atualizarDuracao);
    audio.addEventListener('ended', tocarProxima);

    return () => {
      audio.removeEventListener('timeupdate', atualizarProgresso);
      audio.removeEventListener('loadedmetadata', atualizarDuracao);
      audio.removeEventListener('ended', tocarProxima);
    };
  }, [trocarMusica]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (isPlaying) tocar();
  }, [indiceAtual, isPlaying, tocar]);

  return (
    <section className="music-player" aria-label="Player de músicas do casal">
      <audio ref={audioRef} src={musicaAtual.src} preload="metadata" />

      <div className="music-info">
        <img src={musicaAtual.capa} alt="" className="cover" loading="lazy" />
        <div className="details">
          <div className="title">{musicaAtual.titulo}</div>
          <div className="artist">{musicaAtual.artista}</div>
          <div className="shuffle-note">{isPlaying ? 'Tocando agora' : 'Fila aleatória'}</div>
        </div>
      </div>

      <div className="controls">
        <div className="button-group">
          <button onClick={() => trocarMusica(-1)} aria-label="Tocar música anterior">⏮</button>
          <button onClick={isPlaying ? pausar : tocar} aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={() => trocarMusica(1)} aria-label="Tocar próxima música">⏭</button>
        </div>

        <div className="progress-bar" role="progressbar" aria-label="Progresso da música" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progresso)}>
          <div className="progress" style={{ width: `${progresso}%` }} />
        </div>

        <div className="player-meta">
          <span>{formatarTempo(tempoAtual)}</span>
          <label>
            Volume
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
            />
          </label>
          <span>{formatarTempo(duracao)}</span>
        </div>
      </div>
    </section>
  );
}
