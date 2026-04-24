import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import Footer from '../components/Footer';
import { 
  Globe, ArrowRight, ArrowUpRight, Megaphone, Calendar, 
  ChevronRight, Bookmark, ShieldCheck, Users,PlusCircle,UserCog,ChevronLeft 
} from 'lucide-react';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [selectedNews, setSelectedNews] = useState(null);
  const [canScrollDoctors, setCanScrollDoctors] = useState(false);
  
  const groupScrollRef = useRef(null);
  

  // --- CONFIGURACIÓN DE URL DINÁMICA ---
  const baseURL = API.defaults.baseURL.replace('/api/', '');
  const doctorScrollRef = useRef(null);

  const checkScrollAbility = () => {
  if (doctorScrollRef.current) {
    const { scrollWidth, clientWidth } = doctorScrollRef.current;
    // Si el ancho total del contenido es mayor al ancho visible, activamos las flechas
    setCanScrollDoctors(scrollWidth > clientWidth);
  }
};

// Ejecutar al cargar y cuando cambie la lista de doctores
useEffect(() => {
  checkScrollAbility();
  window.addEventListener('resize', checkScrollAbility);
  return () => window.removeEventListener('resize', checkScrollAbility);
}, [doctors]); // Se vuelve a ejecutar si la lista de doctores cambia

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [resDocs, resProj, resNews] = await Promise.all([
          API.get('accounts/public-doctors/').catch(() => ({ data: [] })),
          API.get('projects/').catch(() => ({ data: [] })),
          API.get('news/').catch(() => ({ data: [] }))
        ]);

        setDoctors(resDocs.data);
        setProjects(resProj.data);
        setFeaturedNews(resNews.data);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const offset = clientWidth * 0.8; 
      const scrollToValue = direction === 'left' ? scrollLeft - offset : scrollLeft + offset;

      ref.current.scrollTo({
        left: scrollToValue,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#072146] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#49a5e6]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F7F9] min-h-screen font-sans text-[#072146]">
      
      {/* --- SECCIÓN 1: HERO --- */}
      <header id="hero" className="relative bg-[#072146] min-h-[65vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <div className="animate-in fade-in slide-in-from-left duration-1000">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="text-[#49a5e6] animate-pulse" size={20} />
              <span className="text-[#49a5e6] font-bold tracking-[0.3em] text-[10px] uppercase">Conectando Ciencia y Futuro</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tighter">
              Área de Inteligencia <span className="text-[#49a5e6]">Artificial</span>
            </h1>
            <p className="text-white/70 text-lg mb-10 max-w-lg leading-relaxed font-light italic border-l-2 border-[#49a5e6] pl-6">
              Investigación de vanguardia y desarrollo tecnológico para los desafíos globales de la nueva era digital.
            </p>
            <Link to="/conocenos">
              <button className="bg-[#49a5e6] hover:bg-white text-[#072146] px-10 py-4 rounded-sm font-bold text-xs uppercase tracking-widest transition-all shadow-lg">
                Conócenos
              </button>
            </Link>
          </div>
          <div className="hidden lg:block relative">
            <div className="relative z-10 w-full h-[450px] rounded-lg shadow-2xl overflow-hidden border border-white/10 group">
              <img src="/cenit.jpeg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Cenidet" />
              <div className="absolute inset-0 bg-[#072146]/20"></div>
            </div>
          </div>
        </div>
      </header>


{/* --- SECCIÓN 2: COMUNICADOS --- */}
{featuredNews.length > 0 && (
  <section id="noticias" className="py-24 px-6 max-w-7xl mx-auto space-y-20">
    
    {/* --- 2.1 COMUNICADOS OFICIALES DEL GRUPO --- */}
    {(() => {
      const groupNews = featuredNews.filter(n => n.is_group_announcement);
      if (groupNews.length === 0) return null;

      return (
        <div className="animate-in fade-in slide-in-from-bottom duration-700">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-[#072146] rounded-xl text-[#49a5e6] shadow-lg">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-[#072146] tracking-tighter uppercase">Comunicados del Grupo</h2>
              <p className="text-[#49a5e6] font-bold text-[10px] uppercase tracking-[0.3em]">TecNM Inteligencia Artificial</p>
            </div>
          </div>

          {/* CONTENEDOR RELATIVO PARA LAS FLECHAS POSICIONADAS ABSOLUTAMENTE */}
          <div className="relative group/slider">
            
            {/* Botón Izquierdo */}
            <button 
              onClick={() => scroll(groupScrollRef, 'left')}
              className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-xl text-slate-600 hover:text-[#072146] opacity-0 group-hover/slider:opacity-100 transition-all duration-300 border border-slate-100 hidden md:flex"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Contenedor de Scroll */}
            <div 
              ref={groupScrollRef} 
              className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth"
            >
              {groupNews.map(item => (
                <div key={item.id} className="flex-none w-[90vw] md:w-[850px] snap-center bg-[#072146] text-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10">
                  {item.image && (
                    <div className="md:w-96 h-64 md:h-auto overflow-hidden shrink-0">
                      <img src={item.image.startsWith('http') ? item.image : `${baseURL}${item.image}`} alt={item.title} className="w-full h-full object-cover opacity-80" />
                    </div>
                  )}
                  <div className="p-10 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4 text-[#49a5e6]">
                      <Calendar size={14}/><span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.date_text}</span>
                    </div>
                    <h3 className="text-2xl font-black mb-4 uppercase text-white">{item.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-8 font-light italic line-clamp-3">"{item.content}"</p>
                    <button onClick={() => setSelectedNews(item)} className="text-[#49a5e6] font-black text-[10px] uppercase flex items-center gap-2 hover:text-white">
                      Leer noticia completa <ArrowUpRight size={16}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón Derecho */}
            <button 
              onClick={() => scroll(groupScrollRef, 'right')}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-xl text-slate-600 hover:text-[#072146] opacity-0 group-hover/slider:opacity-100 transition-all duration-300 border border-slate-100 hidden md:flex"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      );
    })()}

{/* --- 2.2 ACTIVIDAD DE INVESTIGADORES --- */}
    {(() => {
      const docNews = featuredNews.filter(n => n.is_important && !n.is_group_announcement);
      if (docNews.length === 0) return null;

      return (
        <div className="animate-in fade-in slide-in-from-bottom duration-1000 mt-16 px-4">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-[#072146] border border-[#49a5e6]/30 rounded-xl text-[#49a5e6] shadow-lg">
              <UserCog size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-[#072146] tracking-tighter uppercase leading-none">Actividad Académica</h2>
              <p className="text-[#49a5e6] font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Investigadores del Claustro</p>
            </div>
          </div>

          <div className="relative group/docs">
            {/* BOTÓN IZQUIERDO UNIFICADO */}
            <button 
              onClick={() => scroll(doctorScrollRef, 'left')}
              className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-[#072146] text-white shadow-xl hover:bg-[#49a5e6] opacity-0 group-hover/docs:opacity-100 transition-all duration-300 border border-[#49a5e6]/30 hidden md:flex active:scale-90"
            >
              <ChevronLeft size={24} />
            </button>

            <div ref={doctorScrollRef} className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory scrollbar-hide scroll-smooth">
              {docNews.map((item) => (
                <div key={item.id} className="flex-none w-[280px] md:w-[400px] snap-start bg-[#072146] rounded-[2.5rem] shadow-2xl border border-white/5 hover:border-[#49a5e6]/50 hover:-translate-y-2 transition-all duration-500 flex flex-col overflow-hidden group/card">
                  {item.image && (
                    <div className="w-full h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#072146] via-transparent to-transparent opacity-70 z-10" />
                      <img 
                        src={item.image.startsWith('http') ? item.image : `${baseURL}${item.image}`} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-1000 opacity-90" 
                      />
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-1 text-white">
                    <div className="flex items-center gap-2 mb-4 text-[#49a5e6] uppercase text-[10px] font-black tracking-widest">
                      <Calendar size={14}/> {item.date_text}
                    </div>
                    <h4 className="text-[11px] font-bold text-white/50 uppercase mb-2 tracking-tighter">
                      Dr. {item.doctor_name || item.doctor_username}
                    </h4>
                    <h3 className="text-xl font-black text-white mb-4 uppercase leading-tight line-clamp-2 min-h-[3rem]">
                      {item.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed line-clamp-3 mb-8 font-light italic border-l-2 border-[#49a5e6]/40 pl-4">
                      "{item.content}"
                    </p>
                    <button 
                      onClick={() => setSelectedNews(item)} 
                      className="mt-auto flex items-center justify-between w-full bg-white/5 hover:bg-[#49a5e6] px-5 py-4 rounded-2xl border border-white/10 transition-all duration-300 group/btn"
                    >
                      <span className="text-white font-black text-[10px] uppercase tracking-widest">Leer investigación</span>
                      <PlusCircle size={20} className="text-[#49a5e6] group-hover/btn:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTÓN DERECHO UNIFICADO */}
            <button 
              onClick={() => scroll(doctorScrollRef, 'right')}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-[#072146] text-white shadow-xl hover:bg-[#49a5e6] opacity-0 group-hover/docs:opacity-100 transition-all duration-300 border border-[#49a5e6]/30 hidden md:flex active:scale-90"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      );
    })()}
  </section>
)}
{/* --- SECCIÓN 3: EQUIPO (CLAUSTRO DOCTORAL) --- */}
      <section 
        id="equipo" 
        className="py-24 px-6 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(7, 33, 70, 0.92), rgba(7, 33, 70, 0.92)), url('/fondo3.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[2px] w-12 bg-[#49a5e6]"></div>
              <h2 className="text-4xl font-black text-white uppercase tracking-[0.25em] italic drop-shadow-lg">
                Claustro Doctoral
              </h2>
              <div className="h-[2px] w-12 bg-[#49a5e6]"></div>
            </div>
            <p className="text-[#49a5e6]/80 font-bold text-xs uppercase tracking-[0.4em]">Excelencia en Investigación</p>
          </div>

          <div className="relative group/carousel px-4">
            {/* BOTÓN IZQUIERDO: Solo si canScrollDoctors es true */}
            {canScrollDoctors && (
              <button 
                onClick={() => scroll(doctorScrollRef, 'left')} 
                className="absolute left-[-10px] top-1/2 -translate-y-1/2 z-30 bg-[#49a5e6] p-4 rounded-full text-[#072146] shadow-[0_0_20px_rgba(73,165,230,0.4)] hover:bg-white transition-all hidden md:flex"
              >
                <ChevronRight size={32} className="rotate-180" />
              </button>
            )}

            {/* BOTÓN DERECHO: Solo si canScrollDoctors es true */}
            {canScrollDoctors && (
              <button 
                onClick={() => scroll(doctorScrollRef, 'right')} 
                className="absolute right-[-10px] top-1/2 -translate-y-1/2 z-30 bg-[#49a5e6] p-4 rounded-full text-[#072146] shadow-[0_0_20px_rgba(73,165,230,0.4)] hover:bg-white transition-all hidden md:flex"
              >
                <ChevronRight size={32} />
              </button>
            )}

            {/* CONTENEDOR: Alineado a la izquierda por defecto */}
            <div 
              ref={doctorScrollRef} 
              className="flex overflow-x-auto gap-10 pb-16 snap-x snap-mandatory scrollbar-hide scroll-smooth"
            >
              {doctors.map(doc => (
                <div key={doc.id} className="flex-none w-[300px] md:w-[340px] snap-center">
                  <Link 
                    to={`/doctor/${doc.scholar_id}`} 
                    className="relative block bg-[#F8FAFC] p-10 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-4 transition-all duration-500 group border border-white/20 h-full overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#49a5e6]/0 to-[#49a5e6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="flex flex-col items-center relative z-10">
                      <div className="relative mb-8">
                        <div className="absolute inset-0 rounded-full bg-[#49a5e6] blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="w-40 h-40 rounded-full overflow-hidden border-[6px] border-white shadow-xl group-hover:border-[#49a5e6] transition-all duration-500 relative">
                          <img 
                            src={doc.image_url ? (doc.image_url.startsWith('http') ? doc.image_url : `${baseURL}${doc.image_url}`) : `https://scholar.googleusercontent.com/citations?view_op=medium_photo&user=${doc.scholar_id}`} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            alt={doc.username} 
                          />
                        </div>
                      </div>
                      <h3 className="text-base font-black text-[#072146] uppercase text-center min-h-[50px] flex items-center justify-center leading-tight tracking-tight border-b-2 border-slate-100 group-hover:border-[#49a5e6] transition-colors pb-4 w-full">
                        {doc.first_name} {doc.last_name || doc.username}
                      </h3>
                      <div className="mt-8 w-full">
                        <div className="w-full py-3 bg-[#072146] text-white text-xs font-black uppercase flex items-center justify-center gap-3 rounded-xl transition-all duration-300 group-hover:bg-[#49a5e6] group-hover:shadow-[0_10px_20px_rgba(73,165,230,0.3)]">
                          Ver Perfil <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 4: PROYECTOS --- */}
      {projects.length > 0 && (
        <section id="proyectos" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b pb-8 border-slate-100">
            <div className="flex items-center gap-4">
              <Bookmark className="text-[#49a5e6]" size={28} />
              <div>
                <h2 className="text-3xl font-bold text-[#072146] tracking-tighter uppercase">Portafolio de Proyectos</h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1 text-left">Casos de Éxito</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map(project => (
              <div key={project.id} className="group relative h-[450px] bg-[#072146] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 rounded-sm">
                <img
                  src={project.image?.startsWith('http') ? project.image : `${baseURL}${project.image}`}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-[#072146] via-transparent to-transparent">
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight uppercase leading-none border-l-4 border-[#49a5e6] pl-4">
                    {project.title}
                  </h3>
                  <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden">
                    <p className="text-slate-200 text-xs font-light leading-relaxed mb-6 italic italic">"{project.description}"</p>
                    <p className="text-[9px] font-black text-[#49a5e6] uppercase tracking-[0.2em] mb-4">{project.participants}</p>
                  </div>
                  <div className="pt-4 border-t border-white/10 mt-2">
                    <Link to={`/proyecto/${project.id}`} className="text-[10px] font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2 hover:text-[#49a5e6] transition-colors">
                      Ver especificaciones <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

     {/* --- MODAL DE NOTICIAS (CON BOTÓN DE CERRAR CLARO) --- */}
    {selectedNews && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Fondo oscuro con desenfoque */}
        <div 
          className="absolute inset-0 bg-[#072146]/95 backdrop-blur-md animate-in fade-in duration-300" 
          onClick={() => setSelectedNews(null)} 
        />
        
        {/* Contenedor del Modal */}
        <div className="relative bg-white w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col border border-white/20">
          
          {/* BOTÓN CERRAR VISIBLE */}
          <button 
            onClick={() => setSelectedNews(null)} 
            className="absolute top-6 right-6 z-30 flex items-center gap-2 bg-[#072146] text-white px-5 py-2.5 rounded-full hover:bg-red-600 transition-all shadow-lg group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest pl-1">Cerrar</span>
            <PlusCircle size={20} className="rotate-45 group-hover:rotate-[135deg] transition-transform duration-500" />
          </button>

          {/* Imagen de Cabecera */}
          {selectedNews.image && (
            <div className="w-full h-72 md:h-96 shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
              <img 
                src={selectedNews.image.startsWith('http') ? selectedNews.image : `${baseURL}${selectedNews.image}`} 
                className="w-full h-full object-cover" 
                alt="Detalle Noticia" 
              />
            </div>
          )}

          {/* Contenido del Modal */}
          <div className="p-8 md:p-14 relative z-20">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#49a5e6]/10 text-[#49a5e6] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#49a5e6]/20">
                {selectedNews.date_text}
              </span>
              {selectedNews.is_group_announcement && (
                <span className="bg-[#072146] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                  Comunicado Oficial
                </span>
              )}
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-[#072146] uppercase leading-tight mb-8 tracking-tighter">
              {selectedNews.title || "Sin Título"}
            </h2>

            {/* Texto con fondo suave para lectura */}
            <div className="text-slate-700 text-lg leading-relaxed whitespace-pre-line font-medium border-l-4 border-[#49a5e6] pl-6 bg-slate-50 py-6 rounded-r-2xl">
              {selectedNews.content}
            </div>

            {/* Enlace Externo */}
            {selectedNews.link && (
              <div className="mt-12 pt-8 border-t border-slate-100">
                <a 
                  href={selectedNews.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex bg-[#072146] text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#49a5e6] transition-all items-center gap-3 shadow-xl hover:-translate-y-1"
                >
                  Ver Fuente Original <ArrowUpRight size={18}/>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    )}

      <Footer />
    </div>
  );
};

export default Home;