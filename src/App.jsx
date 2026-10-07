import emailjs from '@emailjs/browser';
import React, { useState, useEffect } from 'react';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' });
  const [formMsg, setFormMsg] = useState('');
  const [geoInfo, setGeoInfo] = useState('');
  const [fileInfo, setFileInfo] = useState('');

  useEffect(() => {
    // Cargar borrador de WebStorage API
    const saved = localStorage.getItem('tp3_borrador');
    if (saved) {
      setFormData(JSON.parse(saved));
    }

    // Manejar historial de navegación (History API)
    const handlePopState = (event) => {
      const page = event.state ? event.state.page : 'home';
      setActivePage(page);
    };

    window.addEventListener('popstate', handlePopState);

    // Navegación según el hash inicial
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && ['home', 'servicios', 'contacto'].includes(initialHash)) {
      setActivePage(initialHash);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (pageId) => {
    setActivePage(pageId);
    window.history.pushState({ page: pageId }, '', `#${pageId}`);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const updatedData = { ...formData, [id]: value };
    setFormData(updatedData);
    localStorage.setItem('tp3_borrador', JSON.stringify(updatedData));
  };

  const guardarFormulario = (e) => {
  e.preventDefault();

  const serviceID = 'xYAlVmgLwVZcQJvs4';
  const templateID = 'service_ybmb6rk';
  const publicKey = 'template_19j2n5i';

  setFormMsg('Enviando mensaje...');

  emailjs.send(serviceID, templateID, formData, publicKey)
    .then(() => {
      localStorage.removeItem('tp3_borrador');
      setFormData({ nombre: '', email: '', mensaje: '' });
      setFormMsg('¡Mensaje enviado con éxito a tu casilla de correo!');
    })
    .catch((error) => {
      console.error('Error al enviar:', error);
      setFormMsg('Hubo un error al enviar el mensaje. Revisa la consola.');
    });
};
  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setGeoInfo('Geolocalización no soportada por el navegador.');
      return;
    }
    setGeoInfo('Obteniendo posición');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoInfo(`Latitud: ${pos.coords.latitude}, Longitud: ${pos.coords.longitude}`);
      },
      () => {
        setGeoInfo('No se pudo obtener la ubicación.');
      }
    );
  };

  const manejarDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFileInfo(`Archivo recibido: ${files[0].name} (${files[0].size} bytes)`);
    }
  };

  return (
    <div>
      <nav style={{ background: '#2c3e50', padding: '1rem', display: 'flex', gap: '10px' }}>
        <button 
          style={navButtonStyle} 
          onClick={() => navigate('home')}
        >
          Inicio
        </button>
        <button 
          style={navButtonStyle} 
          onClick={() => navigate('servicios')}
        >
          Servicios
        </button>
        <button 
          style={navButtonStyle} 
          onClick={() => navigate('contacto')}
        >
          Contacto
        </button>
      </nav>

      {/* Página Inicio */}
      <div style={{ padding: '20px', display: activePage === 'home' ? 'block' : 'none' }}>
        <h1>Página Principal</h1>
        <p>TP3.</p>
        
        <h3>Ubicación Actual</h3>
        <button style={actionButtonStyle} onClick={obtenerUbicacion}>Obtener Coordenadas</button>
        <p>{geoInfo}</p>

        <h3>Arrastrar y Soltar Archivos</h3>
        <div 
          style={{
            border: '2px dashed #3498db',
            padding: '20px',
            textAlign: 'center',
            margin: '10px 0',
            background: '#ebf5fb'
          }}
          onDragOver={(e) => e.preventDefault()} 
          onDrop={manejarDrop}
        >
          Arrastra un archivo aquí
        </div>
        <p>{fileInfo}</p>
      </div>

      {/* Página Servicios */}
      <div style={{ padding: '20px', display: activePage === 'servicios' ? 'block' : 'none' }}>
        <h1>Servicios</h1>
        <ul>
          <li>Desarrollo Web</li>
          <li>Diseño UI/UX</li>
          <li>Consultoría Técnica</li>
        </ul>
      </div>

      {/* Página Contacto */}
      <div style={{ padding: '20px', display: activePage === 'contacto' ? 'block' : 'none' }}>
        <h1>Contacto</h1>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }} onSubmit={guardarFormulario}>
          <label>Nombre:</label>
          <input 
            type="text" 
            id="nombre" 
            value={formData.nombre} 
            onChange={handleInputChange} 
            style={inputStyle}
            required 
          />

          <label>Correo Electrónico:</label>
          <input 
            type="email" 
            id="email" 
            value={formData.email} 
            onChange={handleInputChange} 
            style={inputStyle}
            required 
          />

          <label>Mensaje:</label>
          <textarea 
            id="mensaje" 
            rows="4" 
            value={formData.mensaje} 
            onChange={handleInputChange} 
            style={inputStyle}
            required 
          />

          <button type="submit" style={actionButtonStyle}>Enviar</button>
        </form>
        <p style={{ color: 'green' }}>{formMsg}</p>
      </div>
    </div>
  );
}

const navButtonStyle = {
  background: '#34495e',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  cursor: 'pointer',
  borderRadius: '4px'
};

const actionButtonStyle = {
  padding: '8px 16px',
  fontSize: '1rem',
  cursor: 'pointer'
};

const inputStyle = {
  padding: '8px',
  fontSize: '1rem'
};