import React, { useEffect, useState } from 'react'; // importando funcionalidades react necesarias
import { useNavigate } from 'react-router-dom'; // importando funcion de navegacion entre componentes
import Modal from 'react-bootstrap/Modal'; // importando el componente Modal de react-bootstrap
import Button from 'react-bootstrap/Button'; // importando el componente Button de react-bootstrap
import Card from 'react-bootstrap/Card';// importando el componente Card de react-bootstrap

import './VerDetalleEjercicio.css'; // importar estilos asociados a este componente
import axios from 'axios';

const VerDetalleEjercicio = ({ show, handleClose, idEjercicioElegido, setIdEjercicioElegido }) => {
    const [ejercicio, setEjercicio] = useState(null); // estado en el que almacenare los datos del ejrcicio

    // efecto para traer la informacion del ejercicio
    useEffect(() => {
        const traerEjercicio = async () => {
            const response = await axios.get(`http://localhost:4001/flextrainer/ejercicios/ejercicio/${idEjercicioElegido}`);
            setEjercicio(response.data)
        }
        traerEjercicio();
    }, [idEjercicioElegido]);

    useEffect(() => {
        console.log("ejercicio elegido ahora: ", ejercicio)
    }, [idEjercicioElegido])

    return (
        <>
            {/* misma explicacion de declaracion de Modal que en LoginModal.js, al igual que el header de este modal */}
            <Modal show={show} onHide={() => { setIdEjercicioElegido(null); handleClose() }}>
                <Modal.Header closeButton className='verEjercicio-modal-header'>
                    <Modal.Title className='verEjercicio-modal-title'>Detalle Ejercicio</Modal.Title>
                </Modal.Header>

                <div className='text-center'>
                    <Card>
                        <Card.Body>
                            <p>NOMBRE: {ejercicio ? ejercicio.nombre : ''}</p>
                            <p>DESCRIPCION: {ejercicio ? ejercicio.descripcion : ''}</p>
                            <p>ZONA DEL CUERPO QUE TRABAJA: {ejercicio ? ejercicio.nombreZonaCuerpo : ''}</p>
                            <p>CATEGORIA DEL EJERCICIO:  {ejercicio ? ejercicio.nombreCategoria : ''}</p>
                            <iframe
                                width="100%"
                                height="315"
                                src="https://www.youtube.com/embed/v4yPFSDJyJ0?si=Bt-NESBbdsGMkG9a"
                                title="YouTube video player"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            >
                            </iframe>
                        </Card.Body>
                    </Card>
                </div>

                <Modal.Footer>
                    <Button variant="danger" onClick={() => { setIdEjercicioElegido(null); handleClose() }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export { VerDetalleEjercicio };
