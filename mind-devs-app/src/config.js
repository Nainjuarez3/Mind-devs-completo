// src/config.js

// Esta lógica detecta si estás en tu compu o en internet
export const API_URL = import.meta.env.PROD
    ? 'https://AQUI-IRA-TU-URL-DE-RENDER.onrender.com'
    : 'http://localhost:3000';