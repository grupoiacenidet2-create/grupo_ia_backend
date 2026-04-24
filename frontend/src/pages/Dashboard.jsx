import React, { useEffect, useState, useCallback, useMemo } from 'react'; // Agregué useMemo
import { Link } from 'react-router-dom';
import { 
  FileText, Trash2, Eye, 
  Users, UserPlus, PlusCircle, GraduationCap, 
  UserCog, Save, CheckCircle, BookOpen, Megaphone,
  ExternalLink, Shield, Star, AlertCircle, ShieldCheck, Lock, 
  Sun, Moon, X, Edit3, Plus,Image as ImageIcon
} from 'lucide-react';
import API from '../api';

const Dashboard = () => {
  const [data, setData] = useState([]); 
  const [activeTab, setActiveTab] = useState(localStorage.getItem('is_staff') === 'true' ? 'news' : 'publications'); 
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [scholarIdInput, setScholarIdInput] = useState("");
  const [currentScholarId, setCurrentScholarId] = useState(localStorage.getItem('scholar_id') || "");
  const [profileForm, setProfileForm] = useState({
    bio: '', office_location: '', phone: '', github_url: '', linkedin_url: '', scholar_id: ''
  });

const currentUserId = parseInt(localStorage.getItem('user_id'));
  const userName = localStorage.getItem('user_name');
  const isStaff = localStorage.getItem('is_staff') === 'true';
  
  // 1. PRIMERO definimos 'user' (Esto quita el error de ESLint)


  // 2. AHORA definimos el useMemo usando esa variable 'user'
  // --- PERMISOS DINÁMICOS CORREGIDOS ---
  const hasGroupAccess = useMemo(() => {
    // Definimos el objeto user aquí adentro para evitar el warning de ESLint
    const userStored = JSON.parse(localStorage.getItem('user')) || {}; 
    
    if (isStaff) return true;

    // 1. Si estamos en la pestaña de usuarios, actualizamos el permiso "al vuelo"
    if (activeTab === 'users') {
      const me = data.find(u => u.id === currentUserId);
      if (me) {
        // Actualizamos el localStorage si detectamos cambios en la DB
        if (userStored.current_group_permission !== me.current_group_permission) {
          userStored.current_group_permission = me.current_group_permission;
          localStorage.setItem('user', JSON.stringify(userStored));
        }
        return me.current_group_permission === true;
      }
    }
    
    // 2. Si no, usamos lo que tenemos guardado
    return userStored.current_group_permission === true;
    
    // Quitamos 'user' de las dependencias porque ya se calcula adentro
  }, [data, isStaff, currentUserId, activeTab]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      let endpoint = '';
      switch (activeTab) {
        case 'publications': endpoint = 'publications/'; break;
        case 'users': endpoint = 'accounts/users-list/'; break;
        case 'courses': endpoint = 'courses/'; break;
        case 'students': endpoint = 'students/'; break;
        case 'news': endpoint = 'news/'; break;
        case 'projects': endpoint = 'projects/'; break;
        default: endpoint = 'publications/';
      }
      const response = await API.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (err) { 
      setData([]); 
    }
    setLoading(false);
  }, [activeTab]);

