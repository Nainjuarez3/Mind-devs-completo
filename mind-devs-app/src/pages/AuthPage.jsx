import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, KeyRound, CheckCircle } from 'lucide-react';

// Recibimos 'initialView'
const AuthPage = ({ navigateTo, initialView = 'login' }) => {
    const [view, setView] = useState(initialView);

    // Si cambia la prop, actualizamos la vista
    useEffect(() => { setView(initialView); }, [initialView]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [code, setCode] = useState(['', '', '', '']);

    // RECUPERACIÓN: Ahora son 3 pasos
    // 1: Correo, 2: Código, 3: Nueva Password
    const [recoveryStep, setRecoveryStep] = useState(1);
    const [newPassword, setNewPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    // --- ESTILOS ---
    const baseInputClass = "w-full py-3 rounded-xl border border-gray-200 outline-none focus:border-mind-primary focus:ring-2 focus:ring-blue-100 transition-all";
    const inputStandardClass = `${baseInputClass} pl-10 pr-4`;
    const inputPasswordClass = `${baseInputClass} pl-10 pr-14`;

    // --- LÓGICA ---

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/login', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) { localStorage.setItem('usuario', JSON.stringify(data)); navigateTo('dashboard'); }
            else { alert("Error: " + data.error); }
        } catch (error) { console.error(error); }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/registro', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: name, email, password }),
            });
            if (res.ok) { alert("Cuenta creada. Revisa tu correo."); setView('verify'); }
            else { const data = await res.json(); alert("Error: " + data.error); }
        } catch (error) { console.error(error); }
    };

    const handleVerifyRegister = async (e) => {
        e.preventDefault();
        const codigoString = code.join('');
        try {
            const res = await fetch('http://localhost:3000/verificar', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, codigo: codigoString })
            });
            if (res.ok) { alert("¡Verificado! Inicia sesión."); setView('login'); }
            else { alert("Código incorrecto"); }
        } catch (error) { console.error(error); }
    };

    // --- LÓGICA DE RECUPERACIÓN PASO A PASO ---

    // PASO 1: Enviar correo
    const solicitarRecuperacion = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/solicitar-recuperacion', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
            });
            if (res.ok) {
                alert("Código enviado.");
                setRecoveryStep(2); // Ir a poner código
                setCode(['', '', '', '']);
            } else { alert("Correo no encontrado"); }
        } catch (error) { console.error(error); }
    };

    // PASO 2: Validar código (Intermedio)
    const validarCodigoRecuperacion = async (e) => {
        e.preventDefault();
        const codigoString = code.join('');
        try {
            const res = await fetch('http://localhost:3000/validar-codigo-recuperacion', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, codigo: codigoString })
            });
            if (res.ok) {
                setRecoveryStep(3); // Ir a poner password
            } else {
                const data = await res.json();
                alert("Error: " + data.error);
            }
        } catch (error) { console.error(error); }
    };

    // PASO 3: Cambiar contraseña final
    const finalizarRecuperacion = async (e) => {
        e.preventDefault();
        const codigoString = code.join('');
        try {
            const res = await fetch('http://localhost:3000/restablecer-password', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, codigo: codigoString, newPassword })
            });
            if (res.ok) {
                alert("¡Contraseña actualizada!");
                setView('login');
                setRecoveryStep(1);
                setPassword('');
            } else { const data = await res.json(); alert("Error: " + data.error); }
        } catch (error) { console.error(error); }
    };

    const handleCodeChange = (element, index) => {
        if (isNaN(element.value)) return;
        const newCode = [...code]; newCode[index] = element.value; setCode(newCode);
        if (element.nextSibling && element.value !== "") { element.nextSibling.focus(); }
    };

    const eyeButtonClass = "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-mind-primary focus:outline-none p-1 cursor-pointer z-10";

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
            {/* LADO IZQUIERDO */}
            <div className="hidden md:flex md:w-1/2 bg-mind-primary items-center justify-center p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-blue-600 opacity-20 transform rotate-12 scale-150"></div>
                <div className="z-10 text-center">
                    <h1 className="text-5xl font-bold mb-4">MIND DEVS</h1>
                    <p className="text-xl opacity-90">Tu camino para dominar el código empieza hoy.</p>
                </div>
            </div>

            {/* LADO DERECHO */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <button onClick={() => navigateTo('landing')} className="text-gray-400 text-sm mb-8 hover:text-mind-primary">← Volver al inicio</button>

                    {/* VISTA LOGIN */}
                    {view === 'login' && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl font-bold text-mind-dark mb-2">Bienvenido</h2>
                            <form onSubmit={handleLogin} className="space-y-4 mt-6">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input type="email" placeholder="Correo" className={inputStandardClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input type={showPassword ? "text" : "password"} placeholder="Contraseña" className={inputPasswordClass} value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={eyeButtonClass}>
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <div className="text-right">
                                    <button type="button" onClick={() => setView('recovery')} className="text-sm text-mind-primary hover:underline">¿Olvidaste tu contraseña?</button>
                                </div>
                                <button type="submit" className="btn-primary">INICIAR SESIÓN</button>
                            </form>
                            <p className="mt-8 text-center text-gray-600">¿No tienes cuenta? <button onClick={() => setView('register')} className="text-mind-primary font-bold hover:underline">Regístrate</button></p>
                        </div>
                    )}

                    {/* VISTA REGISTRO */}
                    {view === 'register' && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl font-bold text-mind-dark mb-2">Crear cuenta</h2>
                            <form onSubmit={handleRegister} className="space-y-4 mt-8">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input type="text" placeholder="Nombre" className={inputStandardClass} value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input type="email" placeholder="Correo" className={inputStandardClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input type={showPassword ? "text" : "password"} placeholder="Crear contraseña" className={inputPasswordClass} value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={eyeButtonClass}>
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <button type="submit" className="btn-cyan">CREAR CUENTA</button>
                            </form>
                            <p className="mt-8 text-center text-gray-600">¿Ya tienes cuenta? <button onClick={() => setView('login')} className="text-mind-primary font-bold hover:underline">Inicia sesión</button></p>
                        </div>
                    )}

                    {/* VISTA VERIFICACIÓN (REGISTRO) */}
                    {view === 'verify' && (
                        <div className="text-center animate-fade-in-up">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600"><Mail size={32} /></div>
                            <h2 className="text-2xl font-bold mb-2">Verifica tu correo</h2>
                            <p className="text-gray-500 mb-6">Código enviado a {email}</p>
                            <form onSubmit={handleVerifyRegister}>
                                <div className="flex justify-center space-x-4 mb-8">
                                    {code.map((data, index) => (
                                        <input key={index} type="text" maxLength="1" className="input-code" value={data} onChange={(e) => handleCodeChange(e.target, index)} onFocus={(e) => e.target.select()} />
                                    ))}
                                </div>
                                <button type="submit" className="btn-green">VERIFICAR Y ENTRAR <ArrowRight className="ml-2" size={20} /></button>
                            </form>
                        </div>
                    )}

                    {/* VISTA RECUPERACIÓN (3 PASOS) */}
                    {view === 'recovery' && (
                        <div className="animate-fade-in-up">
                            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-yellow-600 mx-auto"><KeyRound size={32} /></div>

                            {/* PASO 1: CORREO */}
                            {recoveryStep === 1 && (
                                <>
                                    <h2 className="text-2xl font-bold text-center mb-2">Recuperar Contraseña</h2>
                                    <p className="text-gray-500 text-center mb-6">Te enviaremos un código.</p>
                                    <form onSubmit={solicitarRecuperacion} className="space-y-4">
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                            <input type="email" placeholder="Tu correo registrado" className={inputStandardClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        </div>
                                        <button type="submit" className="btn-primary">ENVIAR CÓDIGO</button>
                                    </form>
                                </>
                            )}

                            {/* PASO 2: SOLO CÓDIGO */}
                            {recoveryStep === 2 && (
                                <>
                                    <h2 className="text-2xl font-bold text-center mb-2">Ingresa el Código</h2>
                                    <p className="text-gray-500 text-center mb-6">Código enviado a {email}</p>
                                    <form onSubmit={validarCodigoRecuperacion} className="space-y-4">
                                        <div className="flex justify-center space-x-3 mb-4">
                                            {code.map((data, index) => (
                                                <input key={index} type="text" maxLength="1" className="input-code" value={data} onChange={(e) => handleCodeChange(e.target, index)} onFocus={(e) => e.target.select()} />
                                            ))}
                                        </div>
                                        <button type="submit" className="btn-primary">VERIFICAR CÓDIGO</button>
                                    </form>
                                </>
                            )}

                            {/* PASO 3: NUEVA CONTRASEÑA */}
                            {recoveryStep === 3 && (
                                <>
                                    <h2 className="text-2xl font-bold text-center mb-2">Nueva Contraseña</h2>
                                    <p className="text-gray-500 text-center mb-6">Código verificado. Crea una nueva.</p>
                                    <form onSubmit={finalizarRecuperacion} className="space-y-4">
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Nueva contraseña"
                                                className={inputPasswordClass}
                                                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className={eyeButtonClass}>
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        <button type="submit" className="btn-green">CAMBIAR CONTRASEÑA</button>
                                    </form>
                                </>
                            )}

                            <button onClick={() => { setView('login'); setRecoveryStep(1); }} className="block w-full text-center mt-6 text-gray-400 hover:text-mind-primary">Cancelar y volver</button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .btn-primary { width: 100%; background-color: #3b82f6; color: white; font-weight: bold; padding: 12px; border-radius: 0.75rem; box-shadow: 4px 4px 0px 0px rgba(0,0,0,0.8); transition: all 0.2s; }
        .btn-cyan { width: 100%; background-color: #06b6d4; color: white; font-weight: bold; padding: 12px; border-radius: 0.75rem; box-shadow: 4px 4px 0px 0px rgba(0,0,0,0.8); transition: all 0.2s; }
        .btn-green { width: 100%; background-color: #86efac; color: #1f2937; font-weight: bold; padding: 12px; border-radius: 0.75rem; box-shadow: 4px 4px 0px 0px rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; transition: all 0.2s; }
        .btn-primary:active, .btn-cyan:active, .btn-green:active { transform: translateY(2px); box-shadow: none; }
        .input-code { width: 3.5rem; height: 3.5rem; border: 2px solid #e5e7eb; border-radius: 0.75rem; text-align: center; font-size: 1.5rem; font-weight: bold; outline: none; transition: all 0.2s; }
        .input-code:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px #dbeafe; }
      `}</style>
        </div>
    );
};

export default AuthPage;