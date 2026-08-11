// Hero.jsx
import React from "react";
import heroImage from "./assets/hero52.png"; // ajusta a tu imagen real

export default function Hero() {
  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    />
  );
}