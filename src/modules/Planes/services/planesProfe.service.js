// traer todos los planes de un profe existentes y activos en la base de datos para el primer renderizado
import axios from "axios";
import { API } from "../../../constants/api.js";

const getPlanes = async (dniProfe) => {
    const planesTraidos = await axios.get(`${API}/flextrainer/planes/byProfesor/${dniProfe}`, { timeout: 500000 });
    const planes = planesTraidos.data;
    return planes
}

const planesProfeServices = {
    getPlanes
}

export { planesProfeServices }