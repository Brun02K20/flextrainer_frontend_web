import React, { useEffect, useState } from 'react'; // importando funcionalidades necesarias de react, ademas de la libreria en si
import { useForm } from 'react-hook-form'; // importando las funcionalidades neecsarias para gestion de formularios

// importando componentes bootstrap necesarios
import Button from 'react-bootstrap/Button';
import { Card, Modal } from 'react-bootstrap';
import './EliminarAlumno.css'; // importando estilos asociados a esta pantalla
import axios from 'axios'; // importando axios para poder llevar a cabo las peticiones al backend
import { API } from '../../../constants/api.js';

const EliminarAlumno = ({ showModalEliminarAlumno, handleCloseEliminarAlumno, setSelectedUser, setIsUserSelected, selectedUser, traerAlumnos, handleClean }) => {

    // funcionalidades y propiedades necesarias para la gestion del formulario, que en este caso, solo consistira
    // en el boton de ELIMINAR
    const { handleSubmit } = useForm();

    // gestion de modal de: "se elimino el alumno exitosamente"
    const [showModalEliminado, setShowModalEliminado] = useState(false);
    const handleCloseModalEliminado = () => setShowModalEliminado(false);
    const handleShowModalEliminado = () => setShowModalEliminado(true);

    // mostrar por consola a que alumno elegi para borrarlo
    useEffect(() => {
        console.log("datos alumno a eliminar: ", selectedUser);
    }, [selectedUser]);

    // funcion que se va a ejecutar en cuanto el usuario pulse el boton ELIMINAR, que procesara el dato de que el 
    // administrador elimino el usuario, y enviara ese dato al backend para que registre dicha baja
    const onSubmit = async (data) => {
        data.dni = selectedUser.alumno.dni;
        console.log(data);
        await axios.put(`${API}/flextrainer/planesAlumnos/desAsociarAlumnoDeProfe/${data.dni}`);
        setSelectedUser({}); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
        setIsUserSelected(false); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
        handleCloseEliminarAlumno(); // cierro el primer modal de eliminacion de usuario 
        await traerAlumnos(); // traigo todos los alumnos del profesor desde el backend
        handleShowModalEliminado(); // abro el segundo modal de eliminacion de usuario
    };

    useEffect(() => {
        const a = async () => {
            await traerAlumnos()
        }
    }, [showModalEliminado])

    // renderizando los modales
    return (
        <>
            {/* // modales y formualrios ya lo explique en el modal de inicio de sesion, y ante la duda siempre me pueden mandar un wsp */}
            <Modal show={showModalEliminarAlumno} onHide={() => { handleCloseEliminarAlumno(); handleClean() }}>
                <Modal.Header closeButton className='deleteAlumno-modal-header'>
                    <Modal.Title className='deleteAlumno-modal-title'>Eliminar alumno</Modal.Title>
                </Modal.Header>

                {/* El cuerpo de este modal, tendra 2 textos centrados, de advertencia.  */}
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div className='text-center'>
                                <span className='deleteAlumno-alertText'>¿Estás seguro de que querés dar de baja a tu alumno?</span>
                                <br></br>
                                <span className='deleteAlumno-alertText'>{selectedUser?.alumno?.nombre?.toUpperCase()} {selectedUser?.alumno?.apellido?.toUpperCase()}</span>
                                <br></br>
                                <br></br>
                                <span>Tu alumno ya no aparecerá mas en tu lista</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                {/* Footer del modal, la parte final del mismo, que contendra los botones de cancelar y de eliminar  */}
                <Modal.Footer>
                    <Button style={{ backgroundColor: 'grey', marginRight: '8px', border: 'none' }} onClick={() => { handleCloseEliminarAlumno(); handleClean() }}>
                        Cancelar
                    </Button>
                    <Button style={{ backgroundColor: 'darkred', marginRight: '8px', border: 'none' }} onClick={handleSubmit(onSubmit)}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL que se va a mostrar SOLO despues de que el usuario haya pulsado ELIMINAR
            en el primer modal, el cual simplemente muestra un mensaje */}
            <Modal show={showModalEliminado} onHide={handleCloseModalEliminado}>
                <Modal.Header closeButton className='deleteAlumno-modal-header'>
                    <Modal.Title className='deleteAlumno-modal-title'>Eliminar alumno</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div className='text-center'>
                                <span>Diste de baja al alumno correctamente</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <Modal.Footer>
                    <Button style={{ backgroundColor: 'darkred', border: 'none' }} onClick={() => { handleCloseModalEliminado(); handleClean() }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export { EliminarAlumno }