const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await API.get('accounts/manage-profile/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfileForm(res.data);

      // --- ESTO ES LO QUE FALTA ---
      // Actualizamos el objeto 'user' en el localStorage con el permiso real que viene de la DB
      const userObj = JSON.parse(localStorage.getItem('user')) || {};
      
      // 'can_post_as_group' es el nombre que devuelve tu vista manage_profile en Django
      if (userObj.current_group_permission !== res.data.can_post_as_group) {
        userObj.current_group_permission = res.data.can_post_as_group;
        localStorage.setItem('user', JSON.stringify(userObj));
        
        // Forzamos un pequeño refresh visual si el permiso cambió
        if (activeTab === 'projects' || activeTab === 'news') {
           // Esto hará que el botón aparezca de inmediato sin recargar la página
           setSelectedItem(null); 
        }
      }
    } catch (err) { 
      console.error(err); 
    }
    setLoading(false);
  }, [activeTab]);

 useEffect(() => {
    fetchProfile(); // Cargamos el perfil siempre para actualizar permisos en segundo plano
    if (activeTab !== 'profile') {
      fetchData();
    }
  }, [activeTab, fetchData, fetchProfile]);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await API.post('accounts/manage-profile/', profileForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem('scholar_id', profileForm.scholar_id);
      setCurrentScholarId(profileForm.scholar_id);
      alert("Configuración de perfil actualizada.");
    } catch (err) { alert("Error al guardar perfil"); }
  };

  const handleSaveScholar = async () => {
    if (!scholarIdInput) return alert("Ingrese un ID");
    try {
      const token = localStorage.getItem('access_token');
      await API.post('accounts/manage-profile/', { scholar_id: scholarIdInput }, { headers: { Authorization: `Bearer ${token}` }});
      localStorage.setItem('scholar_id', scholarIdInput);
      setCurrentScholarId(scholarIdInput);
      alert("ID vinculado.");
      window.location.reload(); 
    } catch (err) { alert("Error al vincular"); }
  };

 const handleEdit = (item) => {
  setSelectedItem(item);
  setEditFormData({ 
    ...item,
    name: item.name || '',
    title: item.title || item.name || '', 
    description: item.description || '',
    content: item.content || item.description || '', 
    link: item.link || item.external_url || '',
    category: item.category || '',
    code: item.code || '',       
    semester: item.semester || '' 
  }); 
  setIsEditModalOpen(true);
};

