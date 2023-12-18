import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Card } from 'react-bootstrap';

// importo axios para llevar a cabo la peticion de login al backend
import './RecoverPassword.css'

const RPExitoso = ({ showModalRPExitoso, handleCloseModalRPExitoso, setUsuarioAActualizar }) => {
    return (
        <Modal show={showModalRPExitoso} onHide={handleCloseModalRPExitoso}>
            <Modal.Header closeButton className='recover-modal-header'>
                <Modal.Title className='recover-modal-title'>Recuperar contraseña</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Card>
                    <Card.Body>
                        <div className='text-center'>
                            <span>Actualizaste tu contraseña exitosamente.</span>
                        </div>
                    </Card.Body>
                </Card>
            </Modal.Body>

            <Modal.Footer>
                <Button style={{ backgroundColor: 'darkred', marginRight: '8px', border: 'none' }} onClick={() => { handleCloseModalRPExitoso(); setUsuarioAActualizar({}) }}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export { RPExitoso }