import React from 'react'; // importando funcionalidades react necesarias
import { useNavigate } from 'react-router-dom'; // importando funcion de navegacion entre componentes
import Modal from 'react-bootstrap/Modal'; // importando el componente Modal de react-bootstrap
import Button from 'react-bootstrap/Button'; // importando el componente Button de react-bootstrap
import Card from 'react-bootstrap/Card';// importando el componente Card de react-bootstrap

import './VerDetalleEjercicio.css'; // importar estilos asociados a este componente

const VerDetalleEjercicio = ({ show, handleClose }) => {
    return (
        <>
            {/* misma explicacion de declaracion de Modal que en LoginModal.js, al igual que el header de este modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className='verEjercicio-modal-header'>
                    <Modal.Title className='verEjercicio-modal-title'>Detalle Ejercicio</Modal.Title>
                </Modal.Header>

                <div className='text-center'>
                    <Card>
                        <Card.Body>
                            <p>saduifsalig</p>
                            <iframe
                                width="100%"
                                height="315"
                                src="https://www.youtube.com/embed/v4yPFSDJyJ0?si=Bt-NESBbdsGMkG9a"
                                title="YouTube video player"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowfullscreen
                            >
                            </iframe>
                        </Card.Body>
                    </Card>
                </div>

                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export { VerDetalleEjercicio };
