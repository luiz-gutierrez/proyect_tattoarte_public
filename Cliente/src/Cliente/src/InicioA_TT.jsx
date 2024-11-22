import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function InicioA_Tatuadores() {
  const [tatuadores, setTatuadores] = useState([]); // Estado para almacenar la lista de tatuadores
  const navigate = useNavigate(); // Función de navegación de React Router

  // Función para redirigir a una URL específica
  const redirectToUrl = (url) => {
    navigate(url);
  };

  // Simulación de datos de tatuadores (deberías reemplazar con tu lógica de obtención de datos reales)
  useEffect(() => {
    // Aquí deberías hacer la llamada real a tu API para obtener los datos de tatuadores
    // Esta es una simulación para demostración
    const fetchData = async () => {
      try {
        // Simulando la respuesta del servidor
        const response = await fetch('http://localhost:3001/api/tatuadores');
        if (response.ok) {
          const data = await response.json();
          setTatuadores(data); // Actualiza el estado con los datos recibidos
        } else {
          console.error('Error al obtener datos de tatuadores');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData(); // Llama a la función de obtención de datos al montar el componente
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tatuaName');
    navigate('/'); // Redirige al usuario a la página principal
};

  return (
    <div>
      <div className="FondoA">
        <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
          <div className="container-fluid">
            <a className="navbar-brand" onClick={() => redirectToUrl('/inicio_admin')}>TATTOOARTE</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" onClick={() => redirectToUrl('/inicio_admin')}>INICIO</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" onClick={() => redirectToUrl('/admin_tatuadores')}>TATUADORES</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" onClick={() => redirectToUrl('/admin_viewers')}>VIEWERS</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" onClick={() => redirectToUrl('/admin_planes')}>PLANES</a>
                </li>
              </ul>
              <div class="ms-auto p-2">
                <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>Cerrar sesión</button>

              </div>
            </div>
          </div>
        </nav>
        <div className="cuadro">
          <div className="text-center mt-5">
            <h2>TABLA DE TATUADORES</h2>
          </div>
          <div className="mt-5">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tatuadores.map(tatuador => (
                  <tr key={tatuador.id}>
                    <td>{tatuador.nombre}</td>
                    <td>{tatuador.apellido}</td>
                    <td>{tatuador.telefono}</td>
                    <td>{tatuador.email}</td>
                    <td>
                      <button type="button" className="btn btn-success">Editar</button>&nbsp;
                      <button type="button" className="btn btn-danger">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InicioA_Tatuadores;
