import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { NavHeader } from '../../../components/NavHeader/NavHeader.js';
import { BackButton } from '../../../components/BackButton/BackButton.js';

import { useForm, Controller } from 'react-hook-form'; // importando funcionalidades necesarias para la gestion de formularios

import { Card, Navbar } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Nav, Table, Pagination } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { API } from '../../../constants/api.js';


const VerDetalleAlumno = ({ usuarioEnSesion }) => {
    const { id } = useParams(); // Obtenemos el parámetro 'id' de la URL
    const navigate = useNavigate(); // declaro la funcion de navegacion
    const { handleSubmit, control, formState: { errors }, reset, setValue, register } = useForm();
    const [alumnoTraido, setAlumnoTraido] = useState({})
    const [selectedLink, setSelectedLink] = useState('Plan');;

    useEffect(() => {
        const traerAlumno = async () => {
            const response = await axios.get(`${API}/flextrainer/planesAlumnos/alumnoProfe/${usuarioEnSesion.dni}/${id}`)
            setAlumnoTraido(response.data)
        }
        traerAlumno()
    }, []);

    const handleBack = () => {
        navigate('/alumnosProfe')
        setAlumnoTraido({})
        handleLinkClick('Alumno');
    }

    useEffect(() => {
        console.log("alumno traido ahora: ", alumnoTraido)
    }, [alumnoTraido])

    const handleLinkClick = (link) => {
        setSelectedLink(link);
    }

    return (
        <>
            <NavHeader encabezado="Ver Detalle Alumno" />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p>Alumno</p>

                        <div className='row'>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                    <Form.Label>DNI</Form.Label>
                                    <Controller
                                        name="dni"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                type="text"
                                                placeholder={alumnoTraido.alumno ? alumnoTraido.alumno.dni : ''}
                                                {...field}
                                                disabled
                                            />
                                        )}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                    <Form.Label>Nombre</Form.Label>
                                    <Controller
                                        name="dni"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                type="text"
                                                placeholder={alumnoTraido.alumno ? alumnoTraido.alumno.nombre : ''}
                                                {...field}
                                                disabled
                                            />
                                        )}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                    <Form.Label>Apellido</Form.Label>
                                    <Controller
                                        name="apellido"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                type="text"
                                                placeholder={alumnoTraido.alumno ? alumnoTraido.alumno.apellido : ''}
                                                {...field}
                                                disabled
                                            />
                                        )}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <br></br>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Navbar style={{ backgroundColor: 'darkred', width: '96%', borderRadius: '12px' }}>
                    <Link onClick={() => handleLinkClick('Plan')} style={{ marginLeft: '24px', color: 'white', textDecoration: 'none' }}>Plan</Link>
                    <Link onClick={() => handleLinkClick('Alumno')} style={{ marginLeft: '24px', color: 'white', textDecoration: 'none' }}>Informacion</Link>

                </Navbar>
            </div>

            <br></br>

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                {selectedLink === 'Plan' && (
                    <>
                        {alumnoTraido && (alumnoTraido.plan ? (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Card border="danger" style={{ width: '96%' }}>
                                        <Card.Body>
                                            <div className='row'>
                                                <p style={{ textAlign: 'left' }}>Plan</p>
                                                <div className="col-md-6">
                                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput8">
                                                        <Form.Label>Nombre</Form.Label>
                                                        <Controller
                                                            name="nombre"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder={alumnoTraido.plan ? alumnoTraido.plan.nombre : ''}
                                                                    {...field}
                                                                    disabled
                                                                />
                                                            )}
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-6">
                                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput8">
                                                        <Form.Label>Cantidad de Sesiones</Form.Label>
                                                        <Controller
                                                            name="cantSesiones"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder={alumnoTraido.plan ? alumnoTraido.plan.cantSesiones : ''}
                                                                    {...field}
                                                                    disabled
                                                                />
                                                            )}
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-6">
                                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput8">
                                                        <Form.Label>Objetivo del Plan</Form.Label>
                                                        <Controller
                                                            name="objPlan"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder={alumnoTraido.plan ? (alumnoTraido.plan.objetivo ? alumnoTraido.plan.objetivo.nombre : '') : ''}
                                                                    {...field}
                                                                    disabled
                                                                />
                                                            )}
                                                        />
                                                    </Form.Group>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-md-12">
                                                    <Form.Group className="mb-6" controlId="exampleForm.ControlInput8">
                                                        <Form.Label>Observaciones</Form.Label>
                                                        <Controller
                                                            name="observaciones"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Form.Control
                                                                    as="textarea"
                                                                    placeholder={alumnoTraido.planAlumno ? (alumnoTraido.planAlumno.observaciones ? alumnoTraido.planAlumno.observaciones : 'No hay observaciones') : 'No hay observaciones'}
                                                                    {...field}
                                                                    disabled
                                                                />
                                                            )}
                                                        />
                                                    </Form.Group>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>

                                <br></br>

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Card border="danger" style={{ width: '96%' }}>
                                        <Card.Body>
                                            {alumnoTraido ? (
                                                <>
                                                    {alumnoTraido.plan && alumnoTraido.plan.sesiones && alumnoTraido.plan.sesiones.map((sesion, index) => (
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
                            </>
                        ) : (<h2>Este alumno no tiene asociado un plan</h2>))}
                    </>
                )}


                {selectedLink === 'Alumno' && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Card border="danger" style={{ width: '96%' }}>
                                <Card.Body>
                                    <div className='row'>
                                        <div className="col-md-6">
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                                                <Form.Label>Género</Form.Label>
                                                <Controller
                                                    name="genero"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Form.Control
                                                            type="text"
                                                            placeholder={alumnoTraido.alumno ? alumnoTraido.alumno.genero : ''}
                                                            {...field}
                                                            disabled
                                                        />
                                                    )}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                                                <Form.Label>Correo Electrónico</Form.Label>
                                                <Controller
                                                    name="email"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Form.Control
                                                            type="text"
                                                            placeholder={alumnoTraido.alumno ? alumnoTraido.alumno.correoElectronico : ''}
                                                            {...field}
                                                            disabled
                                                        />
                                                    )}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                                                <Form.Label>Celular</Form.Label>
                                                <Controller
                                                    name="celular"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Form.Control
                                                            type="text"
                                                            placeholder={alumnoTraido.alumno ? alumnoTraido.alumno.numeroTelefono : ''}
                                                            {...field}
                                                            disabled
                                                        />
                                                    )}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </>
                )}
            </div>

            <br></br>

            <BackButton handleBack={handleBack} />
        </>
    )
}

export { VerDetalleAlumno }
