import React, { useState, useEffect } from 'react';
import { Table, Card, OverlayTrigger, Tooltip, Button, Form } from 'react-bootstrap';
import { ModalModifEjercicio } from './ModalModifEjercicio';
import { cuerpoZonasServices } from '../services/cuerpoZonas.service.js';
import axios from 'axios';
import { API } from '../../../constants/api.js';
import { useForm, Controller } from 'react-hook-form';

const AgregarModificarEjercicios = ({ planTraido, setPlanTraido }) => {
    // hook genericos
    const { register, setValue, reset, handleSubmit, control, formState: { errors } } = useForm();


    // GESTION DE LA MODIFICACION Y/O LA ELIMINACION DE UN EJERCICIO
    // gestion de modal de modificacion de ejercicio
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // funcion que elimina un ejercicio de una sesion
    const eliminarEjercicio = (sesionIndex, ejercicioIndex) => {
        // Realiza la lógica para eliminar el ejercicio del array
        const nuevasSesiones = [...planTraido.sesiones];
        nuevasSesiones[sesionIndex].ejercicios.splice(ejercicioIndex, 1);
        // Actualiza el estado con las sesiones actualizadas
        setPlanTraido({ ...planTraido, sesiones: nuevasSesiones });
    }

    // estados para la modificacion
    const [ejercicioAModificar, setEjercicioAModificar] = useState(null) // almacenar que ejercicio eligio para modificar
    const [nuevosValores, setNuevosValores] = useState(null); // almacenar los valores del ejercicio a modificar, mal llamado nuevos valores
    const [sesionIndexMod, setSesionIndexMod] = useState(null) // indice de la sesion del ejercicio a modificar
    const [ejercicioIndexMod, setEjercicioIndexMod] = useState(null) // indice del ejercicio a modificar dentro de la sesion

    // si se eligio un ejercicio a modificar, que setee los valores a modificar de dicho ejercicio, esto se ejecuta cada vez que se elige un ejercicio a modificar diferente
    useEffect(() => {
        console.log("ejercicio a modificar: ", ejercicioAModificar)
        if (ejercicioAModificar !== null) {
            setNuevosValores({
                tiempo: ejercicioAModificar.tiempo ? ejercicioAModificar.tiempo : '',
                series: ejercicioAModificar.series ? ejercicioAModificar.series : '',
                repeticiones: ejercicioAModificar.repeticiones ? ejercicioAModificar.repeticiones : '',
                descanso: ejercicioAModificar.descanso ? ejercicioAModificar.descanso : '',
            })
        }
    }, [ejercicioAModificar])

    // consoleos
    useEffect(() => {
        console.log("nuevos valores: ", nuevosValores)
    }, [nuevosValores])

    useEffect(() => {
        console.log("indice sesion: ", sesionIndexMod)
        console.log("indice ejercicio: ", ejercicioIndexMod)
    }, [sesionIndexMod, ejercicioIndexMod])


    // GESTION DEL AGREGADO DE UN NUEVO EJERCICIO
    const [cuerpoZonasTraidos, setCuerpoZonasTraidos] = useState([]) // almacenar todas las zonas del cuerpo del backend
    const [ejerciciosByZC, setEjericiosByZC] = useState([]) // almacenar los ejercicios asociados a la zona del cuerpo indicada

    const [sesionIndicada, setSesionIndicada] = useState(0) // almacenar el nro la sesion indicada
    const [indexSesionIndicada, setIndexSesionIndicada] = useState(null) // almacenar el nro de indice de la sesion indicada
    const [zonaCuerpoIndicada, setZonaCuerpoIndicada] = useState(0); // almacenar que zona del cuerpo eligio
    const [idEjercicioElegido, setIdEjercicioElegido] = useState(0); // almacenar el id del ejercicio quye eligio agreagr
    const [ejercicioElegido, setEjercicioElegido] = useState({}); // almacenar el ejercicio que eligio agregar

    // efecto para traer todas las zonas del cuerpo existentes
    useEffect(() => {
        const traerCuerpoZonas = async () => {
            const response = await cuerpoZonasServices.getCuerpoZonas()
            setCuerpoZonasTraidos(response)
        }
        traerCuerpoZonas()
    }, [])

    // efecto para traer todos los ejercicios segun la zona del cuerpo indicada
    useEffect(() => {
        const traerEjerciciosByZC = async () => {
            setIdEjercicioElegido('')
            setEjercicioElegido({})
            setEjericiosByZC([])
            const response = await axios.get(`${API}/flextrainer/ejercicios/byZC/${zonaCuerpoIndicada}`, { timeout: 500000 })
            setEjericiosByZC(response.data)
        }
        traerEjerciciosByZC();
    }, [zonaCuerpoIndicada]);

    // efecto para traer los datos del ejercicio elegido en el combobox
    useEffect(() => {
        const traerDatosEjercicioElegido = async () => {
            if (idEjercicioElegido !== 0 && idEjercicioElegido !== '') {
                const response = await axios.get(`${API}/flextrainer/ejercicios/ejercicio/${idEjercicioElegido}`, { timeout: 500000 })
                setEjercicioElegido(response.data)
            }
        }
        traerDatosEjercicioElegido()
    }, [idEjercicioElegido]);

    // gestion de errores en el formulario de agregado, mas especificamente para los combobox
    const [errorSesionIndicada, setErrorSesionIndicada] = useState(false)
    const [errorZCIndicada, setErrorZCIndicada] = useState(false)
    const [errorEjElegido, setErrorEjElegido] = useState(false);

    // funcion que en cuanto se pulse agregar, va a añadir al plan traido un nuevo ejercicio a una sesion indicada
    const onSubmit = async (data) => {
        // validaciones de errores de los combobox
        if (sesionIndicada === 0) {
            setErrorSesionIndicada(true);
            return;
        }
        setErrorSesionIndicada(false);

        if (zonaCuerpoIndicada === 0) {
            setErrorZCIndicada(true);
            return;
        }
        setErrorZCIndicada(false);

        if (idEjercicioElegido === 0 || idEjercicioElegido === '') {
            setErrorEjElegido(true);
            return;
        }
        setErrorEjElegido(false);

        // parseando los datos
        data.tiempo = data.tiempo ? parseInt(data.tiempo) : '' // conversiones de tipo
        data.series = data.series ? parseInt(data.series) : ''
        data.repeticiones = data.repeticiones ? parseInt(data.repeticiones) : ''
        data.descanso = data.descanso ? parseInt(data.descanso) : ''

        // Crear una copia del ejercicioElegido con los nuevos valores
        const nuevoEjercicio = {
            ...ejercicioElegido,
            tiempo: data.tiempo,
            series: data.series,
            repeticiones: data.repeticiones,
            descanso: data.descanso,
        };

        // Actualizar el estado con el nuevo ejercicio
        setEjercicioElegido(nuevoEjercicio);
        data.ejercicio = ejercicioElegido // asignando el ejercicio elegido

        // borrando datos innecesarios para la agregacion de un ejercicio a una sesion
        delete data.cuerpoZona
        delete data.nombreMaquina

        data.sesion = indexSesionIndicada // diciendo que la sesion a la cual voy a agregar la sesion va a ser el indice de la sesion indicada
        console.log("los datos del ejercicio a agregar: ", data)

        // AGREGANDO EL NUEVO EJERCICIO AL PLAN POR FAVOR QUE ANDE
        // Suponiendo que ejercicios es el array de ejercicios de la sesión en planTraido
        const ejerciciosSesion = planTraido.sesiones[indexSesionIndicada].ejercicios;

        // Agregar el nuevo ejercicio a la sesión actual
        const nuevaSesion = {
            ...planTraido.sesiones[indexSesionIndicada],
            ejercicios: [...ejerciciosSesion, nuevoEjercicio],
        };

        // Crear una copia del objeto planTraido con la nueva sesión
        const nuevoPlanTraido = {
            ...planTraido,
            sesiones: planTraido.sesiones.map((sesion, index) =>
                index === indexSesionIndicada ? nuevaSesion : sesion
            ),
        };

        // Actualizar el estado con el nuevo planTraido
        setPlanTraido(nuevoPlanTraido);

        // reseteando los datos
        setEjercicioElegido({})
        setIdEjercicioElegido(0)
        setSesionIndicada(0)
        setZonaCuerpoIndicada(0)
        setEjericiosByZC([])
        reset()
        setValue("tiempo", "")
        setValue("series", "")
        setValue("repeticiones", "")
        setValue("descanso", "")
        reset()
    }


    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p style={{ color: 'darkred', fontWeight: '600' }}>Ejercicios</p>
                        {planTraido ?
                            <>
                                <>
                                    <div className='row'>
                                        <div className="col-md-6">
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                                <Form.Label>Sesión*</Form.Label>
                                                <Controller
                                                    name="sesion"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Form.Select
                                                            aria-label="select-sesion-crear-plan"
                                                            {...field}
                                                            onChange={(e) => { setSesionIndicada(e.target.value ? parseInt(e.target.value) : 0); setIndexSesionIndicada(e.target.value ? parseInt(e.target.value) - 1 : null) }}
                                                            value={sesionIndicada}
                                                        >
                                                            <option value=''>Sin Elegir</option>
                                                            {Array.from({ length: planTraido.cantSesiones }, (_, index) => (
                                                                <option key={index + 1} value={index + 1}>
                                                                    {index + 1}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    )}
                                                />
                                            </Form.Group>
                                            {errorSesionIndicada && <span style={{ color: 'darkred' }}>Elegí la sesión</span>}
                                        </div>

                                        {sesionIndicada !== 0 && (
                                            <div className="col-md-6">
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                                                    <Form.Label>Zona del cuerpo*</Form.Label>
                                                    <Controller
                                                        name="cuerpoZona"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Form.Select
                                                                aria-label="select-zc-crear-plan"
                                                                {...field}
                                                                onChange={(e) => {
                                                                    const selectedValue = e.target.value ? parseInt(e.target.value) : 0;
                                                                    setZonaCuerpoIndicada(selectedValue);
                                                                    // Configura el segundo select en "Sin Elegir" cuando cambia el primero
                                                                    setIdEjercicioElegido(0);
                                                                    setEjercicioElegido({})
                                                                }}
                                                                value={zonaCuerpoIndicada}
                                                            >
                                                                <option value=''>Sin Elegir</option>
                                                                {cuerpoZonasTraidos.map((e, index) => (
                                                                    <option key={index + 1} value={e.id}>{e.nombre}</option>
                                                                ))}
                                                            </Form.Select>
                                                        )}
                                                    />
                                                    {errorZCIndicada && <span style={{ color: 'darkred' }}>Elegí la zona del cuerpo del ejercicio</span>}
                                                </Form.Group>
                                            </div>
                                        )}

                                        {zonaCuerpoIndicada !== 0 && sesionIndicada !== 0 && (
                                            <div className="col-md-6">
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                                                    <Form.Label>Ejercicio*</Form.Label>
                                                    <Controller
                                                        name="ejercicio"
                                                        control={control}
                                                        // rules={{ required: 'Este campo es requerido' }}
                                                        render={({ field }) => (
                                                            <Form.Select value={idEjercicioElegido} aria-label="select-ejercicio-crear-plan" {...field} onChange={(e) => setIdEjercicioElegido(e.target.value ? parseInt(e.target.value) : 0)}>
                                                                <option value={0}>Sin Elegir</option>
                                                                {ejerciciosByZC.map((e, index) => (
                                                                    <option key={index + 1} value={e.Ejercicio.id}>{e.Ejercicio.nombre}</option>
                                                                ))}
                                                            </Form.Select>
                                                        )}
                                                    />
                                                    {errorEjElegido && <span style={{ color: 'darkred' }}>Elegí el ejercicio</span>}
                                                </Form.Group>
                                            </div>
                                        )}

                                        {(idEjercicioElegido !== 0 && zonaCuerpoIndicada !== 0 && ejercicioElegido && ejerciciosByZC.length !== 0 && sesionIndicada !== 0) && (
                                            <>
                                                <div className="col-md-6">
                                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput7">
                                                        <Form.Label>Máquina/Elemento</Form.Label>
                                                        <Controller
                                                            name="nombreMaquina"
                                                            control={control}
                                                            rules={
                                                                {
                                                                    required: {
                                                                        value: false
                                                                    }
                                                                }
                                                            }
                                                            render={({ field }) => (
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder={ejercicioElegido.Maquina ? ejercicioElegido.Maquina.nombre : ''}
                                                                    disabled
                                                                    {...field}
                                                                />
                                                            )}
                                                        />
                                                        {errors.nombreMaquina && <p style={{ color: 'darkred' }}>{errors.nombreMaquina.message}</p>}
                                                    </Form.Group>
                                                </div>

                                                <div className='row'>
                                                    <div className='col-md-6'>
                                                        {(ejercicioElegido && ejercicioElegido.Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio.tieneTiempo === true) && (
                                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput8">
                                                                <Form.Label>Tiempo (en minutos)*</Form.Label>
                                                                <Controller
                                                                    name="tiempo"
                                                                    control={control}
                                                                    rules={{
                                                                        required: {
                                                                            value: true,
                                                                            message: 'Ingresá el tiempo del ejercicio en minutos'
                                                                        },
                                                                        pattern: {
                                                                            value: /^[1-9][0-9]*$/,
                                                                            message: 'Por favor, ingresá solo números positivos en este campo.'
                                                                        },
                                                                        max: {
                                                                            value: 59,
                                                                            message: "La máxima cantidad de minutos permitidos es 59"
                                                                        }
                                                                    }}
                                                                    render={({ field }) => (
                                                                        <Form.Control
                                                                            type="number"
                                                                            placeholder="Ingresá el tiempo del ejercicio"
                                                                            {...field}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.tiempoEjercicio && <p style={{ color: 'darkred' }}>{errors.tiempoEjercicio.message}</p>}
                                                            </Form.Group>
                                                        )}

                                                        {(ejercicioElegido && ejercicioElegido.Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio.tieneSeries === true) && (
                                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput8">
                                                                <Form.Label>Series*</Form.Label>
                                                                <Controller
                                                                    name="series"
                                                                    control={control}
                                                                    rules={{
                                                                        required: {
                                                                            value: true,
                                                                            message: 'Ingresá las series'
                                                                        },
                                                                        pattern: {
                                                                            value: /^(?:[1-9]|[1-9][0-9])$/,
                                                                            message: 'Por favor, ingresá un número entre 1 y 99.'
                                                                        },
                                                                    }}
                                                                    render={({ field }) => (
                                                                        <Form.Control
                                                                            type="number"
                                                                            placeholder="Ingresá la cantidad de series del ejercicio"
                                                                            {...field}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.seriesEjercicio && <p style={{ color: 'darkred' }}>{errors.seriesEjercicio.message}</p>}
                                                            </Form.Group>
                                                        )}
                                                        {(ejercicioElegido && ejercicioElegido.Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio.tieneRepeticiones === true) && (
                                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput9">
                                                                <Form.Label>Repeticiones*</Form.Label>
                                                                <Controller
                                                                    name="repeticiones"
                                                                    control={control}
                                                                    rules={{
                                                                        required: {
                                                                            value: true,
                                                                            message: 'Ingresá las repeticiones'
                                                                        },
                                                                        pattern: {
                                                                            value: /^(?:[1-9]|[1-9][0-9])$/,
                                                                            message: 'Por favor, ingresá un número entre 1 y 99.'
                                                                        },
                                                                    }}
                                                                    render={({ field }) => (
                                                                        <Form.Control
                                                                            type="number"
                                                                            placeholder="Ingresá las repeticiones de las series"
                                                                            {...field}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.repsEjercicio && <p style={{ color: 'darkred' }}>{errors.repsEjercicio.message}</p>}
                                                            </Form.Group>
                                                        )}
                                                        {(ejercicioElegido && ejercicioElegido.Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio.tieneDescanso === true) && (
                                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput10">
                                                                <Form.Label>Descanso (en segundos)*</Form.Label>
                                                                <Controller
                                                                    name="descanso"
                                                                    control={control}
                                                                    rules={{
                                                                        required: {
                                                                            value: true,
                                                                            message: 'Ingresá el tiempo de descanso del ejercicio'
                                                                        },
                                                                        pattern: {
                                                                            value: /^[1-9][0-9]*$/,
                                                                            message: 'Por favor, ingresá solo números positivos en este campo.'
                                                                        },
                                                                        max: {
                                                                            value: 300,
                                                                            message: "La máxima cantidad de segundos permitidos es 300"
                                                                        }
                                                                    }}
                                                                    render={({ field }) => (
                                                                        <Form.Control
                                                                            type="number"
                                                                            placeholder="Ingresá el tiempo de descanso del ejercicio en segundos"
                                                                            {...field}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.descanso && <p style={{ color: 'darkred' }}>{errors.descanso.message}</p>}
                                                            </Form.Group>
                                                        )}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={handleSubmit(onSubmit)}>
                                                    <Button style={{ backgroundColor: 'darkred', border: 'none', margin: '8px' }} >
                                                        Agregar
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>

                                <br></br>
                                {planTraido.sesiones && planTraido.sesiones.map((sesion, sesionIndex) => (
                                    <div key={sesion.id}>
                                        <h3>Sesión N° {sesionIndex + 1}</h3>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>Ejercicio</th>
                                                    <th>Tiempo</th>
                                                    <th>Series</th>
                                                    <th>Repeticiones</th>
                                                    <th>Descanso</th>
                                                    <th>Máquina</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sesion.ejercicios && sesion.ejercicios.map((ejercicio, ejercicioIndex) => (
                                                    <tr key={ejercicioIndex}>
                                                        <td>{ejercicio["Ejercicio.nombre"] ? ejercicio["Ejercicio.nombre"]?.toUpperCase() : (ejercicio.Ejercicio.nombre?.toUpperCase())}</td>
                                                        <td>{ejercicio["tiempo"] ? ejercicio["tiempo"] + " ' " : '--------'}</td>
                                                        <td>{ejercicio["series"] ? ejercicio["series"] : '--------'}</td>
                                                        <td>{ejercicio["repeticiones"] ? ejercicio["repeticiones"] : '--------'}</td>
                                                        <td>{ejercicio["descanso"] ? ejercicio["descanso"] + " '' " : '--------'}</td>
                                                        <td>{ejercicio["Ejercicio.Maquinas.nombre"] ? ejercicio["Ejercicio.Maquinas.nombre"]?.toUpperCase() : (ejercicio.Maquina ? ejercicio.Maquina.nombre?.toUpperCase() : '--------')}</td>
                                                        <td >
                                                            <>
                                                                <OverlayTrigger
                                                                    placement='top'
                                                                    overlay={
                                                                        <Tooltip id='intentandoesto'>
                                                                            <strong>Eliminar ejercicio</strong>.
                                                                        </Tooltip>
                                                                    }
                                                                >
                                                                    <Button variant="secondary" style={{ backgroundColor: 'red', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => { eliminarEjercicio(sesionIndex, ejercicioIndex) }}>
                                                                        <i className="bi bi-x" style={{ fontSize: '16px' }}></i>
                                                                    </Button>
                                                                </OverlayTrigger>
                                                                <OverlayTrigger
                                                                    placement='top'
                                                                    overlay={
                                                                        <Tooltip id='intentandoesto'>
                                                                            <strong>Modificar ejercicio</strong>.
                                                                        </Tooltip>
                                                                    }
                                                                >
                                                                    <Button variant="secondary" style={{ backgroundColor: 'green', border: 'none', borderRadius: '50%', margin: '8px 2px 2px 2px' }} onClick={() => { setSesionIndexMod(sesionIndex); setEjercicioIndexMod(ejercicioIndex); setEjercicioAModificar(ejercicio); handleShow() }}>
                                                                        <i className="bi bi-pencil-square" style={{ fontSize: '16px' }}></i>
                                                                    </Button>
                                                                </OverlayTrigger>
                                                            </>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                ))}
                            </>
                            : (
                                <>Cargando..</>
                            )}
                    </Card.Body>
                </Card>
            </div>

            <ModalModifEjercicio
                show={show}
                handleClose={handleClose}
                ejercicioAModificar={ejercicioAModificar}
                nuevosValores={nuevosValores}
                setNuevosValores={setNuevosValores}
                setEjercicioAModificar={setEjercicioAModificar}
                setEjercicioIndexMod={setEjercicioIndexMod}
                setSesionIndexMod={setSesionIndexMod}
                ejercicioIndexMod={ejercicioIndexMod}
                sesionIndexMod={sesionIndexMod}
                planTraido={planTraido}
                setPlanTraido={setPlanTraido}
            />
        </>
    )
}

export { AgregarModificarEjercicios }