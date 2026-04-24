import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Save, Send } from 'lucide-react';
import API from '../api';

const UploadPublication = () => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    date_published: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Esta función ahora recibe "statusType" (draft o published)
  const handleSubmit = async (e, statusType) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.title || !file) {
      alert("Por favor, pon al menos un título y selecciona un archivo PDF.");
      return;
    }

    setLoading(true);

    // Creamos el paquete de datos para enviar
    const data = new FormData();
    data.append('title', formData.title);
    data.append('abstract', formData.abstract);
    data.append('date_published', formData.date_published);
    data.append('pdf_file', file);
    data.append('status', statusType); // <--- Enviamos el estado elegido

    try {
      const token = localStorage.getItem('access_token');
      await API.post('publications/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const mensaje = statusType === 'draft' ? "¡Borrador guardado correctamente!" : "¡Publicación enviada con éxito!";
      alert(mensaje);
      navigate('/dashboard'); // Regresamos al panel
    } catch (err) {
      console.error(err);
      alert("Hubo un error al guardar. Revisa la conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
      <div className="flex items-center gap-3 mb-8 border-b pb-4 text-[#002d55]">
        <FileText size={32} />
        <h2 className="text-2xl font-bold">Gestión de Publicación</h2>
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Título del Artículo</label>
          <input 
            type="text" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej: Nuevo Enfoque en Redes Neuronales"
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Resumen / Abstract</label>
          <textarea 
            rows="5" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Describe brevemente de qué trata la investigación..."
            onChange={(e) => setFormData({...formData, abstract: e.target.value})}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Fecha de Publicación</label>
            <input 
              type="date" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, date_published: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Archivo PDF</label>
            <input 
              type="file" 
              accept=".pdf" 
              className="w-full p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* CONTENEDOR DE BOTONES */}
        <div className="flex flex-col md:flex-row gap-4 pt-6 border-t">
          {/* Botón Borrador */}
          <button 
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, 'draft')}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition shadow-md disabled:opacity-50"
          >
            <Save size={20} /> Guardar como Borrador
          </button>

          {/* Botón Publicar */}
          <button 
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, 'published')}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl transition shadow-md disabled:opacity-50"
          >
            {loading ? "Procesando..." : <><Send size={20}/> Publicar Ahora</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPublication;