// traer todos los usuarios existentes en la base de datos para el primer renderizado
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4001';  // declaracion de variable de entorno de la API

const getCuerpoZonas = async () => {
    const cuerpoZonasTraidos = await axios.get(`${apiUrl}/flextrainer/cuerpoZonas/`);
    const cuerpoZonas = cuerpoZonasTraidos.data;
    return cuerpoZonas
}

const cuerpoZonasServices = {
    getCuerpoZonas
}

export { cuerpoZonasServices }