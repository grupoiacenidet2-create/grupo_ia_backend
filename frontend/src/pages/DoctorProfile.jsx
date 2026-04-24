import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Camera, Edit3, Save, ExternalLink, Loader2, 
  Github, Linkedin, Users, Home as HomeIcon, BookOpen,
  PlusCircle, Award, Calendar, ChevronRight, Megaphone,
  Cpu, Globe, FlaskConical, Library, FileText
} from 'lucide-react';
import API from '../api';
import Footer from '../components/Footer';

const DoctorProfile = () => {
  const { scholar_id } = useParams();
  const [activeSubTab, setActiveSubTab] = useState('home'); 
  const [data, setData] = useState(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const isOwner = localStorage.getItem('scholar_id') === scholar_id;
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempAbstract, setTempAbstract] = useState("");

  // --- OBTENER URL BASE DINÁMICA ---
  // Esto quita el '/api/' del final para poder concatenar rutas de imágenes
  const baseURL = API.defaults.baseURL.replace('/api/', '');

  const getJournalIcon = (journalName) => {
    const name = (journalName || "").toLowerCase().trim();
    if (name.includes('mdpi') || name.includes('sensors') || name.includes('mathematics') || name.includes('drones')) {
      return <FlaskConical className="w-8 h-8 text-emerald-600" />;
    }
    if (name.includes('ieee') || name.includes('intelligence') || name.includes('computer')) {
      return <Cpu className="w-8 h-8 text-blue-600" />;
    }
    if (name.includes('nature') || name.includes('scientific') || name.includes('optica')) {
      return <Globe className="w-8 h-8 text-indigo-600" />;
    }
    if (name.includes('educación') || name.includes('dilemas')) {
      return <Library className="w-8 h-8 text-amber-600" />;
    }
    return <FileText className="w-8 h-8 text-slate-400" />;
  };

  useEffect(() => {
    if (scholar_id) {
      setLoading(true);
      const loadScholar = API.get(`scholar-data/${scholar_id}/`);
      const loadStudents = API.get(`students/?scholar_id=${scholar_id}`);
      const loadCourses = API.get(`courses/?scholar_id=${scholar_id}`); 
      const loadNews = API.get(`news/?scholar_id=${scholar_id}`);

      Promise.all([loadScholar, loadStudents, loadCourses, loadNews])
        .then(([scholarRes, studentsRes, coursesRes, newsRes]) => {
          setData(scholarRes.data);
          setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
          setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
          setNews(Array.isArray(newsRes.data) ? newsRes.data : []);
        })
        .catch(err => console.error("Error al cargar perfil:", err))
        .finally(() => setLoading(false));
    }
  }, [scholar_id]);

  // --- FUNCIÓN DE SINCRONIZACIÓN CORREGIDA ---
  const handleSync = async () => {
    if (window.confirm("¿Sincronizar con Google Scholar? Esto tomará unos segundos debido al límite de RAM del servidor.")) {
      try {
        setLoading(true);
        // Usamos la instancia API que ya sabe si ir a localhost o Render
        await API.get(`force-sync/?scholar_id=${scholar_id}`);
        alert("¡Sincronización exitosa!");
        window.location.reload();
      } catch (err) {
        console.error(err);
        alert("Error en la sincronización. Verifica tu conexión o intenta más tarde.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveAbstract = async (index, publicationId) => {
    try {
      const token = localStorage.getItem('access_token');
      await API.patch(`publications/${publicationId}/`, 
        { abstract: tempAbstract }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const updatedData = {...data};
      updatedData.publications[index].abstract = tempAbstract;
      setData(updatedData);
      setEditingIndex(null);
    } catch (err) {
      console.error(err);
      alert("Error al guardar cambios.");
    }
  };

  const handleImageUpload = async (e, pubId) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const token = localStorage.getItem('access_token');
      const response = await API.patch(`publications/${pubId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedPubs = data.publications.map(p => 
        p.id === pubId ? { ...p, image: response.data.image } : p
      );
      setData({ ...data, publications: updatedPubs });
      alert("¡Imagen guardada!");
    } catch (err) {
      console.error(err);
      alert("Error al subir imagen.");
    }
  };

const handleUploadPhoto = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file); // 'image' coincide con tu views.py

  try {
    const token = localStorage.getItem('access_token');
    
    // Si tu urls.py de la app se incluye en el principal con 'accounts/'
    // la ruta debe ser 'accounts/update-photo/'
// AGREGAMOS 'accounts/' antes de 'update-photo/'
const response = await API.post('accounts/update-photo/', formData, { 
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`
  }
});

    console.log("Respuesta servidor:", response.data);
    setData({ ...data, image_url: response.data.image_url });
    alert("¡Foto actualizada!");
    window.location.reload();
  } catch (err) {
    // ESTO ES CLAVE: Mira qué dice el error en la consola
    console.error("Detalle del error:", err.response?.data);
    alert(`Error: ${err.response?.data?.error || "No se pudo subir"}`);
  }
};

  const categorized = useMemo(() => ({
    phd: students.filter(s => s.category === 'phd'),
    undergrad: students.filter(s => s.category === 'undergrad'),
    alumni: students.filter(s => s.category === 'alumni')
  }), [students]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center">
        <Loader2 className="animate-spin text-[#072146] mb-4" size={40} />
        <span className="text-sm font-bold text-[#072146] tracking-[0.2em] uppercase">Cargando Perfil Académico</span>
      </div>
    </div>
  );

  if (!data) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">Perfil no disponible</div>;

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900 select-none" onContextMenu={(e) => e.preventDefault()}>
<nav className="bg-[#072146] text-white sticky top-0 z-50 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 flex flex-col md:flex-row justify-between items-center md:h-16">
          
          {/* Título del Grupo - Se centra en móvil, se alinea a la izquierda en PC */}
          <div className="py-3 md:py-0 border-b border-white/10 md:border-none w-full md:w-auto text-center md:text-left">
            <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase opacity-70">
              GRUPO INTELIGENCIA ARTIFICIAL
            </span>
          </div>

          {/* Contenedor de Botones - Scroll horizontal en móvil */}
          <div className="flex gap-6 md:gap-8 w-full md:w-auto overflow-x-auto no-scrollbar scroll-smooth h-12 md:h-full items-center px-2 md:px-0">
            {[
              { id: 'home', label: 'Biografía', icon: <HomeIcon size={14}/> },
              { id: 'pubs', label: 'Publicaciones', icon: <BookOpen size={14}/> },
              { id: 'group', label: 'Equipo', icon: <Users size={14}/> },
              { id: 'teaching', label: 'Docencia', icon: <PlusCircle size={14}/> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-1 md:px-2 text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-all relative h-full whitespace-nowrap shrink-0 ${activeSubTab === tab.id ? 'text-[#49a5e6]' : 'text-white/70 hover:text-white'}`}
              >
                {tab.icon} {tab.label}
                {activeSubTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#49a5e6]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10">
        <div className="flex flex-col md:flex-row gap-16">
          {/* --- ASIDE: PERFIL Y FOTO --- */}
          <aside className="w-full md:w-80">
            <div className="sticky top-32">
              <div className="relative mb-8 bg-white p-6 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100">
                <div className="flex justify-center items-center">
                  <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-50 relative">
                    <img 
                      src={data.image_url ? (data.image_url.startsWith('http') ? data.image_url : `${baseURL}${data.image_url}`) : `https://scholar.googleusercontent.com/citations?view_op=medium_photo&user=${scholar_id}`} 
                      className="w-full h-full object-cover transition-all duration-500 hover:scale-110" 
                      alt={data.name} 
                    />
                  </div>
                </div>
                
                {isOwner && (
                  <label className="absolute bottom-6 right-10 bg-[#072146] p-2.5 text-white rounded-full shadow-lg cursor-pointer hover:bg-[#49a5e6] transition-all z-20">
                    <Camera size={16} />
                    <input type="file" className="hidden" onChange={handleUploadPhoto} accept="image/*" />
                  </label>
                )}

                <div className="mt-6 text-center">
                  <h1 className="text-xl font-black text-[#072146] tracking-tight uppercase leading-tight">
                    {data.name}
                  </h1>
                  <div className="h-0.5 w-8 bg-[#49a5e6] mx-auto my-3" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    {data.affiliation}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 pt-6 px-4 border-t border-slate-200">
                {scholar_id && (
                  <a href={`https://scholar.google.com/citations?user=${scholar_id}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[10px] font-black text-slate-500 hover:text-[#072146] transition-colors uppercase tracking-widest">
                    <Award size={16} className="text-[#49a5e6]"/> Google Scholar
                  </a>
                )}
                {data.github_url && (
                  <a href={data.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[10px] font-black text-slate-500 hover:text-black transition-colors uppercase tracking-widest">
                    <Github size={16}/> Repository
                  </a>
                )}
                {data.linkedin_url && (
                  <a href={data.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[10px] font-black text-slate-500 hover:text-[#072146] transition-colors uppercase tracking-widest">
                    <Linkedin size={16}/> LinkedIn Profile
                  </a>
                )}
                {data.email && (
                  <a href={`mailto:${data.email}`} className="flex items-center gap-3 text-[10px] font-black text-slate-500 hover:text-[#072146] transition-colors uppercase tracking-widest">
                    <Globe size={16} className="text-[#49a5e6]"/> Institutional Email
                  </a>
                )}
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {activeSubTab === 'home' && (
              <div className="space-y-16 animate-in fade-in duration-500">
                <section>
                  <h2 className="text-[10px] font-black tracking-[0.3em] text-[#004481] uppercase mb-8 flex items-center gap-4">
                    Resumen Profesional <div className="h-[1px] flex-1 bg-slate-200" />
                  </h2>
                  <div className="text-lg leading-relaxed text-slate-700 font-light border-l-2 border-slate-300 pl-8 italic">
                    {data.bio || "Información biográfica bajo revisión académica."}
                  </div>
                </section>
                
                <section>
                  <h2 className="text-[10px] font-black tracking-[0.3em] text-[#004481] uppercase mb-8 flex items-center gap-4">
                    <Megaphone size={14} className="text-[#49a5e6]"/> Comunicados <div className="h-[1px] flex-1 bg-slate-200" />
                  </h2>
                  <div className="grid gap-1">
                    {news.map(item => (
                      <div key={item.id} className="bg-white p-6 border-l-4 border-l-slate-100 border-y border-r border-slate-100 shadow-sm flex gap-8 items-center hover:border-l-[#49a5e6] transition-all">
                        <div className="text-[10px] font-black text-[#004481] uppercase tracking-tighter whitespace-nowrap">
                          {item.date_text}
                        </div>
                        <p className="text-sm font-semibold text-slate-600 uppercase tracking-tight">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeSubTab === 'pubs' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-end mb-12 border-b-2 border-[#072146] pb-4">
                  <h2 className="text-2xl font-bold text-[#072146] uppercase tracking-tighter">PUBLICACIONES</h2>
                  {isOwner && (
                    <button 
                      onClick={handleSync}
                      className="bg-[#072146] text-white text-[9px] font-black px-5 py-2 hover:bg-[#49a5e6] transition-all uppercase tracking-[0.2em]"
                    >
                      Update Database
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100">
                  {(data.publications || []).map((pub, index) => (
                    <div key={pub.id || index} className="group py-10 first:pt-0">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="relative group/logo w-20 h-20 shrink-0">
                          <div className="w-full h-full bg-slate-50 border border-slate-100 flex items-center justify-center rounded-lg shadow-inner group-hover/logo:border-[#49a5e6] transition-all overflow-hidden">
                            {pub.image ? (
                              <img 
                                src={pub.image.startsWith('http') ? pub.image : `${baseURL}${pub.image}`} 
                                className="w-full h-full object-contain p-2" 
                                alt="Journal Logo" 
                              />
                            ) : (
                              getJournalIcon(pub.journal_name)
                            )}
                          </div>
                          {isOwner && (
                            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover/logo:opacity-100 cursor-pointer transition-opacity rounded-lg text-white">
                              <Camera size={20} />
                              <span className="text-[8px] font-black uppercase mt-1">Upload Logo</span>
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, pub.id)} />
                            </label>
                          )}
                        </div>

                        <div className="flex-1 space-y-1">
                          <h3 className="text-[19px] font-bold text-[#1a0dab] leading-snug hover:underline cursor-pointer transition-all tracking-tight">
                            {pub.title}
                          </h3>
                          <div className="text-[14px] text-[#006621] font-medium leading-relaxed">
                            {pub.authors_list || "Cargando autores investigadores..."}
                          </div>
                          <div className="text-[13px] text-slate-500 flex items-center gap-1 font-medium">
                            <span className="text-slate-600">{pub.journal_name || "Academic Journal"}</span>
                            <span>, {pub.year || "2024"}</span>
                            {pub.citations > 0 && (
                              <>
                                <span className="mx-1">•</span>
                                <span className="text-[#1a0dab] hover:underline cursor-pointer">Citado por {pub.citations}</span>
                              </>
                            )}
                          </div>

                          {editingIndex === index ? (
                            <div className="mt-4 bg-slate-50 p-6 border border-slate-200 animate-in fade-in zoom-in-95">
                              <textarea 
                                className="w-full bg-white p-4 border border-slate-200 text-sm h-32 outline-none focus:border-[#49a5e6] font-mono" 
                                value={tempAbstract} 
                                onChange={e => setTempAbstract(e.target.value)} 
                              />
                              <div className="flex gap-4 mt-4">
                                <button onClick={() => handleSaveAbstract(index, pub.id)} className="bg-[#072146] text-white text-[10px] px-8 py-2 uppercase font-black flex items-center gap-2 hover:bg-[#49a5e6] transition-colors">
                                  <Save size={14}/> Finalize Changes
                                </button>
                                <button onClick={() => setEditingIndex(null)} className="text-[10px] uppercase font-bold text-slate-400 hover:text-red-500 transition-colors">
                                  Discard
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500 font-normal leading-relaxed max-w-3xl mt-2 line-clamp-2">
                              {pub.abstract || "Resumen técnico no disponible."}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          <a href={pub.external_url} target="_blank" rel="noopener noreferrer" className="p-3 border border-slate-200 text-slate-400 hover:text-[#004481] hover:border-[#004481] transition-all shadow-sm flex items-center justify-center">
                            <ExternalLink size={16}/>
                          </a>
                          {isOwner && editingIndex !== index && (
                            <button onClick={() => { setEditingIndex(index); setTempAbstract(pub.abstract || ""); }} className="p-3 border border-slate-200 text-slate-400 hover:text-[#49a5e6] hover:border-[#49a5e6] transition-all shadow-sm flex items-center justify-center">
                              <Edit3 size={16}/>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === 'group' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                {[
                  { id: 'phd', label: 'Doctorado', singular: 'Doctorado', plural: 'Doctorados' }, 
                  { id: 'undergrad', label: 'Maestría', singular: 'Maestría', plural: 'Maestrías' }, 
                  { id: 'alumni', label: 'Egresados', singular: 'Egresado', plural: 'Egresados' }
                ].map(cat => {
                  const count = categorized[cat.id].length;
                  const labelText = count === 1 ? cat.singular : cat.plural;
                  return (
                    <div key={cat.id} className="border-t-2 border-slate-100 pt-8">
                      <h3 className="text-[10px] font-black text-[#49a5e6] uppercase tracking-[0.3em] mb-8">
                        {count} {labelText}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categorized[cat.id].map(student => (
                          <div key={student.id} className="flex items-center gap-5 p-5 bg-white border border-slate-100 hover:border-slate-300 transition-all shadow-sm">
                            <div className="w-1.5 h-6 bg-[#072146]" />
                            <div>
                              <p className="text-[12px] font-black text-slate-800 uppercase tracking-widest">{student.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{student.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* --- SECCIÓN DE MATERIAS (Línea 300 aprox) --- */}
{activeSubTab === 'teaching' && (
  <div className="animate-in fade-in duration-500">
    <h2 className="text-2xl font-bold text-[#072146] uppercase mb-10 tracking-tighter">MATERIAS IMPARTIDAS</h2>
    <div className="space-y-1">
      {courses.map(course => (
        <a 
          key={course.id} 
          href={course.link} 
          target="_blank" 
          rel="noreferrer" 
          className="flex items-center justify-between p-8 bg-white border border-slate-100 hover:bg-slate-50 transition-all group shadow-sm"
        >
          <div className="flex items-center gap-10">
            <span className="text-[10px] font-black text-[#004481] border-r border-slate-200 pr-10 uppercase">{course.semester}</span>
            <span className="text-sm font-bold text-slate-700 group-hover:text-[#004481] uppercase tracking-wide">{course.name}</span>
          </div>
          {/* SE ELIMINÓ EL COMPONENTE CHEVRONRIGHT DE AQUÍ */}
        </a>
      ))}
    </div>
  </div>
)}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorProfile;