const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Importamos la conexión
const nodemailer = require('nodemailer');

// Configuración del correo
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // IMPORTANTE: debe ser false para el puerto 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // Esto ayuda si Render tiene problemas con los certificados de seguridad
    tls: {
        rejectUnauthorized: false
    }
});

const app = express();
const port = process.env.PORT || 3000;

// Middlewares (Configuración)
app.use(cors()); // Permite conexiones desde React
app.use(express.json()); // Permite recibir datos JSON

// RUTA DE PRUEBA: Para ver si funciona
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()'); // Pregunta la hora a la BD
        res.json({ mensaje: 'Backend funcionando 🚀', hora_servidor: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
});

// Función auxiliar para calcular recarga
const calcularEnergia = async (usuario) => {
    if (usuario.energia >= 5) return usuario.energia; // Ya está llena

    const ahora = new Date();
    const ultima = new Date(usuario.ultima_recarga);
    const diferenciaMs = ahora - ultima;
    const minutosPasados = Math.floor(diferenciaMs / 60000);

    // REGLA: 1 energía cada 5 minutos
    if (minutosPasados >= 5) {
        const energiaRecuperada = Math.floor(minutosPasados / 5);
        let nuevaEnergia = usuario.energia + energiaRecuperada;
        if (nuevaEnergia > 5) nuevaEnergia = 5;

        // Actualizamos en BD
        await pool.query(
            'UPDATE usuarios SET energia = $1, ultima_recarga = NOW() WHERE id = $2',
            [nuevaEnergia, usuario.id]
        );
        return nuevaEnergia;
    }
    return usuario.energia;
};

