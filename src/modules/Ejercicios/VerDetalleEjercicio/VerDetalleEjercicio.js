import React, { useEffect, useState } from 'react'; // importando funcionalidades react necesarias
import { useNavigate } from 'react-router-dom'; // importando funcion de navegacion entre componentes
import Modal from 'react-bootstrap/Modal'; // importando el componente Modal de react-bootstrap
import Button from 'react-bootstrap/Button'; // importando el componente Button de react-bootstrap
import Card from 'react-bootstrap/Card';// importando el componente Card de react-bootstrap

import './VerDetalleEjercicio.css'; // importar estilos asociados a este componente
import axios from 'axios';
import { API } from '../../../constants/api.js';

const VerDetalleEjercicio = ({ show, handleClose, idEjercicioElegido, setIdEjercicioElegido }) => {
    const [ejercicio, setEjercicio] = useState({}); // estado en el que almacenare los datos del ejrcicio

    // efecto para traer la informacion del ejercicio
    useEffect(() => {
        const traerEjercicio = async () => {
            if (idEjercicioElegido !== null && idEjercicioElegido !== 0 && show) {
                const response = await axios.get(`${API}/flextrainer/ejercicios/ejercicio/${idEjercicioElegido}`);
                setEjercicio(response.data)
            }
        }
        traerEjercicio();
    }, [idEjercicioElegido]);

    // mostrando por consola el ejercicio elegido
    useEffect(() => {
        console.log("ejercicio elegido ahora: ", ejercicio)
    }, [idEjercicioElegido])

    return (
        <>
            {/* misma explicacion de declaracion de Modal que en LoginModal.js, al igual que el header de este modal */}
            <Modal show={show} onHide={() => { setIdEjercicioElegido(0); handleClose(); setEjercicio(null) }}>
                <Modal.Header closeButton className='verEjercicio-modal-header'>
                    <Modal.Title className='verEjercicio-modal-title'>Detalle ejercicio</Modal.Title>
                </Modal.Header>

                <div className='text-center'>
                    <Card>
                        <Card.Body>
                            <p>NOMBRE: {ejercicio.Ejercicio ? ejercicio.Ejercicio.nombre : ''}</p>
                            <p>DESCRIPCIÓN: {ejercicio.Ejercicio ? ejercicio.Ejercicio.descripcion : ''}</p>
                            <p>ZONA DEL CUERPO QUE TRABAJA: {ejercicio.Ejercicio ? ejercicio.Ejercicio.Cuerpo_Zona.nombre : ''}</p>
                            <p>CATEGORÍA DEL EJERCICIO:  {ejercicio.Ejercicio ? ejercicio.Ejercicio.Categoria_Ejercicio.nombre : ''}</p>
                            {(ejercicio.Ejercicio !== null && ejercicio.linkVideo) ? (
                                <iframe
                                    width="100%"
                                    height="315"
                                    src={ejercicio !== null ? (ejercicio.linkVideo ? ejercicio.linkVideo : 'https://www.youtube.com/embed/e18WN3syp6g?si=XDDceDQOxidQHCfz') : 'https://www.youtube.com/embed/e18WN3syp6g?si=XDDceDQOxidQHCfz'}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                >
                                </iframe>
                            ) : (
                                <div className='col s12 center' style={{ width: '100%', height: '315px' }}>
                                    <h3 style={{ textAlign: 'center' }}>NO HAY VIDEO ASOCIADO A ESTE EJERCICIO</h3>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>

                <Modal.Footer>
                    <Button style={{ marginRight: '8px', border: 'none', backgroundColor: 'darkred' }} onClick={() => { setIdEjercicioElegido(0); handleClose(); setEjercicio(null) }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export { VerDetalleEjercicio };
