import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './App.css';

function RegistroUT() {
  const [inputs, setInputs] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
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
    especialidades: [] // IDs de especialidades seleccionadas
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    axios.get('http://localhost:3001/api/especialidades')
      .then(response => {
        setEspecialidades(response.data);
      })
      .catch(error => {
        console.error('Error fetching specialties:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (especialidad) => {
    setFormData((prevFormData) => {
      const { especialidades } = prevFormData;
      if (especialidades.includes(especialidad)) {
        return {
          ...prevFormData,
          especialidades: especialidades.filter(esp => esp !== especialidad)
        };
      } else {
        return {
          ...prevFormData,
          especialidades: [...especialidades, especialidad]
        };
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'nombre', 'apellido', 'telefono', 'email', 'password',
      'dir_calle', 'dir_numero_ext', 'dir_colonia', 'dir_cp',
      'dir_municipio', 'dir_estado', 'dir_localidad'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Este campo es requerido';
      }
    });

    inputs.forEach(input => {
      if (!formData[`red_${input.toLowerCase()}`]) {
        newErrors[`red_${input.toLowerCase()}`] = 'Este campo es requerido';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
        fetch('http://localhost:3001/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formData,
                especialidadesSeleccionadas: formData.especialidades.map(esp => esp.esp_id), // Obtener sólo los IDs
                todasEspecialidades: especialidades.map(esp => esp.esp_id) // Obtener sólo los IDs
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.message === 'Tatuador registrado exitosamente') {
                localStorage.setItem('tatuaName', formData.nombre);
                localStorage.setItem('tatuaId', data.tatuaId); // Guarda el ID del tatuador
                navigate('/inicio_tatuador'); // Redirige al usuario a /inicio_tatuador
            } else {
                console.error('Error en el registro:', data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
};

  return (
    <div className="Fondo1">
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
                <a className="nav-link" href="#">TEXTO 1</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">TEXTO 2</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div>Registro Tatuador</div>
      <div className="cuadro">
        <h2>DATOS PERSONALES</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col">
              <input type="text" className="form-control" placeholder="NOMBRE" aria-label="First name" name="nombre" onChange={handleInputChange} />
              {errors.nombre && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.nombre}</div>}
              <br />
              <input type="text" className="form-control" placeholder="APELLIDO" aria-label="First name" name="apellido" onChange={handleInputChange} />
              {errors.apellido && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.apellido}</div>}
              <br />
              <input type="text" className="form-control" placeholder="TELEFONO" aria-label="First name" name="telefono" onChange={handleInputChange} />
              {errors.telefono && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.telefono}</div>}
              <br />
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="CORREO" aria-label="Email" name="email" onChange={handleInputChange} />
              {errors.email && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.email}</div>}
              <br />
              <input type="password" className="form-control" placeholder="CONTRASEÑA" aria-label="Password" name="password" onChange={handleInputChange} />
              {errors.password && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.password}</div>}
              <br />
            </div>
          </div>
          <div className="row">
            <h2>DIRECCION</h2>
            <div className="col">
              <input type="text" className="form-control" placeholder="CALLE" aria-label="Street" name="dir_calle" onChange={handleInputChange} />
              {errors.dir_calle && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.dir_calle}</div>}
              <br />
              <input type="text" className="form-control" placeholder="NUMERO EXTERIOR" aria-label="Exterior number" name="dir_numero_ext" onChange={handleInputChange} />
              {errors.dir_numero_ext && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.dir_numero_ext}</div>}
              <br />
              <input type="text" className="form-control" placeholder="COLONIA" aria-label="Neighborhood" name="dir_colonia" onChange={handleInputChange} />
              {errors.dir_colonia && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.dir_colonia}</div>}
              <br />
              <input type="text" className="form-control" placeholder="CODIGO POSTAL" aria-label="Postal code" name="dir_cp" onChange={handleInputChange} />
              {errors.dir_cp && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.dir_cp}</div>}
              <br />
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="MUNICIPIO" aria-label="Municipality" name="dir_municipio" onChange={handleInputChange} />
              {errors.dir_municipio && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.dir_municipio}</div>}
              <br />
              <input type="text" className="form-control" placeholder="ESTADO" aria-label="State" name="dir_estado" onChange={handleInputChange} />
              {errors.dir_estado && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.dir_estado}</div>}
              <br />
              <input type="text" className="form-control" placeholder="LOCALIDAD" aria-label="Locality" name="dir_localidad" onChange={handleInputChange} />
              {errors.dir_localidad && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.dir_localidad}</div>}
              <br />
            </div>
          </div>
          <div className="row">
            <h2>REDES SOCIALES</h2>
            <div className="col">
              <input type="text" className="form-control" placeholder="TIKTOK" aria-label="Tiktok" name="red_tiktok" onChange={handleInputChange} />
              {errors.red_tiktok && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.red_tiktok}</div>}
              <br />
              <input type="text" className="form-control" placeholder="FACEBOOK" aria-label="Facebook" name="red_facebook" onChange={handleInputChange} />
              {errors.red_facebook && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.red_facebook}</div>}
              <br />
              <input type="text" className="form-control" placeholder="WHATSAPP" aria-label="Whatsapp" name="red_whatsapp" onChange={handleInputChange} />
              {errors.red_whatsapp && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.red_whatsapp}</div>}
              <br />
              <input type="text" className="form-control" placeholder="INSTAGRAM" aria-label="Instagram" name="red_instagram" onChange={handleInputChange} />
              {errors.red_instagram && <div className="alert alert-danger d-inline-flex p-2 bd-highlight">{errors.red_instagram}</div>}
              <br />
            </div>
          </div>
          <div className="row">
            <h2>ESPECIALIDADES</h2>
            <div className="col">
              {especialidades.map(esp => (
                <div key={esp.esp_id}>
                  <input
                    type="checkbox"
                    id={`especialidad-${esp.esp_id}`}
                    checked={formData.especialidades.includes(esp.esp_id)}
                    onChange={() => handleCheckboxChange(esp.esp_id)}
                  />
                  <label htmlFor={`especialidad-${esp.esp_id}`}>{esp.esp_nombre}</label>
                  <br />
                </div>
              ))}
            </div>
          </div>
          <br />
          <button type="submit" className="btn btn-primary">Registrar</button>
        </form>
      </div>
    </div>
  );
}

export default RegistroUT;
