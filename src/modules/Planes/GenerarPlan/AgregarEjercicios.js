import React, { useState, useEffect } from 'react';

// importando componentes de react-bootstrap necesarios
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Nav, Table, Pagination } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Modal } from 'react-bootstrap';

import axios from 'axios'; // importo axios para llevar a cabo las peticiones al backend
import { useForm, Controller, set } from 'react-hook-form';
import { cuerpoZonasServices } from '../services/cuerpoZonas.service.js';

import { API } from '../../../constants/api.js';
import './AgregarEjercicios.css'

const AgregarEjercicios = ({ cantidadSesionesIndicadas, ejerciciosAgregados, setEjerciciosAgregados }) => {
    const { formState: { errors }, register, setValue, handleSubmit, control, reset } = useForm();

    const [cuerpoZonasTraidos, setCuerpoZonasTraidos] = useState([])
    const [ejerciciosByZC, setEjericiosByZC] = useState([])

    const [sesionIndicada, setSesionIndicada] = useState(0)
    const [zonaCuerpoIndicada, setZonaCuerpoIndicada] = useState(0);
    const [idEjercicioElegido, setIdEjercicioElegido] = useState(0);
    const [ejercicioElegido, setEjercicioElegido] = useState({});

    const [errorSesionIndicada, setErrorSesionIndicada] = useState(false)
    const [errorZCIndicada, setErrorZCIndicada] = useState(false)
    const [errorEjElegido, setErrorEjElegido] = useState(false);

    const agregarEjercicios = (ejercicio) => {
        setEjerciciosAgregados([...ejerciciosAgregados, ejercicio])
    }

    const handleEliminarRegistro = (registroId) => {
        // Filtra el array ejerciciosAgregados para mantener solo los registros que no coinciden con el registroId
        const nuevosEjerciciosAgregados = ejerciciosAgregados.filter(
            (registro) => registro.id !== registroId
        );

        // Actualiza el estado con el nuevo array sin el registro eliminado
        setEjerciciosAgregados(nuevosEjerciciosAgregados);
    };

    useEffect(() => {
        const traerCuerpoZonas = async () => {
            const response = await cuerpoZonasServices.getCuerpoZonas()
            setCuerpoZonasTraidos(response)
        }
        traerCuerpoZonas()
    }, [])

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

    useEffect(() => {
        console.log("zona del cuerpo indicada", zonaCuerpoIndicada)
        console.log("ejercicios traidos: ", ejerciciosByZC)
    }, [ejerciciosByZC, zonaCuerpoIndicada])

    useEffect(() => {
        const traerDatosEjercicioElegido = async () => {
            if (idEjercicioElegido !== 0 && idEjercicioElegido !== '') {
                const response = await axios.get(`${API}/flextrainer/ejercicios/ejercicio/${idEjercicioElegido}`, { timeout: 500000 })
                setEjercicioElegido(response.data)
            }
        }
        traerDatosEjercicioElegido()
    }, [idEjercicioElegido]);

    useEffect(() => {
        console.log("ej elegido: ", ejercicioElegido)
    }, [ejercicioElegido])

    useEffect(() => {
        console.log("ejercicios hasta ahora: ", ejerciciosAgregados)
    }, [ejerciciosAgregados])

    useEffect(() => {
        console.log("sesion elegida: ", sesionIndicada)
    }, [sesionIndicada])

    // gestion del modal de la modificacion de un ejercicio mientras se crea
    const [modalOpen, setModalOpen] = useState(false);
    const [ejercicioAModificar, setEjercicioAModificar] = useState(null);
    const [camposVaciosIniciales, setCamposVaciosIniciales] = useState({
        tiempo: true,
        series: true,
        reps: true,
        descanso: true,
    });
    const [modificarValores, setModificarValores] = useState({
        tiempo: "",
        series: "",
        reps: "",
        descanso: "",
    });
    const abrirModalModificar = (ejercicio) => {
        setEjercicioAModificar(ejercicio); // Establece el ejercicio que se va a modificar

        setModificarValores({
            tiempo: ejercicio.tiempoEjercicio || "",
            series: ejercicio.seriesEjercicio || "",
            reps: ejercicio.repsEjercicio || "",
            descanso: ejercicio.descanso || "",
        });

        setCamposVaciosIniciales({
            tiempo: !ejercicio.tiempoEjercicio,
            series: !ejercicio.seriesEjercicio,
            reps: !ejercicio.repsEjercicio,
            descanso: !ejercicio.descanso,
        });
        setModalOpen(true);
    };

    const [errorModifTiempo, setErrorModifTiempo] = useState(false);
    const [errorModifSeries, setErrorModifSeries] = useState(false);
    const [errorModifReps, setErrorModifReps] = useState(false);
    const [errorModifDescanso, setErrorModifDescanso] = useState(false);

    const aplicarCambios = () => {
        if (!/^[1-9][0-9]*$/.test(modificarValores.tiempo) && !camposVaciosIniciales.tiempo) {
            setErrorModifTiempo(true)
            return;
        }
        setErrorModifTiempo(false)

        if (!/^(?:[1-9]|[1-9][0-9])$/.test(modificarValores.series) && !camposVaciosIniciales.series) {
            setErrorModifSeries(true)
            return;
        }
        setErrorModifSeries(false)

        if (!/^(?:[1-9]|[1-9][0-9])$/.test(modificarValores.reps) && !camposVaciosIniciales.reps) {
            setErrorModifReps(true)
            return;
        }
        setErrorModifReps(false)

        if (!/^[1-9][0-9]*$/.test(modificarValores.descanso) && !camposVaciosIniciales.descanso) {
            setErrorModifDescanso(true)
            return;
        }
        setErrorModifDescanso(false)

        const ejerciciosActualizados = ejerciciosAgregados.map((ejercicio) => {
            if (ejercicio.id === ejercicioAModificar.id) {
                return {
                    ...ejercicio,
                    tiempoEjercicio: modificarValores.tiempo,
                    seriesEjercicio: modificarValores.series,
                    repsEjercicio: modificarValores.reps,
                    descanso: modificarValores.descanso,
                };
            }
            return ejercicio;
        });
        setEjercicioAModificar(null); // Reinicia la variable después de aplicar los cambios
        setEjerciciosAgregados(ejerciciosActualizados); // Actualiza el estado con los ejercicios modificados
        setModalOpen(false); // Cierra el modal
    };


    useEffect(() => {
        console.log("ejm: ", ejercicioAModificar)
    }, [ejercicioAModificar])

    const [nextId, setNextId] = useState(1)
    const onSubmit = async (data) => {
        data.id = nextId
        setNextId(prevState => prevState + 1)

        data.sesion = sesionIndicada
        data.cuerpoZona = zonaCuerpoIndicada
        data.ejercicio = ejercicioElegido
        delete data.nombreMaquina

        if (data.sesion === 0) {
            setErrorSesionIndicada(true);
            return;
        }
        setErrorSesionIndicada(false);

        if (data.cuerpoZona === 0) {
            setErrorZCIndicada(true);
            return;
        }
        setErrorZCIndicada(false);

        if (!data.ejercicio.id) {
            setErrorEjElegido(true);
            return;
        }
        setErrorEjElegido(false);

        console.log(data)

        agregarEjercicios(data)

        setValue('descanso', '')
        setValue('repsEjercicio', '')
        setValue('seriesEjercicio', '')
        setValue('tiempoEjercicio', '')
        setEjercicioElegido({})
        setIdEjercicioElegido(0)
        setSesionIndicada(0)
        setZonaCuerpoIndicada(0)
        setEjericiosByZC([])
        // Incrementa el contador para el próximo 'id'
    }

    return (
        <>
            <Form>
                <Card>
                    <Card.Body>
                        <div className="row">
                            <p style={{ color: 'darkred', fontWeight: '600' }}>Ejercicios</p>
                            {cantidadSesionesIndicadas !== 0 && (
                                <>
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
                                                        onChange={(e) => setSesionIndicada(e.target.value ? parseInt(e.target.value) : 0)}
                                                        value={sesionIndicada}
                                                    >
                                                        <option value='0'>Sin Elegir</option>
                                                        {Array.from({ length: cantidadSesionesIndicadas }, (_, index) => (
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
                                                                name="tiempoEjercicio"
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
                                                                name="seriesEjercicio"
                                                                control={control}
                                                                rules={{
                                                                    required: {
                                                                        value: true,
                                                                        message: 'Ingresá la cantidad de series del ejercicio'
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
                                                                name="repsEjercicio"
                                                                control={control}
                                                                rules={{
                                                                    required: {
                                                                        value: true,
                                                                        message: 'Ingresá la cantidad de repeticiones por serie del ejercicio'
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
                                </>
                            )}

                            <div className="col-md-12">
                                {cantidadSesionesIndicadas !== 0 && (
                                    <>
                                        {Array.from({ length: cantidadSesionesIndicadas }).map((_, index) => (
                                            <div key={index}>
                                                <h2>Sesión N° {index + 1}</h2>
                                                <Table striped bordered hover responsive key={index}>
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
                                                        {ejerciciosAgregados.length !== 0
                                                            &&
                                                            ejerciciosAgregados
                                                                .filter((row) => row.sesion === index + 1)
                                                                .map((row, index) => (
                                                                    <tr key={index + 1}>
                                                                        <td>{row.ejercicio.Ejercicio.nombre?.toUpperCase()}</td>
                                                                        <td>{row.tiempoEjercicio ? row.tiempoEjercicio + " ' " : '--------'}</td>
                                                                        <td>{row.seriesEjercicio ? row.seriesEjercicio : '--------'}</td>
                                                                        <td>{row.repsEjercicio ? row.repsEjercicio : '--------'}</td>
                                                                        <td>{row.descanso ? row.descanso + " '' " : '--------'}</td>
                                                                        <td>{row.ejercicio.Maquina ? row.ejercicio.Maquina.nombre?.toUpperCase() : '--------'}</td>
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
                                                                                    <Button variant="secondary" style={{ backgroundColor: 'red', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => { handleEliminarRegistro(row.id) }}>
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
                                                                                    <Button variant="secondary" style={{ backgroundColor: 'green', border: 'none', borderRadius: '50%', margin: '8px 2px 2px 2px' }} onClick={() => { abrirModalModificar(row) }}>
                                                                                        <i className="bi bi-pencil-square" style={{ fontSize: '16px' }}></i>
                                                                                    </Button>
                                                                                </OverlayTrigger>
                                                                            </>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                        }
                                                    </tbody>
                                                </Table>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Form>

            <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
                <Modal.Header className='ae-modal-header' closeButton>
                    <Modal.Title className='ae-modal-title'>Modificar ejercicio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(ejercicioAModificar !== null && !camposVaciosIniciales.tiempo) && (
                        <Form.Group>
                            <Form.Label>Tiempo (en minutos)*</Form.Label>
                            <Form.Control
                                type="number"
                                value={modificarValores.tiempo}
                                onChange={(e) =>
                                    setModificarValores({
                                        ...modificarValores,
                                        tiempo: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                    )}
                    {errorModifTiempo && <p style={{ color: 'darkred' }}>Ingresá tiempo del ejercicio en minutos</p>}

                    {(ejercicioAModificar !== null && !camposVaciosIniciales.series) && (
                        <Form.Group>
                            <Form.Label>Series*</Form.Label>
                            <Form.Control
                                type="text"
                                value={modificarValores.series}
                                onChange={(e) =>
                                    setModificarValores({
                                        ...modificarValores,
                                        series: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                    )}
                    {errorModifSeries && <p style={{ color: 'darkred' }}>Ingresá las series del ejercicio</p>}

                    {(ejercicioAModificar !== null && !camposVaciosIniciales.reps) && (
                        <Form.Group>
                            <Form.Label>Repeticiones*</Form.Label>
                            <Form.Control
                                type="text"
                                value={modificarValores.reps}
                                onChange={(e) =>
                                    setModificarValores({
                                        ...modificarValores,
                                        reps: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                    )}
                    {errorModifReps && <p style={{ color: 'darkred' }}>Ingresá las repeticiones de las series</p>}
                    {(ejercicioAModificar !== null && !camposVaciosIniciales.descanso) && (
                        <Form.Group>
                            <Form.Label>Descanso (en segundos)*</Form.Label>
                            <Form.Control
                                type="text"
                                value={modificarValores.descanso}
                                onChange={(e) =>
                                    setModificarValores({
                                        ...modificarValores,
                                        descanso: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                    )}
                    {errorModifDescanso && <p style={{ color: 'darkred' }}>Ingresá descanso del ejercicio en segundos</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{ backgroundColor: 'grey', marginRight: '8px', border: 'none' }} onClick={() => setModalOpen(false)}>
                        Cerrar
                    </Button>
                    <Button style={{ backgroundColor: 'darkred', marginRight: '8px', border: 'none' }} onClick={aplicarCambios}>
                        Aplicar cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export { AgregarEjercicios }