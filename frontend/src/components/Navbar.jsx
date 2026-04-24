import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { User, LogOut, Mail, Eye, Contrast, ChevronRight, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú móvil
  const userName = localStorage.getItem('user_name');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  const handleScroll = (e, id) => {
    e.preventDefault();
    setIsOpen(false); // Cerrar menú al hacer click
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="w-full shadow-md sticky top-0 z-50">
      {/* BARRA BLANCA (Institucional) - Se oculta en móviles muy pequeños para ahorrar espacio si quieres */}
      <div className="bg-white py-2 px-4 md:px-8 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-2 md:gap-6 overflow-hidden">
          <img src="/pleca_educacion_dic24.png" alt="SEP" className="h-6 md:h-10 w-auto" />
          <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
          <img src="/pleca_tecnm.jpg" alt="TecNM" className="h-6 md:h-10 w-auto" />
          <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
          <img src="/pleca_cenidet.jpg" alt="CENIDET" className="h-5 md:h-8 w-auto" />
        </div>
        
        {/* Iconos de accesibilidad (Solo desktop) */}
        <div className="hidden lg:flex items-center gap-4 text-slate-400">
          <Mail size={18} className="hover:text-[#004481] cursor-pointer transition-colors" /> 
          <Eye size={18} className="hover:text-[#004481] cursor-pointer transition-colors" /> 
          <Contrast size={18} className="hover:text-[#004481] cursor-pointer transition-colors" />
        </div>

        {/* BOTÓN HAMBURGUESA (Solo móvil) */}
        <button 
          className="lg:hidden text-[#072146] p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

{/* BARRA AZUL (Navegación) */}
<nav className={`bg-[#072146] text-white transition-all duration-300 ${isOpen ? 'block' : 'hidden lg:block'}`}>
  {/* He quitado 'uppercase' de la siguiente línea para que respete las minúsculas */}
  <div className="max-w-7xl mx-auto px-8 py-3 flex flex-col lg:flex-row justify-end items-center gap-6 lg:gap-8 font-bold text-[11px] lg:text-[10px] tracking-[0.15em]">
    
    <button onClick={(e) => handleScroll(e, 'hero')} className="hover:text-[#49a5e6] transition-colors w-full lg:w-auto text-center py-2 lg:py-0">Inicio</button>
    
    <Link 
      to="/conocenos" 
      onClick={() => setIsOpen(false)}
      className="hover:text-[#49a5e6] transition-colors w-full lg:w-auto text-center py-2 lg:py-0"
    >
      Conócenos  {/* <-- Aquí ya está en minúsculas */}
    </Link>
    
    <button onClick={(e) => handleScroll(e, 'noticias')} className="hover:text-[#49a5e6] transition-colors w-full lg:w-auto text-center py-2 lg:py-0">Noticias</button>
    <button onClick={(e) => handleScroll(e, 'equipo')} className="hover:text-[#49a5e6] transition-colors w-full lg:w-auto text-center py-2 lg:py-0">Equipo</button>
    <button onClick={(e) => handleScroll(e, 'proyectos')} className="hover:text-[#49a5e6] transition-colors w-full lg:w-auto text-center py-2 lg:py-0">Proyectos</button>

    {/* ... resto del código (Sección de Login) ... */}

          {/* LOGIN / USER SECTION */}
          <div className="w-full lg:w-auto flex justify-center pt-4 lg:pt-0 border-t border-white/10 lg:border-none">
            {userName ? (
              <div className="flex items-center gap-4 bg-white/5 p-1 rounded-full pl-4 border border-white/10 group">
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-[#49a5e6] normal-case italic text-xs">Dr. {userName}</Link>
                <button onClick={handleLogout} className="bg-red-500/80 p-2 rounded-full hover:bg-red-600 transition shadow-lg">
                  <LogOut size={12}/>
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="bg-[#004481] hover:bg-[#49a5e6] border border-white/10 px-6 py-2 rounded-sm flex items-center gap-2 transition-all font-bold group w-full lg:w-auto justify-center">
                <User size={14} /> 
                Acceso 
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;