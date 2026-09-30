import React, { useState, useEffect } from 'react';

const Inicio = () => <h1>Inicio</h1>;

const Servicios = () => <h1>Servicios</h1>;

const Contacto = () => {
  const [formulario, setFormulario] = useState({ nombre: '', correo: '', mensaje: '' });
  const [errores, setErrores] = useState({});
  const [ubicacion, setUbicacion] = useState(null);
  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    const borrador = localStorage.getItem('borradorContacto');
    if (borrador) {
      setFormulario(JSON.parse(borrador));
    }
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    const nuevoFormulario = { ...formulario, [name]: value };
    setFormulario(nuevoFormulario);
    localStorage.setItem('borradorContacto', JSON.stringify(nuevoFormulario));
  };

  const obtenerUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error(err)
      );
    }
  };

  const manejarDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setArchivo(e.dataTransfer.files[0].name);
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formulario.nombre.trim()) nuevosErrores.nombre = "El nombre y apellido son obligatorios.";
    if (!formulario.correo.includes('@')) nuevosErrores.correo = "Debe ingresar un correo válido.";
    if (formulario.mensaje.length > 300) nuevosErrores.mensaje = "El mensaje no puede superar los 300 caracteres.";
    return nuevosErrores;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const validacion = validar();
    
    if (Object.keys(validacion).length > 0) {
      setErrores(validacion);
    } else {
      setErrores({});
      alert("Simulando envío a cuenta de correo...");
      console.log("Enviando:", formulario, ubicacion, archivo);
      
      localStorage.removeItem('borradorContacto');
      setFormulario({ nombre: '', correo: '', mensaje: '' });
      setUbicacion(null);
      setArchivo(null);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Contacto</h1>
      <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
        <div>
          <label>Nombre y Apellido:</label><br />
          <input type="text" name="nombre" value={formulario.nombre} onChange={manejarCambio} style={{ width: '100%' }} />
          {errores.nombre && <span style={{ color: 'red' }}>{errores.nombre}</span>}
        </div>
        
        <div>
          <label>Correo Electrónico:</label><br />
          <input type="email" name="correo" value={formulario.correo} onChange={manejarCambio} style={{ width: '100%' }} />
          {errores.correo && <span style={{ color: 'red' }}>{errores.correo}</span>}
        </div>
        
        <div>
          <label>Mensaje:</label><br />
          <textarea name="mensaje" value={formulario.mensaje} onChange={manejarCambio} rows="4" style={{ width: '100%' }} />
          {errores.mensaje && <span style={{ color: 'red' }}>{errores.mensaje}</span>}
        </div>

        <button type="button" onClick={obtenerUbicacion}>Compartir mi ubicación actual</button>
        {ubicacion && <small>Ubicación capturada: Lat {ubicacion.lat}, Lng {ubicacion.lng}</small>}

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={manejarDrop}
          style={{ border: '2px dashed #666', padding: '20px', textAlign: 'center' }}
        >
          Arrastra y suelta un archivo adjunto aquí
        </div>
        {archivo && <small>Archivo listo: {archivo}</small>}

        <button type="submit" style={{ padding: '10px', marginTop: '10px' }}>Enviar Mensaje</button>
      </form>
    </div>
  );
};

export default function App() {
  const [ruta, setRuta] = useState(window.location.pathname);

  useEffect(() => {
    const manejarPopState = () => setRuta(window.location.pathname);
    window.addEventListener('popstate', manejarPopState);
    return () => window.removeEventListener('popstate', manejarPopState);
  }, []);

  const navegar = (nuevaRuta) => {
    window.history.pushState({}, '', nuevaRuta);
    setRuta(nuevaRuta);
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <nav style={{ padding: '10px', background: '#eee', display: 'flex', gap: '10px' }}>
        <button onClick={() => navegar('/')}>Inicio</button>
        <button onClick={() => navegar('/servicios')}>Servicios</button>
        <button onClick={() => navegar('/contacto')}>Contacto</button>
      </nav>
      
      <main style={{ padding: '20px' }}>
        {ruta === '/' && <Inicio />}
        {ruta === '/servicios' && <Servicios />}
        {ruta === '/contacto' && <Contacto />}
      </main>
    </div>
  );
}