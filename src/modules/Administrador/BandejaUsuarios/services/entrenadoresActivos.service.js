import axios from "axios";
import { API } from "../../../../constants/api.js";

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4001';  // declaracion de variable de entorno de la API

const getEntrenadoresActivos = async () => {
    const entrenadoresTraidos = await axios.get(`${API}/flextrainer/usuarios/entrenadoresActivos`, { timeout: 500000 });
    const entrenadores = entrenadoresTraidos.data;
    return entrenadores
}

const entrenadoresActivosServices = {
    getEntrenadoresActivos
}

export { entrenadoresActivosServices }