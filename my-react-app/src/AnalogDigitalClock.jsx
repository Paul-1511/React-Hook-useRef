import React, { useState, useEffect, useRef } from 'react';
import './AnalogDigitalClock.css';

const AnalogDigitalClock = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const intervalRef = useRef(null);
  
  // Referencias para las agujas
  const hourHandRef = useRef(null);
  const minuteHandRef = useRef(null);
  const secondHandRef = useRef(null);

  // Formatear tiempo digital
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

  // Actualizar agujas
  const updateClockHands = (totalSeconds) => {
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600) % 12;

    if (secondHandRef.current) {
      secondHandRef.current.style.transform = `rotate(${seconds * 6}deg)`;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.style.transform = `rotate(${minutes * 6}deg)`;
    }
    if (hourHandRef.current) {
      hourHandRef.current.style.transform = `rotate(${hours * 30 + minutes * 0.5}deg)`;
    }
  };

  // Efecto principal
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1;
          updateClockHands(newTime);
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Controladores
  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
    updateClockHands(0);
  };
  const saveSession = () => {
    setSessions(prev => [...prev, {
      id: Date.now(),
      time: formatTime(time)
    }]);
  };

  return (
    <div className="clock-container">
      <h1></h1>
      
      {/* Reloj analógico */}
      <div className="analog-clock">
        <div className="clock-face">
          <div ref={hourHandRef} className="hand hour-hand"></div>
          <div ref={minuteHandRef} className="hand minute-hand"></div>
          <div ref={secondHandRef} className="hand second-hand"></div>
          <div className="center-circle"></div>
        </div>
      </div>
      
      {/* Display digital */}
      <div className="digital-display">{formatTime(time)}</div>
      
      {/* Controles */}
      <div className="controls">
        <button 
          onClick={toggleTimer} 
          className={`control-btn ${isRunning ? 'pause' : 'start'}`}
        >
          {isRunning ? '⏸' : '⏵'}
        </button>
        <button onClick={resetTimer} className="control-btn reset">⏹</button>
        <button 
          onClick={saveSession} 
          className="control-btn save"
          disabled={time === 0}
        >
          ⚡ Guardar
        </button>
      </div>
      
      {/* Sesiones guardadas */}
      {sessions.length > 0 && (
        <div className="sessions">
          <h3>Sesiones:</h3>
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

export default AnalogDigitalClock;