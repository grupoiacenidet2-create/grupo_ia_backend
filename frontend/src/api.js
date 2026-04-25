import axios from 'axios';

// Usamos la variable de entorno que configuramos en Vercel.
// Si no existe (estás en local), usa la de localhost por defecto.
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL 
        ? `${process.env.REACT_APP_API_URL}/api/` 
        : 'http://127.0.0.1:8000/api/'
});

export default API;