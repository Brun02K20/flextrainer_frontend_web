// traer todos los usuarios existentes en la base de datos para el primer renderizado
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4001';  // declaracion de variable de entorno de la API

const getUsers = async () => {
    const usuariosTraidos = await axios.get(`api/flextrainer/usuarios/`);
    const usuarios = usuariosTraidos.data;
    return usuarios
}

const usuariosServices = {
    getUsers
}

export { usuariosServices }