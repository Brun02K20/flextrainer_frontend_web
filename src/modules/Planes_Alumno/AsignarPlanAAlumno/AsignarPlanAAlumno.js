import React, { useState, useEffect } from 'react'; // importando React y funcionalidades necesarias del mismo
import { useNavigate, useParams } from 'react-router-dom'; // importando funcion de navegacion entre componentes de react-router-dom
import { useForm, Controller } from 'react-hook-form'; // importando funcionalidades necesarias para la gestion de formularios

// probando esto
import moment from 'moment/moment.js';


// importando componentes de react-bootstrap necesarios
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Nav, Table, Pagination } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

// importo axios para poder realizar las peticiones necesarias al backend
import axios from 'axios';
import { NavHeader } from '../../../components/NavHeader/NavHeader.js';
import { BackButton } from '../../../components/BackButton/BackButton.js';

// importo servicio que me trae los planes de un profe, esos planes deben ser activos, esto es solo para el combobox
import { planesProfeServices } from '../../Planes/services/planesProfe.service.js';
import { API } from '../../../constants/api.js';

const AsignarPlanAAlumno = ({ usuarioEnSesion }) => {
    const { dniAlumno } = useParams();
    const { handleSubmit, control, formState: { errors }, setValue } = useForm(); // funcionalidades y propiedades necesarias para la gestion del formulario
    const [planes, setPlanes] = useState([]); // estado en el que voy a almacenar los profesores
    const [planElegido, setPlanElegido] = useState(null); // seteando en un estado el plan a asignr, para que cada vez que cambie este estado, me traiga el detalle de ese plan para mostrarlo
    const [idElegido, setIdElegido] = useState(0); // id del plan que elegi en el combobox
    const [alumnoTraido, setAlumnoTraido] = useState({})
    const [errorPlan, setErrorPlan] = useState(false)
    const [errorFecha, setErrorFecha] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const traerAlumno = async () => {
            const response = await axios.get(`${API}/flextrainer/planesAlumnos/alumnoProfe/${usuarioEnSesion.dni}/${dniAlumno}`)
            setAlumnoTraido(response.data)
        }
        traerAlumno()
    }, []);
    useEffect(() => {
        console.log("alumno traido ahora: ", alumnoTraido)
    }, [alumnoTraido])
    useEffect(() => {
        console.log("alumno elegido: ", dniAlumno)
    }, [])


    // funcion que me permite traer los entrenadores actios del backend
    const traerPlanes = async () => {
        const planesTraidos = await planesProfeServices.getPlanes(usuarioEnSesion.dni);
        setPlanes(planesTraidos);
    }
    useEffect(() => {
        traerPlanes();
    }, []);
    useEffect(() => {
        console.log("SE TRAEN LOS PLANES DEL PROFE EN LA ASIGNACION: ", planes)
    }, [planes])



    useEffect(() => {
        console.log("eligio tal plan: ", idElegido)
    }, [idElegido])

    useEffect(() => {
        if (idElegido) {
            const traerDetailPlan = async () => {
                const planazo = await axios.get(`${API}/flextrainer/planes/plan/${idElegido}`)
                setPlanElegido(planazo.data)
            }
            traerDetailPlan()
        } else {
            setPlanElegido(null)
        }
    }, [idElegido])
    useEffect(() => {
        console.log("este es el detalle del plan elegido: ", planElegido)
    }, [planElegido])

    const handleBack = () => {
        setAlumnoTraido({})
        setPlanElegido(null)
        setPlanes([])
        setErrorPlan(false)
        navigate('/alumnosProfe')
    }

    const onSubmit = async (data) => {
        delete data.dni
        delete data.apellido
        delete data.objetivo

        if (isNaN(idElegido) || parseInt(idElegido) === 0) {
            setErrorPlan(true)
            return
        }
        setErrorPlan(false)

        const hoy = moment(); // Obtener la fecha de hoy
        const fechaInicioMoment = moment(data.fechaInicio, 'YYYY-MM-DD');
        const fechaFinMoment = moment(data.fechaFin, 'YYYY-MM-DD');

        if (fechaInicioMoment.isBefore(hoy, 'day') || fechaFinMoment.isBefore(hoy, 'day')) {
            // 1. Ambas fechas deben ser iguales o posteriores a hoy
            setErrorFecha('Las fechas deben ser posteriores o iguales que la fecha de hoy');
            return;
        } else if (fechaFinMoment.isSameOrBefore(fechaInicioMoment)) {
            // 2. fechaFin debe ser mayor que fechaInicio
            setErrorFecha('La fecha de finalizacion debe ser posterior a la de inicio');
            return;
        } else if (fechaFinMoment.diff(fechaInicioMoment, 'days') <= planElegido.cantSesiones - 1) {
            // 3. La diferencia en días debe ser mayor a 5
            setErrorFecha(`La fecha de finalizacion debe ser ${planElegido.cantSesiones} dias posterior que la de inicio minimamente`);
            return
        }
        setErrorFecha('')


        data.cantSesiones = planElegido.cantSesiones
        data.idPlan = parseInt(idElegido)
        data.dniAlumno = parseInt(dniAlumno);


        delete data.cantSesiones
        console.log(data)

        await axios.post(`${API}/flextrainer/planesAlumnos/asignarPlanAAlumno`, data)
        navigate('/alumnosProfe')
    }

    return (
        <>
            <NavHeader encabezado="Asignar plan a alumno" />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p style={{ color: 'darkred', fontWeight: '600' }}>Alumno</p>

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
                                                placeholder={alumnoTraido.alumno ? alumnoTraido.alumno.nombre?.toUpperCase() : ''}
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
                                                placeholder={alumnoTraido.alumno ? alumnoTraido.alumno.apellido?.toUpperCase() : ''}
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
                        <div className='row'>
                            <p style={{ color: 'darkred', fontWeight: '600' }}>Plan a asignar</p>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                    <Form.Label>Plan*</Form.Label>
                                    <Controller
                                        name="idPlan"
                                        control={control}
                                        // rules={{ required: 'Este campo es requerido' }}
                                        render={({ field }) => (
                                            <Form.Select aria-label="select-plan-asignar-plan" {...field} onChange={(e) => setIdElegido(parseInt(e.target.value))}>
                                                <option value='0'>Sin Elegir</option>
                                                {planes.map((e, index) => (
                                                    <option key={index + 1} value={e.id}>{e.nombre}</option>
                                                ))}
                                            </Form.Select>
                                        )}
                                    />
                                    {errors.idPlan && <p style={{ color: 'darkred' }}>{errors.idPlan.message}</p>}
                                </Form.Group>
                                {errorPlan && <p style={{ color: 'darkred' }}>Este campo es requerido</p>}


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
                                                placeholder={planElegido !== null ? (planElegido.objetivo ? planElegido.objetivo.nombre : '') : ''}
                                                {...field}
                                                disabled
                                            />
                                        )}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                    <Form.Label>Cantidad de sesiones</Form.Label>
                                    <Controller
                                        name="cantSesiones"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                type="text"
                                                placeholder={planElegido !== null ? (planElegido.cantSesiones ? planElegido.cantSesiones : '') : ''}
                                                {...field}
                                                disabled
                                            />
                                        )}
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                                    <Form.Label>Fecha de inicio</Form.Label>
                                    <Controller
                                        name='fechaInicio'
                                        control={control}
                                        rules={{ required: 'Este campo es requerido' }}
                                        render={({ field }) => (
                                            <div>
                                                <input type='date' {...field} />
                                            </div>
                                        )}
                                    />
                                    {errors.fechaInicio && <p style={{ color: 'darkred' }}>{errors.fechaInicio.message}</p>}
                                </Form.Group>
                            </div>

                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                                    <Form.Label>Fecha de finalización</Form.Label>
                                    <Controller
                                        name='fechaFin'
                                        control={control}
                                        rules={{ required: 'Este campo es requerido' }}
                                        render={({ field }) => (
                                            <div>
                                                <input type='date' {...field} />
                                            </div>
                                        )}
                                    />
                                    {/* en estos campos fecha me los crea con formato: yyyy-mm-dd */}
                                    {errors.fechaFin && <p style={{ color: 'darkred' }}>{errors.fechaFin.message}</p>}

                                </Form.Group>
                                {errorFecha && <p style={{ color: 'darkred' }}>{errorFecha}</p>}
                            </div>

                            <div className="col-md-12">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                    <Form.Label>Observaciones</Form.Label>
                                    <Controller
                                        name="observaciones"
                                        control={control}
                                        rules={
                                            {
                                                maxLength: {
                                                    value: 200,
                                                    message: 'Maximo 200 caracteres'
                                                }
                                            }
                                        }
                                        render={({ field }) => (
                                            <Form.Control
                                                as='textarea'
                                                placeholder="Ingresá observaciones de este alumno"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.observaciones && <p style={{ color: 'darkred' }}>{errors.observaciones.message}</p>}
                                </Form.Group>
                            </div>
                        </div>
                        <Nav style={{ backgroundColor: '#F2F2F2', borderRadius: '12px', marginTop: '8px' }} className="justify-content-end">
                            <Button style={{ backgroundColor: 'grey', border: 'none', margin: '8px' }} onClick={() => handleBack()} >
                                Cancelar
                            </Button>
                            <Button style={{ backgroundColor: 'darkred', border: 'none', margin: '8px' }} onClick={handleSubmit(onSubmit)}>
                                Registrar
                            </Button>
                        </Nav>
                    </Card.Body>
                </Card>
            </div>

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p style={{ color: 'darkred', fontWeight: '600', textAlign: 'left' }}>Ejercicios</p>
                        {planElegido !== null ? (
                            <>
                                {planElegido.sesiones && planElegido.sesiones.map((sesion, index) => (

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
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sesion.ejercicios && sesion.ejercicios.map((ejercicio, ejercicioIndex) => (
                                                    <tr key={ejercicioIndex}>
                                                        <td>{ejercicio["Ejercicio.nombre"]?.toUpperCase()}</td>
                                                        <td>{ejercicio["tiempo"] ? ejercicio["tiempo"] + " ' " : 'No aplica'}</td>
                                                        <td>{ejercicio["series"] ? ejercicio["series"] : 'No aplica'}</td>
                                                        <td>{ejercicio["repeticiones"] ? ejercicio["repeticiones"] : 'No aplica'}</td>
                                                        <td>{ejercicio["descanso"] ? ejercicio["descanso"] + " '' " : 'No aplica'}</td>
                                                        <td>{ejercicio["Ejercicio.Maquinas.nombre"] ? ejercicio["Ejercicio.Maquinas.nombre"]?.toUpperCase() : 'No aplica'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                ))}
                            </>
                        ) : (<h2 style={{ textAlign: 'center' }}>Elegí un plan</h2>)}
                    </Card.Body>
                </Card>
            </div>

            <br></br>

            <BackButton handleBack={handleBack} />
        </>
    )
}

export { AsignarPlanAAlumno }

// onClick={() => handleClean()}
