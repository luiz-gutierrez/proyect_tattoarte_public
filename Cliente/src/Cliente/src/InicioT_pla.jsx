import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function InicioT_pla() {
    const navigate = useNavigate();
    const [tatuaId, setTatuaId] = useState('');
    const [planes, setPlanes] = useState([]);

    useEffect(() => {
        const id = localStorage.getItem('tatuaId');
        if (id) {
            setTatuaId(id);
        } else {
            navigate('/'); // Redirige al inicio de sesión si no se encuentra tatuaId
        }
    }, [navigate]);

    useEffect(() => {
        if (tatuaId) {
            axios.get(`http://localhost:3001/api/plan/${tatuaId}`)
                .then(response => {
                    console.log(response.data); // Verifica la respuesta aquí
                    const planData = Array.isArray(response.data) ? response.data : [response.data]; // Asegura que sea un array
                    setPlanes(planData);
                })
                .catch(error => {
                    console.error('Error fetching plans:', error);
                });
        }
    }, [tatuaId]);

    const redirectToUrl = (url) => {
        navigate(url);
    };

    const handleLogout = () => {
        localStorage.removeItem('tatuaName');
        localStorage.removeItem('tatuaId');
        navigate('/'); // Redirige al usuario a la página principal
    };

    const formatoFechaConDiaExtra = (fecha) => {
        // Crear una nueva fecha basada en la fecha original
        const fechaConDiaExtra = new Date(fecha);
        fechaConDiaExtra.setDate(fechaConDiaExtra.getDate() + 1); // Agregar un día

        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        return new Intl.DateTimeFormat('es-ES', options).format(fechaConDiaExtra);
    };

    const formatoFechaSinCambio = (fecha) => {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        return new Intl.DateTimeFormat('es-ES', options).format(new Date(fecha));
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
                    <div className="text-center mt-5">
                        {planes.length > 0 ? (
                            planes.map((plan, index) => (
                                <div key={index}>
                                    <h2>MI PLAN: {plan.pla_nombre}</h2>
                                    <br />
                                    <h3>Descripción: {plan.pla_descripcion}</h3>
                                    <h3>Duración: {plan.pla_duracion} meses</h3>
                                    <h3>Costo: {plan.pla_monto} $</h3>
                                    <h3>Fecha de Inicio: {formatoFechaConDiaExtra(plan.fecha_emision)}</h3> {/* Mostrar fecha de inicio con un día adicional */}
                                    <h3>Fecha de Vencimiento: {formatoFechaSinCambio(plan.fecha_vencimiento)}</h3> {/* Mostrar fecha de vencimiento sin cambios */}
                                </div>
                            ))
                        ) : (
                            <h3>No cuentas con ningún plan activo.</h3>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InicioT_pla;
