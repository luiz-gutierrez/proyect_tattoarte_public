import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function InicioV() {
    const navigate = useNavigate();
    const [imagenes, setImagenes] = useState([]);
    const [viewerName, setViewerName] = useState('');
    const [viewerId, setViewerId] = useState('');

    useEffect(() => {
        // Realizar la solicitud para obtener las imágenes desde la API
        axios.get('http://localhost:3001/api/imagenes_pru')
            .then(response => {
                console.log(response.data); // Verificar los datos recibidos
                setImagenes(response.data); // Asignar los datos recibidos al estado
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, []);

    useEffect(() => {
        const name = localStorage.getItem('viewerName');
        const id = localStorage.getItem('viewerId');
        if (name) {
            setViewerName(name);
        }
        if (id) {
            setViewerId(id);
        }
    }, []);

    const redirectToUrl = (url) => {
        navigate(url);
    };

    const handleLogout = () => {
        localStorage.removeItem('tatuaName');
        navigate('/'); // Redirige al usuario a la página principal
    };

    return (
        <div>
            <div className="FondoA">
                <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body " data-bs-theme="dark">
                    <div className="container-fluid">
                        <a className="navbar-brand" onClick={() => redirectToUrl('/inicio_viewer')}>TATTOOARTE</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <div className="ms-auto p-2">
                                 <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>Cerrar sesión</button>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="cuadro">
                    <div className="text-center mt-5">
                        <h2>BIENVENIDO {viewerName} </h2>
                        <h2>BIENVENIDO {viewerId} </h2>
                        <br />
                    </div>
                    <div className="row row-cols-2 row-cols-md-4 g-4" >
                        {imagenes.map((imagen, index) => (
                            <div className="col" key={index}>
                                <div className="card border-dark">
                                    <img src={`http://localhost:3001${imagen.ima_url}`} className="card-img-top" alt={`Imagen ${index}`} />
                                    <div className="card-body">
                                        <h5 className="card-title">{imagen.esp_id}</h5>
                                        <p className="card-text">{imagen.ima_url}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InicioV;
