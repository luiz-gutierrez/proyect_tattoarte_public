import React, { useState } from 'react';
import './App.css';

function RegistroUT() {
  const [inputs, setInputs] = useState([]);
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
    especialidades: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleToggleInput = (type) => {
    const inputIndex = inputs.indexOf(type);
    if (inputIndex !== -1) {
      setInputs(inputs.filter(input => input !== type));
    } else {
      setInputs([...inputs, type]);
    }
  };

  const handleEspecialidadesChange = (e) => {
    const { value, checked } = e.target;
    const { especialidades } = formData;

    if (checked) {
      setFormData({
        ...formData,
        especialidades: [...especialidades, value]
      });
    } else {
      setFormData({
        ...formData,
        especialidades: especialidades.filter(id => id !== value)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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
              <br />
              <input type="text" className="form-control" placeholder="APELLIDO" aria-label="NOMBRE" name="apellido" onChange={handleInputChange} />
              <br />
              <input type="text" className="form-control" placeholder="TELEFONO" aria-label="First name" name="telefono" onChange={handleInputChange} />
              <br />
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="CORREO" aria-label="First name" name="email" onChange={handleInputChange} />
              <br />
              <input type="password" className="form-control" placeholder="CONTRASEÑA" aria-label="First name" name="password" onChange={handleInputChange} />
              <br />
            </div>
          </div>
          <div className="row">
            <h2>DIRECCION</h2>
            <div className="col">
              <input type="text" className="form-control" placeholder="CALLE" aria-label="First name" name="dir_calle" onChange={handleInputChange} />
              <br />
              <input type="text" className="form-control" placeholder="NUMERO EXTERIOR" aria-label="NOMBRE" name="dir_numero_ext" onChange={handleInputChange} />
              <br />
              <input type="text" className="form-control" placeholder="COLONIA" aria-label="First name" name="dir_colonia" onChange={handleInputChange} />
              <br />
              <input type="text" className="form-control" placeholder="CODIGO POSTAL" aria-label="First name" name="dir_cp" onChange={handleInputChange} />
              <br />
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="MUNICIPIO" aria-label="First name" name="dir_municipio" onChange={handleInputChange} />
              <br />
              <input type="text" className="form-control" placeholder="ESTADO" aria-label="First name" name="dir_estado" onChange={handleInputChange} />
              <br />
              <input type="text" className="form-control" placeholder="LOCALIDAD" aria-label="First name" name="dir_localidad" onChange={handleInputChange} />
              <br />
            </div>
          </div>
          <div className="row">
            <h2>ESPECIALIDAD Y REDES SOCIALES</h2>
            <div className="col">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="facebookSwitch" onClick={() => handleToggleInput('FACEBOOK')} />
                <label className="form-check-label" htmlFor="facebookSwitch">FACEBOOK</label>
              </div>
              <br />
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="whatsappSwitch" onClick={() => handleToggleInput('WHATSAPP')} />
                <label className="form-check-label" htmlFor="whatsappSwitch">WHATSAPP</label>
              </div>
              <br />
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="instagramSwitch" onClick={() => handleToggleInput('INSTAGRAM')} />
                <label className="form-check-label" htmlFor="instagramSwitch">INSTAGRAM</label>
              </div>
              <br />
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="tiktokSwitch" onClick={() => handleToggleInput('TIKTOK')} />
                <label className="form-check-label" htmlFor="tiktokSwitch">TIKTOK</label>
              </div>
            </div>
            <div className="col">
              {inputs.map((input, index) => (
                <input key={index} type="text" className="form-control mt-2" placeholder={`Link de ${input}`} name={`red_${input.toLowerCase()}`} aria-label={input} onChange={handleInputChange} />
              ))}
            </div>
          </div>
          <div className="row">
            <h2>ESPECIALIDADES</h2>
            <div className="col">
              <input className="form-check-input" type="checkbox" value="1" id="realista" onChange={handleEspecialidadesChange} /> REALISTA
              <br />
              <input className="form-check-input" type="checkbox" value="2" id="neotradicional" onChange={handleEspecialidadesChange} /> NEOTRADICIONAL
              <br />
              <input className="form-check-input" type="checkbox" value="3" id="dotwork" onChange={handleEspecialidadesChange} /> DOTWORK
              <br />
              <input className="form-check-input" type="checkbox" value="4" id="acuarela" onChange={handleEspecialidadesChange} /> ACUARELA
              <br />
              <input className="form-check-input" type="checkbox" value="5" id="geometrico" onChange={handleEspecialidadesChange} /> GEOMETRICO
              <br />
              <input className="form-check-input" type="checkbox" value="6" id="oldschool" onChange={handleEspecialidadesChange} /> OLD SCHOOL O TRADICIONAL
              <br />
            </div>
            <div className="col">
              <input className="form-check-input" type="checkbox" value="7" id="BLACKWORK" onChange={handleEspecialidadesChange} /> BLACKWORK
              <br />
              <input className="form-check-input" type="checkbox" value="8" id="JAPONÉS" onChange={handleEspecialidadesChange} /> JAPONÉS
              <br />
              <input className="form-check-input" type="checkbox" value="9" id="TEJIDO" onChange={handleEspecialidadesChange} /> TEJIDO
              <br />
              <input className="form-check-input" type="checkbox" value="10" id="TRIBAL" onChange={handleEspecialidadesChange} /> TRIBAL
              <br />
              <input className="form-check-input" type="checkbox" value="11" id="ANIME/GEEK/KAWAII" onChange={handleEspecialidadesChange} /> ANIME/GEEK/KAWAII
              <br />
              <input className="form-check-input" type="checkbox" value="12" id="3D" onChange={handleEspecialidadesChange} /> 3D
              <br />
            </div>
          </div>
          <button type="submit" className="btn btn-secondary">Crear Perfil</button>
        </form>
      </div>
      <br />
    </div>
  );
}

export default RegistroUT;
