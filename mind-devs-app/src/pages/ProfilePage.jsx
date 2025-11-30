import React, { useState, useEffect } from 'react';
import { User, Lock, Save, LogOut, Award, Zap, Trophy, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';
import AlertModal from '../components/AlertModal';

const ProfilePage = ({ navigateTo }) => {
    // 1. Cargar datos del usuario guardado
    const [usuario, setUsuario] = useState(() => {
        const guardado = localStorage.getItem('usuario');
        return guardado ? JSON.parse(guardado) : null;
    });

    // Estados para el formulario de edición
    const [nombre, setNombre] = useState(usuario?.nombre || '');
    const [password, setPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [insignias, setInsignias] = useState([]);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ type: 'info', title: '', message: '' });

    const showAlert = (type, title, message) => {
        setModalConfig({ type, title, message });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    // Si no hay usuario, mandar al login (Protección básica)
    useEffect(() => {
        if (!usuario) navigateTo('auth');
    }, [usuario, navigateTo]);

    // 2. Cargar insignias
    useEffect(() => {
        if (usuario) {
            fetch(`${API_URL}/usuarios/${usuario.id}/insignias`)
                .then(res => res.json())
                .then(data => setInsignias(data))
                .catch(err => console.error(err));
        }
    }, [usuario]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!password) {
            showAlert('info', 'Contraseña Requerida', 'Por favor confirma tu contraseña actual o escribe una nueva para guardar cambios.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Actualizamos localStorage y el estado
                localStorage.setItem('usuario', JSON.stringify(data));
                setUsuario(data);
                setIsEditing(false);
                showAlert('success', '¡Perfil Actualizado!', 'Tus datos han sido actualizados correctamente.');
            } else {
                showAlert('error', 'Error', 'No se pudo actualizar el perfil. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error(error);
            showAlert('error', 'Error de Conexión', 'No se pudo conectar con el servidor.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigateTo('landing');
    };

    if (!usuario) return null;

    return (
        // FONDO PRINCIPAL: dark:bg-gray-900
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans pb-10 transition-colors duration-300">
            <AlertModal
                isOpen={modalOpen}
                onClose={closeModal}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
            />

            {/* HEADER DE PERFIL (Se mantiene azul, se ve bien en ambos modos) */}
            <div className="bg-mind-primary text-white p-8 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
                <div className="max-w-2xl mx-auto flex items-center justify-between relative z-10">
                    <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-bold text-sm transition">
                        <ArrowLeft size={18} /> VOLVER
                    </button>
                    <h1 className="text-2xl font-bold">Mi Perfil</h1>
                    <div className="w-20"></div> {/* Espaciador */}
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-20">

                {/* TARJETA PRINCIPAL: dark:bg-gray-800 */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-hard p-6 mb-8 text-center transition-colors">
                    <div className="w-24 h-24 bg-mind-cyan rounded-full mx-auto border-4 border-white dark:border-gray-700 shadow-md flex items-center justify-center text-4xl mb-4">
                        😎
                    </div>
                    {/* TEXTOS: dark:text-white */}
                    <h2 className="text-3xl font-bold text-mind-dark dark:text-white">{usuario.nombre}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{usuario.email}</p>

                    {/* ESTADÍSTICAS RÁPIDAS (Cajas adaptadas) */}
                    <div className="flex justify-center gap-4 mt-6">
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-xl border border-yellow-200 dark:border-yellow-700 flex items-center gap-2 font-bold">
                            <Zap size={20} className="fill-current" /> {usuario.energia} Energía
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-700 flex items-center gap-2 font-bold">
                            <Trophy size={20} /> Nivel {usuario.nivel}
                        </div>
                    </div>
                </div>

                {/* SECCIÓN DE EDICIÓN: dark:bg-gray-800 dark:border-gray-700 */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-mind-dark dark:text-white">Datos Personales</h3>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-mind-primary font-bold hover:underline text-sm"
                        >
                            {isEditing ? 'Cancelar' : 'Editar'}
                        </button>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1 block">Nombre de Usuario</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    // CLASES CONDICIONALES PARA INPUTS (Modo edición vs lectura + Dark Mode)
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition 
                                        ${isEditing
                                            ? 'border-mind-cyan bg-white dark:bg-gray-900 dark:text-white focus:ring-2 dark:border-mind-cyan'
                                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300'
                                        }`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1 block">
                                {isEditing ? 'Nueva Contraseña' : 'Contraseña'}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    disabled={!isEditing}
                                    value={password}
                                    placeholder={isEditing ? "Escribe para cambiar" : "••••••••"}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition 
                                        ${isEditing
                                            ? 'border-mind-cyan bg-white dark:bg-gray-900 dark:text-white focus:ring-2 dark:border-mind-cyan'
                                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300'
                                        }`}
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <button type="submit" className="w-full bg-mind-green text-mind-dark font-bold py-3 rounded-xl shadow-md hover:bg-green-400 transition flex justify-center gap-2">
                                <Save size={20} /> GUARDAR CAMBIOS
                            </button>
                        )}
                    </form>
                </div>

                {/* SECCIÓN DE INSIGNIAS */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8 transition-colors">
                    <h3 className="text-xl font-bold text-mind-dark dark:text-white mb-4 flex items-center gap-2">
                        <Award className="text-mind-primary" /> Mis Insignias
                    </h3>

                    {insignias.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center italic">Aún no tienes insignias. ¡Completa niveles!</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-4">
                            {insignias.map((insignia, index) => (
                                <div key={index} className="flex flex-col items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700/50 animate-fade-in">
                                    <div className="text-3xl mb-2">{insignia.icono}</div>
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 text-center">{insignia.nombre}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* BOTÓN CERRAR SESIÓN */}
                <button
                    onClick={handleLogout}
                    className="w-full border-2 border-mind-red text-mind-red font-bold py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition flex justify-center gap-2"
                >
                    <LogOut size={20} /> CERRAR SESIÓN
                </button>

            </div>
        </div>
    );
};

export default ProfilePage;