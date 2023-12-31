import React, { useState, useEffect } from 'react'; // importo funcionalidades react necesarias
import { useForm } from 'react-hook-form'; // importo el hook de useForm para la gestion de formularios
// importo componentes bootstrp necesarios
import Button from 'react-bootstrap/Button';
import { Card, Modal } from 'react-bootstrap';
import axios from 'axios'; // importo axios para llevar a cabo las peticiones necesarias
import './ActivarPlan.css'; // importo los estilos asociados a esta pantalla
import { API } from '../../../constants/api.js';

const ActivarPlan = ({ showModalActivarPlan, handleCloseActivarPlan, setSelectedPlan, setIsPlanSelected, selectedPlan, traerPlanes, handleClean }) => {
    const { handleSubmit } = useForm(); // funcionalidades y propiedades necesarias para la gestion del formulario

    // muestro por consola que usuario voy a activar
    useEffect(() => {
        console.log("datos plan a activar: ", selectedPlan);
    }, [selectedPlan]);

    // gestion del modal que el plan se reactivo correctamente
    const [showModalActivado, setShowModalActivado] = useState(false);
    const handleCloseModalActivado = () => setShowModalActivado(false);
    const handleShowModalActivado = () => setShowModalActivado(true);

    // funcion que se va a ejecutar en cuanto el usuario pulse el boton ACTIVAR, que procesara el dato de que el
    // administrador reactivo el usuario, y enviara ese dato al backend para que registre dicha baja actualizacion
    const onSubmit = async (data) => {
        data.id = selectedPlan.id;
        console.log(data);
        await axios.put(`${API}/flextrainer/planes/plan/activate/${data.id}`, null, { timeout: 500000 }); // peticion
        setSelectedPlan({}); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
        setIsPlanSelected(false); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
        handleCloseActivarPlan(); // cierro el primer modal de eliminacion de usuario 
        traerPlanes(); // traigo todos los usuarios desde el backend
        handleShowModalActivado(); // abro el segundo modal de activacion de usuario
    }

    return (
        <>
            <Modal show={showModalActivarPlan} onHide={() => { handleCloseActivarPlan(); handleClean() }}>
                <Modal.Header closeButton className='activatePlan-modal-header'>
                    <Modal.Title className='activatePlan-modal-title'>Activar plan</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div className='text-center'>
                                <span className='activatePlan-alertText'>¿Estás seguro de que querés reactivar este plan?</span>
                                <br></br>
                                <span className='activatePlan-alertText'>{selectedPlan?.nombre?.toUpperCase()}</span>
                                <br></br>
                                <br></br>
                                <span>Todos los datos del plan van a ser reactivados, pero tenés que volver a vincular a los alumnos mnualmente.</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Modal.Body>

                <Modal.Footer>
                    <Button style={{ backgroundColor: 'grey', marginRight: '8px', border: 'none' }} onClick={() => { handleCloseActivarPlan(); handleClean() }}>
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
                <Modal.Header closeButton className='activatePlan-modal-header'>
                    <Modal.Title className='activatePlan-modal-title'>Activar plan</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div className='text-center'>
                                <span>Activaste el plan correctamente</span>
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

export { ActivarPlan }