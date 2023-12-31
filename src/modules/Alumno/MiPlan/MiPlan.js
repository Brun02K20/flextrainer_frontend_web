import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { useForm, Controller } from 'react-hook-form'; // importando funcionalidades necesarias para la gestion de formularios

import { NavHeader } from '../../../components/NavHeader/NavHeader.js';
import { BackButton } from '../../../components/BackButton/BackButton.js';

// importando componentes de react-bootstrap necesarios
import Form from 'react-bootstrap/Form';
import { Table } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { VerDetalleEjercicio } from '../../Ejercicios/VerDetalleEjercicio/VerDetalleEjercicio.js';
import { API } from '../../../constants/api.js';
import { ActionButton } from '../../../components/ActionButton/ActionButton.js';

const MiPlan = ({ usuarioEnSesion }) => {

    const navigate = useNavigate(); // declaro la funcion de navegacion
    const { handleSubmit, control, formState: { errors }, reset, setValue, register } = useForm();
    const [planTraido, setPlanTraido] = useState({});

    useEffect(() => {
        const traerPlan = async () => {
            const response = await axios.get(`${API}/flextrainer/planesAlumnos/planDeAlumno/${usuarioEnSesion.dni}`, { timeout: 500000 })
            setPlanTraido(response.data)
        }
        traerPlan()
    }, []);

    const handleBack = () => {
        navigate('/bienvenida')
        setPlanTraido({})
    }

    useEffect(() => {
        console.log("plan traido ahora: ", planTraido)
    }, [planTraido])

    // gestion del modal del detalle de un ejercicio (para lo del video):
    const [idEjercicioElegido, setIdEjercicioElegido] = useState(0);
    const [showME, setShowME] = useState(false);
    const handleCloseME = () => setShowME(false);
    const handleShowME = () => setShowME(true);

    return (
        <>
            <NavHeader encabezado='Ver plan' />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p style={{ color: "darkred", fontWeight: '600' }}>Plan</p>
                        <div className='row'>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                    <Form.Label>Nombre</Form.Label>
                                    <Controller
                                        name="nombre"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                type="text"
                                                placeholder={planTraido.detallePlan ? planTraido.detallePlan.nombre?.toUpperCase() : ''}
                                                {...field}
                                                disabled
                                            />
                                        )}
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                    <Form.Label>Objetivo</Form.Label>
                                    <Controller
                                        name="objetivo"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                type="text"
                                                placeholder={planTraido.detallePlan ? planTraido.detallePlan.objetivo.nombre?.toUpperCase() : ''}
                                                {...field}
                                                disabled
                                            />
                                        )}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                    <Form.Label>Cantidad Sesiones</Form.Label>
                                    <Controller
                                        name="cantSesiones"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                type="text"
                                                placeholder={planTraido.detallePlan ? planTraido.detallePlan.cantSesiones : ''}
                                                {...field}
                                                disabled
                                            />
                                        )}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                    <Form.Label>Observaciones</Form.Label>
                                    <Controller
                                        name="observaciones"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                as='textarea'
                                                placeholder={planTraido.aspectosBasicos ? (planTraido.aspectosBasicos.observaciones ? planTraido.aspectosBasicos.observaciones : 'Sin observaciones') : 'Sin observaciones'}
                                                {...field}
                                                disabled
                                            />
                                        )}
                                    />
                                    {errors.observaciones && <p>{errors.observaciones.message}</p>}
                                </Form.Group>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    {(planTraido && !planTraido.error) ? (
                        <Card.Body>
                            <p style={{ color: 'darkred', fontWeight: '600' }}>Ejercicios</p>
                            {planTraido ? (
                                <>
                                    {planTraido.detallePlan && planTraido.detallePlan.sesiones && planTraido.detallePlan.sesiones.map((sesion, index) => (
                                        <>
                                            <div key={index}>
                                                <h3>Sesión N° {index + 1}</h3>
                                                <Table striped bordered hover responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>Ejercicio</th>
                                                            <th>Tiempo</th>
                                                            <th>Series</th>
                                                            <th>Repeticiones</th>
                                                            <th>Descanso</th>
                                                            <th>Máquina</th>
                                                            <th>Ver ejercicio</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sesion.ejercicios && sesion.ejercicios.map((ejercicio, ejercicioIndex) => (
                                                            <tr key={ejercicioIndex}>
                                                                <td>{ejercicio["Ejercicio.nombre"]?.toUpperCase()}</td>
                                                                <td>{ejercicio["tiempo"] ? ejercicio["tiempo"] + " ' " : '--------'}</td>
                                                                <td>{ejercicio["series"] ? ejercicio["series"] : '--------'}</td>
                                                                <td>{ejercicio["repeticiones"] ? ejercicio["repeticiones"] : '--------'}</td>
                                                                <td>{ejercicio["descanso"] ? ejercicio["descanso"] + " '' " : '--------'}</td>
                                                                <td>{ejercicio["Ejercicio.Maquinas.nombre"] ? ejercicio["Ejercicio.Maquinas.nombre"]?.toUpperCase() : '--------'}</td>
                                                                <td className="d-flex justify-content-center">
                                                                    <ActionButton
                                                                        tooltipText='Ver Ejercicio'
                                                                        color='#881313'
                                                                        icon='bi-camera-video-fill'
                                                                        onClickFunction={() => { console.log(index); setIdEjercicioElegido(ejercicio["Ejercicioid"]); handleShowME(); }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </>
                                    ))}
                                </>
                            ) : (<h2>No tiene plan</h2>)}
                        </Card.Body>
                    ) : (
                        <h2 style={{ textAlign: 'center' }}>No tiene plan</h2>
                    )}
                </Card>
            </div>

            <br></br>

            <BackButton handleBack={handleBack} />

            {showME && (
                <VerDetalleEjercicio
                    show={showME}
                    handleClose={handleCloseME}
                    idEjercicioElegido={idEjercicioElegido}
                    setIdEjercicioElegido={setIdEjercicioElegido}
                />
            )}
        </>
    )
}

export { MiPlan }