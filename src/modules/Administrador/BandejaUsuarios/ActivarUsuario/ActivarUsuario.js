import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import { Card, Modal } from 'react-bootstrap';

import './ActivarUsuario.css';

const ActivarUsuario = ({ showModalActivarUsuario, handleCloseActivarUsuario, setSelectedUser, setIsUserSelected, selectedUser, traerUsuarios, handleClean }) => {
    const { handleSubmit, control, formState: { errors }, setValue } = useForm();

    useEffect(() => {
        console.log("datos user a activar: ", selectedUser)
    }, [selectedUser])

    // gestion del modal que el usuario se reactivo correctamente
    const [showModalActivado, setShowModalActivado] = useState(false);
    const handleCloseModalActivado = () => setShowModalActivado(false);
    const handleShowModalActivado = () => setShowModalActivado(true);

    const onSubmit = async (data) => {
        data.dni = selectedUser.dni;
        console.log(data);
        await axios.put(`http://localhost:4001/flextrainer/usuarios/usuario/activate/${data.dni}`);
        setSelectedUser({});
        setIsUserSelected(false);
        handleCloseActivarUsuario();
        traerUsuarios();
        handleShowModalActivado();
    }



    return (
        <>
            <Modal show={showModalActivarUsuario} onHide={() => { handleCloseActivarUsuario(); handleClean() }}>
                <Modal.Header closeButton className='activateUser-modal-header'>
                    <Modal.Title className='activateUser-modal-title'>Activar Usuario</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div className='text-center'>
                                <span className='activateUser-alertText'>¿Estás seguro de que querés reactivar al usuario?</span>
                                <span className='activateUser-alertText'>{selectedUser?.nombre} {selectedUser?.apellido}</span>
                                <br></br>
                                <br></br>
                                <br></br>
                                <span>Todos los datos del usuario van a ser reactivados</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={() => { handleCloseActivarUsuario(); handleClean() }}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={handleSubmit(onSubmit)}>
                        Activar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL que se va a mostrar SOLO despues de que el usuario haya pulsado ACTIVAR
            en el primer modal, el cual simplemente muestra un mensaje */}
            <Modal show={showModalActivado} onHide={() => { handleCloseModalActivado(); }}>
                <Modal.Header closeButton className='activateUser-modal-header'>
                    <Modal.Title className='activateUser-modal-title'>Activar Usuario</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div className='text-center'>
                                <span>Activaste al usuario correctamente.</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="success" onClick={() => { handleCloseModalActivado(); handleClean() }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export { ActivarUsuario }
