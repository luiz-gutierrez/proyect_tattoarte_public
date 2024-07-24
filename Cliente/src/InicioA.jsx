import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function InicioA() {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState('');

    useEffect(() => {
        const name = localStorage.getItem('adminName'); // Obtiene el nombre del administrador desde localStorage
        if (name) {
            setAdminName(name); // Establece el nombre del administrador en el estado
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
                        <h2>BIENVENIDO ADMINISTRADOR {adminName}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InicioA;
