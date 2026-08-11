// CombosMujer.jsx
import React, { useState } from "react";
import combo1 from "./assets/Combo6.png";
import combo2 from "./assets/Combo103.png";
import combo3 from "./assets/Combo8.png";

const COMBOS = [
  { image: combo1, title: "Combo Crecimiento" },
  { image: combo2, title: "Combo Hidratación" },
  { image: combo3, title: "Combo Completo" },
];

const VISIBLE_ITEMS = 3;

export default function CombosMujer() {
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, COMBOS.length - VISIBLE_ITEMS);

  const next = () => setIndex((i) => Math.min(i + 1, maxIndex));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="combos-container">
      <div className="combos-viewport">
        <div
          className="combos-track"
          style={{
            transform: `translateX(-${index * (100 / VISIBLE_ITEMS)}%)`,
          }}
        >
          {COMBOS.map((combo, i) => (
            <a
              key={i}
              href="#contacto"
              className="combo-card"
              style={{ width: `${100 / VISIBLE_ITEMS}%` }}
            >
              <div className="combo-image-wrapper">
                <img src={combo.image} alt={combo.title} className="combo-image" />
              </div>
              <div className="combo-label">
                <span>{combo.title}</span>
                <span className="combo-arrow">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="combos-nav">
        <button className="combos-nav-btn" onClick={prev} disabled={index === 0}>
          ‹
        </button>
        <button className="combos-nav-btn" onClick={next} disabled={index >= maxIndex}>
          ›
        </button>
      </div>
    </div>
  );
}