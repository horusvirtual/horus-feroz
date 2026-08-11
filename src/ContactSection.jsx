// ContactSection.jsx
import React from 'react'
import logoContacto from "./assets/logo.png"

function ContactSection() {
  const handleWhatsAppClick = () => {
    // Cambia el número por el de tu negocio
    window.open(
      "https://wa.me/573123456789?text=Hola%20Feroz%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20productos", 
      "_blank"
    )
  }

  return (
    <section className="contact-section">
      <div className="contact-content">
        <div className="contact-left">
          <img src={logoContacto} alt="Feroz Logo" className="contact-logo" />
        </div>
        <div className="contact-right">
          <h2 className="contact-title">¿Listo para transformar tu cabello?</h2>
          <p className="contact-description">
            Contáctanos y descubre cuál de nuestros productos es perfecto para ti. 
            Nuestro equipo está listo para ayudarte.
          </p>
          <button className="contact-btn" onClick={handleWhatsAppClick}>
            <svg className="whatsapp-icon" viewBox="0 0 24 24" fill="white" width="24" height="24">
              <path d="M12.032 21.965c-1.821 0-3.583-.499-5.12-1.445l-4.456 1.464 1.476-4.352c-1.035-1.636-1.587-3.519-1.587-5.464 0-5.607 4.557-10.168 10.168-10.168 2.716 0 5.268 1.059 7.19 2.979 1.92 1.92 2.979 4.474 2.979 7.19 0 5.607-4.557 10.168-10.168 10.168h.015zM18.931 5.829c-1.82-1.82-4.243-2.824-6.88-2.824-4.764 0-8.636 3.872-8.636 8.636 0 1.724.509 3.4 1.472 4.814l-.948 2.798 2.868-.942c1.37.748 2.93 1.148 4.529 1.148 4.764 0 8.636-3.872 8.636-8.636 0-2.316-.901-4.491-2.537-6.127l.004.003zM16.887 13.796c-.267-.133-1.576-.777-1.82-.866-.244-.089-.423-.133-.602.133-.179.266-.695.866-.852 1.044-.157.178-.314.2-.581.067-.267-.133-1.129-.416-2.149-1.327-.794-.716-1.329-1.599-1.485-1.87-.157-.267-.017-.411.118-.544.122-.122.267-.311.401-.467.133-.155.178-.267.267-.444.089-.178.044-.333-.022-.466-.067-.133-.602-1.45-.824-1.988-.217-.522-.437-.445-.602-.445-.155 0-.333-.022-.511-.022-.178 0-.467.067-.711.333-.244.267-.932.911-.932 2.222 0 1.31.953 2.577 1.087 2.755.134.178 1.865 2.862 4.536 3.806.633.225 1.127.36 1.513.459.636.199 1.215.171 1.672.104.51-.075 1.576-.643 1.798-1.266.222-.623.222-1.157.155-1.266-.067-.111-.244-.178-.511-.311l.002.002z"/>
            </svg>
            Contáctanos por WhatsApp
          </button>
        </div>
      </div>
    </section>
  )
}

export default ContactSection