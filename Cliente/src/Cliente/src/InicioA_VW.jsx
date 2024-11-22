import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function InicioA_VW() {
  const [viewers, setViewers] = useState([]); // Estado para almacenar la lista de viewers
  const [showModal, setShowModal] = useState(false); // Estado para manejar la visibilidad del modal
  const [currentViewer, setCurrentViewer] = useState(null); // Estado para almacenar los datos del usuario actual
  const navigate = useNavigate(); // Función de navegación de React Router

  // Función para redirigir a una URL específica
  const redirectToUrl = (url) => {
    navigate(url);
  };

  // Función para obtener datos de viewers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/viewers');
        if (response.ok) {
          const data = await response.json();
          setViewers(data); // Actualiza el estado con los datos recibidos
        } else {
          console.error('Error al obtener datos de viewers');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData(); // Llama a la función de obtención de datos al montar el componente
  }, []);

  // Función para eliminar un viewer
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/viewers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setViewers(viewers.filter(viewer => viewer.viw_id !== id)); // Actualiza el estado eliminando el viewer
      } else {
        console.error('Error al eliminar viewer');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para abrir el modal y cargar los datos del usuario
  const handleEdit = (viewer) => {
    setCurrentViewer(viewer); // Establece el viewer actual
    setShowModal(true); // Muestra el modal
  };

  // Función para manejar el cambio en los inputs del modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentViewer({ ...currentViewer, [name]: value });
  };

  // Función para manejar la actualización del usuario
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/viewers/${currentViewer.viw_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentViewer),
      });

      if (response.ok) {
        const updatedViewer = await response.json();
        setViewers(viewers.map(viewer => (viewer.viw_id === updatedViewer.viw_id ? updatedViewer : viewer))); // Actualiza el estado con el viewer editado
        setShowModal(false); // Cierra el modal
      } else {
        console.error('Error al actualizar viewer');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
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
            <h2>TABLA DE VIEWERS</h2>
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
                {viewers.map(viewer => (
                  <tr key={viewer.viw_id}>
                    <td>{viewer.viw_nombre}</td>
                    <td>{viewer.viw_apellido}</td>
                    <td>{viewer.viw_telefono}</td>
                    <td>{viewer.viw_email}</td>
                    <td>
                      <button type="button" className="btn btn-success" onClick={() => handleEdit(viewer)}>Editar</button>&nbsp;
                      <button type="button" className="btn btn-danger" onClick={() => handleDelete(viewer.viw_id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal para editar viewer */}
      {currentViewer && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Viewer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="viw_nombre"
                  value={currentViewer.viw_nombre}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="viw_apellido"
                  value={currentViewer.viw_apellido}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="viw_telefono"
                  value={currentViewer.viw_telefono}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  name="viw_email"
                  value={currentViewer.viw_email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default InicioA_VW;
