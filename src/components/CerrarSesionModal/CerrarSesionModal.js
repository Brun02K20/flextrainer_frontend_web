import React from 'react'; // importando React y funcionalidades nativas del mismo
import { useNavigate } from 'react-router-dom'; // importando funcion de navegacion entre componentes
import Modal from 'react-bootstrap/Modal'; // importando el componente Modal de react-bootstrap
import Button from 'react-bootstrap/Button'; // importando el componente Button de react-bootstrap
import Card from 'react-bootstrap/Card';// importando el componente Card de react-bootstrap
import './CerrarSesionModal.css'; // importando los estilos CSS asociados a este componente

// declarando el compoennte y explicitando las props que este recibira
const CerrarSesionModal = ({ show, handleClose, setUsuarioEnSesion }) => {
    const navigate = useNavigate(); // declarando la funcion de navegacion

    // funcion que se ejecutara si el usuario hace click en cerrar sesion,
    // NOTA: setearemos el usuarioEnSesion como un {} en esta funcion, indicando que el usuario ya no esta logueado en la app
    const cerrarSesion = () => {
        setUsuarioEnSesion({}); // indicando que el usuario que usa la app ya no esta logueado
        handleClose(); // cerrando el modal de Cerrar Sesion
        navigate('/'); // redirigiendo al Home, donde el usuario no esta logueado
    };

    return (
        // misma explicacion de declaracion de Modal que en LoginModal.js, al igual que el header de este modal
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className='closeSesion-modal-header'>
                <Modal.Title className='closeSesion-modal-title'>Cerrar sesión</Modal.Title>
            </Modal.Header>

            {/* Body del modal, que simplemenmte sera un texto */}
            <div className='text-center'>
                <Card>
                    <Card.Body>¿Estás seguro de que querés cerrar sesión?</Card.Body>
                </Card>
            </div>

            {/* misma explicacion que el Footer del modal de Login */}
            <Modal.Footer>
                <Button style={{ backgroundColor: 'grey', border: 'none' }} onClick={handleClose}>
                    Cancelar
                </Button>
                <Button style={{ backgroundColor: 'darkred', border: 'none' }} onClick={cerrarSesion}>
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export { CerrarSesionModal };