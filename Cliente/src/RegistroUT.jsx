import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

function RegistroUT() {
  const location = useLocation();
  const navigate = useNavigate();
  const [especialidades, setEspecialidades] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: location.state?.verifiedEmail || '', // Obtener el email verificado del estado
    password: '',
    dir_calle: '',
    dir_numero_ext: '',
    dir_colonia: '',
    dir_cp: '',
    dir_municipio: '',
    dir_estado: '',
    dir_localidad: '',
    red_tiktok: '',
    red_facebook: '',
    red_whatsapp: '',
    red_instagram: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Redirigir si no hay email verificado
    if (!location.state?.verifiedEmail) {
      navigate('/login'); // O la ruta donde esté tu modal de verificación
      return;
    }

    // Cargar especialidades
    axios
      .get('http://localhost:3001/api/especialidades')
      .then((response) => {
        setEspecialidades(response.data);
      })
      .catch((error) => {
        console.error('Error fetching specialties:', error);
      });
  }, [location.state, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') return; // No permitir modificar el email
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar campos obligatorios
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    if (!formData.password.trim()) newErrors.password = 'La contraseña es obligatoria';
    if (!formData.dir_calle.trim()) newErrors.dir_calle = 'La calle es obligatoria';
    if (!formData.dir_numero_ext.trim()) newErrors.dir_numero_ext = 'El número exterior es obligatorio';
    if (!formData.dir_colonia.trim()) newErrors.dir_colonia = 'La colonia es obligatoria';
    if (!formData.dir_cp.trim()) newErrors.dir_cp = 'El código postal es obligatorio';
    if (!formData.dir_municipio.trim()) newErrors.dir_municipio = 'El municipio es obligatorio';
    if (!formData.dir_estado.trim()) newErrors.dir_estado = 'El estado es obligatorio';
    if (!formData.dir_localidad.trim()) newErrors.dir_localidad = 'La localidad es obligatoria';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          especialidades: especialidades.map((esp) => ({ esp_id: esp.esp_id, status: 0 })), // Guardar todas las especialidades con estado 0
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Error en la respuesta del servidor');
          return response.json();
        })
        .then((data) => {
          console.log('Response:', data);

          if (data.message.includes('Tatuador y factura registrados exitosamente')) {
            localStorage.setItem('tatuaName', formData.nombre);
            localStorage.setItem('tatuaId', data.tatuaId);
            navigate('/inicio_tatuador');
          } else {
            console.error('Error en el registro:', data.message);
          }
        })
        .catch((error) => {
          console.error('Error en la solicitud:', error);
        });
    }
  };

  return (
    <div className="Fondo1">
      <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">TATTOOARTE</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">INICIO</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">TEXTO 1</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">TEXTO 2</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="cuadro">
        <h2>DATOS PERSONALES</h2>
        <form onSubmit={handleSubmit}>
          {/* Campos personales */}
          <div className="row">
            <div className="col">
              <input type="text" className="form-control" placeholder="NOMBRE" name="nombre" onChange={handleInputChange} value={formData.nombre} />
              {errors.nombre && <div className="alert alert-danger">{errors.nombre}</div>}
              <input type="text" className="form-control" placeholder="APELLIDO" name="apellido" onChange={handleInputChange} value={formData.apellido} />
              {errors.apellido && <div className="alert alert-danger">{errors.apellido}</div>}
              <input type="text" className="form-control" placeholder="TELEFONO" name="telefono" onChange={handleInputChange} value={formData.telefono} />
              {errors.telefono && <div className="alert alert-danger">{errors.telefono}</div>}
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="CORREO" name="email" value={formData.email} readOnly disabled style={{ backgroundColor: '#e9ecef' }} />
              <input type="password" className="form-control" placeholder="CONTRASEÑA" name="password" onChange={handleInputChange} value={formData.password} />
              {errors.password && <div className="alert alert-danger">{errors.password}</div>}
            </div>
          </div>

          {/* Dirección */}
          <h2>DIRECCIÓN</h2>
          <div className="row">
            <div className="col">
              <input type="text" className="form-control" placeholder="CALLE" name="dir_calle" onChange={handleInputChange} value={formData.dir_calle} />
              {errors.dir_calle && <div className="alert alert-danger">{errors.dir_calle}</div>}
              <input type="text" className="form-control" placeholder="NUMERO EXTERIOR" name="dir_numero_ext" onChange={handleInputChange} value={formData.dir_numero_ext} />
              {errors.dir_numero_ext && <div className="alert alert-danger">{errors.dir_numero_ext}</div>}
              <input type="text" className="form-control" placeholder="COLONIA" name="dir_colonia" onChange={handleInputChange} value={formData.dir_colonia} />
              {errors.dir_colonia && <div className="alert alert-danger">{errors.dir_colonia}</div>}
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="CÓDIGO POSTAL" name="dir_cp" onChange={handleInputChange} value={formData.dir_cp} />
              {errors.dir_cp && <div className="alert alert-danger">{errors.dir_cp}</div>}
              <input type="text" className="form-control" placeholder="MUNICIPIO" name="dir_municipio" onChange={handleInputChange} value={formData.dir_municipio} />
              {errors.dir_municipio && <div className="alert alert-danger">{errors.dir_municipio}</div>}
              <input type="text" className="form-control" placeholder="ESTADO" name="dir_estado" onChange={handleInputChange} value={formData.dir_estado} />
              {errors.dir_estado && <div className="alert alert-danger">{errors.dir_estado}</div>}
              <input type="text" className="form-control" placeholder="LOCALIDAD" name="dir_localidad" onChange={handleInputChange} value={formData.dir_localidad} />
              {errors.dir_localidad && <div className="alert alert-danger">{errors.dir_localidad}</div>}
            </div>
          </div>

          {/* Redes Sociales */}
          <h2>REDES SOCIALES</h2>
          <div className="row">
            <div className="col">
              <input type="text" className="form-control" placeholder="TIKTOK" name="red_tiktok" onChange={handleInputChange} value={formData.red_tiktok} />
              <input type="text" className="form-control" placeholder="FACEBOOK" name="red_facebook" onChange={handleInputChange} value={formData.red_facebook} />
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="WHATSAPP" name="red_whatsapp" onChange={handleInputChange} value={formData.red_whatsapp} />
              <input type="text" className="form-control" placeholder="INSTAGRAM" name="red_instagram" onChange={handleInputChange} value={formData.red_instagram} />
            </div>
          </div>

          <button type="submit" className="btn btn-dark mt-3">REGISTRAR</button>
        </form>
      </div>
    </div>
  );
}

export default RegistroUT;