// RUTA DE REGISTRO
app.post('/registro', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // 1. Validar que no exista el usuario
        const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Generar código de 4 dígitos
        const codigo = Math.floor(1000 + Math.random() * 9000).toString();
        // Expiración en 10 minutos
        const expiracion = new Date(Date.now() + 10 * 60000);

        // Guardar usuario con verificado = false
        // NOTA: Asegúrate de que las columnas verificado, codigo_verificacion, codigo_expiracion existan en tu tabla usuarios
        const nuevoUsuario = await pool.query(
            'INSERT INTO usuarios (nombre, email, password, verificado, codigo_verificacion, codigo_expiracion) VALUES ($1, $2, $3, false, $4, $5) RETURNING *',
            [nombre, email, password, codigo, expiracion]
        );

        // Enviar correo
        const mailOptions = {
            from: 'MIND DEVS <tu_correo@gmail.com>',
            to: email,
            subject: 'Tu código de verificación',
            text: `Hola ${nombre}, tu código es: ${codigo}. Expira en 10 minutos.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log(error);
            else console.log('Email enviado: ' + info.response);
        });

        res.json({ message: "Usuario creado, verifica tu correo" });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error al registrar usuario');
    }
});

// RUTA VERIFICAR CÓDIGO
app.post('/verificar', async (req, res) => {
    try {
        const { email, codigo } = req.body;

        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const usuario = result.rows[0];

        if (!usuario) return res.status(400).json({ error: "Usuario no existe" });

        // Validar código
        if (usuario.codigo_verificacion !== codigo) {
            return res.status(400).json({ error: "Código incorrecto" });
        }

        // Validar tiempo
        if (new Date() > new Date(usuario.codigo_expiracion)) {
            return res.status(400).json({ error: "El código ha expirado" });
        }

        // Activar usuario
        await pool.query('UPDATE usuarios SET verificado = true WHERE email = $1', [email]);

        res.json({ success: true, message: "Cuenta verificada" });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error verificando código');
    }
});

// RUTA DE LOGIN
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar si el usuario existe por su email
        const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (resultado.rows.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        const usuario = resultado.rows[0];

        // 2. Verificar contraseña (OJO: En el futuro usaremos encriptación, por ahora comparamos texto plano)
        if (password !== usuario.password) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // 3. Antes de responder, calculamos si recuperó energía
        const energiaReal = await calcularEnergia(usuario);
        usuario.energia = energiaReal; // Actualizamos el objeto

        // 4. Si todo coincide, enviamos los datos del usuario (sin la contraseña por seguridad)
        res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            energia: usuario.energia,
            nivel: usuario.nivel,
            monedas: usuario.monedas
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error al iniciar sesión');
    }
});

// RUTA PARA ACTUALIZAR PERFIL
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, password } = req.body;

        // Actualizamos solo nombre y contraseña
        const resultado = await pool.query(
            'UPDATE usuarios SET nombre = $1, password = $2 WHERE id = $3 RETURNING *',
            [nombre, password, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuarioActualizado = resultado.rows[0];

        // Devolvemos los datos nuevos (sin la pass)
        res.json({
            id: usuarioActualizado.id,
            nombre: usuarioActualizado.nombre,
            email: usuarioActualizado.email,
            energia: usuarioActualizado.energia,
            nivel: usuarioActualizado.nivel
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar');
    }
});


// RUTA PARA OBTENER UNA LECCIÓN COMPLETA (Por curso y nivel)
app.get('/lecciones/:curso/:nivel', async (req, res) => {
    try {
        const { curso, nivel } = req.params;

        // 1. Buscar la lección
        const leccionResult = await pool.query(
            'SELECT * FROM lecciones WHERE curso = $1 AND nivel = $2',
            [curso, nivel]
        );

        if (leccionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Lección no encontrada' });
        }

        const leccion = leccionResult.rows[0];

        // 2. Buscar los ejercicios de esa lección
        const ejerciciosResult = await pool.query(
            'SELECT * FROM ejercicios WHERE leccion_id = $1',
            [leccion.id]
        );

        // 3. Devolver todo junto
        res.json({
            ...leccion,
            ejercicios: ejerciciosResult.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener lección');
    }
});

// 1. OBTENER PROGRESO (Para pintar el mapa)
app.get('/progreso/:usuario_id/:curso', async (req, res) => {
    try {
        const { usuario_id, curso } = req.params;

        const resultado = await pool.query(
            'SELECT nivel_actual FROM progreso WHERE usuario_id = $1 AND curso = $2',
            [usuario_id, curso]
        );

        if (resultado.rows.length === 0) {
            // Si no ha jugado nunca, asumimos Nivel 1
            return res.json({ nivel_actual: 1 });
        }

        res.json(resultado.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error obteniendo progreso');
    }
});

// 2. ACTUALIZAR PROGRESO (Cuando gana un nivel)
app.post('/progreso', async (req, res) => {
    try {
        const { usuario_id, curso, nivel_ganado, errores } = req.body;

        // REGLA 1: Si tuvo errores, NO desbloquea el siguiente nivel
        if (errores > 0) {
            return res.json({
                aprobado: false,
                mensaje: "Tienes errores, inténtalo de nuevo."
            });
        }

        // REGLA 2: Verificar si ya había pasado este nivel antes (para las monedas)
        const check = await pool.query(
            'SELECT nivel_actual FROM progreso WHERE usuario_id = $1 AND curso = $2',
            [usuario_id, curso]
        );

        let monedasGanadas = 0;
        let yaEstabaCompletado = false;

        if (check.rows.length > 0) {
            // Si el nivel que ganó es MENOR al nivel actual, es que está repitiendo
            if (nivel_ganado < check.rows[0].nivel_actual) {
                yaEstabaCompletado = true;
            }
        }

        // Lógica de recompensa
        if (!yaEstabaCompletado) {
            monedasGanadas = 20; // Recompensa completa
            // Sumamos monedas en BD
            await pool.query('UPDATE usuarios SET monedas = COALESCE(monedas, 0) + $1 WHERE id = $2', [monedasGanadas, usuario_id]);
        } else {
            monedasGanadas = 0;
        }

        // REGLA 3: Desbloquear siguiente nivel (Solo si es nuevo record)
        if (!yaEstabaCompletado) {
            if (check.rows.length === 0) {
                await pool.query('INSERT INTO progreso (usuario_id, curso, nivel_actual) VALUES ($1, $2, $3)', [usuario_id, curso, nivel_ganado + 1]);
            } else {
                await pool.query('UPDATE progreso SET nivel_actual = $1 WHERE usuario_id = $2 AND curso = $3', [nivel_ganado + 1, usuario_id, curso]);
            }

            // CHEQUEO INSIGNIA: Primeros Pasos (Si completó nivel 1)
            if (nivel_ganado === 1) {
                // Verificamos si ya la tiene
                const checkBadge = await pool.query('SELECT * FROM usuario_insignias WHERE usuario_id = $1 AND insignia_id = 1', [usuario_id]);
                if (checkBadge.rows.length === 0) {
                    await pool.query('INSERT INTO usuario_insignias (usuario_id, insignia_id) VALUES ($1, 1)', [usuario_id]);
                    // Podrías devolver un flag en la respuesta para que el frontend muestre una animación
                }
            }
        }

        // 2. NUEVO: INSIGNIA Perfeccionista (ID 2) - Si completó con 0 errores
        if (errores === 0) {
            const checkBadge = await pool.query('SELECT * FROM usuario_insignias WHERE usuario_id = $1 AND insignia_id = 2', [usuario_id]);
            if (checkBadge.rows.length === 0) {
                await pool.query('INSERT INTO usuario_insignias (usuario_id, insignia_id) VALUES ($1, 2)', [usuario_id]);
                console.log(`🏅 Insignia Perfeccionista otorgada a ${usuario_id}`);
            }
        }

        res.json({
            aprobado: true,
            monedas_ganadas: monedasGanadas
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error guardando progreso');
    }
});

// ACTUALIZAR ENERGÍA (Restar o Sumar)
app.post('/usuarios/:id/energia', async (req, res) => {
    try {
        const { id } = req.params;
        const { cambio } = req.body; // Puede ser -1 o +5

        // 1. Obtener energía actual
        const userRes = await pool.query('SELECT energia FROM usuarios WHERE id = $1', [id]);
        let nuevaEnergia = userRes.rows[0].energia + cambio;

        // Límites: No menos de 0, no más de 5
        if (nuevaEnergia < 0) nuevaEnergia = 0;
        if (nuevaEnergia > 5) nuevaEnergia = 5;

        // 2. Actualizar
        await pool.query('UPDATE usuarios SET energia = $1 WHERE id = $2', [nuevaEnergia, id]);

        res.json({ energia: nuevaEnergia });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error actualizando energía');
    }
});

// SUMAR MONEDAS (Al ganar nivel)
app.post('/usuarios/:id/monedas', async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        await pool.query('UPDATE usuarios SET monedas = COALESCE(monedas, 0) + $1 WHERE id = $2', [cantidad, id]);

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error sumando monedas');
    }
});

// RUTA PARA COMPRAR ENERGÍA
app.post('/tienda/comprar', async (req, res) => {
    try {
        const { usuario_id, item } = req.body;

        // Definimos los precios aquí (Backend es la autoridad)
        const precios = {
            'recarga_1': { costo: 10, energia: 1 },
            'recarga_full': { costo: 40, energia: 5 }
        };

        const producto = precios[item];
        if (!producto) return res.status(400).json({ error: "Producto no válido" });

        // 1. Obtener usuario actual
        const userRes = await pool.query('SELECT monedas, energia FROM usuarios WHERE id = $1', [usuario_id]);
        const usuario = userRes.rows[0];

        // 2. Validaciones
        if (usuario.monedas < producto.costo) {
            return res.status(400).json({ error: "No tienes suficientes monedas" });
        }
        if (usuario.energia >= 5) {
            return res.status(400).json({ error: "Tu energía ya está llena" });
        }

        // 3. Calcular nueva energía (sin pasar de 5)
        let nuevaEnergia = usuario.energia + producto.energia;
        if (nuevaEnergia > 5) nuevaEnergia = 5;

        // 4. Ejecutar la compra (Restar monedas, Sumar energía)
        const updateRes = await pool.query(
            'UPDATE usuarios SET monedas = monedas - $1, energia = $2 WHERE id = $3 RETURNING monedas, energia',
            [producto.costo, nuevaEnergia, usuario_id]
        );

        res.json({
            success: true,
            monedas: updateRes.rows[0].monedas,
            energia: updateRes.rows[0].energia,
            message: "¡Compra realizada!"
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error en la compra');
    }
});

// OBTENER INSIGNIAS DE UN USUARIO
app.get('/usuarios/:id/insignias', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query(`
            SELECT i.nombre, i.icono, i.descripcion 
            FROM usuario_insignias ui
            JOIN insignias i ON ui.insignia_id = i.id
            WHERE ui.usuario_id = $1
        `, [id]);
        res.json(resultado.rows);
    } catch (err) {
        res.status(500).send('Error obteniendo insignias');
    }
});

// ...

// RUTA PARA EL FORMULARIO DE AYUDA (CONTACTO)
app.post('/contacto', async (req, res) => {
    try {
        const { email, message } = req.body;

        // Validar que lleguen datos
        if (!email || !message) {
            return res.status(400).json({ error: "Faltan datos" });
        }

        // Configurar el correo que TE llegará a TI (Admin)
        const mailOptions = {
            from: `"Soporte MIND DEVS" <${process.env.EMAIL_USER}>`, // Quien envía (el sistema)
            to: process.env.EMAIL_USER, // A QUIEN LE LLEGA
            replyTo: email,
            subject: `📢 Nueva Ayuda/Soporte de: ${email}`,
            text: `Has recibido un nuevo mensaje desde el Help Modal:\n\nUsuario: ${email}\n\nMensaje:\n${message}`
        };

        // Enviar
        await transporter.sendMail(mailOptions);

        console.log(`📩 Soporte enviado de ${email}`);
        res.json({ success: true, message: "Mensaje enviado a soporte" });

    } catch (err) {
        console.error("Error enviando correo de soporte:", err);
        res.status(500).send('Error al enviar mensaje');
    }
});

// ...

// 1. SOLICITAR RECUPERACIÓN (Envía el código)
app.post('/solicitar-recuperacion', async (req, res) => {
    try {
        const { email } = req.body;

        // Verificar si existe el usuario
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            // Por seguridad, no decimos si existe o no, pero aquí para desarrollo retornamos error
            return res.status(404).json({ error: "Correo no registrado" });
        }

        // Generar código
        const codigo = Math.floor(1000 + Math.random() * 9000).toString();
        const expiracion = new Date(Date.now() + 10 * 60000); // 10 minutos

        // Guardar código en el usuario existente
        await pool.query(
            'UPDATE usuarios SET codigo_verificacion = $1, codigo_expiracion = $2 WHERE email = $3',
            [codigo, expiracion, email]
        );

        // Enviar correo
        const mailOptions = {
            from: '"Seguridad MIND DEVS" <nainjuarez8@gmail.com>',
            to: email,
            subject: 'Recuperar Contraseña',
            text: `Tu código para restablecer contraseña es: ${codigo}. Expira en 10 min.`
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Código enviado" });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error al solicitar recuperación');
    }
});

// 2. CAMBIAR CONTRASEÑA (Verifica código y actualiza)
app.post('/restablecer-password', async (req, res) => {
    try {
        const { email, codigo, newPassword } = req.body;

        // Buscar usuario y validar código
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const usuario = result.rows[0];

        if (!usuario) return res.status(400).json({ error: "Usuario no válido" });
        if (usuario.codigo_verificacion !== codigo) return res.status(400).json({ error: "Código incorrecto" });
        if (new Date() > new Date(usuario.codigo_expiracion)) return res.status(400).json({ error: "Código expirado" });

        // Actualizar contraseña y limpiar código para que no se pueda reusar
        await pool.query(
            'UPDATE usuarios SET password = $1, codigo_verificacion = NULL WHERE email = $2',
            [newPassword, email]
        );

        res.json({ success: true, message: "Contraseña actualizada" });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error al restablecer');
    }
});

// VALIDAR CÓDIGO (Paso intermedio de recuperación)
app.post('/validar-codigo-recuperacion', async (req, res) => {
    try {
        const { email, codigo } = req.body;

        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const usuario = result.rows[0];

        if (!usuario) return res.status(400).json({ error: "Usuario no encontrado" });
        if (usuario.codigo_verificacion !== codigo) return res.status(400).json({ error: "Código incorrecto" });
        if (new Date() > new Date(usuario.codigo_expiracion)) return res.status(400).json({ error: "Código expirado" });

        res.json({ success: true, message: "Código válido" });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error de validación');
    }
});

// Arrancar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});