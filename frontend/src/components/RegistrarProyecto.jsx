import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Save, ArrowLeft, Image as ImageIcon, Users, FileText } from 'lucide-react';
import API from '../api';

const RegistrarProyecto = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('participants', participants);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await API.post('projects/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      alert("¡Proyecto registrado exitosamente!");
      navigate('/dashboard');
    } catch (err) {
      console.error("Error al subir:", err.response?.data);
      setError("Error al registrar el proyecto. Revisa los permisos o los campos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-8 flex flex-col items-center">
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
                <Layout size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Nuevo Proyecto</h2>
                <p className="text-[#49a5e6] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Registro de Investigación y Desarrollo</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mx-10 mt-6 bg-red-50 text-red-600 p-4 border-l-4 border-red-600 font-bold text-xs uppercase tracking-widest">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {/* Título */}
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest flex items-center gap-2">
                <FileText size={14} /> Título del Proyecto
              </label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#49a5e6] outline-none text-sm font-bold text-[#072146]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Sistema de Optimización de Energía con IA"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest flex items-center gap-2">
                <Layout size={14} /> Descripción del Proyecto
              </label>
              <textarea 
                className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#49a5e6] outline-none transition text-sm font-medium min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe los objetivos y alcances..."
                required
              />
            </div>

            {/* Participantes */}
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest flex items-center gap-2">
                <Users size={14} /> Colaboradores
              </label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#49a5e6] outline-none text-sm font-bold"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="Dr. Juan Perez, Dra. Maria Lopez"
              />
            </div>

            {/* Imagen */}
            <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
              <label className="text-[9px] font-black uppercase text-slate-400 block mb-3 tracking-widest flex items-center gap-2">
                <ImageIcon size={14} /> Imagen Representativa
              </label>
              <input 
                type="file" 
                accept="image/*"
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#072146] file:text-white hover:file:bg-[#49a5e6] transition-all cursor-pointer"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            {/* Botón de Guardar */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#072146] text-white font-black py-5 flex items-center justify-center gap-3 shadow-lg hover:bg-[#49a5e6] transition-all uppercase text-[11px] tracking-[0.3em] disabled:opacity-50 group"
            >
              {loading ? "PROCESANDO..." : <><Save size={18} className="group-hover:scale-110 transition-transform" /> GUARDAR PROYECTO</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrarProyecto;