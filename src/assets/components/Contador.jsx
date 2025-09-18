import { useEffect, useState } from "react";
import "./Contador.css";

export default function Contador() {
  const [tempo, setTempo] = useState({
    anos: 0,
    totalMeses: 0,
    totalSemanas: 0,
    totalDias: 0,
    totalHoras: 0,
    totalMinutos: 0,
    totalSegundos: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
    mesesRestantes: 0,
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
      const totalMeses = Math.floor(totalDias / 30.4);

      const anos = Math.floor(totalMeses / 12);
      const mesesRestantes = totalMeses - anos * 12;

      const horasRestantes = totalHoras % 24;
      const minutosRestantes = totalMinutos % 60;
      const segundosRestantes = totalSegundos % 60;

      setTempo({
        anos,
        totalMeses,
        totalSemanas,
        totalDias,
        totalHoras,
        totalMinutos,
        totalSegundos,
        horas: horasRestantes,
        minutos: minutosRestantes,
        segundos: segundosRestantes,
        mesesRestantes,
      });
    };

    atualizar();
    const intervalo = setInterval(atualizar, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const {
    anos,
    mesesRestantes,
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
        {anos > 0 && (
          <>
            <strong>{fmt(anos)}</strong> {anos === 1 ? "ano" : "anos"}
            {mesesRestantes > 0 && (
              <>
                {" e "}
                <strong>{fmt(mesesRestantes)}</strong> {mesesRestantes === 1 ? "mês" : "meses"}
              </>
            )}
            ,&nbsp;
          </>
        )}
        
        <strong>{fmt(totalMeses)}</strong>  {totalMeses === 1 ? "mês" : "meses"},&nbsp;
        <strong>{fmt(totalSemanas)}</strong> {totalSemanas === 1 ? "semana" : "semanas"},&nbsp;
        <strong>{fmt(totalDias)}</strong> {totalDias === 1 ? "dia" : "dias"},&nbsp;
        <strong>{fmt(totalHoras)}</strong> {totalHoras === 1 ? "hora" : "horas"},&nbsp;
        <strong>{fmt(totalMinutos)}</strong> {totalMinutos === 1 ? "minuto" : "minutos"},&nbsp;
        <strong>{fmt(totalSegundos)}</strong> {totalSegundos === 1 ? "segundo" : "segundos"} 💞
      </p>
    </div>
  );
}
