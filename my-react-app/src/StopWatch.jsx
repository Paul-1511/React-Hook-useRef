// Prueba

import React, { useState, useEffect, useRef } from 'react';
import './Stopwatch.css';

const Stopwatch = () => {
  // Estado para el tiempo transcurrido en segundos
  const [time, setTime] = useState(0);
  // Estado para saber si el cronómetro está en marcha
  const [isRunning, setIsRunning] = useState(false);
  // Estado para almacenar las sesiones guardadas
  const [sessions, setSessions] = useState([]);
  // Ref para almacenar el ID del intervalo
  const intervalRef = useRef(null);

  // Efecto para manejar el inicio/detención del cronómetro
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Función para formatear el tiempo como HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  // Maneja el inicio/pausa del cronómetro
  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  // Reinicia el cronómetro
  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
  };

  // Guarda la sesión actual
  const handleSaveSession = () => {
    if (time > 0) {
      setSessions(prevSessions => [
        ...prevSessions,
        {
          id: Date.now(),
          time: formatTime(time)
        }
      ]);
    }
  };

  return (
    <div className="stopwatch-container">
      <h1>Cronómetro</h1>
      <div className="time-display">{formatTime(time)}</div>
      
      <div className="buttons-container">
        <button 
          onClick={handleStartPause}
          className={isRunning ? 'pause-btn' : 'start-btn'}
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        
        <button onClick={handleReset} className="reset-btn">
          Reiniciar
        </button>
        
        <button 
          onClick={handleSaveSession} 
          className="save-btn"
          disabled={time === 0}
        >
          Guardar Sesión
        </button>
      </div>

      {sessions.length > 0 && (
        <div className="sessions-list">
          <h2>Sesiones Guardadas</h2>
          <ul>
            {sessions.map((session, index) => (
              <li key={session.id}>
                <span>Sesión {index + 1}:</span>
                <span>{session.time}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Stopwatch;