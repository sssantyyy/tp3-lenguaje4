import emailjs from '@emailjs/browser';
import React, { useState, useEffect } from 'react';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' });
  const [formMsg, setFormMsg] = useState('');
  const [geoInfo, setGeoInfo] = useState('');
  const [fileInfo, setFileInfo] = useState('');

  const [mascotas, setMascotas] = useState([]);
  const [cargandoApi, setCargandoApi] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('tp3_borrador');
    if (saved) {
      setFormData(JSON.parse(saved));
    }

    fetch('https://api.thecatapi.com/v1/breeds?limit=4')
      .then((res) => res.json())
      .then((data) => {
        setMascotas(data);
        setCargandoApi(false);
      })
      .catch((err) => {
        console.error('Error al consumir API:', err);
        setCargandoApi(false);
      });

    const handlePopState = (event) => {
      const page = event.state ? event.state.page : 'home';
      setActivePage(page);
    };

    window.addEventListener('popstate', handlePopState);

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

    const serviceID = 'service_ybmb6rk';
    const templateID = 'template_19j2n5i';
    const publicKey = 'xYAlVmgLwVzCQJvs4';

    setFormMsg('Enviando mensaje...');

    emailjs.init(publicKey);

    emailjs.send(serviceID, templateID, {
      nombre: formData.nombre,
      email: formData.email,
      mensaje: formData.mensaje
    })
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
    setGeoInfo('Obteniendo posición...');
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

  const serviciosData = [
    {
      id: 1,
      titulo: 'Desarrollo Front-End (React & Vite)',
      descripcion: 'Creación de interfaces dinámicas y modulares utilizando componentes y hooks avanzados.',
      imagen: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 2,
      titulo: 'Control de Versiones y Despliegue',
      descripcion: 'Gestión de repositorios con Git/GitHub y publicación automatizada en GitHub Pages.',
      imagen: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 3,
      titulo: 'Integración de Servicios (EmailJS)',
      descripcion: 'Implementación de pasarelas de correo electrónico directo desde el navegador del cliente.',
      imagen: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=500&auto=format&fit=crop&q=60'
    }
  ];

  return (
    <div>
      <nav style={{ background: '#2c3e50', padding: '1rem', display: 'flex', gap: '10px' }}>
        <button style={navButtonStyle} onClick={() => navigate('home')}>
          Inicio
        </button>
        <button style={navButtonStyle} onClick={() => navigate('servicios')}>
          Servicios
        </button>
        <button style={navButtonStyle} onClick={() => navigate('contacto')}>
          Contacto
        </button>
      </nav>

      {/* Página Inicio */}
      <div style={{ padding: '20px', display: activePage === 'home' ? 'block' : 'none' }}>
        <h1>Página Principal - API Externa</h1>
        <p>Datos obtenidos en tiempo real de una API pública de mascotas:</p>

        {cargandoApi ? (
          <p>Cargando datos de la API...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', margin: '20px 0' }}>
            {mascotas.map((cat) => (
              <div key={cat.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                {cat.image?.url && (
                  <img 
                    src={cat.image.url} 
                    alt={cat.name} 
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }} 
                  />
                )}
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{cat.name}</h3>
                <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Origen:</strong> {cat.origin}</p>
                <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Temperamento:</strong> {cat.temperament}</p>
                <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Expectativa:</strong> {cat.life_span} años</p>
              </div>
            ))}
          </div>
        )}
        
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
        <h1>Servicios y Tecnologías</h1>
        <p>Habilidades de tecnología de la información integradas:</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {serviciosData.map((serv) => (
            <div key={serv.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <img 
                src={serv.imagen} 
                alt={serv.titulo} 
                style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }} 
              />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{serv.titulo}</h3>
              <p style={{ fontSize: '0.95rem', color: '#555' }}>{serv.descripcion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Página Contacto */}
      <div style={{ padding: '20px', display: activePage === 'contacto' ? 'block' : 'none' }}>
        <h1>Contacto y Ubicación</h1>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginTop: '20px' }}>
          {/* Formulario */}
          <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '400px' }} onSubmit={guardarFormulario}>
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
            <p style={{ color: 'green', margin: '0' }}>{formMsg}</p>
          </form>

          {/* Mapa Embebido */}
          <div style={{ flex: '1', minWidth: '300px', border: '1px solid #ddd', borderRadius: '8px', padding: '10px', background: '#fff' }}>
            <h3 style={{ marginTop: '0', textAlign: 'center', fontSize: '1.1rem' }}>Nuestra Ubicación</h3>
            <div style={{ width: '100%', height: '300px' }}>
              <iframe 
                title="Mapa de Ubicación"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.723798606626!2d-65.4121285!3d-24.7821273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941bc32598375635%3A0x6b8bc2138b3014a9!2sUniversidad%20Cat%C3%B3lica%20de%20Salta!5e0!3m2!1ses!2sar!4v1650000000000!5m2!1ses!2sar" 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '6px' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
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
  cursor: 'pointer',
  background: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '4px'
};

const inputStyle = {
  padding: '8px',
  fontSize: '1rem',
  borderRadius: '4px',
  border: '1px solid #ccc'
};