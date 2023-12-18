// traer todos los usuarios existentes en la base de datos para el primer renderizado
import axios from "axios";
import { API } from "../../../constants/api.js";

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4001';  // declaracion de variable de entorno de la API

const getCuerpoZonas = async () => {
    const cuerpoZonasTraidos = await axios.get(`${API}/flextrainer/cuerpoZonas/`, { timeout: 500000 });
    const cuerpoZonas = cuerpoZonasTraidos.data;
    return cuerpoZonas
}

const cuerpoZonasServices = {
    getCuerpoZonas
}

export { cuerpoZonasServices }