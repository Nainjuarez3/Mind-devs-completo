// src/config.js

// Esta lógica detecta si estás en tu compu o en internet
export const API_URL = import.meta.env.PROD
    ? 'https://mind-devs-api.onrender.com'
    : 'http://localhost:3000';