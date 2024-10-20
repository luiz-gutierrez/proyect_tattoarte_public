import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Asegúrate de que axios esté importado

function InicioA() {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState('');
    const [facturas, setFacturas] = useState([]);
    const [error, setError] = useState(null); // Para manejar errores

    useEffect(() => {
        const name = localStorage.getItem('adminName'); // Obtiene el nombre del administrador desde localStorage
        if (name) {
            setAdminName(name); // Establece el nombre del administrador en el estado
        }

        const fetchFacturas = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/facturas'); // Realiza la solicitud a la API
                if (Array.isArray(response.data)) {
                    setFacturas(response.data); // Establece las facturas en el estado
                } else {
                    throw new Error('Los datos no son una lista válida');
                }
            } catch (error) {
                console.error('Error al obtener las facturas:', error);
                setError(error.message); // Establece el mensaje de error en el estado
            }
        };

        fetchFacturas(); // Llama a la función para obtener las facturas
    }, []);

    const formatoFechaConDiaExtra = (fecha) => {
        const fechaConDiaExtra = new Date(fecha);
        fechaConDiaExtra.setDate(fechaConDiaExtra.getDate() + 1); // Agregar un día

        const options = { day: '2-digit', month: '2-digit', year: 'numeric' }; // Cambié year a 'numeric' para obtener 2024 en lugar de 24
        return new Intl.DateTimeFormat('es-ES', options).format(fechaConDiaExtra);
    };

    const formatoFechaSinCambio = (fecha) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('es-ES', options).format(new Date(fecha));
    };

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
                            <div className="ms-auto p-2">
                                <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>Cerrar sesión</button>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="cuadro">
                    <div className="text-center mt-5">
                        <h2>BIENVENIDO ADMINISTRADOR {adminName}</h2>
                        {error && <div className="alert alert-danger">{error}</div>} {/* Muestra el error */}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre del Tatuador</th>
                                    <th>Apellido del Tatuador</th>
                                    <th>Fecha de Emisión</th>
                                    <th>Fecha de Vencimiento</th>
                                    <th>Monto</th>
                                    <th>Estado de Pago</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facturas.map(factura => (
                                    <tr key={factura.fac_id}>
                                        <td>{factura.fac_id}</td>
                                        <td>{factura.nombre_tat || 'No disponible'}</td>
                                        <td>{factura.apellido_tat || 'No disponible'}</td>
                                        <td>{formatoFechaConDiaExtra(factura.fecha_emision)}</td>
                                        <td>{formatoFechaSinCambio(factura.fecha_vencimiento)}</td>
                                        <td>{factura.monto}</td>
                                        <td>{factura.estado_pago}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InicioA;
