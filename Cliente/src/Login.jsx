import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const redirectToUrl = (path) => {
        navigate(path);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/login', { email, password });
            const userType = response.data.userType;
            if (userType === 'admin') {
                const adminName = response.data.adminName;
                localStorage.setItem('adminName', adminName);
                redirectToUrl('/inicio_admin');
            } else if (userType === 'tatuador') {
                const tatuaName = response.data.tatuaName;
                const tatuaId = response.data.idName;
                localStorage.setItem('tatuaId', tatuaId);
                localStorage.setItem('tatuaName', tatuaName);
                redirectToUrl('/inicio_tatuador');
            } else if (userType === 'viewer') {
                const viewerName = response.data.viewerName;
                const viewerId = response.data.viewerId;
                localStorage.setItem('viewerId', viewerId);
                localStorage.setItem('viewerName', viewerName);
                redirectToUrl('/inicio_viewer');
            }
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError('Error al conectar con el servidor');
            }
        }
    };

    return (
    <div>
      <div className="Fondo2">
        <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">TATTOOARTE</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">INICIO</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">¿QUE ES TATTOOARTE?</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">TEXTO 2</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="cuadro">
          <div className="text-center mt-5">
            <h2>BIENVENIDOS</h2>
            <div className="row">
              <div className="col">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="CORREO" 
                  aria-label="First name"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="CONTRASEÑA" 
                  aria-label="First name"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                {error && <div className="alert alert-danger d-inline-flex p-2 bd-highlight" role="alert">
                  {error}
                </div>}
              </div>
            </div>
            <button type="button" className="btn btn-secondary" onClick={handleLogin}>INICIAR SESION</button>
          </div>
          <div className="row text-center mt-5">
            <div className="col">
              <p className="text-decoration-underline text-info">OLVIDE CONTRASEÑA</p>
            </div>
            <div className="col">
              <p className="text-decoration-underline text-info" onClick={handleShow}>CREAR CUENTA</p>
              <br />
            </div>
          </div>
        </div>
      </div>

      <Modal className='modal-lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>¿Qué tipo de perfil deseas crear?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-around">
          <Button className="m-2" variant="outline-success" onClick={() => redirectToUrl('/registro_tatuador')}>
            <div>
              <h3>TATUADOR</h3>
              <p>
                Podrás mostrar tus especialidades, diseños, ubicación de estudio, redes sociales para tus futuros clientes.
              </p>
            </div>
          </Button>

          <Button className="m-2" variant="outline-success" onClick={() => redirectToUrl('/registro_viwer')}>
            <div>
              <h3>CLIENTE</h3>
              <p>
                Podrás visualizar los perfiles de los tatuadores (especialidades, diseños, ubicación de estudio, redes sociales), para hacerte tu tatuaje.
              </p>
            </div>
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Login;
