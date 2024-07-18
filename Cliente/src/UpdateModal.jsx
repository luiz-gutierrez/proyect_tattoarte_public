import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function UpdateModal({ show, handleClose, tatuador, handleUpdate }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    id_pla: ''
  });

  useEffect(() => {
    if (tatuador) {
      setFormData({
        id: tatuador.id, // Asegúrate de usar 'id' en minúscula si es el identificador en el backend
        nombre: tatuador.nombre,
        apellido: tatuador.apellido,
        telefono: tatuador.telefono,
        email: tatuador.email,
        id_pla: tatuador.id_pla.toString(), // Asegúrate de convertir a cadena si es necesario
      });
    }
  }, [tatuador]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    console.log(`Campo ${name} actualizado a:`, value); // Log de cambios
  };

  const handleSubmit = () => {
    console.log('Datos a enviar al servidor:', formData); // Log antes de enviar al servidor
    handleUpdate(formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Tatuador</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formApellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formPlan">
            <Form.Label>Plan</Form.Label>
            <Form.Control
              type="text"
              name="id_pla"
              value={formData.id_pla}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateModal;
