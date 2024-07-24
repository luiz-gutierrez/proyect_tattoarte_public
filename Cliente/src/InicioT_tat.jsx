import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

function InicioT_tat() {
    const [especialidades, setEspecialidades] = useState([]);
    const [selectedEspecialidades, setSelectedEspecialidades] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const [tatuaName, setTatuaName] = useState('');
    const [tatuaId, setTatuaId] = useState('');

    useEffect(() => {
        const name = localStorage.getItem('tatuaName');
        const id = localStorage.getItem('tatuaId');
        console.log('Nombre:', name);
        console.log('ID:', id);

        if (name && id) {
            setTatuaName(name);
            setTatuaId(id);
        } else {
            console.error('No se encontró tatuaId en localStorage');
            navigate('/'); // Redirige al inicio de sesión si no se encuentra tatuaId
        }
    }, [navigate]);

    useEffect(() => {
        if (tatuaId) {
            axios.get(`http://localhost:3001/api/especialidades/${tatuaId}`)
                .then(response => {
                    setEspecialidades(response.data);
                })
                .catch(error => {
                    console.error('Error fetching specialties:', error);
                });
        }
    }, [tatuaId]);

    const redirectToUrl = (url) => {
        navigate(url);
    };

    const handleCheckboxChange = (especialidad) => {
        setSelectedEspecialidades(prevSelected => {
            if (prevSelected.includes(especialidad)) {
                return prevSelected.filter(e => e !== especialidad);
            } else {
                return [...prevSelected, especialidad];
            }
        });
    };

    const handleShowModal = (especialidad) => {
        setSelectedEspecialidad(especialidad);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEspecialidad(null);
        setImage(null);
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSaveChanges = () => {
        if (selectedEspecialidad && image) {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('esp_id', selectedEspecialidad.esp_id);
            formData.append('id_tat', tatuaId);

            axios.post('http://localhost:3001/api/upload', formData)
                .then(response => {
                    console.log('Imagen subida con éxito:', response.data);
                    handleCloseModal();
                })
                .catch(error => {
                    console.error('Error al subir la imagen:', error);
                });
        } else {
            console.error('No se ha seleccionado especialidad o imagen');
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
                        <a className="navbar-brand" onClick={() => redirectToUrl('/inicio_tatuador')}>TATTOOARTE</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => redirectToUrl('/tatuador_perfil')}>MI PERFIL</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => redirectToUrl('/tatuador_tatuajes')}>MIS TATUAJES</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => redirectToUrl('/tatuador_redes_sociales')}>MIS REDES SOCIALES</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => redirectToUrl('/tatuador_plan')}>MI PLAN</a>
                                </li>
                            </ul>
                            <div className="ms-auto p-2">
                                <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>Cerrar Sesión</button>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="cuadro">
                    <div className="text-center mt-5">
                        <h2>El ID del Tatuador: {tatuaId}</h2>
                        <h2>MIS ESPECIALIDADES DE {tatuaName}</h2>
                    </div>
                    <div>
                        <div className="row container text-center mt-5" style={{ paddingLeft: "5%" }}>
                            {especialidades.map((especialidad, index) => (
                                <div className="d-flex justify-content-start col-6 col-sm-4 form-check form-switch" key={index}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id={`flexSwitchCheckDefault_${index}`}
                                        onChange={() => handleCheckboxChange(especialidad)}
                                        checked={especialidad.status === 1}
                                        disabled={especialidad.status !== 1}
                                    />
                                    {especialidad.esp_nombre}
                                </div>
                            ))}
                        </div>
                        <br />
                    </div>
                    <div className="row">
                        <div className="col">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Descripción</th>
                                        <th scope="col">Imagen</th>
                                        <th scope="col">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedEspecialidades.map((especialidad, index) => (
                                        <tr key={index}>
                                            <td>{especialidad.esp_nombre}</td>
                                            <td>{especialidad.esp_descripcion}</td>
                                            <td></td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-success"
                                                    onClick={() => handleShowModal(especialidad)}
                                                >
                                                    Agregar imagen
                                                </button>&nbsp;
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {selectedEspecialidad && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Imagen</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formEspecialidad">
                                <Form.Label>Especialidad</Form.Label>
                                <Form.Control type="text" value={selectedEspecialidad.esp_nombre} readOnly/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formImagen">
                                <Form.Label>Subir Imagen</Form.Label>
                                <Form.Control type="file" onChange={handleFileChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cerrar
                        </Button>
                        <Button variant="primary" onClick={handleSaveChanges}>
                            Guardar Cambios
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default InicioT_tat;
