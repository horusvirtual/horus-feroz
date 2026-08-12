// App.jsx
import { useEffect, useRef } from "react";

// ===== COMPONENTES =====
import Hero from "./Hero";
import CombosHombre from "./CombosHombre";
import CombosMujer from "./CombosMujer";
import WhatsAppChat from "./WhatsAppChat";
import Testimonials from "./Testimonials";
import ContactSection from "./ContactSection";
import WavePhrases from "./WavePhrases";
import WavePhrasesTonico from "./WavePhrasesTonico";
import WavePhrasesTonicoMujer from "./WavePhrasesTonicoMujer";

// ===== ESTILOS =====
import "./WavePhrases.css";
import "./WavePhrasesTonico.css";
import "./WavePhrasesTonicoMujer.css";
import "./Combos.css";

// ===== LOGOS Y ASSETS GENERALES =====
import logoFeroz from "./assets/logo.png";
import footerIcon from "./assets/12.jpeg";

// ===== IMÁGENES DE PRODUCTOS =====
import bloodOrange from "./assets/shampoo_hombre_1.png";
import lemonLavender from "./assets/tonico_hombre.png";
import grapefruitRosemary from "./assets/balsamo_hombre.png";
import cherryCinnamon from "./assets/shampoo_mujer_1.png";
import mandarinSage from "./assets/tonico_mujer.png";

// ===== LOGOS POR SECCIÓN =====
import logoIzquierda1 from "./assets/dorada_hombre.png";
import logoDerecha1 from "./assets/dorada_hombre.png";
import logoIzquierda2 from "./assets/6.png";
import logoDerecha2 from "./assets/6.png";
import logoIzquierda3 from "./assets/cara_balsamo.png";
import logoDerecha3 from "./assets/cara_balsamo.png";
import logoIzquierda4 from "./assets/cara_dorada.png";
import logoDerecha4 from "./assets/cara_dorada.png";
import logoIzquierda5 from "./assets/cara_dorada.png";
import logoDerecha5 from "./assets/cara_dorada.png";

// ============================================================
// UTILIDADES DE COLOR PARA EL FONDO DINÁMICO EN SCROLL
// ============================================================
const HEX_STOPS = ["#FFFFFF", "#DBC3A7", "#FFC977", "#DBC3A7", "#FFFFFF"];

const RGB_STOPS = HEX_STOPS.map((h) => {
  const v = h.replace("#", "");
  return [
    Number.parseInt(v.substring(0, 2), 16),
    Number.parseInt(v.substring(2, 4), 16),
    Number.parseInt(v.substring(4, 6), 16),
  ];
});

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function colorAt(p) {
  const segs = RGB_STOPS.length - 1;
  const scaled = Math.min(Math.max(p, 0), 1) * segs;
  const idx = Math.min(Math.floor(scaled), segs - 1);
  const t = scaled - idx;
  const a = RGB_STOPS[idx];
  const b = RGB_STOPS[idx + 1];
  const r = Math.round(lerp(a[0], b[0], t));
  const g = Math.round(lerp(a[1], b[1], t));
  const bl = Math.round(lerp(a[2], b[2], t));
  return {
    rgb: `rgb(${r},${g},${bl})`,
    lum: r * 0.299 + g * 0.587 + bl * 0.114,
  };
}

