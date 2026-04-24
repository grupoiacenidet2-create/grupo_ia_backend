import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

const EditPublication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', abstract: '', status: '' });

  useEffect(() => {
    API.get(`publications/${id}/`).then(res => setFormData(res.data));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await API.patch(`publications/${id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Actualizado con éxito");
      navigate('/dashboard');
    } catch (err) { alert("Error"); }
  };

  return (
    <div className="max-w-3xl mx-auto p-10 bg-white shadow-2xl rounded-3xl mt-10 border">
      <h2 className="text-2xl font-black mb-6 text-blue-900 uppercase">Editar Publicación</h2>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="font-bold text-gray-700">Título</label>
          <input className="w-full p-3 border rounded-xl" value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div>
          <label className="font-bold text-gray-700">Resumen (Extraído de Scholar)</label>
          <textarea className="w-full p-3 border rounded-xl h-48" value={formData.abstract} 
            onChange={e => setFormData({...formData, abstract: e.target.value})} />
        </div>
        <div className="flex gap-4">
          <select className="p-3 border rounded-xl font-bold" value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value})}>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase flex-1">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPublication;