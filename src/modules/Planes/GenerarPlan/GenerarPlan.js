import React, { useEffect, useState } from 'react';

// importando componentes de react-bootstrap necesarios
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Nav, Table, Pagination } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import axios from 'axios'; // importo axios para llevar a cabo las peticiones al backend
import { NavHeader } from '../../../components/NavHeader/NavHeader.js';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, set } from 'react-hook-form';
import { objetivosServices } from '../services/objetivos.service.js';
import { cuerpoZonasServices } from '../services/cuerpoZonas.service.js';

const GenerarPlan = () => {
    const navigate = useNavigate();
    const { formState: { errors }, register, setValue, handleSubmit, control } = useForm();
    const [objetivosTraidos, setObjetivosTraidos] = useState([])
    const [cuerpoZonasTraidos, setCuerpoZonasTraidos] = useState([])
    const [ejerciciosByZC, setEjericiosByZC] = useState([])
    const [cantidadSesionesIndicadas, setCantidadSesionesIndicadas] = useState(0);
    const [zonaCuerpoIndicada, setZonaCuerpoIndicada] = useState(0);
    const [idEjercicioElegido, setIdEjercicioElegido] = useState(0);
    const [ejercicioElegido, setEjercicioElegido] = useState({});

    useEffect(() => {
        const traerObjetivos = async () => {
            const response = await objetivosServices.getObjetivos();
            setObjetivosTraidos(response)
        }
        traerObjetivos();
    }, [])

    useEffect(() => {
        const traerCuerpoZonas = async () => {
            const response = await cuerpoZonasServices.getCuerpoZonas()
            setCuerpoZonasTraidos(response)
        }
        traerCuerpoZonas()
    }, [])

    useEffect(() => {
        const traerEjerciciosByZC = async () => {
            const response = await axios.get(`http://localhost:4001/flextrainer/ejercicios/byZC/${zonaCuerpoIndicada}`)
            setEjericiosByZC(response.data)
        }
        traerEjerciciosByZC();
    }, [zonaCuerpoIndicada])

    useEffect(() => {
        console.log("objetivos: ", objetivosTraidos)
    }, [objetivosTraidos])

    useEffect(() => {
        console.log("cantidad de sesiones: ", cantidadSesionesIndicadas)
    }, [cantidadSesionesIndicadas])

    useEffect(() => {
        console.log("zona del cuerpo indicada", zonaCuerpoIndicada)
        console.log("ejercicios traidos: ", ejerciciosByZC)
    }, [ejerciciosByZC, zonaCuerpoIndicada])

    useEffect(() => {
        const traerDatosEjercicioElegido = async () => {
            if (idEjercicioElegido !== 0) {
                const response = await axios.get(`http://localhost:4001/flextrainer/ejercicios/ejercicio/${idEjercicioElegido}`)
                setEjercicioElegido(response.data)
            }
        }
        traerDatosEjercicioElegido()
    }, [idEjercicioElegido])


    const onSubmit = async (data) => {
        console.log(data)
    }

    return (
        <>
            <NavHeader encabezado='Generar Plan' />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Form style={{ width: '96%' }}>
                    <Card>
                        <Card.Body >
                            <div className="row">
                                <p>PLAN</p>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Nombre*</Form.Label>
                                        <Controller
                                            name="nombre"
                                            control={control}
                                            rules={
                                                {
                                                    required: {
                                                        value: true,
                                                        message: 'Este campo es requerido'
                                                    },
                                                    pattern: {
                                                        value: /^[a-zA-Z]+$/,
                                                        message: 'Porfavor, ingresa solo letras en este campo. Si tu nombre tiene una ñ, por favor usa `ni`'
                                                    },
                                                    maxLength: {
                                                        value: 30,
                                                        message: 'Maximo 30 caracteres'
                                                    }
                                                }
                                            }
                                            render={({ field }) => (
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Ingresá el nombre del plan"
                                                    {...field}
                                                />
                                            )}
                                        />
                                        {errors.nombre && <p>{errors.nombre.message}</p>}
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                        <Form.Label>Objetivo*</Form.Label>
                                        <Controller
                                            name="objetivo"
                                            control={control}
                                            rules={{ required: 'Este campo es requerido' }}
                                            render={({ field }) => (
                                                <Form.Select aria-label="select-objetivo-crear-plan" {...field}>
                                                    <option value='0'>Sin Elegir</option>
                                                    {objetivosTraidos.map((e, index) => (
                                                        <option key={index + 1} value={e.id}>{e.nombre}</option>
                                                    ))}
                                                </Form.Select>
                                            )}
                                        />
                                        {errors.objetivo && <p>{errors.objetivo.message}</p>}
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                        <Form.Label>Cantidad de Sesiones*</Form.Label>
                                        <Controller
                                            name="cantSesiones"
                                            control={control}
                                            rules={{ required: 'Este campo es requerido' }}
                                            render={({ field }) => (
                                                <Form.Select aria-label="select-sesiones-crear-plan" {...field} onChange={(e) => setCantidadSesionesIndicadas(e.target.value == '' ? 0 : parseInt(e.target.value))}>
                                                    <option value=''>Sin Elegir</option>
                                                    <option value='1'>1</option>
                                                    <option value='2'>2</option>
                                                    <option value='3'>3</option>
                                                    <option value='4'>4</option>
                                                    <option value='5'>5</option>
                                                    <option value='6'>6</option>
                                                    <option value='7'>7</option>
                                                </Form.Select>
                                            )}
                                        />
                                        {errors.cantSesiones && <p>{errors.cantSesiones.message}</p>}
                                    </Form.Group>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    <br></br>

                    <Card>
                        <Card.Body>
                            <div className="row">
                                <p>EJERCICIOS</p>
                                <div className="col-md-6">
                                    {cantidadSesionesIndicadas !== 0 && (
                                        <>
                                            <div className="col-md-6">
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                                    <Form.Label>Sesion*</Form.Label>
                                                    <Controller
                                                        name="sesion"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Form.Select aria-label="select-sesion-crear-plan" {...field} >
                                                                <option value=''>Sin Elegir</option>
                                                                {Array.from({ length: cantidadSesionesIndicadas }, (_, index) => (
                                                                    <option key={index + 1} value={index + 1}>
                                                                        {index + 1}
                                                                    </option>
                                                                ))}
                                                            </Form.Select>
                                                        )}
                                                    />
                                                </Form.Group>
                                            </div>

                                            <div className="col-md-6">
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                                                    <Form.Label>Zona del Cuerpo*</Form.Label>
                                                    <Controller
                                                        name="cuerpoZona"
                                                        control={control}
                                                        // rules={{ required: 'Este campo es requerido' }}
                                                        render={({ field }) => (
                                                            <Form.Select aria-label="select-zc-crear-plan" {...field} onChange={(e) => setZonaCuerpoIndicada(parseInt(e.target.value))}>
                                                                <option value='0'>Sin Elegir</option>
                                                                {cuerpoZonasTraidos.map((e, index) => (
                                                                    <option key={index + 1} value={e.id}>{e.nombre}</option>
                                                                ))}
                                                            </Form.Select>
                                                        )}
                                                    />
                                                    {errors.cuerpoZona && <p>{errors.cuerpoZona.message}</p>}
                                                </Form.Group>
                                            </div>

                                            <div className="col-md-6">
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                                                    <Form.Label>Ejercicio*</Form.Label>
                                                    <Controller
                                                        name="ejercicio"
                                                        control={control}
                                                        // rules={{ required: 'Este campo es requerido' }}
                                                        render={({ field }) => (
                                                            <Form.Select aria-label="select-ejercicio-crear-plan" {...field} onChange={(e) => setIdEjercicioElegido(parseInt(e.target.value))}>
                                                                <option value='0'>Sin Elegir</option>
                                                                {ejerciciosByZC.map((e, index) => (
                                                                    <option key={index + 1} value={e.Ejercicio.id}>{e.Ejercicio.nombre}</option>
                                                                ))}
                                                            </Form.Select>
                                                        )}
                                                    />
                                                    {errors.ejercicio && <p>{errors.ejercicio.message}</p>}
                                                </Form.Group>
                                            </div>

                                            {idEjercicioElegido !== 0 && (
                                                <>
                                                    <div className="col-md-6">
                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput7">
                                                            <Form.Label>Maquina/Elemento*</Form.Label>
                                                            <Controller
                                                                name="nombreMaquina"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder={ejercicioElegido.Maquina ? ejercicioElegido.Maquina.nombre : ''}
                                                                        disabled
                                                                        {...field}
                                                                    />
                                                                )}
                                                            />
                                                            {errors.nombreMaquina && <p>{errors.nombreMaquina.message}</p>}
                                                        </Form.Group>
                                                    </div>

                                                    <>
                                                        {ejercicioElegido.Ejercicio.Categoria_Ejercicio.tiempo !== null && (
                                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput8">
                                                                <Form.Label>Tiempo*</Form.Label>
                                                                <Controller
                                                                    name="tiempoEjercicio"
                                                                    control={control}
                                                                    // rules={

                                                                    // }
                                                                    render={({ field }) => (
                                                                        <Form.Control
                                                                            type="text"
                                                                            placeholder="Ingresá el tiempoEjercicio del plan"
                                                                            {...field}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.tiempoEjercicio && <p>{errors.tiempoEjercicio.message}</p>}
                                                            </Form.Group>
                                                        )}
                                                        {ejercicioElegido.Ejercicio.Categoria_Ejercicio.series !== null && (
                                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput8">
                                                                <Form.Label>series*</Form.Label>
                                                                <Controller
                                                                    name="seriesEjercicio"
                                                                    control={control}
                                                                    // rules={

                                                                    // }
                                                                    render={({ field }) => (
                                                                        <Form.Control
                                                                            type="text"
                                                                            placeholder="Ingresá el seriesEjercicio del plan"
                                                                            {...field}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.seriesEjercicio && <p>{errors.seriesEjercicio.message}</p>}
                                                            </Form.Group>
                                                        )}
                                                        {(ejercicioElegido.Ejercicio.Categoria_Ejercicio.repeticiones !== null) && (
                                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput9">
                                                                <Form.Label>repeticiones*</Form.Label>
                                                                <Controller
                                                                    name="repsEjercicio"
                                                                    control={control}
                                                                    // rules={

                                                                    // }
                                                                    render={({ field }) => (
                                                                        <Form.Control
                                                                            type="text"
                                                                            placeholder="Ingresá el repsEjercicio del plan"
                                                                            {...field}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.repsEjercicio && <p>{errors.repsEjercicio.message}</p>}
                                                            </Form.Group>
                                                        )}
                                                        {(ejercicioElegido.Ejercicio.Categoria_Ejercicio.descanso !== null) && (
                                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput10">
                                                                <Form.Label>descanso*</Form.Label>
                                                                <Controller
                                                                    name="descanso"
                                                                    control={control}
                                                                    // rules={

                                                                    // }
                                                                    render={({ field }) => (
                                                                        <Form.Control
                                                                            type="text"
                                                                            placeholder="Ingresá el descanso del plan"
                                                                            {...field}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.descanso && <p>{errors.descanso.message}</p>}
                                                            </Form.Group>
                                                        )}
                                                    </>
                                                </>
                                            )}

                                            {Array.from({ length: cantidadSesionesIndicadas }).map((_, index) => (
                                                <p key={index}>Hola</p>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Form>
            </div>
        </>
    )
}

export { GenerarPlan }
