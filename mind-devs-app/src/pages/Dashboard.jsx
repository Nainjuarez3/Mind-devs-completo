import React from 'react';
import Navbar from '../components/Navbar';

const Dashboard = ({ navigateTo, onSelectCourse }) => {

    // Componente interno para las tarjetas (Cards)
    const CourseCard = ({ title, subtitle, icon, color, onClick, disabled }) => (
        <div
            onClick={!disabled ? onClick : undefined}
            className={`
        relative p-6 rounded-2xl border-2 transition-all duration-300 group select-none
        ${disabled
                    ? 'border-gray-200 bg-gray-100 opacity-70 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700'
                    : 'bg-white border-gray-200 hover:border-mind-primary hover:shadow-lg cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:hover:border-mind-primary'}
      `}
        >
            <div className="flex items-center justify-between mb-4">
                {/* Icono del curso */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color} text-white shadow-md`}>
                    {icon}
                </div>

                {/* Botón fantasma "Jugar" */}
                {!disabled && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-mind-primary font-bold text-sm">
                        JUGAR →
                    </div>
                )}
            </div>

            {/* Títulos */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors font-sans">

            {/* 1. BARRA DE NAVEGACIÓN REUTILIZABLE */}
            <Navbar navigateTo={navigateTo} />

            {/* 2. CONTENIDO PRINCIPAL */}
            <main className="max-w-5xl mx-auto px-6 py-10">

                {/* Encabezado de sección */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        ¿Qué quieres aprender hoy?
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Selecciona un curso para continuar tu racha de aprendizaje.
                    </p>
                </div>

                {/* Rejilla de Cursos */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Curso 1: Lógica */}
                    <CourseCard
                        title="Lógica de Programación"
                        subtitle="Domina los fundamentos del pensamiento lógico."
                        icon="🧠"
                        color="bg-mind-green"
                        onClick={() => onSelectCourse('logic')}
                    />

                    {/* Curso 2: Python */}
                    <CourseCard
                        title="Python Básico"
                        subtitle="Aprende la sintaxis del lenguaje más popular."
                        icon="🐍"
                        color="bg-mind-cyan"
                        onClick={() => onSelectCourse('python')}
                    />

                    {/* Curso 3: C (Deshabilitado) */}
                    <CourseCard
                        title="Lenguaje C"
                        subtitle="Próximamente disponible."
                        icon="🇨"
                        color="bg-gray-400"
                        disabled={true}
                    />

                    {/* Curso 4: Java (Deshabilitado) */}
                    <CourseCard
                        title="Java"
                        subtitle="Próximamente disponible."
                        icon="☕"
                        color="bg-gray-400"
                        disabled={true}
                    />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;