import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Publications from './pages/Publications';
import ScrollToTop from './components/ScrollToTop'; // Importado correctamente
import Login from './pages/Login';
import DoctorProfile from './pages/DoctorProfile';
import RegisterStudent from './pages/RegisterStudent';
import Dashboard from './pages/Dashboard';
import RegisterCourse from './pages/RegisterCourse'; 
import UploadPublication from './pages/UploadPublication';
import RegisterUser from './pages/RegisterUser'; 
import RegisterNews from './pages/RegisterNews';
import AboutUs from './pages/AboutUs';
import RegistrarProyecto from './components/RegistrarProyecto';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  return (
    <Router>
      {/* VITAL: Ponlo aquí. No renderiza nada visual, 
          pero detecta el cambio de página y sube el scroll. 
      */}
      <ScrollToTop />

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctor/:scholar_id" element={<DoctorProfile />} />
          <Route path="/registrar-usuario" element={<RegisterUser />} />
          <Route path="/registrar-estudiante" element={<RegisterStudent />} />
          <Route path="/registrar-noticia" element={<RegisterNews />} />
          <Route path="/conocenos" element={<AboutUs />} />
          <Route path="/registrar-proyecto" element={<RegistrarProyecto />} />
          <Route path="/proyecto/:id" element={<ProjectDetail />} />
          <Route path="/registrar-curso" element={<RegisterCourse />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;