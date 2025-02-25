import axios from "axios";
import { API } from "../../../../constants/api.js";

const getEntrenadoresActivos = async () => {
    const entrenadoresTraidos = await axios.get(`${API}/flextrainer/usuarios/entrenadoresActivos`, { timeout: 500000 });
    const entrenadores = entrenadoresTraidos.data;
    return entrenadores
}

const entrenadoresActivosServices = {
    getEntrenadoresActivos
}

export { entrenadoresActivosServices }