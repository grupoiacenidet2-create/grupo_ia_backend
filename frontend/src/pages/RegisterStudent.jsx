import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, GraduationCap, Info, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import API from '../api';

const RegisterStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'phd', 
    link: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      await API.post('students/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("¡Estudiante añadido al grupo de investigación!");
      navigate('/dashboard'); 
    } catch (err) {
      console.error(err);
      alert("Hubo un error al registrar al alumno. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-8 flex flex-col items-center font-sans">
      <div className="w-full max-w-2xl">
        
        {/* BOTÓN VOLVER AL PANEL RESALTADO */}
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 text-[#072146] font-black uppercase text-[11px] tracking-[0.2em] shadow-sm hover:bg-[#072146] hover:text-white hover:border-[#072146] hover:shadow-md transition-all duration-300 rounded-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Volver al Panel de Control
          </Link>
        </div>

        <div className="bg-white shadow-2xl border border-slate-200 overflow-hidden rounded-sm">
          {/* ENCABEZADO ESTILO INSTITUCIONAL */}
          <div className="bg-[#072146] p-10 text-white border-b-4 border-[#49a5e6]">
            <div className="flex items-center gap-5">
              <div className="bg-white/10 p-4 rounded-xl text-[#49a5e6]">
                <UserPlus size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Nuevo Estudiante</h2>
                <p className="text-[#49a5e6] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Gestión de Grupo de Investigación</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            
            {/* NOMBRE COMPLETO */}
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest flex items-center gap-2">
                <UserPlus size={14} /> Nombre del Alumno
              </label>
              <input 
                type="text" required
                className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#49a5e6] outline-none text-sm font-bold text-[#072146] uppercase"
                placeholder="Ej: ERIC JI"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* CATEGORÍA */}
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest flex items-center gap-2">
                <GraduationCap size={14} /> Nivel Académico
              </label>
              <select 
                className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#49a5e6] outline-none text-sm font-bold text-[#072146] appearance-none cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="phd">ESTUDIANTE DE DOCTORADO</option>
                <option value="undergrad">ESTUDIANTE DE PREGRADO</option>
                <option value="alumni">ANTIGUO ALUMNO / EGRESADO</option>
              </select>
            </div>

            {/* DESCRIPCIÓN / ESTADO */}
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest flex items-center gap-2">
                <Info size={14} /> Descripción de Apoyo / Estatus
              </label>
              <input 
                type="text" required
                className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#49a5e6] outline-none text-sm font-medium"
                placeholder="Ej: Desde otoño de 2025 o coasesorado por el profesor Minh Do"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {/* LINK (OPCIONAL) */}
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest flex items-center gap-2">
                <LinkIcon size={14} /> Perfil Personal o LinkedIn (Opcional)
              </label>
              <input 
                type="url"
                className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#49a5e6] outline-none text-sm"
                placeholder="https://linkedin.com/in/perfil"
                onChange={(e) => setFormData({...formData, link: e.target.value})}
              />
            </div>

            {/* BOTÓN FINAL */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#072146] text-white font-black py-5 flex items-center justify-center gap-3 shadow-lg hover:bg-[#49a5e6] transition-all uppercase text-[11px] tracking-[0.3em] disabled:opacity-50 group"
            >
              {loading ? "PROCESANDO..." : "CONFIRMAR REGISTRO"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStudent;