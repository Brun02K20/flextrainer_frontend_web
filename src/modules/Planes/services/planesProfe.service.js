// traer todos los planes de un profe existentes y activos en la base de datos para el primer renderizado
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4001';  // declaracion de variable de entorno de la API

const getPlanes = async (dniProfe) => {
    const planesTraidos = await axios.get(`api/flextrainer/planes/byProfesor/${dniProfe}`);
    const planes = planesTraidos.data;
    return planes
}

const planesProfeServices = {
    getPlanes
}

export { planesProfeServices }