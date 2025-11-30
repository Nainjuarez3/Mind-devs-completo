import React, { useState, useEffect } from 'react';
import { Star, Lock, Play, Loader, X, BookOpen, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import { API_URL } from '../config'; // <--- 1. IMPORTAMOS LA URL DE LA NUBE

const LevelMapPage = ({ course, navigateTo, onLevelSelect }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedLevelInfo, setSelectedLevelInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    const fetchProgreso = async () => {
        try {
            // 2. USAMOS LA VARIABLE API_URL AQUÍ
            const res = await fetch(`${API_URL}/progreso/${usuario.id}/${course}`);
            const data = await res.json();
            setCurrentLevel(data.nivel_actual);
        } catch (error) { console.error(error); } 
        finally { setLoading(false); }
    };
    fetchProgreso();
  }, [usuario.id, course]);

  const handleNodeClick = async (levelNumber) => {
    setIsModalOpen(true);
    setModalLoading(true);
    try {
        // 3. Y TAMBIÉN AQUÍ
        const res = await fetch(`${API_URL}/lecciones/${course}/${levelNumber}`);
        if (res.ok) {
            const data = await res.json();
            setSelectedLevelInfo(data);
        } else {
            console.error("Error al cargar lección");
        }
    } catch (error) { console.error(error); } 
    finally { setModalLoading(false); }
  };

  const totalLevels = course === 'logic' ? 7 : 8;
  const courseName = course === 'logic' ? 'Lógica de Programación' : 'Python Básico';
  const themeColor = course === 'logic' ? 'bg-mind-green' : 'bg-mind-cyan';
  const themeBorder = course === 'logic' ? 'border-mind-green' : 'border-mind-cyan';
  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white"><Loader className="animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col font-sans relative transition-colors">
       
       <Navbar navigateTo={navigateTo} />

       <div className={`${themeColor} p-3 shadow-inner text-white sticky top-[68px] z-10`}>
          <div className="max-w-md mx-auto flex items-center justify-between">
             <button 
                onClick={() => navigateTo('dashboard')} 
                className="flex items-center gap-1 font-bold text-sm bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-lg transition"
             >
                <ArrowLeft size={16} /> Volver
             </button>
             <span className="font-bold tracking-wide uppercase text-sm md:text-base">
                {courseName}
             </span>
             <div className="w-16"></div>
          </div>
       </div>

       <main className="flex-grow flex justify-center py-12 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        <div className="relative w-full max-w-sm flex flex-col items-center space-y-8 pb-20">
          
          {levels.map((level, index) => {
            const isCompleted = level < currentLevel;
            const isCurrent = level === currentLevel;
            const isLocked = level > currentLevel;
            const offset = Math.sin(index) * 60;

            return (
              <div key={level} className="relative z-0" style={{ transform: `translateX(${offset}px)` }}>
                <button
                  onClick={() => !isLocked && handleNodeClick(level)}
                  disabled={isLocked}
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center
                    border-b-8 transition-transform active:border-b-0 active:translate-y-2
                    shadow-xl
                    ${isCompleted ? 'bg-yellow-400 border-yellow-600' : ''}
                    ${isCurrent ? `${themeColor} ${themeBorder} animate-bounce` : ''}
                    ${isLocked ? 'bg-gray-200 border-gray-300 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600' : ''}
                  `}
                >
                  {isCompleted && <Star fill="white" className="text-white w-10 h-10" />}
                  {isCurrent && <Play fill="white" className="text-white w-10 h-10" />}
                  {isLocked && <Lock className="text-gray-400 w-8 h-8" />}
                </button>
                 {!isLocked && (
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 font-bold text-gray-400 dark:text-gray-500 text-sm">
                        NIVEL {level}
                    </span>
                )}
              </div>
            );
          })}
           <div className="absolute top-10 bottom-10 w-2 border-l-4 border-dotted border-gray-300 dark:border-gray-700 -z-10"></div>
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative border-4 border-white dark:border-gray-700">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10"><X size={28} /></button>
                {modalLoading ? (<div className="p-10 flex justify-center"><Loader className="animate-spin text-mind-primary"/></div>) : (
                    <>
                        <div className={`p-6 ${themeColor} text-white text-center`}>
                            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl"><BookOpen size={32} /></div>
                            {/* AQUÍ ESTABA EL ERROR VISUAL DE UNDEFINED */}
                            <h2 className="text-2xl font-bold uppercase tracking-wide">
                                {selectedLevelInfo?.titulo || `Nivel ${selectedLevelInfo?.nivel || '?'}`}
                            </h2>
                            <p className="opacity-90 text-sm mt-1">Antes de empezar...</p>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                                {selectedLevelInfo?.contenido_educativo ? (<div dangerouslySetInnerHTML={{ __html: selectedLevelInfo.contenido_educativo }} />) : (<p className="italic text-gray-400">¡Prepárate!</p>)}
                            </div>
                            <button onClick={() => onLevelSelect(selectedLevelInfo?.nivel)} className={`w-full ${themeColor} brightness-110 hover:brightness-125 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2 text-xl`}>
                                <Play size={24} fill="currentColor" /> ¡EMPEZAR AHORA!
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default LevelMapPage;