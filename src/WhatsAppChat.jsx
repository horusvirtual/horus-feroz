// WhatsAppChat.jsx
import { useEffect, useRef, useState } from "react"

const PRODUCTS = [
  "Shampoo Crecimiento Hombre Feroz (Carda)",
  "Tónico Capilar Hombre Feroz",
  "Bálsamo Hombre Feroz",
  "Shampoo Crecimiento Mujer Feroz",
  "Tónico Capilar Mujer Feroz",
  "Otro / No estoy seguro",
]

const PHONE = "573207182364" // 👉 cambia por tu número real (sin + ni espacios)
const REDIRECT_SECONDS = 5

// Estilos críticos inline: garantizan que el botón flote correctamente
// aunque haya algún problema con la carga del archivo CSS externo.
const floatButtonStyle = {
  position: "fixed",
  right: "24px",
  bottom: "24px",
  width: "60px",
  height: "60px",
  background: "#25D366",
  color: "#ffffff",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 6px 20px rgba(37, 211, 102, 0.4)",
  zIndex: 9999,
  border: "none",
  cursor: "pointer",
  padding: 0,
}

const chatWindowStyle = {
  position: "fixed",
  right: "24px",
  bottom: "24px",
  width: "min(340px, calc(100vw - 32px))",
  maxHeight: "480px",
  background: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}

export default function WhatsAppChat() {
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState("greeting") // greeting -> list -> redirecting
  const [selected, setSelected] = useState(null)
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const openChat = () => {
    setOpen(true)
    setStage("greeting")
    setSelected(null)
    setCountdown(REDIRECT_SECONDS)
  }

  const closeChat = () => {
    setOpen(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const goToList = () => setStage("list")

  const selectProduct = (product) => {
    setSelected(product)
    setStage("redirecting")
    setCountdown(REDIRECT_SECONDS)

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          const message = `Hola, quiero más información sobre el producto: ${product}`
          const link = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
          // window.location.href en vez de window.open: los navegadores bloquean
          // window.open cuando no ocurre como resultado directo de un clic (como
          // aquí, que se dispara tras un setInterval). Redirigir la misma pestaña
          // nunca se bloquea.
          window.location.href = link
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      {!open && (
        <button
          className="whatsapp-float"
          style={floatButtonStyle}
          onClick={openChat}
          aria-label="Abrir chat de WhatsApp"
        >
          <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor">
            <path d="M16.001 2.667c-7.364 0-13.334 5.97-13.334 13.334 0 2.353.615 4.66 1.783 6.686L2.667 29.333l6.83-1.792a13.27 13.27 0 0 0 6.504 1.657h.006c7.364 0 13.333-5.97 13.333-13.334S23.365 2.667 16.001 2.667zm0 24.4h-.005a11.05 11.05 0 0 1-5.63-1.542l-.404-.24-4.053 1.063 1.082-3.951-.263-.406a11.03 11.03 0 0 1-1.694-5.884c0-6.11 4.973-11.083 11.084-11.083 2.96 0 5.744 1.155 7.838 3.25a11.005 11.005 0 0 1 3.244 7.837c0 6.111-4.973 11.084-11.083 11.084l-.116-.001zm6.077-8.297c-.333-.166-1.968-.972-2.273-1.083-.305-.111-.527-.166-.749.167-.222.333-.86 1.083-1.055 1.305-.194.222-.388.25-.72.083-.334-.166-1.408-.519-2.682-1.654-.992-.885-1.663-1.978-1.858-2.31-.194-.334-.02-.514.146-.68.15-.149.334-.389.5-.583.167-.194.222-.333.334-.555.111-.222.055-.417-.028-.583-.083-.167-.749-1.805-1.026-2.472-.27-.65-.545-.562-.749-.572l-.638-.012c-.222 0-.583.083-.888.417-.305.333-1.166 1.14-1.166 2.777 0 1.638 1.194 3.221 1.361 3.443.167.222 2.35 3.588 5.693 5.032.795.343 1.416.548 1.9.702.798.254 1.524.218 2.098.132.64-.095 1.968-.805 2.245-1.583.278-.777.278-1.444.194-1.583-.083-.14-.305-.222-.638-.389z"/>
          </svg>
        </button>
      )}

      {/* VENTANA DE CHAT */}
      {open && (
        <div className="chat-window" style={chatWindowStyle}>
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-avatar">
                <svg viewBox="0 0 32 32" width="20" height="20" fill="#25D366">
                  <path d="M16.001 2.667c-7.364 0-13.334 5.97-13.334 13.334 0 2.353.615 4.66 1.783 6.686L2.667 29.333l6.83-1.792a13.27 13.27 0 0 0 6.504 1.657h.006c7.364 0 13.333-5.97 13.333-13.334S23.365 2.667 16.001 2.667z"/>
                </svg>
              </span>
              <div>
                <div className="chat-title">Feroz · Asesor</div>
                <div className="chat-status">En línea</div>
              </div>
            </div>
            <button className="chat-close" onClick={closeChat} aria-label="Cerrar chat">✕</button>
          </div>

          <div className="chat-body">
            {stage === "greeting" && (
              <div className="chat-bubble">
                <p>¡Hola! 👋 Cuéntame, ¿en qué podemos colaborarte? ¿En qué producto estás interesado?</p>
                <button className="chat-action-btn" onClick={goToList}>
                  Ver productos
                </button>
              </div>
            )}

            {stage === "list" && (
              <div className="chat-bubble">
                <p>Selecciona el producto que te interesa:</p>
                <div className="chat-product-list">
                  {PRODUCTS.map((product) => (
                    <button
                      key={product}
                      className="chat-product-item"
                      onClick={() => selectProduct(product)}
                    >
                      {product}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {stage === "redirecting" && (
              <div className="chat-bubble">
                <p>Elegiste: <strong>{selected}</strong></p>
                <p>Serás redirigido a un asesor en <strong>{countdown}</strong> segundo{countdown !== 1 ? "s" : ""}…</p>
                <div className="chat-spinner" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}