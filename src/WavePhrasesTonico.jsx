// components/WavePhrasesTonico.jsx
import React, { useEffect, useRef } from 'react';

function ArcLine({ text, amplitude = 12, speed = 10.5, waveWidth = 4 }) {
  const chars = text.split('');
  const letterRefs = useRef([]);

  useEffect(() => {
    let frame;
    const start = performance.now();

    const animate = (now) => {
      const t = (now - start) / 1000;

      letterRefs.current.forEach((el, i) => {
        if (!el) return;
        const wavePos = ((t * speed) % (chars.length + waveWidth)) - waveWidth / 2;
        const dist = i - wavePos;
        const influence = Math.exp(-(dist * dist) / (2 * waveWidth));
        const lift = -amplitude * influence;
        el.style.transform = `translateY(${lift}px)`;
      });

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [chars.length, amplitude, speed, waveWidth]);

  return (
    <span className="wave-line">
      {chars.map((ch, i) => (
        <span
          key={i}
          ref={(el) => (letterRefs.current[i] = el)}
          className="wave-letter"
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  );
}

// Posiciones por defecto (mismas que usabas para esta variante)
const DEFAULT_POSITIONS = [
  { bottom: '-24%', right: '119%', rotate: '-3deg' },
  { bottom: '-24%', right: '4%',   rotate: '2deg'  },
  { bottom: '-24%', right: '32%',  rotate: '-2deg' },
  { bottom: '-25%', right: '54%',  rotate: '-1deg'  },
];

const WavePhrasesTonico = ({ positions = DEFAULT_POSITIONS }) => {
  const phrases = [
    "Ayuda a fortalecer el cabello.",
    "Favorece el crecimiento.",
    "Nutre profundamente.",
    "Cabello con mejor apariencia y mayor densidad con el uso constante."
  ];

  return (
    <>
      {phrases.map((phrase, index) => {
        const pos = positions[index] || {};
        return (
          <div
            key={index}
            className="wave-phrase-floating"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              transform: `rotate(${pos.rotate || '0deg'})`,
            }}
          >
            <span className="wave-phrase-bullet">✦</span>{' '}
            <ArcLine text={phrase} />
          </div>
        );
      })}
    </>
  );
};

export default WavePhrasesTonico;