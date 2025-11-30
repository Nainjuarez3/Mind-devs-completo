import React, { useState } from 'react';
import { X, Send, MessageSquare, Loader } from 'lucide-react'; // Agregamos Loader

const HelpModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Nuevo estado de carga

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Activamos carga

        try {
            // CONEXIÓN CON EL BACKEND
            const response = await fetch('http://localhost:3000/contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, message })
            });

            if (response.ok) {
                setIsSent(true);
                // Limpiamos y cerramos después de 2.5 segundos
                setTimeout(() => {
                    setIsSent(false);
                    setEmail('');
                    setMessage('');
                    setIsLoading(false);
                    onClose();
                }, 2500);
            } else {
                alert("Hubo un error al enviar tu mensaje. Intenta más tarde.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor.");
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">

            <div className="bg-white w-full max-w-lg rounded-3xl border-4 border-mind-dark shadow-hard relative overflow-hidden">

                {/* Botón Cerrar (Deshabilitado si está cargando para evitar errores) */}
                <button
                    onClick={!isLoading ? onClose : undefined}
                    className={`absolute top-4 right-4 transition-colors ${isLoading ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-mind-red'}`}
                >
                    <X size={32} strokeWidth={2.5} />
                </button>

                <div className="p-8">

                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-mind-cyan p-3 rounded-full text-white border-2 border-mind-dark">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-mind-dark">¿Necesitas ayuda?</h2>
                            <p className="text-gray-500 text-sm">Cuéntanos tu problema o sugerencia.</p>
                        </div>
                    </div>

                    {isSent ? (
                        <div className="bg-green-100 text-green-700 p-8 rounded-xl text-center font-bold border-2 border-green-200 animate-bounce flex flex-col items-center">
                            <div className="text-4xl mb-2">📨</div>
                            ¡Mensaje enviado correctamente! <br />
                            <span className="text-sm font-normal text-green-800 mt-2">Te responderemos pronto.</span>
                        </div>
                    ) : (

                        /* FORMULARIO */
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-mind-dark mb-1">Tu Correo</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="ejemplo@correo.com"
                                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-mind-primary focus:ring-0 outline-none transition-colors bg-gray-50"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-mind-dark mb-1">Mensaje</label>
                                <textarea
                                    required
                                    rows="4"
                                    placeholder="Describe tu problema aquí..."
                                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-mind-primary focus:ring-0 outline-none transition-colors bg-gray-50 resize-none"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    disabled={isLoading}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`
                  w-full font-bold py-3 rounded-xl shadow-hard transition-all flex items-center justify-center gap-2
                  ${isLoading
                                        ? 'bg-gray-300 text-gray-500 cursor-wait shadow-none translate-y-1'
                                        : 'bg-mind-primary hover:bg-blue-600 text-white active:translate-y-1 active:shadow-none'}
                `}
                            >
                                {isLoading ? (
                                    <><Loader size={20} className="animate-spin" /> ENVIANDO...</>
                                ) : (
                                    <><Send size={20} /> ENVIAR MENSAJE</>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <div className="h-4 bg-mind-cyan w-full border-t-2 border-mind-dark"></div>
            </div>
        </div>
    );
};

export default HelpModal;