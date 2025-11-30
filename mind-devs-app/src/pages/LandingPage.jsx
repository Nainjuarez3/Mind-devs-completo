import React, { useState } from 'react';
import HelpModal from './HelpModal'; // <--- 1. Importamos el Modal
import { Code, Target, Users } from 'lucide-react'; // Iconos para About We

const LandingPage = ({ navigateTo, goToAuth }) => {
    const [isHelpOpen, setIsHelpOpen] = useState(false); // Estado del modal

    // Función para scroll suave
    const scrollToAbout = () => {
        const section = document.getElementById('about-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans">

            {/* --- MODAL DE AYUDA (Invisible por defecto) --- */}
            <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

            <div className="p-4 md:p-8">
                {/* HEADER */}
                <header className="flex justify-between items-center mb-12 md:mb-24">
                    <div className="bg-mind-primary text-white px-6 py-3 rounded-full flex items-center space-x-3 shadow-md cursor-default select-none">
                        <span className="text-2xl">🧠</span>
                        <span className="font-bold text-lg tracking-wide">MIND DEVS</span>
                    </div>
                    <div className="flex space-x-4">

                        {/* Botón About We con Scroll */}
                        <button
                            onClick={scrollToAbout}
                            className="bg-mind-cyan hover:bg-cyan-600 text-white font-semibold px-4 md:px-6 py-2 rounded-lg transition-colors shadow-sm"
                        >
                            About We
                        </button>
                        {/* Botón Help abre el Modal */}
                        <button
                            onClick={() => setIsHelpOpen(true)}
                            className="bg-mind-cyan hover:bg-cyan-600 text-white font-semibold px-4 md:px-6 py-2 rounded-lg transition-colors shadow-sm"
                        >
                            Help
                        </button>
                    </div>
                </header>

                {/* CONTENIDO PRINCIPAL (HERO SECTION) */}
                <main className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 max-w-6xl mx-auto mb-32">
                    {/* Lado Izquierdo */}
                    <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
                        <div className="bg-white border-4 border-mind-dark rounded-3xl p-8 mb-8 shadow-lg w-full text-left transform hover:-rotate-1 transition-transform duration-300">
                            <h2 className="text-3xl font-bold mb-4 text-mind-dark">
                                Aprende a pensar como programador
                            </h2>
                            <p className="text-gray-700 mb-4 leading-relaxed text-lg">
                                Domina la lógica de programación y las bases de Python con nuestro sistema gamificado.
                            </p>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                Sin frustraciones, a tu ritmo y con práctica interactiva real. ¡Empieza tu racha hoy mismo!
                            </p>
                        </div>

                        <div className="flex w-full space-x-4">
                            <button
                                onClick={() => goToAuth('login')} // <--- USA LA NUEVA FUNCIÓN
                                className="flex-1 bg-mind-cyan hover:bg-cyan-600 text-white font-bold py-4 rounded-xl transition-colors shadow-md text-center text-xl"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => goToAuth('register')} // <--- USA LA NUEVA FUNCIÓN
                                className="flex-1 bg-mind-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-md text-center text-xl"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>

                    {/* Lado Derecho */}
                    <div className="w-full md:w-1/2 flex justify-center relative">
                        <div className="absolute bottom-0 right-10 w-64 h-64 bg-blue-100 rounded-full opacity-60 -z-10 blur-3xl"></div>
                        <img
                            src="https://marketplace.canva.com/wUs8M/MAG05HwUs8M/1/tl/canva-illustration-of-nanashi-character-programming-on-computer-MAG05HwUs8M.png"
                            alt="Ilustración de programadora"
                            className="w-full max-w-xl h-auto rounded-3xl shadow-sm object-cover z-10 hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </main>
            </div>

            {/* --- SECCIÓN ABOUT WE (Scroll Target) --- */}
            <section id="about-section" className="bg-gray-50 py-20 border-t-2 border-gray-100">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-mind-dark mb-4">Sobre Nosotros</h2>
                        <div className="h-2 w-24 bg-mind-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Tarjeta 1: Misión */}
                        <div className="bg-white p-8 rounded-2xl shadow-md border-b-4 border-mind-green hover:-translate-y-2 transition-transform">
                            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-6 text-green-600">
                                <Target size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-mind-dark">Nuestra Misión</h3>
                            <p className="text-gray-600">
                                Democratizar la educación de la lógica de programación, haciendo que aprender a pensar como un ingeniero sea tan adictivo como un videojuego.
                            </p>
                        </div>

                        {/* Tarjeta 2: Enfoque */}
                        <div className="bg-white p-8 rounded-2xl shadow-md border-b-4 border-mind-cyan hover:-translate-y-2 transition-transform">
                            <div className="bg-cyan-100 w-14 h-14 rounded-full flex items-center justify-center mb-6 text-mind-cyan">
                                <Code size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-mind-dark">El Método</h3>
                            <p className="text-gray-600">
                                Olvídate de videos aburridos de 2 horas. Aquí aprendes haciendo, con micro-retos, feedback inmediato y cero frustración.
                            </p>
                        </div>

                        {/* Tarjeta 3: Comunidad */}
                        <div className="bg-white p-8 rounded-2xl shadow-md border-b-4 border-mind-primary hover:-translate-y-2 transition-transform">
                            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-6 text-mind-primary">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-mind-dark">Para Todos</h3>
                            <p className="text-gray-600">
                                Desde estudiantes universitarios hasta curiosos. MIND DEVS es el lugar seguro para cometer errores y aprender de ellos.
                            </p>
                        </div>
                    </div>

                    {/* Footer pequeño */}
                    <div className="text-center mt-20 text-gray-400 text-sm">
                        © 2025 MIND DEVS. Hecho con 🧠 y ☕.
                        <br />
                        <a>
                            UNIVERSIDAD DE COLIMA
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;