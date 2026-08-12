// Testimonials.jsx
import React from 'react'

// Importar la imagen del iPhone (marco)
import iphoneFrame from "./assets/celular.png"

// Importar las capturas de WhatsApp para cada testimonio
import whatsapp1 from "./assets/testimonio_1.jpeg"
import whatsapp2 from "./assets/testimonio_2.jpeg"
import whatsapp3 from "./assets/testimonio_3.jpeg"
// import whatsapp4 from "./assets/6.png"
// import whatsapp5 from "./assets/6.png"

function Testimonials() {
  const testimonials = [
    { 
      id: 1, 
      screenshot: whatsapp1, 
      name: "Carlos",
    },
    { 
      id: 2, 
      screenshot: whatsapp2, 
      name: "Claudia",
    },
    { 
      id: 3, 
      screenshot: whatsapp3, 
      name: "Diana",
    },
    // { 
    //   id: 4, 
    //   screenshot: whatsapp4, 
    //   name: "Juan Pérez",
    // },
    // { 
    //   id: 5, 
    //   screenshot: whatsapp5, 
    //   name: "Laura Sánchez",
    // },
  ]

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <h2 className="display">Testimonios</h2>
        <p className="testimonials-sub">Lo que dicen nuestros clientes sobre Feroz</p>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="iphone-container">
              <div className="iphone-wrapper">
                {/* Imagen del iPhone (marco) */}
                <img 
                  src={iphoneFrame} 
                  alt="iPhone Frame" 
                  className="iphone-frame-image"
                />
                
                {/* Captura de WhatsApp dentro del iPhone */}
                <img 
                  src={testimonial.screenshot} 
                  alt={`Testimonio de ${testimonial.name}`} 
                  className="whatsapp-inside"
                />
              </div>
              
              {/* Nombre del cliente */}
              <div className="testimonial-name">{testimonial.name}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials