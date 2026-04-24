import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import Footer from '../components/Footer';
import { Clock, ArrowLeft } from 'lucide-react';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- CONFIGURACIÓN DE URL DINÁMICA ---
    const baseURL = API.defaults.baseURL.replace('/api/', '');

    useEffect(() => {
        API.get(`projects/${id}/`)
            .then(res => {
                setProject(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar el proyecto:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#49a5e6] mb-4"></div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Cargando Proyecto</span>
        </div>
    );

    if (!project) return (
        <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest">
            No se encontró el proyecto.
        </div>
    );

    return (
        <div className="bg-white min-h-screen font-sans">
            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Botón Volver */}
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#49a5e6] mb-8 transition-colors text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Volver al inicio
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Columna Izquierda: Imagen Corregida */}
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-50">
                        <img 
                            src={project.image?.startsWith('http') ? project.image : `${baseURL}${project.image}`} 
                            alt={project.title}
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Columna Derecha: Info Principal */}
                    <div className="flex flex-col">
                        <h1 className="text-5xl font-extrabold text-[#007bff] tracking-tighter mb-6 uppercase leading-[0.9]">
                            {project.title}
                        </h1>

                        <div className="mb-8">
                            <h3 className="text-red-600 font-black text-xl mb-4 uppercase tracking-tight">
                                Autores:
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium border border-slate-200">
                                    {project.participants || "Información no disponible"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] border-t border-slate-100 pt-6">
                            <span className="flex items-center gap-1">
                                <Clock size={12} /> Actualizado: {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Reciente'}
                            </span>
                            <span>• Lectura Técnica</span>
                        </div>
                    </div>
                </div>

                {/* Sección de Contenido */}
                <div className="mt-16 max-w-4xl animate-in fade-in slide-in-from-bottom duration-700">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                        <span className="text-[#49a5e6]">🤖</span> Descripción del Proyecto
                    </h2>
                    <div className="bg-slate-50 p-8 rounded-2xl border-l-4 border-[#007bff] shadow-sm">
                        <p className="text-lg leading-relaxed text-slate-700 italic font-light whitespace-pre-line">
                            "{project.description}"
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProjectDetail;