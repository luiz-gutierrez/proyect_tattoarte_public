import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function InicioT_red() {
    const navigate = useNavigate();
    const [tatuaId, setTatuaId] = useState('');
    const [tatuaName, setTatuaName] = useState('');
    const [socialNetworks, setSocialNetworks] = useState({
        red_facebook: '',
        red_whatsapp: '',
        red_tiktok: '',
        red_instagram: ''
    });
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const redirectToUrl = (url) => {
        navigate(url);
    };

    const handleLogout = () => {
        localStorage.removeItem('tatuaName');
        localStorage.removeItem('tatuaId');
        navigate('/');
    };

    useEffect(() => {
        const name = localStorage.getItem('tatuaName');
        const id = localStorage.getItem('tatuaId');
        console.log('Nombre del tatuador:', name);
        console.log('ID del tatuador:', id);
        if (name && id) {
            setTatuaName(name);
            setTatuaId(id);
            fetchSocialNetworks(id);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const fetchSocialNetworks = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/tatuadores/${id}/redes_sociales`);
            console.log('Response data:', response.data);
            if (response.data) {
                setSocialNetworks(response.data);
            } else {
                setAlert({ show: true, message: 'No se encontraron redes sociales para este tatuador.', type: 'danger' });
            }
        } catch (error) {
            console.error('Error fetching social networks:', error.message);
            setAlert({ show: true, message: 'Error al obtener redes sociales.', type: 'danger' });
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setSocialNetworks((prevState) => ({
            ...prevState,
            [id]: value
        }));
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
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => redirectToUrl('/tatuador_ubicacion')}>UBICACION</a>
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
                        {alert.show && (
                            <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                                {alert.message}
                                <button type="button" className="btn-close" onClick={() => setAlert({ ...alert, show: false })} aria-label="Close"></button>
                            </div>
                        )}
                        <h2>REDES SOCIALES DE {tatuaName}</h2>
                        {socialNetworks ? (
                            <div>
                                <div className="mb-3">
                                    <label htmlFor="red_facebook" className="form-label">Facebook</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="red_facebook"
                                        value={socialNetworks.red_facebook || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="red_whatsapp" className="form-label">WhatsApp</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="red_whatsapp"
                                        value={socialNetworks.red_whatsapp || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="red_tiktok" className="form-label">TikTok</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="red_tiktok"
                                        value={socialNetworks.red_tiktok || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="red_instagram" className="form-label">Instagram</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="red_instagram"
                                        value={socialNetworks.red_instagram || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* Botón de guardar cambios eliminado */}
                            </div>
                        ) : (
                            <p>Cargando redes sociales...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InicioT_red;
