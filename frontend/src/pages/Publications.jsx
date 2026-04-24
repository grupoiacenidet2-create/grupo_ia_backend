import React, { useEffect, useState } from 'react';
import API from '../api';
import { FileText, Download } from 'lucide-react';

const Publications = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    API.get('publications/')
      .then(res => setDocs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-[#003a70] mb-8">Publicaciones Científicas</h1>
      
      <div className="space-y-6">
        {docs.map(pub => (
          <div key={pub.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600 flex justify-between items-center">
            <div className="flex gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-700 h-fit">
                <FileText size={30} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{pub.title}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2 max-w-2xl">{pub.abstract}</p>
                <div className="flex gap-4 mt-3 text-xs font-medium text-gray-400">
                  <span>Autor: {pub.author_details?.username}</span>
                  <span>Fecha: {pub.date_published}</span>
                </div>
              </div>
            </div>
            
            {/* Botón para abrir el PDF */}
            <a 
              href={pub.pdf_file} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition font-bold"
            >
              <Download size={18} /> PDF
            </a>
          </div>
        ))}

        {docs.length === 0 && <p>No hay publicaciones registradas.</p>}
      </div>
    </div>
  );
};

export default Publications;