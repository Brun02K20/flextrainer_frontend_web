// traer todos los usuarios existentes en la base de datos para el primer renderizado
import axios from "axios";
import { API } from "../../../../constants/api.js";

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4001';  // declaracion de variable de entorno de la API

const getUsers = async () => {
    const usuariosTraidos = await axios.get(`${API}/flextrainer/usuarios/`, { timeout: 500000 });
    const usuarios = usuariosTraidos.data;
    return usuarios
}

const usuariosServices = {
    getUsers
}

export { usuariosServices }