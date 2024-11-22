import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login.jsx';
import RegistroUT from './RegistroUT.jsx';
import RegistroUC from './RegistroUC.jsx';
import InicioA from './InicioA.jsx';
import InicioA_TT from './InicioA_TT.jsx';
import InicioA_VW from './InicioA_VW.jsx';
import InicioA_Pla from './InicioA_Pla.jsx';
import InicioT from './InicioT.jsx';
import InicioT_per from './InicioT_per.jsx';
import InicioT_tat from './InicioT_tat.jsx';
import InicioT_red from './InicioT_red.jsx';
import InicioT_pla from './InicioT_pla.jsx';
import InicioV from './InicioV.jsx';
import axios from 'axios';
import InicioT_Ubi from './InicioT_Ubi.jsx';

function App() {

  const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/viewers')
            .catch(error => {
               console.error('There was an error fetching the data!', error);
            });
    }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro_tatuador" element={<RegistroUT />} />
        <Route path="/registro_viwer" element={<RegistroUC />} />
        
        <Route path="/inicio_admin" element={<InicioA />} />
        <Route path="/admin_tatuadores" element={<InicioA_TT />} />
        <Route path="/admin_viewers" element={<InicioA_VW />} />
        <Route path="/admin_planes" element={<InicioA_Pla />} />

        <Route path="/inicio_tatuador" element={<InicioT />} />
        <Route path="/tatuador_perfil" element={<InicioT_per />} />
        <Route path="/tatuador_tatuajes" element={<InicioT_tat />} />
        <Route path="/tatuador_redes_sociales" element={<InicioT_red />} />
        <Route path="/tatuador_plan" element={<InicioT_pla />} />
        <Route path="/tatuador_ubicacion" element={<InicioT_Ubi />} />
        
        <Route path="/inicio_viewer" element={<InicioV />} />
      </Routes>
    </Router>
  );
}

export default App;
