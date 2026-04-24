import React from 'react';
import { Target, Eye, BrainCircuit } from 'lucide-react';
import Footer from '../components/Footer';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow">
        <section id="conocenos" className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* ENCABEZADO PRINCIPAL */}
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-[10px] font-black text-[#49a5e6] uppercase tracking-[0.3em] mb-4">
                  Nuestra Identidad
                </h2>
                <h3 className="text-4xl font-black text-[#072146] uppercase tracking-tighter leading-none">
                  Impulsando la vanguardia <br /> tecnológica desde el CENIDET
                </h3>
              </div>
              <div className="h-[2px] flex-1 bg-slate-100 mb-4 mx-8 hidden md:block"></div>
              <p className="text-slate-500 font-medium text-sm max-w-xs italic border-l-4 border-[#49a5e6] pl-4">
                "Excelencia en investigación para el desarrollo nacional."
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* COLUMNA IZQUIERDA: TEXTO INFORMATIVO Y TARJETAS */}
              <div className="space-y-8">
<div className="prose prose-slate">
  <p className="text-slate-600 leading-relaxed text-lg">
    El <b>Centro Nacional de Investigación y Desarrollo Tecnológico (CENIDET)</b> es un pilar fundamental del TecNM. 
    Nuestro grupo de investigación en <b>Inteligencia Artificial</b> se dedica a la creación de soluciones disruptivas, 
    integrando algoritmos de aprendizaje profundo y modelos generativos para resolver problemas complejos de la industria y la sociedad.
  </p>
  <p className="text-slate-600 leading-relaxed mt-4">
    Formamos investigadores de alto nivel capaces de liderar la transformación digital, manteniendo siempre un compromiso ético y humano en el desarrollo de la <b>IA</b>.
  </p>
</div>

                {/* MISION Y VISION ACTUALIZADAS (Más grandes) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                  {/* TARJETA MISIÓN */}
                  <div className="bg-slate-50 p-8 border-t-4 border-[#072146] shadow-sm hover:shadow-md transition-all">
                    <Target className="text-[#49a5e6] mb-4" size={36} />
                    <h4 className="text-[#072146] font-black uppercase text-sm tracking-widest mb-4">Misión</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      Generar conocimiento científico y tecnológico original a través de la investigación en Inteligencia Artificial para fortalecer la soberanía tecnológica de México.
                    </p>
                  </div>

                  {/* TARJETA VISIÓN */}
                  <div className="bg-[#072146] p-8 border-t-4 border-[#49a5e6] shadow-xl text-white hover:scale-[1.02] transition-all">
                    <Eye className="text-[#49a5e6] mb-4" size={36} />
                    <h4 className="text-white font-black uppercase text-sm tracking-widest mb-4">Visión</h4>
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                      Ser referentes internacionales en Inteligencia Artificial Generativa, reconocidos por la excelencia de nuestros egresados y el impacto global de nuestras patentes.
                    </p>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA: IMAGEN PROMO */}
              <div className="relative">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#49a5e6]/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 border-[12px] border-slate-50 shadow-2xl overflow-hidden group">
                  <img 
                    src="/promo.jpg" 
                    alt="CENIDET Laboratorio IA" 
                    className="w-full h-full object-cover aspect-video group-hover:scale-105 transition-transform duration-700" 
                  />
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#072146] to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#49a5e6] p-2">
                        <BrainCircuit size={20} className="text-white" />
                      </div>
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">
                        Laboratorio de IA Avanzada
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estadísticas rápidas */}
                <div className="absolute -bottom-6 -left-6 bg-white shadow-xl p-6 border-l-4 border-[#49a5e6] z-20 hidden md:block">
                  <span className="block text-2xl font-black text-[#072146]">100%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Investigadores SNI</span>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;