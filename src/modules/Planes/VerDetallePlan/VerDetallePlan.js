import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { NavHeader } from '../../../components/NavHeader/NavHeader';
import { Card } from 'react-bootstrap';

import { useForm, Controller } from 'react-hook-form'; // importando funcionalidades necesarias para la gestion de formularios

// importando componentes de react-bootstrap necesarios
import Form from 'react-bootstrap/Form';
import { Nav, Table, Pagination } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { BackButton } from '../../../components/BackButton/BackButton';
import { API } from '../../../constants/api.js';

const VerDetallePlan = () => {
    const { id } = useParams(); // Obtenemos el parámetro 'id' de la URL
    const navigate = useNavigate(); // declaro la funcion de navegacion
    const { handleSubmit, control, formState: { errors }, reset, setValue, register } = useForm();
    const [planTraido, setPlanTraido] = useState({});

    useEffect(() => {
        const traerPlan = async () => {
            const response = await axios.get(`${API}/flextrainer/planes/plan/${id}`)
            setPlanTraido(response.data)
        }
        traerPlan()
    }, []);

    const handleBack = () => {
        navigate('/planesProfe')
        setPlanTraido({})
    }

    useEffect(() => {
        console.log("plan traido ahora: ", planTraido)
    }, [planTraido])

    return (
        <>
            <NavHeader encabezado={'VER DETALLE PLAN'} />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p>Plan</p>

                        <div className="col-md-6">
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                <Form.Label>Nombre</Form.Label>
                                <Controller
                                    name="nombre"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="text"
                                            placeholder={planTraido.nombre ? planTraido.nombre : ''}
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
                                            placeholder={planTraido.objetivo ? planTraido.objetivo.nombre : ''}
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
                                            placeholder={planTraido.cantSesiones ? planTraido.cantSesiones : ''}
                                            {...field}
                                            disabled
                                        />
                                    )}
                                />
                            </Form.Group>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        {planTraido ? (
                            <>
                                {planTraido.sesiones && planTraido.sesiones.map((sesion, index) => (
                                    <>
                                        <div key={index}>
                                            <h3>Tabla Sesion N° {index + 1}</h3>
                                            <Table striped bordered hover responsive>
                                                <thead>
                                                    <tr>
                                                        <th>Ejercicio</th>
                                                        <th>Tiempo</th>
                                                        <th>Series</th>
                                                        <th>Repeticiones</th>
                                                        <th>Descanso</th>
                                                        <th>Maquina</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sesion.ejercicios && sesion.ejercicios.map((ejercicio, ejercicioIndex) => (
                                                        <tr key={ejercicioIndex}>
                                                            <td>{ejercicio["Ejercicio.nombre"]}</td>
                                                            <td>{ejercicio["tiempo"] ? ejercicio["tiempo"] : 'No aplica'}</td>
                                                            <td>{ejercicio["series"] ? ejercicio["series"] : 'No aplica'}</td>
                                                            <td>{ejercicio["repeticiones"] ? ejercicio["repeticiones"] : 'No aplica'}</td>
                                                            <td>{ejercicio["descanso"] ? ejercicio["descanso"] : 'No aplica'}</td>
                                                            <td>{ejercicio["Ejercicio.Maquinas.nombre"] ? ejercicio["Ejercicio.Maquinas.nombre"] : 'No aplica'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </>
                                ))}
                            </>
                        ) : (<h2>Cargando</h2>)}
                    </Card.Body>
                </Card>
            </div>

            <br></br>

            <BackButton handleBack={handleBack} />
        </>
    )
}

export { VerDetallePlan }