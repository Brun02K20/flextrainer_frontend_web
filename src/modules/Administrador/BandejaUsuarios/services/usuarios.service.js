// traer todos los usuarios existentes en la base de datos para el primer renderizado
import axios from "axios";
import { API } from "../../../../constants/api.js";

const getUsers = async () => {
    const usuariosTraidos = await axios.get(`${API}/flextrainer/usuarios/`, { timeout: 500000 });
    const usuarios = usuariosTraidos.data;
    return usuarios
}

const usuariosServices = {
    getUsers
}

export { usuariosServices }