import React, { useState, useEffect } from 'react'; // importo funcionalidades react necesarias
import { useForm } from 'react-hook-form'; // importo el hook de useForm para la gestion de formularios
// importo componentes bootstrp necesarios
import Button from 'react-bootstrap/Button';
import { Card, Modal } from 'react-bootstrap';
import axios from 'axios'; // importo axios para llevar a cabo las peticiones necesarias
import './ActivarMaquina.css'; // importo los estilos asociados a esta pantalla
import { API } from '../../../constants/api.js';

const ActivarMaquina = ({ showModalActivarMaquina, handleCloseActivarMaquina, setSelectedMaquina, setIsMaquinaSelected, selectedMaquina, traerMaquinas, handleClean }) => {
    const { handleSubmit } = useForm(); // funcionalidades y propiedades necesarias para la gestion del formulario

    // muestro por consola que maquina voy a activar
    useEffect(() => {
        console.log("datos maquina a activar: ", selectedMaquina);
    }, [selectedMaquina]);

    // gestion del modal que el plan se reactivo correctamente
    const [showModalActivado, setShowModalActivado] = useState(false);
    const handleCloseModalActivado = () => setShowModalActivado(false);
    const handleShowModalActivado = () => setShowModalActivado(true);

    // funcion que se va a ejecutar en cuanto el usuario pulse el boton ACTIVAR, que procesara el dato de que el
    // administrador reactivo el usuario, y enviara ese dato al backend para que registre dicha baja actualizacion
    const onSubmit = async (data) => {
        data.id = selectedMaquina.id;
        console.log(data);
        await axios.put(`${API}/flextrainer/maquinas/activate/${data.id}`); // peticion
        setSelectedMaquina({}); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
        setIsMaquinaSelected(false); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
        handleCloseActivarMaquina(); // cierro el primer modal de eliminacion de usuario 
        traerMaquinas(); // traigo todos los usuarios desde el backend
        handleShowModalActivado(); // abro el segundo modal de activacion de usuario
    }

    return (
        <>
            <Modal show={showModalActivarMaquina} onHide={() => { handleCloseActivarMaquina(); handleClean() }}>
                <Modal.Header closeButton className='activateMaquina-modal-header'>
                    <Modal.Title className='activateMaquina-modal-title'>Activar máquina</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div className='text-center'>
                                <span className='activateMaquina-alertText'>¿Estás seguro de que querés reactivar esta máquina?</span>
                                <br></br>
                                <span className='activateMaquina-alertText'>{selectedMaquina?.nombre?.toUpperCase()}</span>
                                <br></br>
                                <br></br>
                                <span>Todos los datos de la máquina van a ser reactivados. </span>
                            </div>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <Modal.Footer>
                    <Button style={{ backgroundColor: 'grey', marginRight: '8px', border: 'none' }} onClick={() => { handleCloseActivarMaquina(); handleClean() }}>
                        Cancelar
                    </Button>
                    <Button style={{ backgroundColor: 'darkred', marginRight: '8px', border: 'none' }} onClick={handleSubmit(onSubmit)}>
                        Activar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL que se va a mostrar SOLO despues de que el usuario haya pulsado ACTIVAR
            en el primer modal, el cual simplemente muestra un mensaje */}
            <Modal show={showModalActivado} onHide={() => { handleCloseModalActivado(); }}>
                <Modal.Header closeButton className='activateMaquina-modal-header'>
                    <Modal.Title className='activateMaquina-modal-title'>Activar máquina</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div className='text-center'>
                                <span>Activaste la máquina correctamente</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <Modal.Footer>
                    <Button style={{ backgroundColor: 'darkred', marginRight: '8px', border: 'none' }} onClick={() => { handleCloseModalActivado(); handleClean() }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export { ActivarMaquina }