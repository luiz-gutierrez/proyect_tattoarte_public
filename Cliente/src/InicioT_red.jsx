import React from 'react';
import { useNavigate } from 'react-router-dom';

function InicioT_red() {
    const navigate = useNavigate(); // Obtiene la función navigate para realizar redirecciones

    const redirectToUrl = (url) => {
        navigate(url); // Redirige a la URL especificada
    };

    return (
        <div>
            <div className="FondoA">
                <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body " data-bs-theme="dark">
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
                            <div class="ms-auto p-2">
                                <button type="button" class="btn btn-outline-danger" onClick={() => redirectToUrl('/')}>cerrar sesion</button>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="cuadro">
                    <div className="text-center mt-5">
                        <h2>MIS REDES SOCIALES</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default InicioT_red