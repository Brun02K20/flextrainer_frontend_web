import React, { useState, useEffect } from 'react'; // importo funcionalidades react necesarias
import { useForm } from 'react-hook-form'; // importo el hook de useForm para la gestion de formularios
// importo componentes bootstrp necesarios
import Button from 'react-bootstrap/Button';
import { Card, Modal } from 'react-bootstrap';
import axios from 'axios'; // importo axios para llevar a cabo las peticiones necesarias
import './ActivarUsuario.css'; // importo los estilos asociados a esta pantalla

const ActivarUsuario = ({ showModalActivarUsuario, handleCloseActivarUsuario, setSelectedUser, setIsUserSelected, selectedUser, traerUsuarios, handleClean }) => {
    const { handleSubmit } = useForm(); // funcionalidades y propiedades necesarias para la gestion del formulario

    // muestro por consola que usuario voy a activar
    useEffect(() => {
        console.log("datos user a activar: ", selectedUser);
    }, [selectedUser]);

    // gestion del modal que el usuario se reactivo correctamente
    const [showModalActivado, setShowModalActivado] = useState(false);
    const handleCloseModalActivado = () => setShowModalActivado(false);
    const handleShowModalActivado = () => setShowModalActivado(true);

    // funcion que se va a ejecutar en cuanto el usuario pulse el boton ACTIVAR, que procesara el dato de que el
    // administrador reactivo el usuario, y enviara ese dato al backend para que registre dicha baja actualizacion
    const onSubmit = async (data) => {
        data.dni = selectedUser.dni;
        console.log(data);
        await axios.put(`http://localhost:4001/flextrainer/usuarios/usuario/activate/${data.dni}`); // peticion
        setSelectedUser({}); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
        setIsUserSelected(false); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
        handleCloseActivarUsuario(); // cierro el primer modal de eliminacion de usuario 
        traerUsuarios(); // traigo todos los usuarios desde el backend
        handleShowModalActivado(); // abro el segundo modal de activacion de usuario
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
                                <br></br>
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