// ============================================================
// GENERADOR DE BURBUJAS (determinístico con seed)
// ============================================================
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BUBBLES = (() => {
  const rnd = mulberry32(20240607);
  const variants = ["outline", "outline", "outline", "filled", "dotted"];
  const TOTAL_BUBBLES = 70;

  const getSize = (index) => {
    const total = TOTAL_BUBBLES;
    const smallThreshold = Math.floor(total * 0.68);
    const mediumThreshold = Math.floor(total * 0.9);
    const largeThreshold = Math.floor(total * 0.97);

    if (index < smallThreshold) {
      return Math.round(lerp(6, 20, rnd()));
    } else if (index < mediumThreshold) {
      return Math.round(lerp(21, 42, rnd()));
    } else if (index < largeThreshold) {
      return Math.round(lerp(43, 85, rnd()));
    } else {
      return Math.round(lerp(120, 220, rnd()));
    }
  };

  return Array.from({ length: TOTAL_BUBBLES }, (_, index) => {
    const size = getSize(index);
    const speedBase = 1 - Math.min(size / 140, 1);
    const speed = +lerp(1.2, 3.6, speedBase).toFixed(3);
    const isPlainOutline = size >= 43;
    const variant = isPlainOutline
      ? "outline"
      : variants[Math.floor(rnd() * variants.length)];

    return {
      left: +(rnd() * 100).toFixed(2),
      size,
      speed,
      baseY: +(rnd() * 100).toFixed(3),
      variant,
      isExtraLarge: isPlainOutline,
      opacity: isPlainOutline
        ? +lerp(0.15, 0.5, rnd()).toFixed(2)
        : +lerp(0.35, 0.85, rnd()).toFixed(2),
    };
  });
})();

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function App() {
  const navRef = useRef(null);
  const topBarRef = useRef(null);
  const railRef = useRef(null);
  const railFillRef = useRef(null);
  const bubbleLayerRef = useRef(null);
  const bubbleRefs = useRef([]);
  const animationRef = useRef(null);
  const lastScrollY = useRef(0);

  // Forzar scroll al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const body = document.body;
    const nav = navRef.current;
    const topBar = topBarRef.current;
    const rail = railRef.current;
    const railFill = railFillRef.current;
    const bubbleLayer = bubbleLayerRef.current;

    let ticking = false;
    let scrollY = 0;

    const bubblePositions = BUBBLES.map((b) => ({
      y: b.baseY * window.innerHeight,
    }));

    function updateBubbles(deltaTime) {
      const vh = window.innerHeight;
      const speedMultiplier = 2.2;

      bubbleRefs.current.forEach((el, i) => {
        if (!el) return;
        const b = BUBBLES[i];
        bubblePositions[i].y -= b.speed * speedMultiplier * deltaTime * 60;

        if (bubblePositions[i].y < -b.size * 2) {
          bubblePositions[i].y = vh + b.size + Math.random() * 200;
        }

        const yPos = bubblePositions[i].y;
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }

    function apply() {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      scrollY = window.scrollY;
      const progress = max > 0 ? scrollY / max : 0;
      const { rgb, lum } = colorAt(progress);

      body.style.backgroundColor = rgb;
      if (railFill) railFill.style.height = progress * 100 + "%";

      const scrollThreshold = 50;

      if (topBar) {
        if (scrollY > scrollThreshold) {
          topBar.classList.add("hidden");
          if (nav) {
            nav.classList.add("fixed-top");
            nav.classList.remove("has-top-bar");
          }
        } else {
          topBar.classList.remove("hidden");
          if (nav) {
            nav.classList.remove("fixed-top");
            nav.classList.add("has-top-bar");
          }
        }
      }

      const dark = lum < 140;
      if (rail) rail.classList.toggle("on-dark", dark);

      const isWhiteZone = lum > 227;
      if (bubbleLayer) bubbleLayer.classList.toggle("on-white", isWhiteZone);

      // EFECTO DE FLOTACIÓN POR SCROLL
      const sections = document.querySelectorAll(".product-section");
      const viewportHeight = window.innerHeight;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const shot = section.querySelector(".product-shot");
        if (!shot) return;

        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const sectionHeight = rect.height;
        const visibility = Math.min(1, visibleHeight / sectionHeight);

        if (visibility > 0.1) {
          const scrollDirection = scrollY > lastScrollY.current ? 1 : -1;
          const maxOffset = 15;
          const offset = -scrollDirection * maxOffset * visibility;

          shot.style.transform = `translateY(${offset}px)`;
          shot.style.transition =
            "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        } else {
          shot.style.transform = "translateY(0px)";
        }
      });

      lastScrollY.current = scrollY;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    }

    let lastTime = 0;

    function animateBubbles(time) {
      const deltaTime = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      updateBubbles(deltaTime);
      animationRef.current = requestAnimationFrame(animateBubbles);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);
    apply();

    animationRef.current = requestAnimationFrame(animateBubbles);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* ============================================================
          TOP BAR
          ============================================================ */}
      <div className="top-bar" ref={topBarRef}>
        <div className="top-bar-scroll">
          <span>✦ ENVÍOS A TODO COLOMBIA</span>
          <span>✦ PAGO CONTRA ENTREGA</span>
          <span>✦ ATENCIÓN PERSONALIZADA</span>
          <span>✦ PRODUCTO NUEVO Y SELLADO</span>
          <span>✦ ENVÍOS A TODO COLOMBIA</span>
          <span>✦ ATENCIÓN PERSONALIZADA</span>
          <span>✦ PAGO CONTRA ENTREGA</span>
          <span>✦ PRODUCTO NUEVO Y SELLADO</span>
        </div>
      </div>

      {/* ============================================================
          BUBBLE LAYER
          ============================================================ */}
      <div className="bubble-layer" ref={bubbleLayerRef} aria-hidden="true">
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            ref={(el) => (bubbleRefs.current[i] = el)}
            className={`bubble ${b.variant}${b.isExtraLarge ? " xl" : ""}`}
            style={{
              left: b.left + "%",
              width: b.size,
              height: b.size,
              opacity: b.opacity,
            }}
          />
        ))}
      </div>

      {/* ============================================================
          NAVEGACIÓN CON ANCLAS
          ============================================================ */}
      <nav id="nav" ref={navRef} className="has-top-bar">
        <div className="nav-left">
          <a
            href="#inicio"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
          >
            Inicio
          </a>
          <a
            href="#productos"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("productos");
            }}
          >
            Productos
          </a>
        </div>
        <img className="logo" src={logoFeroz} alt="Feroz" />
        <div className="nav-right">
          <a
            href="#testimonios"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("testimonios");
            }}
          >
            Testimonios
          </a>
          <a
            href="#contacto"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contacto");
            }}
          >
            Contáctanos
          </a>
        </div>
      </nav>

      {/* ============================================================
          PROGRESS RAIL
          ============================================================ */}
      <div className="rail" id="rail" ref={railRef}>
        <div className="rail-fill" id="railFill" ref={railFillRef} />
      </div>

      {/* ============================================================
          INICIO: HERO + COMBOS
          ============================================================ */}
      <div id="inicio">
        <Hero />

        <h2 className="combos-section-title">Combos Hombre</h2>
        <CombosHombre />

        <h2 className="combos-section-title">Combos Mujer</h2>
        <CombosMujer />
      </div>

