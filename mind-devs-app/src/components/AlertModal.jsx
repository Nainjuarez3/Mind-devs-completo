import React from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const AlertModal = ({ isOpen, onClose, type = 'info', title, message }) => {
    if (!isOpen) return null;

    let Icon = Info;
    let colorClass = 'bg-blue-100 border-blue-200 text-blue-600';
    let btnClass = 'bg-blue-500 hover:bg-blue-600';
    let decorationClass = 'bg-blue-500';

    if (type === 'success') {
        Icon = CheckCircle;
        colorClass = 'bg-green-100 border-green-200 text-green-600';
        btnClass = 'bg-green-500 hover:bg-green-600';
        decorationClass = 'bg-green-500';
    } else if (type === 'error') {
        Icon = AlertTriangle;
        colorClass = 'bg-red-100 border-red-200 text-red-600';
        btnClass = 'bg-red-500 hover:bg-red-600';
        decorationClass = 'bg-red-500';
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] relative overflow-hidden text-center">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={28} strokeWidth={2.5} />
                </button>

                <div className="p-8 pt-10">
                    <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 border-4 ${colorClass}`}>
                        <Icon size={40} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {title}
                    </h2>
                    <p className="text-gray-500 mb-8 font-medium">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className={`w-full font-bold py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:translate-y-1 active:shadow-none transition-all text-white ${btnClass}`}
                    >
                        ENTENDIDO
                    </button>
                </div>

                <div className={`h-4 w-full border-t-2 border-gray-800 ${decorationClass}`}></div>
            </div>
        </div>
    );
};

export default AlertModal;
