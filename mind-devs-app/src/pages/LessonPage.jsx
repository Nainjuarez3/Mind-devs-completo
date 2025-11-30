import React, { useState, useEffect } from 'react';
import { X, Zap, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { API_URL } from '../config';

const LessonPage = ({ navigateTo, course, level }) => {
    const [leccionData, setLeccionData] = useState(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [status, setStatus] = useState('idle');
    const [loading, setLoading] = useState(true);
    const [mistakes, setMistakes] = useState(0);

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const [energia, setEnergia] = useState(usuario.energia || 5);

    useEffect(() => {
        const fetchLeccion = async () => {
            try {
                const res = await fetch(`${API_URL}/lecciones/${course}/${level}`);
                if (res.ok) {
                    const data = await res.json();
                    setLeccionData(data);
                } else {
                    alert("No se encontró contenido para este nivel aún.");
                    navigateTo('map');
                }
            } catch (error) {
                console.error(error);
                alert("Error de conexión");
            } finally {
                setLoading(false);
            }
        };
        fetchLeccion();
    }, [course, level, navigateTo]);

    const perderEnergia = async () => {
        try {
            const res = await fetch(`${API_URL}/usuarios/${usuario.id}/energia`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cambio: -1 })
            });
            const data = await res.json();
            setEnergia(data.energia);
            usuario.energia = data.energia;
            localStorage.setItem('usuario', JSON.stringify(usuario));
            if (data.energia === 0) {
                alert("¡Te quedaste sin energía! ⚡");
                navigateTo('dashboard');
            }
        } catch (error) { console.error(error); }
    };

    const handleCheck = () => {
        if (!selectedOption) return;
        const currentExercise = leccionData.ejercicios[currentExerciseIndex];
        const option = currentExercise.opciones.find(opt => opt.id === selectedOption);

        if (option.isCorrect) {
            setStatus('correct');
        } else {
            setStatus('wrong');
            perderEnergia();
            setMistakes(prev => prev + 1);
        }
    };

    const handleNext = async () => {
        if (currentExerciseIndex < leccionData.ejercicios.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            setSelectedOption(null);
            setStatus('idle');
        } else {
            try {
                const response = await fetch(`${API_URL}/progreso`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario_id: usuario.id, curso: course, nivel_ganado: level, errores: mistakes })
                });
                const data = await response.json();

                if (!data.aprobado) {
                    alert(`Completado con ${mistakes} errores. ¡Inténtalo de nuevo sin fallar!`);
                    navigateTo('map');
                    return;
                }
                if (data.monedas_ganadas > 0) {
                    alert(`¡Nivel Perfecto! 🎉 +${data.monedas_ganadas} Monedas`);
                    usuario.monedas += data.monedas_ganadas;
                    localStorage.setItem('usuario', JSON.stringify(usuario));
                } else {
                    alert("Nivel completado. (Repetido, sin monedas extra).");
                }
                navigateTo('map');
            } catch (error) { console.error(error); navigateTo('map'); }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white"><Loader className="animate-spin" /> Cargando...</div>;
    if (!leccionData) return null;

    const currentExercise = leccionData.ejercicios[currentExerciseIndex];

    return (
        // CONTENEDOR PRINCIPAL: dark:bg-gray-900
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300">

            {/* HEADER */}
            <header className="px-6 py-6 flex items-center justify-between max-w-4xl mx-auto w-full">
                <button onClick={() => navigateTo('map')} className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition">
                    <X size={28} />
                </button>

                <div className="flex-grow mx-6 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-mind-green transition-all duration-500"
                        style={{ width: `${((currentExerciseIndex) / leccionData.ejercicios.length) * 100}%` }}
                    ></div>
                </div>

                <div className="flex items-center text-mind-red font-bold text-xl">
                    <Zap size={28} className="fill-current mr-2" />
                    <span>{energia}</span>
                </div>
            </header>

            {/* MAIN */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 max-w-2xl mx-auto w-full">
                <h2 className="text-xl font-bold text-gray-400 mb-2 uppercase tracking-wide">
                    {leccionData.titulo}
                </h2>

                {/* PREGUNTA: dark:text-white */}
                <div className="mb-8 w-full">
                    <p className="text-2xl md:text-3xl font-bold text-mind-dark dark:text-white text-center mb-4">
                        {currentExercise.pregunta}
                    </p>

                    {(currentExercise.tipo === 'completar' || currentExercise.tipo === 'codigo') && (
                        <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-lg text-center shadow-inner border border-gray-700">
                            {currentExercise.tipo === 'completar' ? (
                                <span>&gt;_ {currentExercise.pregunta.replace('____', ' [ ? ] ')}</span>
                            ) : (
                                <span>&gt;_ Código Python</span>
                            )}
                        </div>
                    )}
                </div>

                {/* OPCIONES */}
                <div className="w-full space-y-4">
                    {currentExercise.opciones.map((opt) => (
                        <div
                            key={opt.id}
                            onClick={() => status === 'idle' && setSelectedOption(opt.id)}
                            className={`
                p-4 rounded-xl border-2 transition-all flex items-center
                text-lg font-medium select-none
                ${status !== 'idle' ? 'cursor-default' : 'cursor-pointer'}
                
                // ESTILOS NORMALES Y DARK MODE
                ${selectedOption === opt.id
                                    ? 'border-mind-cyan bg-cyan-50 dark:bg-cyan-900/30 text-mind-cyan'
                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'}
                
                // ESTILOS DE ÉXITO/ERROR (Sobrescriben dark mode)
                ${status === 'correct' && selectedOption === opt.id ? '!border-green-500 !bg-green-100 !text-green-700' : ''}
                ${status === 'wrong' && selectedOption === opt.id ? '!border-red-500 !bg-red-100 !text-red-700' : ''}
                
                ${currentExercise.tipo === 'codigo' || currentExercise.tipo === 'completar' ? 'font-mono text-sm md:text-base' : ''}
              `}
                        >
                            <div className={`
                w-8 h-8 rounded-lg border-2 mr-4 flex items-center justify-center text-sm font-bold
                ${selectedOption === opt.id ? 'border-mind-cyan bg-mind-cyan text-white' : 'border-gray-300 dark:border-gray-600 text-gray-400'}
                ${status === 'correct' && selectedOption === opt.id ? '!border-green-500 !bg-green-500' : ''}
                ${status === 'wrong' && selectedOption === opt.id ? '!border-red-500 !bg-red-500' : ''}
              `}>
                                {opt.id}
                            </div>
                            {opt.text}
                        </div>
                    ))}
                </div>
            </main>

            {/* FOOTER */}
            <footer className={`
        p-6 border-t-2 transition-colors duration-300
        ${status === 'correct' ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800' : ''}
        ${status === 'wrong' ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}
      `}>
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="hidden md:flex items-center">
                        {status === 'correct' && (
                            <div className="flex items-center text-green-700 dark:text-green-400 font-bold text-xl animate-bounce">
                                <CheckCircle className="mr-2" size={32} /> ¡Correcto!
                            </div>
                        )}
                        {status === 'wrong' && (
                            <div className="flex items-center text-red-700 dark:text-red-400 font-bold text-xl animate-shake">
                                <AlertCircle className="mr-2" size={32} /> Incorrecto
                            </div>
                        )}
                    </div>

                    <button
                        onClick={status === 'idle' ? handleCheck : handleNext}
                        disabled={!selectedOption}
                        className={`
              w-full md:w-auto px-10 py-3 rounded-xl font-bold text-white text-lg shadow-hard transition-transform
              active:translate-y-1 active:translate-x-1 active:shadow-none
              ${status === 'idle' ? 'bg-mind-green hover:bg-green-400' : ''}
              ${status === 'correct' ? 'bg-mind-primary hover:bg-blue-600' : ''}
              ${status === 'wrong' ? 'bg-mind-red hover:bg-red-500' : ''}
              ${!selectedOption ? 'opacity-50 cursor-not-allowed bg-gray-400 dark:bg-gray-700' : ''}
            `}
                    >
                        {status === 'idle' ? 'COMPROBAR' : 'CONTINUAR'}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default LessonPage;