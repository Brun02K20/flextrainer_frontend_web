import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';

import Button from 'react-bootstrap/Button';
import { Card, Modal } from 'react-bootstrap';

import axios from 'axios'; // importando axios para poder llevar a cabo las peticiones al backend
import { API } from '../../../constants/api.js';
import './EliminarMaquina.css'

const EliminarMaquina = ({ showModalEliminarMaquina, handleCloseEliminarMaquina, setSelectedMaquina, setIsMaquinaSelected, selectedMaquina, traerMaquinas, handleClean }) => {

    // funcionalidades y propiedades necesarias para la gestion del formulario
    const { handleSubmit } = useForm();

    // gestion de modal de: "se dieron de baja las máquinas exitosamente"
    const [showModalEliminado, setShowModalEliminado] = useState(false);
    const handleCloseModalEliminado = () => setShowModalEliminado(false);
    const handleShowModalEliminado = () => setShowModalEliminado(true);

    // mostrar por consola a que maquina elegi para borrarlo
    useEffect(() => {
        console.log("datos maquina a eliminar: ", selectedMaquina);
    }, [selectedMaquina]);

    // funcion que se va a ejecutar en cuanto el usuario pulse el boton ELIMINAR, que procesara el dato de que el 
    // administrador elimino la maquina, y enviara ese dato al backend para que registre dicha baja
    const onSubmit = async (data) => {
        data.id = selectedMaquina.id
        console.log(data);
        await axios.delete(`${API}/flextrainer/maquinas/delete/${data.id}`, { timeout: 500000 });
        setSelectedMaquina({}); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
        setIsMaquinaSelected(false); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
        handleCloseEliminarMaquina(); // cierro el primer modal de eliminacion de usuario 
        traerMaquinas(); // traigo todos los usuarios desde el backend
        handleShowModalEliminado(); // abro el segundo modal de eliminacion de usuario
    };

    return (
        <>
            {/* // modales y formualrios ya lo explique en el modal de inicio de sesion, y ante la duda siempre me pueden mandar un wsp */}
            <Modal show={showModalEliminarMaquina} onHide={() => { handleCloseEliminarMaquina(); handleClean() }}>
                <Modal.Header closeButton className='deleteMaquina-modal-header'>
                    <Modal.Title className='deleteMaquina-modal-title'>Eliminar máquina</Modal.Title>
                </Modal.Header>

                {/* El cuerpo de este modal, tendra 2 textos centrados, de advertencia.  */}
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div className='text-center'>
                                <span className='deleteMaquina-alertText'>¿Estás seguro de que querés eliminar esta máquina?</span>
                                <br></br>
                                <span className='deleteMaquina-alertText'>{selectedMaquina?.nombre?.toUpperCase()}</span>
                                <br></br>
                                <br></br>
                                <br></br>
                                <span>Todos los datos de la máquina van a ser borrados, sin embargo, puedes recuperarlos cuando quieras.</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                {/* Footer del modal, la parte final del mismo, que contendra los botones de cancelar y de eliminar  */}
                <Modal.Footer>
                    <Button style={{ backgroundColor: 'grey', marginRight: '8px', border: 'none' }} onClick={() => { handleCloseEliminarMaquina(); handleClean() }}>
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
                <Modal.Header closeButton className='deleteMaquina-modal-header'>
                    <Modal.Title className='deleteMaquina-modal-title'>Eliminar máquina</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div className='text-center'>
                                <span>Eliminaste la máquina correctamente</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <Modal.Footer>
                    <Button style={{ backgroundColor: 'darkred', marginRight: '8px', border: 'none' }} onClick={() => { handleCloseModalEliminado(); handleClean() }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export { EliminarMaquina }