import React from 'react';
import { X, Trophy, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

const CompletionModal = ({ isOpen, onClose, type, message, onAction }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';

    return (
        // 1. EL FONDO OSCURO (OVERLAY)
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">

            {/* 2. LA CAJA DEL MODAL */}
            <div className="bg-white w-full max-w-md rounded-3xl border-4 border-mind-dark shadow-hard relative overflow-hidden text-center">

                {/* Botón de cerrar (X) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-mind-red transition-colors"
                >
                    <X size={28} strokeWidth={2.5} />
                </button>

                <div className="p-8 pt-10">

                    {/* Icono Principal */}
                    <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 border-4 ${isSuccess ? 'bg-green-100 border-green-200 text-green-600' : 'bg-red-100 border-red-200 text-red-600'}`}>
                        {isSuccess ? <Trophy size={48} className="fill-current" /> : <AlertTriangle size={48} />}
                    </div>

                    {/* Título y Mensaje */}
                    <h2 className="text-2xl font-bold text-mind-dark mb-2">
                        {isSuccess ? '¡Nivel Completado!' : '¡Ups! Algo salió mal'}
                    </h2>
                    <p className="text-gray-500 mb-8 font-medium">
                        {message}
                    </p>

                    {/* Botón de Acción */}
                    <button
                        onClick={onAction}
                        className={`w-full font-bold py-3 rounded-xl shadow-hard active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 text-white ${isSuccess ? 'bg-mind-green hover:bg-green-400' : 'bg-mind-red hover:bg-red-500'}`}
                    >
                        {isSuccess ? (
                            <>CONTINUAR <ArrowRight size={20} /></>
                        ) : (
                            <>REINTENTAR <RotateCcw size={20} /></>
                        )}
                    </button>
                </div>

                {/* Decoración inferior */}
                <div className={`h-4 w-full border-t-2 border-mind-dark ${isSuccess ? 'bg-mind-green' : 'bg-mind-red'}`}></div>
            </div>
        </div>
    );
};

export default CompletionModal;
