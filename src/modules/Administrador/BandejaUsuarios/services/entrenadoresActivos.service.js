import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4001';  // declaracion de variable de entorno de la API

const getEntrenadoresActivos = async () => {
    const entrenadoresTraidos = await axios.get(`api/flextrainer/usuarios/entrenadoresActivos`);
    const entrenadores = entrenadoresTraidos.data;
    return entrenadores
}

const entrenadoresActivosServices = {
    getEntrenadoresActivos
}

export { entrenadoresActivosServices }