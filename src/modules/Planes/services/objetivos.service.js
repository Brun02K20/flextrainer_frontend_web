// traer todos los usuarios existentes en la base de datos para el primer renderizado
import axios from "axios";
import { API } from "../../../constants/api.js";

const getObjetivos = async () => {
    const objetivosTraidos = await axios.get(`${API}/flextrainer/objetivos/`, { timeout: 500000 });
    const objetivos = objetivosTraidos.data;
    return objetivos
}

const objetivosServices = {
    getObjetivos
}

export { objetivosServices }