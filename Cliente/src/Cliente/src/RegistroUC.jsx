import React, { useState } from 'react';
import './App.css';

function RegistroUC() {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    viw_nombre: '',
    viw_apellido: '',
    viw_telefono: '',
    viw_email: '',
    viw_password: ''
  });

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Actualiza el estado formData con el nuevo valor ingresado en el campo correspondiente
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
    try {
      // Envia una solicitud POST al servidor con los datos del formulario
      const response = await fetch('http://localhost:3001/api/viewers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Convierte el objeto formData a formato JSON
      });
      if (response.ok) {
        alert('Registro exitoso'); // Muestra un mensaje de éxito si la respuesta es exitosa
        // Limpia el formulario después del registro exitoso
        setFormData({
          viw_nombre: '',
          viw_apellido: '',
          viw_telefono: '',
          viw_email: '',
          viw_password: ''
        });
        window.location.href = '/inicio_viewer';
      } else {
        alert('Error en el registro'); // Muestra un mensaje de error si la respuesta no es exitosa
      }
    } catch (error) {
      console.error('Error:', error); // Muestra errores en la consola en caso de problemas de red u otros errores
      alert('Error en el registroooooo'); // Muestra un mensaje de error al usuario
    }
  };

  // Componente de React que devuelve la interfaz del formulario de registro
  return (
    <div className="Fondo1">
      {/* Barra de navegación */}
      <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">TATTOOARTE</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">INICIO</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">PERFIL</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      {/* Título del formulario */}
      <div>Registro Viewer</div>
      
      {/* Formulario de registro */}
      <div className="cuadro">
        <div className="container">
          <form id="perfilForm" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 col-md-6">
                <br />
                {/* Campo de nombre */}
                <label htmlFor="viw_nombre">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="viw_nombre"
                  name="viw_nombre"
                  placeholder="NOMBRE"
                  required
                  value={formData.viw_nombre}
                  onChange={handleChange}
                />
                <br />
                <br />
                {/* Campo de apellido */}
                <label htmlFor="viw_apellido">Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  id="viw_apellido"
                  name="viw_apellido"
                  placeholder="APELLIDO"
                  required
                  value={formData.viw_apellido}
                  onChange={handleChange}
                />
                <br />
                <br />
                {/* Campo de teléfono */}
                <label htmlFor="viw_telefono">Teléfono</label>
                <input
                  type="number"
                  className="form-control"
                  id="viw_telefono"
                  name="viw_telefono"
                  placeholder="TELEFONO"
                  required
                  value={formData.viw_telefono}
                  onChange={handleChange}
                />
                <br />
              </div>
              <div className="col">
                <br />
                {/* Campo de correo electrónico */}
                <label htmlFor="viw_email">Correo</label>
                <input
                  type="email"
                  className="form-control"
                  id="viw_email"
                  name="viw_email"
                  placeholder="CORREO"
                  required
                  value={formData.viw_email}
                  onChange={handleChange}
                />
                <br />
                <br />
                {/* Campo de contraseña */}
                <label htmlFor="viw_password">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="viw_password"
                  name="viw_password"
                  placeholder="CONTRASEÑA"
                  required
                  value={formData.viw_password}
                  onChange={handleChange}
                />
                <br />
                <br />
              </div>
            </div>
            {/* Botón para enviar el formulario */}
            <button type="submit" className="btn btn-secondary">Crear Perfil</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistroUC;
