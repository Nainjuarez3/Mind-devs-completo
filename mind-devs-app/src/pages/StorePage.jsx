import React, { useState } from 'react';
import { ShoppingCart, Zap, Coins, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config'; // Asegúrate de importar esto si ya lo usas

const StorePage = ({ navigateTo }) => {
    const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario')));
    const [loading, setLoading] = useState(false);

    const comprarItem = async (itemKey) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/tienda/comprar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: usuario.id, item: itemKey })
            });

            const data = await res.json();

            if (res.ok) {
                const usuarioActualizado = { ...usuario, monedas: data.monedas, energia: data.energia };
                setUsuario(usuarioActualizado);
                localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
                alert(data.message);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        // AGREGADO: dark:bg-gray-900
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">

            {/* HEADER: dark:bg-gray-800 dark:border-gray-700 */}
            <div className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center justify-between sticky top-0 z-10 border-b border-transparent dark:border-gray-700 transition-colors">
                <button onClick={() => navigateTo('dashboard')} className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-mind-dark dark:text-white flex items-center gap-2">
                    <ShoppingCart className="text-mind-primary" /> Tienda
                </h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center text-yellow-600 dark:text-yellow-400 font-bold bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
                        <Coins size={18} className="mr-2 fill-current" /> {usuario.monedas || 0}
                    </div>
                    <div className="flex items-center text-mind-red dark:text-red-400 font-bold bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full">
                        <Zap size={18} className="mr-2 fill-current" /> {usuario.energia}/5
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-6">
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-6">Recargar Energía</h2>

                <div className="grid md:grid-cols-2 gap-6">

                    {/* TARJETA 1: dark:bg-gray-800 dark:border-gray-700 */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-hard border-2 border-gray-100 dark:border-gray-700 flex flex-col items-center text-center transition-colors">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-mind-primary">
                            <Zap size={40} className="fill-current" />
                        </div>
                        <h3 className="text-xl font-bold text-mind-dark dark:text-white">+1 Energía</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Ideal para seguir la racha.</p>

                        <button
                            onClick={() => comprarItem('recarga_1')}
                            disabled={loading || usuario.energia >= 5}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 rounded-xl shadow-sm active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Coins size={20} /> 10 Monedas
                        </button>
                    </div>

                    {/* TARJETA 2 */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-hard border-2 border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative overflow-hidden transition-colors">
                        <div className="absolute top-0 right-0 bg-mind-green text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                            MEJOR VALOR
                        </div>
                        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-mind-green">
                            <div className="flex">
                                <Zap size={24} className="fill-current" />
                                <Zap size={24} className="fill-current -ml-2" />
                                <Zap size={24} className="fill-current -ml-2" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-mind-dark dark:text-white">Recarga Total</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Llena tu barra al máximo.</p>

                        <button
                            onClick={() => comprarItem('recarga_full')}
                            disabled={loading || usuario.energia >= 5}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 rounded-xl shadow-sm active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Coins size={20} /> 40 Monedas
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StorePage;