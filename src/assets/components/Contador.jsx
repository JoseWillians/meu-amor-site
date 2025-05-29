import { useEffect, useState } from "react";
import "./Contador.css";



export default function Contador() {
  // 1) Inicializa todas as propriedades com 0
  const [tempo, setTempo] = useState({
    totalMeses: 0,
    totalSemanas: 0,
    totalDias: 0,
    totalHoras: 0,
    totalMinutos: 0,
    totalSegundos: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });
  const fmt = (n) => n.toLocaleString('pt-BR');
  const dataInicio = new Date("2024-10-05T21:30:00");

  useEffect(() => {
    const atualizar = () => {
      const agora = new Date();
      const diffMs = agora - dataInicio;

      const totalSegundos = Math.floor(diffMs / 1000);
      const totalMinutos = Math.floor(totalSegundos / 60);
      const totalHoras = Math.floor(totalMinutos / 60);
      const totalDias = Math.floor(totalHoras / 24);
      const totalSemanas = Math.floor(totalDias / 7);
      const totalMeses = Math.floor(totalDias / 30.4375);

      const horasRestantes = totalHoras % 24;
      const minutosRestantes = totalMinutos % 60;
      const segundosRestantes = totalSegundos % 60;

      setTempo({
        totalMeses,
        totalSemanas,
        totalDias,
        totalHoras,
        totalMinutos,
        totalSegundos,
        horas: horasRestantes,
        minutos: minutosRestantes,
        segundos: segundosRestantes,
      });
    };

    atualizar();
    const intervalo = setInterval(atualizar, 1000);
    return () => clearInterval(intervalo);
  }, []);

  // 2) Desestruturamos para facilitar o JSX
  const {
    totalMeses,
    totalSemanas,
    totalDias,
    totalHoras,
    totalMinutos,
    totalSegundos,
    horas,
    minutos,
    segundos,
  } = tempo;

  return (
    <div className="contador">
      <p>
        Estamos juntos há:<br />
        <strong>{fmt(totalMeses)}</strong> meses,&nbsp;
        <strong>{fmt(totalSemanas)}</strong> semanas,&nbsp;
        <strong>{fmt(totalDias)}</strong> dias,&nbsp;
        <strong>{fmt(totalHoras)}</strong> horas,&nbsp;
        <strong>{fmt(totalMinutos)}</strong> minutos,&nbsp;
        <strong>{fmt(totalSegundos)}</strong> segundos 💞
      </p>
    </div>
  );
}