const handleUpdate = async (e) => {
  if (e) e.preventDefault();
  setLoading(true);
  try {
    const token = localStorage.getItem('access_token');
    let endpoint = '';
    
    if (activeTab === 'projects') endpoint = `projects/${selectedItem.id}/`;
    else if (activeTab === 'news') endpoint = `news/${selectedItem.id}/`;
    else if (activeTab === 'students') endpoint = `students/${selectedItem.id}/`;
    else if (activeTab === 'courses') endpoint = `courses/${selectedItem.id}/`;
    else if (activeTab === 'publications') endpoint = `publications/${selectedItem.id}/`;

    // --- USAMOS FORMDATA PARA ENVIAR TEXTO + ARCHIVOS ---
    const formDataToSend = new FormData();
    
    // 1. Agregamos todos los campos de texto del formulario
    Object.keys(editFormData).forEach(key => {
      // No agregamos la 'image' vieja porque es solo una URL de texto
      if (key !== 'image' && editFormData[key] !== null) {
        formDataToSend.append(key, editFormData[key]);
      }
    });

    // 2. SI EL USUARIO SELECCIONÓ UNA IMAGEN NUEVA, LA AGREGAMOS
    if (editImageFile) {
      formDataToSend.append('image', editImageFile);
    }

    // 3. Enviamos la petición PATCH
    const response = await API.patch(endpoint, formDataToSend, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' // <--- INDISPENSABLE PARA ARCHIVOS
      }
    });

    // 4. Actualizamos la interfaz con los nuevos datos (incluyendo la nueva URL de imagen)
    setData(prevData => prevData.map(item => 
      item.id === selectedItem.id ? { ...item, ...response.data } : item
    ));

    setIsEditModalOpen(false);
    setEditImageFile(null); // Limpiamos el archivo para la próxima edición
    alert("¡Registro actualizado correctamente!");

  } catch (err) {
    console.error("Error al actualizar:", err.response?.data || err);
    alert("Error al guardar los cambios.");
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar este registro?")) return;
    try {
      const token = localStorage.getItem('access_token');
      let endpoint = activeTab === 'users' ? `accounts/users-list/${id}/` : `${activeTab}/${id}/`;
      await API.delete(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) { alert("Error al eliminar."); }
  };

  // --- CAMBIO CRÍTICO 2: TOGGLE SINCRONIZADO ---
 const handleTogglePermission = async (userId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await API.patch(`accounts/toggle-group-permission/${userId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Obtenemos el valor REAL que Django guardó
      const nuevoPermisoDeDB = response.data.current_group_permission;

      // Actualizamos la tabla visualmente con la verdad del servidor
      setData(prevData => prevData.map(item => 
        item.id === userId ? { ...item, current_group_permission: nuevoPermisoDeDB } : item
      ));

      // SOLO si te estás editando a ti mismo, actualizamos el localStorage para que los botones cambien
      if (userId === currentUserId) {
        const userStored = JSON.parse(localStorage.getItem('user')) || {};
        userStored.current_group_permission = nuevoPermisoDeDB;
        localStorage.setItem('user', JSON.stringify(userStored));
      }
    } catch (err) {
      alert("Error al sincronizar con el servidor.");
    }
  };

  const allTabs = [
    { id: 'publications', label: 'Publicaciones', icon: <FileText size={16}/>, staff: false },
    { id: 'students', label: 'Estudiantes', icon: <GraduationCap size={16}/>, staff: false },
    { id: 'courses', label: 'Cátedras', icon: <BookOpen size={16}/>, staff: false },
    { id: 'projects', label: 'Proyectos', icon: <PlusCircle size={16}/>, staff: true }, 
    { id: 'news', label: 'Noticias', icon: <Megaphone size={16}/>, staff: true },
    { id: 'profile', label: 'Mi Perfil', icon: <UserCog size={16}/>, staff: false },
    { id: 'users', label: 'Doctores', icon: <Users size={16}/>, staff: true }
  ];

  const visibleTabs = allTabs.filter(tab => isStaff ? tab.staff : (tab.id !== 'users'));

  return (
    <div className={`w-full min-h-screen transition-colors duration-500 ${darkMode ? 'bg-[#020617]' : 'bg-slate-100'}`}>
      <div className="p-8 max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center bg-[#072146] p-8 shadow-lg border-b-4 border-[#49a5e6] rounded-t-xl relative overflow-hidden">
          <div className="text-white relative z-10">
            <h1 className="text-xl font-black tracking-[0.2em] uppercase">Gestión Académica</h1>
            <p className="text-[#49a5e6] text-[10px] font-bold uppercase tracking-widest mt-1">
              {isStaff ? "Administrador: " : "Investigador: "} <span className="text-white">{userName}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <button 
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all font-black text-[9px] uppercase tracking-tighter shadow-inner
                ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-[#004481] border-[#49a5e6] text-white'}`}
            >
              {darkMode ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} />}
              {darkMode ? 'Modo Día' : 'Modo Noche'}
            </button>

            {currentScholarId && !isStaff && (
              <Link to={`/doctor/${currentScholarId}`} target="_blank" className="flex items-center gap-2 bg-white text-[#072146] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-[#49a5e6] hover:text-white transition-all shadow-md">
                Perfil Público <ExternalLink size={14} />
              </Link>
            )}
          </div>
        </header>

        {!isStaff && (
          <div className={`transition-all p-6 shadow-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4 rounded-r-xl border-y border-r border-white/5 border-l-4
            ${darkMode ? 'bg-[#0b1a31] border-l-[#49a5e6]' : 'bg-white border-l-[#072146]'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded shadow-inner border ${darkMode ? 'bg-[#072146] text-[#49a5e6] border-white/10' : 'bg-slate-50 text-[#072146] border-slate-200'}`}>
                <Shield size={24} />
              </div>
              <div>
                <h2 className={`text-[10px] font-black uppercase tracking-widest text-slate-400`}>Scholar Integration</h2>
                <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-[#072146]'}`}>{currentScholarId || "No vinculado"}</p>
              </div>
            </div>
            <div className={`flex border rounded overflow-hidden shadow-sm ${darkMode ? 'bg-[#072146] border-white/10' : 'bg-white border-slate-200'}`}>
              <input 
                type="text" 
                placeholder="ID INVESTIGADOR" 
                className={`px-4 py-2 text-xs font-bold outline-none w-48 bg-transparent ${darkMode ? 'text-white' : 'text-slate-800'}`} 
                onChange={(e) => setScholarIdInput(e.target.value)} 
              />
              <button onClick={handleSaveScholar} className={`px-4 py-2 font-black uppercase text-[10px] transition ${darkMode ? 'bg-[#49a5e6] text-[#072146]' : 'bg-[#072146] text-white hover:bg-[#49a5e6]'}`}>Vincular</button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {visibleTabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`px-8 py-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-lg shadow-md border-b-4
                ${activeTab === tab.id 
                  ? 'bg-[#004481] text-white border-[#49a5e6] scale-105 z-10 brightness-110 shadow-lg' 
                  : 'bg-[#072146] text-white/70 border-transparent hover:text-white hover:brightness-125'}`}
            >
              <span className={activeTab === tab.id ? 'text-[#49a5e6]' : 'text-white/40'}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className={`transition-all shadow-2xl min-h-[500px] rounded-b-2xl overflow-hidden mb-10 border-t-4 border-[#49a5e6] bg-white`}>
          
          {activeTab === 'profile' ? (
            <div className="p-10 animate-in fade-in duration-500 max-w-4xl">
              <h2 className="text-xs font-black text-[#072146] mb-8 uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-1 h-4 bg-[#49a5e6]" /> Perfil Profesional
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 block mb-2">Biografía</label>
                  <textarea className="w-full p-4 bg-slate-50 border text-sm h-32 outline-none focus:border-[#49a5e6]" value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} />
                </div>
                {['office_location', 'phone', 'github_url', 'linkedin_url'].map(field => (
                  <div key={field}>
                    <label className="text-[9px] font-black uppercase text-slate-400 block mb-2">{field.replace('_', ' ')}</label>
                    <input className="w-full p-3 bg-slate-50 border text-xs font-bold outline-none focus:border-[#49a5e6]" value={profileForm[field] || ''} onChange={e => setProfileForm({...profileForm, [field]: e.target.value})} />
                  </div>
                ))}
              </div>
              <button onClick={handleSaveProfile} className="mt-8 bg-[#072146] text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition flex items-center gap-2 shadow-md">
                <Save size={16} /> Guardar Cambios
              </button>
            </div>
          ) : (
            <div>
              <div className="px-10 py-5 bg-slate-50 border-b flex items-center justify-between">
                <h3 className="text-[10px] font-black text-[#072146] uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle className="text-[#49a5e6]" size={16} /> Registros en {activeTab}
                </h3>
                <div className="flex gap-2">
  {/* 1. BOTÓN PARA REGISTRAR DOCTORES (Solo Staff) */}
  {activeTab === 'users' && isStaff && (
    <Link to="/registrar-usuario" className="bg-[#072146] text-white px-4 py-2 flex items-center gap-2 font-bold text-[9px] uppercase hover:bg-[#49a5e6] transition shadow-sm">
      <UserPlus size={14} /> Registrar Doctor
    </Link>
  )}

  {/* 2. BOTONES DE NOTICIAS (Sincronizados) */}
  {activeTab === 'news' && (
    <>
      {/* Botón de Grupo (Staff o Investigador con permiso) */}
      {(isStaff || hasGroupAccess) && (
        <Link 
          to="/registrar-noticia?type=group" 
          className="bg-[#004481] text-white px-4 py-2 flex items-center gap-2 font-bold text-[9px] uppercase hover:bg-[#49a5e6] transition shadow-lg border-b-2 border-blue-400"
        >
          <Plus size={14} /> Añadir Noticia de Grupo
        </Link>
      )}
      
      {/* Botón Personal (Solo para investigadores) */}
      {!isStaff && (
        <Link 
          to="/registrar-noticia" 
          className="bg-[#072146] text-white px-4 py-2 flex items-center gap-2 font-bold text-[9px] uppercase hover:bg-[#49a5e6] transition shadow-sm"
        >
          <PlusCircle size={14} /> Nueva Noticia Personal
        </Link>
      )}
    </>
  )}

  {/* 3. BOTONES DE OTRAS PESTAÑAS (Estudiantes, Cursos, Proyectos) */}
  {!isStaff && (
    <>
      {activeTab === 'students' && (
        <Link to="/registrar-estudiante" className="bg-[#072146] text-white px-4 py-2 flex items-center gap-2 font-bold text-[9px] uppercase hover:bg-[#49a5e6] transition shadow-sm">
          <PlusCircle size={14} /> Nuevo Alumno
        </Link>
      )}
      {activeTab === 'courses' && (
        <Link to="/registrar-curso" className="bg-[#072146] text-white px-4 py-2 flex items-center gap-2 font-bold text-[9px] uppercase hover:bg-[#49a5e6] transition shadow-sm">
          <PlusCircle size={14} /> Nueva Cátedra
        </Link>
      )}
    </>
  )}

  {activeTab === 'projects' && (isStaff || hasGroupAccess) && (
    <Link to="/registrar-proyecto" className="bg-[#072146] text-white px-4 py-2 flex items-center gap-2 font-bold text-[9px] uppercase hover:bg-[#49a5e6] transition shadow-sm">
      <PlusCircle size={14} /> Nuevo Proyecto
    </Link>
  )}
</div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="bg-white border-b border-slate-100">
                    <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Título / Registro</th>
                    {activeTab === 'users' && <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left w-1/4">Permiso Grupo</th>}
                    <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right w-32">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {data.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-all duration-200">
                      <td className="px-10 py-6">
                       {activeTab === 'publications' && (
  <div className="space-y-2">
    <div className="flex items-center gap-3">
      <span className="bg-blue-100 text-[#072146] text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
        {item.year || item.publication_year || '2025'}
      </span>
      <span className="text-[#49a5e6] font-bold text-[10px] uppercase tracking-widest line-clamp-1">
        {item.journal_name || item.journal || 'Revista Académica'}
      </span>
    </div>
    <p className="font-extrabold text-slate-900 text-sm uppercase leading-tight tracking-tight">
      {item.title}
    </p>
    <p className="text-[11px] text-slate-500 font-medium italic line-clamp-2 leading-relaxed max-w-2xl">
      {item.abstract || item.description || "Sin resumen disponible"}
    </p>
    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase leading-relaxed">
      <span className="text-[#49a5e6] shrink-0">Autores:</span> 
      <span className="line-clamp-1">{item.authors_list || item.authors || 'Investigadores CENIDET'}</span>
    </div>
  </div>
)}

                       {activeTab === 'students' && (
  <div className="flex items-center gap-4">
    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-[#072146] border border-slate-200">
      <GraduationCap size={20} />
    </div>
    <div>
      <p className="font-extrabold text-slate-900 text-sm uppercase">{item.name}</p>
      <div className="flex gap-3 mt-1">
        <span className="text-[10px] text-blue-600 font-black uppercase">
          {item.category === 'phd' ? 'Doctorado' : 
           item.category === 'undergrad' ? 'Pregrado' : 
           item.category === 'alumni' ? 'Egresado' : item.category}
        </span>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 rounded font-black uppercase">
          Matrícula Activa
        </span>
      </div>
    </div>
  </div>
)}

                        {activeTab === 'courses' && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <BookOpen size={14} className="text-[#49a5e6]" />
                              <p className="font-extrabold text-slate-900 text-sm uppercase">{item.name}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Periodo:</span>
                              <span className="text-[10px] font-bold text-[#072146]">{item.semester || 'Ene - Jun 2026'}</span>
                              <span className="bg-slate-100 text-slate-600 text-[9px] px-2 py-0.5 rounded font-bold uppercase">ID: {item.course_code || 'CAT-00'}</span>
                            </div>
                          </div>
                        )}

                       {activeTab === 'news' && (
  <div className="flex items-center gap-6 max-w-4xl">
    <div className="relative shrink-0">
      {item.image ? (
        <img src={item.image.startsWith('http') ? item.image : `http://localhost:8000${item.image}`} className="w-28 h-20 object-cover rounded-lg border border-slate-200" alt="Noticia" />
      ) : (
        <div className="w-28 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-[9px] text-slate-400 font-black uppercase">Sin Imagen</div>
      )}
    </div>
    <div className="flex-1">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <span className="text-[9px] font-black bg-[#072146] text-white px-2 py-1 rounded">{item.date_text || 'RECIENTE'}</span>
        <span className="text-[10px] font-black text-[#49a5e6] uppercase flex items-center gap-1">
          <UserCog size={12} /> Por: <span className="text-slate-600">{item.doctor_username || 'Administración'}</span>
        </span>
        {item.is_important && <span className="flex items-center gap-1 text-[9px] font-black bg-yellow-400 text-yellow-900 px-2 py-1 rounded animate-pulse"><Star size={10} fill="currentColor" /> DESTACADA</span>}
        {item.is_group_announcement && <span className="text-[9px] font-black bg-blue-600 text-white px-2 py-1 rounded flex items-center gap-1"><ShieldCheck size={10} /> GRUPO</span>}
      </div>
      <h4 className="text-[#072146] font-black text-sm uppercase tracking-tight mb-1">
        {item.title || "Sin Título"}
      </h4>
      <p className="font-medium text-slate-500 text-xs leading-relaxed line-clamp-2 italic">
        {item.content}
      </p>
    </div>
  </div>
)}

                        {activeTab === 'projects' && (
                          <div className="flex items-center gap-4">
                            {item.image && <img src={item.image.startsWith('http') ? item.image : `http://localhost:8000${item.image}`} className="w-20 h-14 object-cover rounded-lg border-2 border-white shadow-md" alt="Proyecto" />}
                            <div>
                              <p className="font-extrabold text-slate-900 text-sm uppercase tracking-tight">{item.title}</p>
                              <p className="text-[10px] text-slate-500 font-bold mt-1">Liderado por: {item.participants || 'Investigador Principal'}</p>
                            </div>
                          </div>
                        )}

                        {activeTab === 'users' && (
                          <div className="flex items-center gap-4">
                            <div className="relative group">
                              {item.profile_image ? (
                                <img src={item.profile_image.startsWith('http') ? item.profile_image : `http://localhost:8000${item.profile_image}`} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform" alt={item.username} />
                              ) : (
                                <div className="w-11 h-11 bg-[#072146] text-white rounded-full flex items-center justify-center text-sm font-black border-2 border-white shadow-md uppercase">
                                  {item.username ? item.username.charAt(0) : 'U'}
                                </div>
                              )}
                              {item.is_staff && (
                                <div className="absolute -top-1 -right-1 bg-[#49a5e6] text-white rounded-full p-1 border-2 border-white"><ShieldCheck size={8} /></div>
                              )}
                            </div>
                            <div>
                              <p className="font-extrabold text-[#072146] text-sm uppercase leading-none">{item.first_name ? `${item.first_name} ${item.last_name || ''}` : item.username}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5 tracking-tighter">{item.email}</p>
                            </div>
                          </div>
                        )}
                      </td>

                     {activeTab === 'users' && (
  <td className="px-10 py-6">
    <button
      onClick={() => handleTogglePermission(item.id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black transition-all border-2 
        ${item.current_group_permission === true
          ? 'bg-blue-50 border-blue-600 text-blue-700' 
          : 'bg-white border-slate-200 text-slate-400 hover:border-blue-400'}`}
    >
      {item.current_group_permission === true ? <ShieldCheck size={12} /> : <Lock size={12} />}
      {item.current_group_permission === true ? 'GRUPO ACTIVO' : 'SIN ACCESO'}
    </button>
  </td>
)}

<td className="px-10 py-6 text-right">
  <div className="flex justify-end gap-3">
    {activeTab === 'publications' ? (
      (item.link || item.external_url) && (
        <a 
          href={item.link || item.external_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2.5 bg-white border border-slate-200 text-[#49a5e6] hover:bg-blue-50 rounded-lg transition-all shadow-sm flex items-center justify-center group"
          title="Ver publicación original"
        >
          <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
        </a>
      )
    ) : (
      <>
        {activeTab === 'users' && item.scholar_id && (
          <Link to={`/doctor/${item.scholar_id}`} target="_blank" className="p-2.5 bg-white border border-slate-200 text-[#072146] hover:bg-[#49a5e6] hover:text-white rounded-lg transition-all shadow-sm">
            <Eye size={16}/>
          </Link>
        )}

        {(
          activeTab !== 'users' && ( 
            isStaff || 
            String(item.doctor) === String(currentUserId) || 
            String(item.user) === String(currentUserId) ||
            String(item.doctor_id) === String(currentUserId) ||
            (['students', 'courses', 'news'].includes(activeTab)) || 
            (activeTab === 'projects' && hasGroupAccess)
          )
        ) && (
          <button 
            onClick={() => handleEdit(item)} 
            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-[#49a5e6] hover:bg-blue-50 rounded-lg transition-all shadow-sm"
          >
            <Edit3 size={16} />
          </button>
        )}

        {(
          isStaff || 
          String(item.doctor) === String(currentUserId) || 
          String(item.user) === String(currentUserId) ||
          String(item.doctor_id) === String(currentUserId) ||
          (['students', 'courses', 'news'].includes(activeTab)) || 
          (activeTab === 'projects' && hasGroupAccess)
        ) && (
          <button 
            onClick={() => handleDelete(item.id)} 
            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shadow-sm"
          >
            <Trash2 size={16} />
          </button>
        )}
      </>
    )}
  </div>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {data.length === 0 && !loading && (
                <div className="py-32 text-center opacity-20">
                  <AlertCircle size={48} className="mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sin información</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

{/* MODAL DE EDICIÓN */}
{isEditModalOpen && selectedItem && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#072146]/80 backdrop-blur-md p-4">
    <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-y-auto max-h-[90vh]">
      <div className="bg-[#072146] px-8 py-6 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Panel de Edición</h2>
          <p className="text-[#49a5e6] text-[9px] font-bold uppercase mt-1">
            Editando: {activeTab === 'news' ? 'Noticia' : activeTab === 'students' ? 'Estudiante' : activeTab === 'courses' ? 'Cátedra' : 'Registro'}
          </p>
        </div>
        <button onClick={() => setIsEditModalOpen(false)} className="text-white/60 hover:text-white"><X size={20} /></button>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {activeTab === 'courses' ? 'Nombre de la Asignatura' : activeTab === 'students' ? 'Nombre del Alumno' : 'Título'}
          </label>
          <input 
            type="text" 
            value={editFormData.name || editFormData.title || ''} 
            onChange={(e) => setEditFormData({...editFormData, name: e.target.value, title: e.target.value})}
            className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-[#49a5e6] text-sm font-bold text-[#072146] uppercase"
          />
        </div>

        {activeTab === 'courses' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Código ID</label>
              <input 
                type="text"
                value={editFormData.code || ''} 
                onChange={(e) => setEditFormData({...editFormData, code: e.target.value})}
                placeholder="EJ: IA-2026"
                className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-[#49a5e6] text-sm font-bold text-[#072146]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Periodo Académico</label>
              <input 
                type="text"
                value={editFormData.semester || ''} 
                onChange={(e) => setEditFormData({...editFormData, semester: e.target.value})}
                placeholder="EJ: ENE-JUN 2026"
                className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-[#49a5e6] text-sm font-bold text-[#072146]"
              />
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nivel Académico</label>
            <select 
              value={editFormData.category || ''} 
              onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
              className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-[#49a5e6] text-sm font-bold text-[#072146]"
            >
              <option value="">SELECCIONAR NIVEL...</option>
              <option value="phd">ESTUDIANTE DE DOCTORADO</option>
              <option value="undergrad">ESTUDIANTE DE PREGRADO</option>
              <option value="alumni">ANTIGUO ALUMNO / EGRESADO</option>
            </select>
          </div>
        )}

        {activeTab !== 'courses' && (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción / Contenido</label>
            <textarea 
              rows="4"
              value={editFormData.description || editFormData.content || ''} 
              onChange={(e) => setEditFormData({...editFormData, description: e.target.value, content: e.target.value})}
              className="w-full border-2 border-slate-100 p-3 outline-none focus:border-[#49a5e6] text-sm text-slate-600 rounded-sm"
              placeholder="Escribe los detalles aquí..."
            />
          </div>
        )}

        {activeTab !== 'students' && (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enlace (URL / Temario)</label>
            <input 
              type="url" 
              value={editFormData.link || editFormData.external_url || ''} 
              onChange={(e) => setEditFormData({...editFormData, link: e.target.value, external_url: e.target.value})}
              className="w-full border-b-2 border-slate-100 py-2 outline-none focus:border-[#49a5e6] text-sm text-[#072146]"
              placeholder="https://..."
            />
          </div>
        )}
{/* --- PEGA EL CÓDIGO AQUÍ --- */}
        {(activeTab === 'news' || activeTab === 'projects') && (
          <div className="space-y-2 p-4 bg-slate-50 border border-dashed border-slate-200 rounded-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon size={14} /> Cambiar Imagen (Opcional)
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setEditImageFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#072146] file:text-white hover:file:bg-[#49a5e6] cursor-pointer"
            />
            <p className="text-[9px] text-slate-400 italic">Si no seleccionas ninguna, se mantendrá la imagen actual.</p>
          </div>
        )}
        {/* --------------------------- */}
        <div className="flex justify-end gap-4 pt-6 border-t border-slate-100 mt-4">
          <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Cancelar</button>
          <button type="button" onClick={handleUpdate} className="bg-[#072146] text-white px-10 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#49a5e6] transition-all flex items-center gap-2 shadow-lg shadow-blue-900/10"><Save size={14} /> Guardar Cambios</button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Dashboard;