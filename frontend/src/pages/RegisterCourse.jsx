import React, { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom'; // Añadimos Link

import { BookOpen, Save, ArrowLeft, Shield } from 'lucide-react';

import API from '../api';



const RegisterCourse = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', code: '', semester: '', link: '' });



  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem('access_token');

      await API.post('courses/', formData, { headers: { Authorization: `Bearer ${token}` } });

      alert("¡Materia registrada con éxito!");

      navigate('/dashboard');

    } catch (err) {

      alert("Error al registrar la materia. Revisa los datos.");

    }

  };



  return (

    <div className="min-h-screen bg-[#f1f5f9] p-8 flex flex-col items-center font-sans">

      <div className="w-full max-w-xl">

       

        {/* BOTÓN VOLVER AL PANEL RESALTADO */}

        <div className="mb-8">

          <Link

            to="/dashboard"

            className="inline-flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 text-[#072146] font-black uppercase text-[11px] tracking-[0.2em] shadow-sm hover:bg-[#072146] hover:text-white hover:border-[#072146] hover:shadow-md transition-all duration-300 rounded-sm group"

          >

            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />

            Volver al Panel de Control

          </Link>

        </div>



        <div className="bg-white shadow-2xl border border-slate-200 overflow-hidden rounded-sm">

          {/* CABECERA DEL FORMULARIO ESTILO INSTITUCIONAL */}

          <div className="bg-[#072146] p-10 text-white border-b-4 border-[#49a5e6]">

            <div className="flex items-center gap-5">

              <div className="bg-white/10 p-4 rounded-xl text-[#49a5e6]">

                <BookOpen size={32} />

              </div>

              <div>

                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Nueva Materia</h2>

                <p className="text-[#49a5e6] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Registro de Cátedra y Programa</p>

              </div>

            </div>

          </div>



          {/* CUERPO DEL FORMULARIO */}

          <form onSubmit={handleSubmit} className="p-10 space-y-8">

           

            <div className="space-y-6">

              <div>

                <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest flex items-center gap-2">

                  Nombre de la Asignatura

                </label>

                <input

                  type="text"

                  placeholder="EJ: INTELIGENCIA ARTIFICIAL GENERATIVA"

                  className="w-full p-4 bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:border-[#49a5e6] transition-all uppercase text-[#072146]"

                  onChange={e => setFormData({...formData, name: e.target.value})}

                  required

                />

              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                  <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest">Código ID</label>

                  <input

                    type="text"

                    placeholder="EJ: IA-2026"

                    className="w-full p-4 bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:border-[#49a5e6] transition-all uppercase"

                    onChange={e => setFormData({...formData, code: e.target.value})}

                  />

                </div>

                <div>

                  <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest">Periodo Académico</label>

                  <input

                    type="text"

                    placeholder="EJ: ENE-JUN 2026"

                    className="w-full p-4 bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:border-[#49a5e6] transition-all uppercase"

                    onChange={e => setFormData({...formData, semester: e.target.value})}

                    required

                  />

                </div>

              </div>



              <div>

                <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest">Enlace al Temario (Opcional)</label>

                <input

                  type="url"

                  placeholder="https://cenidet.tecnm.mx/programa.pdf"

                  className="w-full p-4 bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:border-[#49a5e6] transition-all text-slate-600"

                  onChange={e => setFormData({...formData, link: e.target.value})}

                />

              </div>

            </div>



            {/* BOTÓN DE ACCIÓN */}

            <button className="w-full bg-[#072146] text-white py-5 flex items-center justify-center gap-3 font-black uppercase text-[11px] tracking-[0.3em] shadow-lg hover:bg-[#49a5e6] transition-all group">

              <Save size={18} className="group-hover:scale-110 transition-transform"/>

              Guardar Materia

            </button>

          </form>

        </div>



        {/* NOTA AL PIE */}

        <p className="mt-8 text-center text-slate-400 text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">

          <Shield size={12}/> Plataforma de Gestión Académica - CENIDET 2026

        </p>

      </div>

    </div>

  );

};



export default RegisterCourse;