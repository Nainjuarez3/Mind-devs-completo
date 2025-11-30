import React, { useState, useEffect } from 'react';
import { LogOut, ShoppingCart, Moon, Sun, User, ChevronDown } from 'lucide-react';

const Navbar = ({ navigateTo }) => {
    // 1. Estado del usuario
    const [usuario, setUsuario] = useState({ nombre: 'Estudiante', energia: 5, monedas: 0 });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 2. Estado del Modo Oscuro
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    // Cargar usuario al montar
    useEffect(() => {
        const guardado = localStorage.getItem('usuario');
        if (guardado) setUsuario(JSON.parse(guardado));
    }, []);

    // Efecto Dark Mode
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigateTo('landing');
    };

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 sticky top-0 z-50 transition-colors">
            <div className="max-w-5xl mx-auto flex items-center justify-between">

                {/* Logo (Clickeable para ir al Dashboard) */}
                <div
                    onClick={() => navigateTo('dashboard')}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <span className="text-2xl">🧠</span>
                    <span className="font-bold text-xl text-mind-primary tracking-tight">MIND DEVS</span>
                </div>

                {/* Área Derecha */}
                <div className="flex items-center gap-6">

                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-4 text-sm font-bold">
                        <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1.5 rounded-full">
                            <span>🪙 {usuario.monedas}</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-1.5 rounded-full">
                            <span>⚡ {usuario.energia}/5</span>
                        </div>
                    </div>

                    {/* Avatar Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 focus:outline-none"
                        >
                            <div className="w-10 h-10 bg-mind-cyan rounded-full flex items-center justify-center text-white text-lg shadow-sm border-2 border-white dark:border-gray-700">
                                😎
                            </div>
                            <ChevronDown size={16} className="text-gray-400" />
                        </button>

                        {isMenuOpen && (
                            <>
                                {/* Backdrop invisible para cerrar al hacer clic fuera */}
                                <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)}></div>

                                {/* Menú */}
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-fade-in-up z-40">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                                        <p className="font-bold text-gray-800 dark:text-white">{usuario.nombre}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{usuario.email}</p>
                                    </div>
                                    <button onClick={() => navigateTo('profile')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                                        <User size={16} /> Mi Perfil
                                    </button>
                                    <button onClick={() => navigateTo('store')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                                        <ShoppingCart size={16} /> Tienda
                                    </button>
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                                            {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
                                        </div>
                                    </button>
                                    <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                            <LogOut size={16} /> Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;