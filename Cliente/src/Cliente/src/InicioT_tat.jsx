import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

function InicioT_tat() {
    const [especialidades, setEspecialidades] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const [tatuaName, setTatuaName] = useState('');
    const [tatuaId, setTatuaId] = useState('');

    useEffect(() => {
        const name = localStorage.getItem('tatuaName');
        const id = localStorage.getItem('tatuaId');
        if (name && id) {
            setTatuaName(name);
            setTatuaId(id);
        } else {
            navigate('/'); // Redirige al inicio de sesión si no se encuentra tatuaId
        }
    }, [navigate]);

    useEffect(() => {
        if (tatuaId) {
            // Obtener especialidades
            axios.get(`http://localhost:3001/api/especialidades/${tatuaId}`)
                .then(response => {
                    const especialidades = response.data;
                    setEspecialidades(especialidades);
                })
                .catch(error => {
                    console.error('Error fetching specialties:', error);
                });
        }
    }, [tatuaId]);

    const handleShowModal = (especialidad) => {
        setSelectedEspecialidad(especialidad);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEspecialidad(null);
        setImage(null);
        setImagePreview(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        if (selectedEspecialidad && image) {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('esp_id', selectedEspecialidad.esp_id);
            formData.append('id_tat', tatuaId);

            axios.post('http://localhost:3001/api/upload', formData)
                .then(response => {
                    console.log('Upload response:', response.data);
                    handleCloseModal();
                    setEspecialidades(prevEspecialidades =>
                        prevEspecialidades.map(e =>
                            e.esp_id === selectedEspecialidad.esp_id ? { ...e, status: 1, ima_url: response.data.ima_url } : e
                        )
                    );
                })
                .catch(error => {
                    console.error('Error al subir la imagen o cambiar el estatus:', error);
                });
        } else {
            console.error('No se ha seleccionado especialidad o imagen');
        }
    };

    const handleDeleteImage = () => {
        if (selectedEspecialidad) {
            axios.delete('http://localhost:3001/api/delete-image', {
                data: {
                    esp_id: selectedEspecialidad.esp_id,
                    id_tat: tatuaId
                }
            })
                .then(response => {
                    console.log('Delete response:', response.data);
                    handleCloseModal();
                    setEspecialidades(prevEspecialidades =>
                        prevEspecialidades.map(e =>
                            e.esp_id === selectedEspecialidad.esp_id ? { ...e, status: 0, ima_url: null } : e
                        )
                    );
                })
                .catch(error => {
                    console.error('Error al eliminar la imagen:', error);
                });
        } else {
            console.error('No se ha seleccionado especialidad');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('tatuaName');
        localStorage.removeItem('tatuaId');
        navigate('/'); // Redirige al inicio de sesión
    };

    return (
        <div>
            <div className="FondoA">
            <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
                    <div className="container-fluid">
                        <a className="navbar-brand" onClick={() => navigate('/inicio_tatuador')}>TATTOOARTE</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => navigate('/tatuador_perfil')}>MI PERFIL</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => navigate('/tatuador_tatuajes')}>MIS TATUAJES</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => navigate('/tatuador_redes_sociales')}>MIS REDES SOCIALES</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => navigate('/tatuador_plan')}>MI PLAN</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => navigate('/tatuador_ubicacion')}>UBICACION</a>
                                </li>
                            </ul>
                            <div className="ms-auto p-2">
                                <button type="button" className="btn btn-outline-light" onClick={handleLogout}>Cerrar Sesión</button>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="container">
                    <div className="row mt-5">
                        <div className="col-md-12">
                            <h3 className="text-center">{tatuaName} estas son tus especialidades de tatuajes </h3>
                            <h3 className="text-center">El ID del Tatuador: {tatuaId}</h3>
                            <hr />
                            <div className="row">
                                {especialidades.map((especialidad) => (
                                    <div key={especialidad.esp_id} className="col-md-4 mb-4">
                                        <div className="card">
                                            <div className="card-body text-center">
                                                <h5 className="card-title">{especialidad.esp_nombre}</h5>
                                                <p className="card-text">{especialidad.esp_descripcion}</p>
                                                {especialidad.status === 1 ? (
                                                    <img
                                                    src={especialidad.ima_url ? `http://localhost:3001${especialidad.ima_url}` : '/default-image.jpg'}
                                                    className="card-img-top"
                                                    alt={`Imagen de ${especialidad.esp_nombre}`}
                                                    />) : (
                                                    <p>No hay imagen</p>,
                                                    <p className="card-text">{especialidad.ima_url}</p>
                                                )}
                                                <button
                                                    className="btn btn-primary mt-3"
                                                    onClick={() => handleShowModal(especialidad)}
                                                >
                                                    {especialidad.status === 1 ? 'Cambiar Imagen' : 'Agregar Imagen'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedEspecialidad ? selectedEspecialidad.esp_nombre : 'Subir Imagen'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Subir Imagen</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                        {imagePreview && (
                            <div className="mb-3">
                                <img src={imagePreview} alt="Preview" className="img-fluid" />
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {selectedEspecialidad && selectedEspecialidad.status === 1 && (
                        <Button variant="danger" onClick={handleDeleteImage}>
                            Eliminar Imagen
                        </Button>
                    )}
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default InicioT_tat;
