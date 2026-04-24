import React from 'react';
import { Mail, Phone, MapPin, Globe, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  // Función para evitar el warning de href="#"
  const handlePlaceholderClick = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="bg-[#072146] text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* COLUMNA 1: Identidad */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#004481] flex items-center justify-center font-bold text-sm italic border border-white/20 text-[#49a5e6]">C</div>
              <span className="font-bold tracking-tighter text-xl uppercase text-[#49a5e6]">CENIDET</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Centro Nacional de Investigación y Desarrollo Tecnológico. 
              Impulsando la vanguardia científica y la formación de investigadores de alto nivel.
            </p>
            <div className="flex gap-4">
              <button onClick={handlePlaceholderClick} className="p-2 bg-white/5 rounded-full hover:bg-[#49a5e6] transition-colors" aria-label="Facebook">
                <Facebook size={18}/>
              </button>
              <button onClick={handlePlaceholderClick} className="p-2 bg-white/5 rounded-full hover:bg-[#49a5e6] transition-colors" aria-label="Twitter">
                <Twitter size={18}/>
              </button>
              <button onClick={handlePlaceholderClick} className="p-2 bg-white/5 rounded-full hover:bg-[#49a5e6] transition-colors" aria-label="Linkedin">
                <Linkedin size={18}/>
              </button>
            </div>
          </div>

          {/* COLUMNA 2: Contacto Directo */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-[#49a5e6]">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#49a5e6] mt-1 flex-shrink-0"/> 
                <span className="text-sm text-slate-300">Interior Internado Palmira S/N, Cuernavaca, Morelos, México. CP 62493.</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#49a5e6] flex-shrink-0"/> 
                <span className="text-sm text-slate-300">+52 (777) 362 7770</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#49a5e6] flex-shrink-0"/> 
                <span className="text-sm text-slate-300">posgrado@cenidet.tecnm.mx</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe size={18} className="text-[#49a5e6] flex-shrink-0"/> 
                <a href="https://www.cenidet.edu.mx" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-300 hover:text-white transition-colors">www.cenidet.edu.mx</a>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: MAPA INTERACTIVO (URL UNIVERSAL) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-[#49a5e6]">Ubicación Sede</h4>
            <div className="w-full h-48 rounded-xl overflow-hidden border border-white/10 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500 shadow-2xl bg-[#0a1a2f]">
              <iframe
                title="Google Maps CENIDET"
                src="https://maps.google.com/maps?q=CENIDET%20Cuernavaca&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

        </div>
{/* COLUMNA 3: MAPA DE VISITANTES GLOBAL */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-[#49a5e6]">Alcance Global</h4>
            <div className="w-full h-48 rounded-xl overflow-hidden border border-white/10 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500 shadow-2xl bg-[#0a1a2f] flex items-center justify-center p-2">
              
              {/* Contenedor del Widget de mapa */}
              <a 
                href="https://mapmyvisitors.com/web/1c344" 
                title="Visit tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full flex items-center justify-center"
              >
                <img 
                  src="https://mapmyvisitors.com/map.png?d=j7kPhHwhZxEdZiE3XvOBFZOLnHqq318DNadMsQ3I5bk&cl=ffffff" 
                  alt="Map"
                  className="max-w-full max-h-full object-contain"
                />
              </a>

            </div>
            <p className="text-[9px] text-slate-500 uppercase text-center tracking-tighter">
              Investigación con impacto internacional
            </p>
          </div>
        {/* Línea final */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center">
            © {new Date().getFullYear()} Tecnológico Nacional de México - CENIDET. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-[10px] text-slate-500 uppercase tracking-tighter">
            <button onClick={handlePlaceholderClick} className="hover:text-white transition-colors uppercase">Aviso de Privacidad</button>
            <button onClick={handlePlaceholderClick} className="hover:text-white transition-colors uppercase">Portal de Transparencia</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;