<h2 className="products-title">Nuestros Productos</h2>
      {/* ============================================================
          SECCIÓN 1: SHAMPOO CRECIMIENTO HOMBRE
          ============================================================ */}
      <section
        id="productos"
        className="product-section"
        style={{
          background: "#FFFFFF",
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={logoIzquierda1}
          alt="Logo izquierda"
          className="product-logo top-left"
          style={{ width: "183px", height: "183px" }}
        />
        <img
          src={logoDerecha1}
          alt="Logo derecha"
          className="product-logo center-right"
          style={{ width: "183px", height: "183px" }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(10px, 2vw, 30px)",
            maxWidth: "1200px",
            width: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              flex: "0 0 auto",
              width: "min(45vw, 380px)",
              position: "relative",
              zIndex: 2,
              marginRight: "-5%",
            }}
          >
            <div className="product-shot" style={{ width: "100%" }}>
              <img
                src={bloodOrange}
                alt="Blood Orange"
                style={{
                  marginLeft: "58%",
                  marginTop: "52%",
                  width: "82%",
                  display: "block",
                }}
              />
            </div>
          </div>

          <div
            style={{
              flex: "1 1 auto",
              textAlign: "center",
              position: "relative",
              zIndex: 3,
            }}
          >
            <h1
              className="display"
              style={{
                    marginLeft: "5%",
                color: "#000000",
                fontSize: "clamp(56px, 8vw, 140px)",
                lineHeight: "0.85",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              <span>SHAMPOO CRECIMIENTO HOMBRE</span>
              <br />
              <span>FEROZ</span>
            </h1>

            <WavePhrases />

            <div
              style={{
                maxWidth: "500px",
                margin: "clamp(12px, 2vw, 24px) auto",
                textAlign: "left",
                padding: "0 clamp(10px, 2vw, 20px)",
              }}
            >
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Aplicar sobre el cuero cabelludo húmedo
              </p>
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Masajear suavemente y distribuir de forma uniforme
              </p>
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Dejar aplicado de 5 a 10 minutos
              </p>
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Enjuagar con abundante agua
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECCIÓN 2: TÓNICO CAPILAR HOMBRE
          ============================================================ */}
      <section
        className="product-section"
        style={{
          background: "#DBC3A7",
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(80px, 10vw, 120px) clamp(20px, 4vw, 48px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={logoIzquierda2}
          alt="Logo izquierda"
          className="product-logo top-left"
          style={{ width: "183px", height: "183px" }}
        />
        <img
          src={logoDerecha2}
          alt="Logo derecha"
          className="product-logo center-right"
          style={{ width: "183px", height: "183px" }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(10px, 2vw, 30px)",
            maxWidth: "1200px",
            width: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              flex: "0 0 auto",
              width: "min(45vw, 380px)",
              position: "relative",
              zIndex: 2,
              marginRight: "-5%",
            }}
          >
            <div className="product-shot" style={{ width: "100%" }}>
              <img
                src={lemonLavender}
                alt="Lemon Lavender"
                style={{
                  marginLeft: "59%",
                  marginTop: "-17%",
                  width: "74%",
                  display: "block",
                }}
              />
            </div>
          </div>

          <div
            style={{
              flex: "1 1 auto",
              textAlign: "center",
              position: "relative",
              zIndex: 3,
            }}
          >
            <h2
              className="display title2"
              style={{
                color: "#000000",
                fontSize: "clamp(56px, 8vw, 140px)",
                lineHeight: "0.85",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              <span>TÓNICO CAPILAR HOMBRE</span>
              <br />
              <span>FEROZ</span>
            </h2>

            <WavePhrasesTonico />

            <div
              style={{
                maxWidth: "500px",
                margin: "clamp(12px, 2vw, 24px) auto",
                textAlign: "left",
                padding: "0 clamp(10px, 2vw, 20px)",
              }}
            >
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Aplicar sobre el cuero cabelludo limpio y seco
              </p>
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Distribuir uniformemente en la zona a tratar
              </p>
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Masajear de 2 a 5 minutos
              </p>
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Aplicar de 2 a 3 veces al día
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECCIÓN 3: BÁLSAMO HOMBRE
          ============================================================ */}
      <section
        className="product-section"
        style={{
          background: "#FFC977",
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(80px, 10vw, 120px) clamp(20px, 4vw, 48px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={logoIzquierda3}
          alt="Logo izquierda"
          className="product-logo top-left"
          style={{ width: "183px", height: "183px" }}
        />
        <img
          src={logoDerecha3}
          alt="Logo derecha"
          className="product-logo center-right"
          style={{ width: "183px", height: "183px" }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(10px, 2vw, 30px)",
            maxWidth: "1200px",
            width: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              flex: "0 0 auto",
              width: "min(45vw, 380px)",
              position: "relative",
              zIndex: 2,
              marginRight: "-5%",
            }}
          >
            <div className="product-shot" style={{ width: "100%" }}>
              <img
                src={grapefruitRosemary}
                alt="Grapefruit Rosemary"
                style={{
                  marginLeft: "31%",
                  marginTop: "22%",
                  width: "100%",
                  display: "block",
                }}
              />
            </div>
          </div>

          <div
            style={{
              flex: "1 1 auto",
              textAlign: "center",
              position: "relative",
              zIndex: 3,
            }}
          >
            <h2
              className="display title3"
              style={{
                color: "#000000",
                fontSize: "clamp(48px, 8vw, 110px)",
                lineHeight: "0.85",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              <span>BÁLSAMO HOMBRE</span>
              <br />
              <span>FEROZ</span>
            </h2>

            <div
              style={{
                maxWidth: "500px",
                margin: "clamp(12px, 2vw, 24px) auto",
                textAlign: "left",
                padding: "0 clamp(10px, 2vw, 20px)",
              }}
            >
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 15px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                  marginBottom: "10px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Lava y seca tu barba antes de aplicar el bálsamo para obtener
                mejores resultados.
              </p>
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 15px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                  marginBottom: "10px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Toma una pequeña cantidad de producto, frótala entre las
                palmas de las manos hasta distribuirla de manera uniforme.
              </p>
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 15px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                  marginBottom: "10px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Aplica el bálsamo desde la raíz hasta las puntas de la barba,
                masajeando suavemente para hidratar tanto el vello como la
                piel.
              </p>
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 15px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Peina y da forma a la barba según el estilo deseado. Úsalo
                diariamente para mantener una barba suave, hidratada y con
                mejor apariencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECCIÓN 4: SHAMPOO CRECIMIENTO MUJER
          ============================================================ */}
      <section
        className="product-section"
        style={{
          background: "#DBC3A7",
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(80px, 10vw, 120px) clamp(20px, 4vw, 48px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={logoIzquierda4}
          alt="Logo izquierda"
          className="product-logo top-left"
          style={{ width: "183px", height: "183px" }}
        />
        <img
          src={logoDerecha4}
          alt="Logo derecha"
          className="product-logo center-right"
          style={{ width: "183px", height: "183px" }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(10px, 2vw, 30px)",
            maxWidth: "1200px",
            width: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              flex: "0 0 auto",
              width: "min(45vw, 380px)",
              position: "relative",
              zIndex: 2,
              marginRight: "-5%",
            }}
          >
            <div className="product-shot" style={{ width: "100%" }}>
              <img
                src={cherryCinnamon}
                alt="Cherry Cinnamon"
                style={{
                  marginTop: "-23%",
                  marginLeft: "32%",
                  width: "100%",
                  display: "block",
                }}
              />
            </div>
          </div>

          <div
            style={{
              flex: "1 1 auto",
              textAlign: "center",
              position: "relative",
              zIndex: 3,
            }}
          >
            <h2
              className="display title4"
              style={{
                color: "#000000",
                fontSize: "clamp(48px, 9vw, 110px)",
                lineHeight: "0.85",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              <span>SHAMPOO CRECIMIENTO MUJER</span>
              <br />
              <span>FEROZ</span>
            </h2>

            <WavePhrases />

            <div
              style={{
                maxWidth: "500px",
                margin: "clamp(12px, 2vw, 24px) auto",
                textAlign: "left",
                padding: "0 clamp(10px, 2vw, 20px)",
              }}
            >
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Aplicar sobre el cuero cabelludo húmedo
              </p>
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Masajear suavemente y distribuir de forma uniforme
              </p>
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Dejar aplicado de 5 a 10 minutos
              </p>
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Enjuagar con abundante agua
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECCIÓN 5: TÓNICO CAPILAR MUJER
          ============================================================ */}
      <section
        className="product-section"
        style={{
          background: "#FFFFFF",
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(80px, 10vw, 120px) clamp(20px, 4vw, 48px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={logoIzquierda5}
          alt="Logo izquierda"
          className="product-logo top-left"
          style={{ width: "183px", height: "183px" }}
        />
        <img
          src={logoDerecha5}
          alt="Logo derecha"
          className="product-logo center-right"
          style={{ width: "183px", height: "183px" }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(10px, 2vw, 30px)",
            maxWidth: "1200px",
            width: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              flex: "0 0 auto",
              width: "min(45vw, 380px)",
              position: "relative",
              zIndex: 2,
              marginRight: "-5%",
            }}
          >
            <div className="product-shot" style={{ width: "100%" }}>
              <img
                src={mandarinSage}
                alt="Mandarin Sage"
                style={{
                  marginTop: "-1%",
                  marginLeft: "26%",
                  width: "100%",
                  display: "block",
                }}
              />
            </div>
          </div>

          <div
            style={{
              flex: "1 1 auto",
              textAlign: "center",
              position: "relative",
              zIndex: 3,
            }}
          >
            <h2
              className="display title5"
              style={{
                color: "#000000",
                fontSize: "clamp(48px, 9vw, 110px)",
                lineHeight: "0.85",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              <span>TÓNICO CAPILAR MUJER</span>
              <br />
              <span>FEROZ</span>
            </h2>

            <WavePhrasesTonicoMujer />

            <div
              style={{
                maxWidth: "500px",
                margin: "clamp(12px, 2vw, 24px) auto",
                textAlign: "left",
                padding: "0 clamp(10px, 2vw, 20px)",
              }}
            >
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Aplicar sobre el cuero cabelludo limpio y seco
              </p>
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Distribuir uniformemente en la zona a tratar
              </p>
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Masajear de 2 a 5 minutos
              </p>
              <p
                style={{
                  color: "#000000",
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  lineHeight: "1.8",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  fontFamily: "'Jost', sans-serif",
                }}
              >
                <span style={{ fontWeight: 600, color: "#A87D3D" }}>✦</span>{" "}
                Aplicar de 2 a 3 veces al día
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TESTIMONIALS
          ============================================================ */}
      <div id="testimonios">
        <Testimonials />
      </div>

      {/* ============================================================
          CONTACT SECTION
          ============================================================ */}
      <div id="contacto">
        <ContactSection />
      </div>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="footer-custom">
        <div className="footer-left">
          <img src={footerIcon} alt="Feroz" className="footer-icon" />
        </div>
        <div className="footer-right">
          <span>Poder</span>
          <span>Fuerza</span>
          <span>Crecimiento</span>
        </div>
      </footer>

      <WhatsAppChat />
    </>
  );
}