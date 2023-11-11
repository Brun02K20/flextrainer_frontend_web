import React, { useEffect, useState } from 'react'; // importando funcionalidades necesarias de react, ademas de la libreria en si
import { useForm } from 'react-hook-form'; // importando las funcionalidades neecsarias para gestion de formularios

// importando componentes bootstrap necesarios
import Button from 'react-bootstrap/Button';
import { Card, Modal } from 'react-bootstrap';
import './EliminarUsuario.css'; // importando estilos asociados a esta pantalla
import axios from 'axios'; // importando axios para poder llevar a cabo las peticiones al backend

const EliminarUsuario = ({ showModalEliminarUsuario, handleCloseEliminarUsuario, setSelectedUser, setIsUserSelected, selectedUser, traerUsuarios, handleClean }) => {
    // funcionalidades y propiedades necesarias para la gestion del formulario, que en este caso, solo consistira
    // en el boton de ELIMINAR
    const { handleSubmit } = useForm();

    // gestion de modal de: "se elimino el usuario exitosamente"
    const [showModalEliminado, setShowModalEliminado] = useState(false);
    const handleCloseModalEliminado = () => setShowModalEliminado(false);
    const handleShowModalEliminado = () => setShowModalEliminado(true);

    // mostrar por consola a que usuario elegi para borrarlo
    useEffect(() => {
        console.log("datos user a eliminar: ", selectedUser);
    }, [selectedUser]);

    // funcion que se va a ejecutar en cuanto el usuario pulse el boton ELIMINAR, que procesara el dato de que el 
    // administrador elimino el usuario, y enviara ese dato al backend para que registre dicha baja
    const onSubmit = async (data) => {
        data.dni = selectedUser.dni;
        console.log(data);
        await axios.delete(`api/flextrainer/usuarios/usuario/delete/${data.dni}`);
        setSelectedUser({}); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
        setIsUserSelected(false); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
        handleCloseEliminarUsuario(); // cierro el primer modal de eliminacion de usuario 
        traerUsuarios(); // traigo todos los usuarios desde el backend
        handleShowModalEliminado(); // abro el segundo modal de eliminacion de usuario
    };

    // renderizando los modales
    return (
        <>
            {/* // modales y formualrios ya lo explique en el modal de inicio de sesion, y ante la duda siempre me pueden mandar un wsp */}
            <Modal show={showModalEliminarUsuario} onHide={() => { handleCloseEliminarUsuario(); handleClean() }}>
                <Modal.Header closeButton className='deleteUser-modal-header'>
                    <Modal.Title className='deleteUser-modal-title'>Eliminar Usuario</Modal.Title>
                </Modal.Header>

                {/* El cuerpo de este modal, tendra 2 textos centrados, de advertencia.  */}
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div className='text-center'>
                                <span className='deleteUser-alertText'>¿Estás seguro de que querés eliminar al usuario?</span>
                                <br></br>
                                <span className='deleteUser-alertText'>{selectedUser?.nombre} {selectedUser?.apellido}</span>
                                <br></br>
                                <br></br>
                                <br></br>
                                <span>Todos los datos del usuario van a ser borrados, sin embargo, puedes recuperarlos cuando quieras</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                {/* Footer del modal, la parte final del mismo, que contendra los botones de cancelar y de eliminar  */}
                <Modal.Footer>
                    <Button style={{ backgroundColor: '#555555', marginRight: '8px' }} onClick={() => { handleCloseEliminarUsuario(); handleClean() }}>
                        Cancelar
                    </Button>
                    <Button style={{ backgroundColor: '#910012', marginRight: '8px' }} onClick={handleSubmit(onSubmit)}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL que se va a mostrar SOLO despues de que el usuario haya pulsado ELIMINAR
            en el primer modal, el cual simplemente muestra un mensaje */}
            <Modal show={showModalEliminado} onHide={handleCloseModalEliminado}>
                <Modal.Header closeButton className='deleteUser-modal-header'>
                    <Modal.Title className='deleteUser-modal-title'>Eliminar Usuario</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div className='text-center'>
                                <span>Eliminaste al usuario correctamente.</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="success" onClick={() => { handleCloseModalEliminado(); handleClean() }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export { EliminarUsuario };

