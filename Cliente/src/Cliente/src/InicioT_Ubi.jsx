import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function InicioT_Ubi() {
    const navigate = useNavigate();
    const [tatuaName, setTatuaName] = useState('');
    const [tatuaId, setTatuaId] = useState('');
    const [tatuaDetails, setTatuaDetails] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    
    // Ubicación inicial (ejemplo: Ciudad de México)
    const [location, setLocation] = useState({ lat: 19.404149704982625 , lng: -98.98561856639321 });

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
        if (name && id) {
            setTatuaName(name);
            setTatuaId(id);
            axios.get(`http://localhost:3001/api/tatuador/${id}`)
                .then(response => {
                    setTatuaDetails(response.data);
                    // Actualiza la ubicación con los datos del tatuador si los tienes
                    if (response.data.latitude && response.data.longitude) {
                        setLocation({ lat: response.data.latitude, lng: response.data.longitude });
                    }
                })
                .catch(error => {
                    console.error('Error fetching tatuador details:', error.response ? error.response.data : error.message);
                });
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleSave = () => {
        axios.put(`http://localhost:3001/api/tatuador/${tatuaId}`, tatuaDetails)
            .then(response => {
                setAlert({ show: true, message: 'Los cambios se han guardado correctamente.', type: 'success' });
            })
            .catch(error => {
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
                                <li className="nav-item"><a className="nav-link" onClick={() => redirectToUrl('/tatuador_perfil')}>MI PERFIL</a></li>
                                <li className="nav-item"><a className="nav-link" onClick={() => redirectToUrl('/tatuador_tatuajes')}>MIS TATUAJES</a></li>
                                <li className="nav-item"><a className="nav-link" onClick={() => redirectToUrl('/tatuador_redes_sociales')}>MIS REDES SOCIALES</a></li>
                                <li className="nav-item"><a className="nav-link" onClick={() => redirectToUrl('/tatuador_plan')}>MI PLAN</a></li>
                                <li className="nav-item"><a className="nav-link" onClick={() => redirectToUrl('/tatuador_ubicacion')}>UBICACION</a></li>
                            </ul>
                            <div className="ms-auto p-2">
                                <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>Cerrar sesión</button>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="cuadro">
                    <div className="text-center mt-3">
                        <h1>MI UBICACION</h1>
                    </div>
                    <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: "400px", width: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[location.lat, location.lng]}>
                        {/* <Popup>{tatuaName}</Popup> */}
                        <Popup>Oficinas de Tattooarte</Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default InicioT_Ubi;
