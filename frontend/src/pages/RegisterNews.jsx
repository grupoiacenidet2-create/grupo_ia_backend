import React, { useState, useEffect } from 'react';
// CORRECCIÓN: Quitamos el duplicado y agregamos useLocation
import { useNavigate, useLocation, Link } from 'react-router-dom'; 
import { Megaphone, ArrowLeft, Send, Star, Link as LinkIcon, Image as ImageIcon, ShieldCheck, Type } from 'lucide-react';
import API from '../api';

const RegisterNews = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // ESTADOS QUE FALTABAN
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Extraemos el parámetro 'type' de la URL (?type=group)
  const queryParams = new URLSearchParams(location.search);
  const isGroupMode = queryParams.get('type') === 'group';

  const isStaff = localStorage.getItem('is_staff') === 'true';
  const [canPostAsGroup, setCanPostAsGroup] = useState(isStaff || isGroupMode);
  
  const [formData, setFormData] = useState({
    title: '', 
    content: '',
    link: '',
    // Si viene de 'Añadir noticia de grupo', marcamos ambos como true de una vez
    is_important: isStaff || isGroupMode, 
    is_group_announcement: isStaff || isGroupMode 
  });

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await API.get('accounts/manage-profile/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const hasAccess = res.data.can_post_as_group === true || isStaff;
        setCanPostAsGroup(hasAccess);

        // Si es Staff o viene por el botón de grupo, forzamos valores
        if (isStaff || isGroupMode) {
          setFormData(prev => ({ 
            ...prev, 
            is_group_announcement: true,
            is_important: true 
          }));
        }
      } catch (err) {
        console.error("Error verificando permisos", err);
      }
    };
    checkPermissions();
  }, [isStaff, isGroupMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    const fechaActual = new Date();
    const fechaAutomatica = `${fechaActual.getDate()} DE ${meses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('date_text', fechaAutomatica); 
    data.append('content', formData.content);
    data.append('link', formData.link);
    data.append('is_important', formData.is_important);
    data.append('is_group_announcement', formData.is_group_announcement);
    
    if (imageFile) data.append('image', imageFile);

    try {
      const token = localStorage.getItem('access_token');
      await API.post('news/', data, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("¡Noticia publicada con éxito!");
      navigate('/dashboard'); 
    } catch (err) {
      alert("Error al publicar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-8 flex flex-col items-center font-sans">
      <div className="w-full max-w-2xl">
        
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 text-[#072146] font-black uppercase text-[11px] tracking-[0.2em] shadow-sm hover:bg-[#072146] hover:text-white transition-all rounded-sm group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Volver al Panel
          </Link>
        </div>

        <div className="bg-white shadow-2xl border border-slate-200 overflow-hidden rounded-sm">
          <div className="bg-[#072146] p-10 text-white border-b-4 border-[#49a5e6]">
            <div className="flex items-center gap-5">
              <div className="bg-white/10 p-4 rounded-xl text-[#49a5e6]">
                <Megaphone size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">
                    {formData.is_group_announcement ? "Comunicado Oficial" : "Nueva Noticia"}
                </h2>
                <p className="text-[#49a5e6] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Portal de Noticias y Avisos</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            
            {canPostAsGroup && (
              <div className={`flex items-center gap-4 p-5 rounded-r-xl transition-all border-l-4 ${
                formData.is_group_announcement ? 'bg-[#072146] text-white border-[#49a5e6]' : 'bg-slate-100 text-slate-500 border-slate-300'
              }`}>
                <input 
                  type="checkbox" 
                  id="group_ann" 
                  checked={formData.is_group_announcement}
                  disabled={isStaff} 
                  className="w-5 h-5 accent-[#49a5e6] cursor-pointer" 
                  onChange={(e) => {
                    const isGroup = e.target.checked;
                    setFormData({
                      ...formData, 
                      is_group_announcement: isGroup,
                      is_important: isGroup ? true : formData.is_important 
                    });
                  }} 
                />
                <div className="flex flex-col">
                  <label htmlFor="group_ann" className="text-[10px] font-black cursor-pointer uppercase flex items-center gap-2">
                    <ShieldCheck size={14} /> 
                    {isStaff ? 'Modo Administrador: Publicación Institucional' : 'Publicar como Grupo Oficial (CENIDET)'}
                  </label>
                  <p className="text-[9px] font-bold uppercase opacity-70">
                    {formData.is_group_announcement ? 'Se marcará como destacada automáticamente' : 'Aviso personal del investigador'}
                  </p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest">Título</label>
                <div className="relative">
                  <Type size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <input required type="text" className="w-full p-4 pl-10 bg-slate-50 border border-slate-200 focus:border-[#49a5e6] outline-none text-sm font-bold text-[#072146] uppercase" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest">Link Externo</label>
                <div className="relative">
                  <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <input type="url" className="w-full p-4 pl-10 bg-slate-50 border border-slate-200 focus:border-[#49a5e6] outline-none text-sm" placeholder="https://..."
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest">Contenido</label>
              <textarea required rows="5" className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#49a5e6] outline-none transition text-sm font-medium" 
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
              ></textarea>
            </div>

            <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
              <label className="text-[9px] font-black uppercase text-slate-400 block mb-3 tracking-widest flex items-center gap-2">
                <ImageIcon size={14}/> Imagen
              </label>
              <input type="file" accept="image/*" className="w-full text-xs" onChange={(e) => setImageFile(e.target.files[0])} />
            </div>

            {!formData.is_group_announcement && (
              <div className="flex items-center gap-4 p-5 bg-slate-900 rounded-xl border-b-4 border-yellow-500 animate-in fade-in zoom-in duration-300">
                <input 
                  type="checkbox" 
                  id="imp" 
                  checked={formData.is_important}
                  className="w-5 h-5 accent-yellow-500 cursor-pointer" 
                  onChange={(e) => setFormData({...formData, is_important: e.target.checked})} 
                />
                <div className="flex flex-col">
                  <label htmlFor="imp" className="text-[11px] font-black text-white cursor-pointer uppercase tracking-tighter flex items-center gap-2">
                    <Star size={14} className="text-yellow-500 fill-yellow-500"/> Noticia Destacada
                  </label>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Resaltar esta noticia personal en el inicio</p>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-[#072146] text-white font-black py-5 flex items-center justify-center gap-3 hover:bg-[#49a5e6] transition-all uppercase text-[11px] tracking-[0.3em] disabled:opacity-50">
              {loading ? "PUBLICANDO..." : <><Send size={18} /> ENVIAR PUBLICACIÓN</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterNews;