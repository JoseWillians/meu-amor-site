import { useRef } from 'react';

export default function MusicPlayer() {
  const m1 = useRef(null);
  const m2 = useRef(null);

  const tocarMusicas = () => {
    m1.current.play();
    m1.current.onended = () => m2.current.play();
    m2.current.onended = () => tocarMusicas(); // repete a sequência
  };

  return (
    <>
      <button onClick={tocarMusicas} className="botao-musica">
        Tocar Músicas 🎵
      </button>
      <audio ref={m1} src={`${import.meta.env.BASE_URL}musicas/musica1.mp3`} />
      <audio ref={m2} src={`${import.meta.env.BASE_URL}musicas/musica2.mp3`} />
    </>
  );
}
