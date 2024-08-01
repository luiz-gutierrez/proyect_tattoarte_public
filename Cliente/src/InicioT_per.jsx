import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function InicioT_per() {
    const navigate = useNavigate();
    const [tatuaName, setTatuaName] = useState('');
    const [tatuaId, setTatuaId] = useState('');
    const [tatuaDetails, setTatuaDetails] = useState(null); // Estado para los detalles del tatuador
    const [alert, setAlert] = useState({ show: false, message: '', type: '' }); // Estado para la alerta

    const redirectToUrl = (url) => {
        navigate(url); // Redirige a la URL especificada
    };

    const handleLogout = () => {
        localStorage.removeItem('tatuaName');
        localStorage.removeItem('tatuaId');
        navigate('/'); // Redirige al usuario a la página principal
    };

    useEffect(() => {
        const name = localStorage.getItem('tatuaName');
        const id = localStorage.getItem('tatuaId');
        if (name && id) {
            setTatuaName(name);
            setTatuaId(id);
            // Hacer solicitud al backend para obtener los detalles del tatuador
            axios.get(`http://localhost:3001/api/tatuador/${id}`)
                .then(response => {
                    console.log('Datos del tatuador:', response.data); // Verificar los datos aquí
                    setTatuaDetails(response.data);
                })
                .catch(error => {
                    console.error('Error fetching tatuador details:', error.response ? error.response.data : error.message);
                });
        } else {
            navigate('/'); // Redirige al inicio de sesión si no se encuentra tatuaId
        }
    }, [navigate]);

    const handleSave = () => {
        axios.put(`http://localhost:3001/api/tatuador/${tatuaId}`, tatuaDetails)
            .then(response => {
                console.log('Detalles actualizados:', response.data);
                setAlert({ show: true, message: 'Los cambios se han guardado correctamente.', type: 'success' });
            })
            .catch(error => {
                console.error('Error updating tatuador details:', error.response ? error.response.data : error.message);
                setAlert({ show: true, message: 'Error al guardar los cambios.', type: 'danger' });
            });
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
                                <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>Cerrar sesión</button>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="cuadro">
                    <div className="text-center mt-3">
                        <h1>MIS DATOS</h1>
                        {alert.show && (
                            <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                                {alert.message}
                                <button type="button" className="btn-close" onClick={() => setAlert({ ...alert, show: false })} aria-label="Close"></button>
                            </div>
                        )}
                        {tatuaDetails ? (
                            <div>
                                <label>
                                    <strong>Nombre:</strong>
                                    <input type="text" className="form-control" value={tatuaDetails.nombre} onChange={(e) => setTatuaDetails({ ...tatuaDetails, nombre: e.target.value })} />
                                </label>
                                <br />
                                <label>
                                    <strong>Apellido:</strong>
                                    <input type="text" className="form-control" value={tatuaDetails.apellido} onChange={(e) => setTatuaDetails({ ...tatuaDetails, apellido: e.target.value })} />
                                </label>
                                <br />
                                <label>
                                    <strong>Teléfono:</strong>
                                    <input type="text" className="form-control" value={tatuaDetails.telefono} onChange={(e) => setTatuaDetails({ ...tatuaDetails, telefono: e.target.value })} />
                                </label>
                                <br />
                                <label>
                                    <strong>Email:</strong>
                                    <input type="text" className="form-control" value={tatuaDetails.email} onChange={(e) => setTatuaDetails({ ...tatuaDetails, email: e.target.value })} />
                                </label>
                                <br/>
                                <br/>
                                <button type="button" className="btn btn-primary" onClick={handleSave}>Guardar cambios</button>
                            </div>
                        ) : (
                            <p>Cargando detalles del tatuador...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InicioT_per;
