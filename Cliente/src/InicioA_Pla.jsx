import React, { useState, useEffect, useRef } from 'react';
import { Table, Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function InicioA_Pla() {
  const [planes, setPlanes] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState({});
  const [newPlan, setNewPlan] = useState({
    pla_nombre: '',
    pla_descripcion: ''
  });
  const [pdfData, setPdfData] = useState(null);

  const navigate = useNavigate();
  const pdfRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/planes');
      if (response.ok) {
        const data = await response.json();
        setPlanes(data);
      } else {
        console.error('Error al obtener datos de planes');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const redirectToUrl = (url) => {
    navigate(url);
  };

  const handleEditClick = (plan) => {
    setCurrentPlan(plan);
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreatePlan = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/planes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPlan)
      });

      if (response.ok) {
        console.log('Plan creado exitosamente');
        setShowCreateModal(false);
        setNewPlan({
          pla_nombre: '',
          pla_descripcion: ''
        });
        fetchData();
      } else {
        console.error('Error al crear el plan');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/planes/${currentPlan.pla_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentPlan),
      });

      if (response.ok) {
        console.log('Plan actualizado exitosamente');
        setShowEditModal(false);
        fetchData();
      } else {
        console.error('Error al actualizar el plan');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este plan?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/planes/${planId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          console.log('Plan eliminado exitosamente');
          fetchData();
        } else {
          console.error('Error al eliminar el plan');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Planes', 10, 10);

    const tableColumn = [['Nombre', 'Descripción']];
    const tableRows = planes.map(plan => [plan.pla_nombre, plan.pla_descripcion]);

    doc.autoTable({
      head: tableColumn,
      body: tableRows,
      startY: 20,
    });

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfData(pdfUrl);
    setShowPDFModal(true);
  };

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = pdfData;
    link.download = 'planes.pdf';
    link.click();
    setShowPDFModal(false);
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
                <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>Cerrar sesión</button>                    </div>
            </div>
          </div>
        </nav>
        <div className="cuadro">
          <div className="text-center mt-5">
            <h2>TABLA DE PLANES</h2>
          </div>
          <div className="mt-5">
            <Table striped bordered hover id="planesTable">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {planes.map(plan => (
                  <tr key={plan.pla_id}>
                    <td>{plan.pla_nombre}</td>
                    <td>{plan.pla_descripcion}</td>
                    <td>
                      <button type="button" className="btn btn-success" onClick={() => handleEditClick(plan)}>Editar</button>&nbsp;
                      <button type="button" className="btn btn-danger" onClick={() => handleDeletePlan(plan.pla_id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="text-center mt-5">
              <button type="button" className="btn btn-info" onClick={() => setShowCreateModal(true)}>Crear Nuevo Plan</button>&nbsp;
              <button type="button" className="btn btn-secondary" onClick={generatePDF}>Crear PDF</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="pla_nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="pla_nombre"
                value={currentPlan.pla_nombre || ''}
                onChange={(e) => setCurrentPlan({ ...currentPlan, pla_nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="pla_descripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="pla_descripcion"
                value={currentPlan.pla_descripcion || ''}
                onChange={(e) => setCurrentPlan({ ...currentPlan, pla_descripcion: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para crear */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="pla_nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="pla_nombre"
                value={newPlan.pla_nombre}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="pla_descripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="pla_descripcion"
                value={newPlan.pla_descripcion}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreatePlan}>
            Crear Plan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para previsualizar PDF */}
      <Modal show={showPDFModal} onHide={() => setShowPDFModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Previsualización del PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pdfData && (
            <iframe
              ref={pdfRef}
              src={pdfData}
              width="100%"
              height="500px"
              title="Previsualización del PDF"
            ></iframe>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPDFModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleDownloadPDF}>
            Descargar PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default InicioA_Pla;
