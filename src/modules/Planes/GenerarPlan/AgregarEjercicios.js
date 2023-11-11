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
            const response = await axios.get(`api/flextrainer/ejercicios/byZC/${zonaCuerpoIndicada}`)
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
                const response = await axios.get(`api/flextrainer/ejercicios/ejercicio/${idEjercicioElegido}`)
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
        if (!/^\d+$/.test(modificarValores.tiempo) && !camposVaciosIniciales.tiempo) {
            setErrorModifTiempo(true)
            return;
        }
        setErrorModifTiempo(false)

        if (!/^\d+$/.test(modificarValores.series) && !camposVaciosIniciales.series) {
            setErrorModifSeries(true)
            return;
        }
        setErrorModifSeries(false)

        if (!/^\d+$/.test(modificarValores.reps) && !camposVaciosIniciales.reps) {
            setErrorModifReps(true)
            return;
        }
        setErrorModifReps(false)

        if (!/^\d+$/.test(modificarValores.descanso) && !camposVaciosIniciales.descanso) {
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
                                            {errorSesionIndicada && <span>Elegi sesion</span>}
                                        </div>


                                        {sesionIndicada !== 0 && (
                                            <div className="col-md-6">
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                                                    <Form.Label>Zona del Cuerpo*</Form.Label>
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
                                                    {errorZCIndicada && <span>Elegi ZC</span>}
                                                </Form.Group>
                                            </div>
                                        )}

                                        {zonaCuerpoIndicada !== 0 && (
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
                                                    {errorEjElegido && <span>Elegi ejercicio</span>}
                                                </Form.Group>
                                            </div>
                                        )}

                                        {(idEjercicioElegido !== 0 && zonaCuerpoIndicada !== 0 && ejercicioElegido && ejerciciosByZC.length !== 0) && (
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

                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={handleSubmit(onSubmit)}>
                                                    <Button variant="danger" >
                                                        Agregar
                                                    </Button>
                                                </div>

                                                <>
                                                    {(ejercicioElegido && ejercicioElegido.Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio.tieneTiempo === true) && (
                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput8">
                                                            <Form.Label>Tiempo*</Form.Label>
                                                            <Controller
                                                                name="tiempoEjercicio"
                                                                control={control}
                                                                rules={{
                                                                    required: {
                                                                        value: true,
                                                                        message: 'Ingresa Tiempo del ejercicio'
                                                                    },
                                                                    pattern: {
                                                                        value: /^[1-9][0-9]*$/,
                                                                        message: 'Por favor, ingresa solo números positivos en este campo.'
                                                                    },
                                                                }}
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

                                                    {(ejercicioElegido && ejercicioElegido.Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio.tieneSeries === true) && (
                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput8">
                                                            <Form.Label>series*</Form.Label>
                                                            <Controller
                                                                name="seriesEjercicio"
                                                                control={control}
                                                                rules={{
                                                                    required: {
                                                                        value: true,
                                                                        message: 'Ingresa las series'
                                                                    },
                                                                    pattern: {
                                                                        value: /^(?:[1-9]|[1-9][0-9])$/,
                                                                        message: 'Por favor, ingresa un número entre 1 y 99.'
                                                                    },
                                                                }}
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
                                                    {(ejercicioElegido && ejercicioElegido.Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio.tieneRepeticiones === true) && (
                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput9">
                                                            <Form.Label>repeticiones*</Form.Label>
                                                            <Controller
                                                                name="repsEjercicio"
                                                                control={control}
                                                                rules={{
                                                                    required: {
                                                                        value: true,
                                                                        message: 'Ingresa las repeticiones'
                                                                    },
                                                                    pattern: {
                                                                        value: /^(?:[1-9]|[1-9][0-9])$/,
                                                                        message: 'Por favor, ingresa un número entre 1 y 99.'
                                                                    },
                                                                }}
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
                                                    {(ejercicioElegido && ejercicioElegido.Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio && ejercicioElegido.Ejercicio.Categoria_Ejercicio.tieneDescanso === true) && (
                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput10">
                                                            <Form.Label>Descanso*</Form.Label>
                                                            <Controller
                                                                name="descanso"
                                                                control={control}
                                                                rules={{
                                                                    required: {
                                                                        value: true,
                                                                        message: 'Ingresa Descanso del ejercicio'
                                                                    },
                                                                    pattern: {
                                                                        value: /^[1-9][0-9]*$/,
                                                                        message: 'Por favor, ingresa solo números positivos en este campo.'
                                                                    },
                                                                }}
                                                                render={({ field }) => (
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder="descanso en segundos"
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
                                    </>
                                )}
                            </div>

                            <div className="col-md-12">
                                {cantidadSesionesIndicadas !== 0 && (
                                    <>
                                        {Array.from({ length: cantidadSesionesIndicadas }).map((_, index) => (
                                            <div key={index}>
                                                <h2>Tabla de Sesion {index + 1}</h2>
                                                <Table striped bordered hover responsive key={index}>
                                                    <thead>
                                                        <tr>
                                                            {/* <th>Indice</th>
                                                            <th>Sesion</th> */}
                                                            <th>Ejercicio</th>
                                                            <th>Tiempo</th>
                                                            <th>Series</th>
                                                            <th>Repeticiones</th>
                                                            <th>Descanso</th>
                                                            <th>Maquina</th>
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
                                                                        {/* <td>{index}</td>
                                                                        <td>{row.sesion}</td> */}
                                                                        <td>{row.ejercicio.Ejercicio.nombre}</td>
                                                                        <td>{row.tiempoEjercicio ? row.tiempoEjercicio : 'No aplica'}</td>
                                                                        <td>{row.seriesEjercicio ? row.seriesEjercicio : 'No aplica'}</td>
                                                                        <td>{row.repsEjercicio ? row.repsEjercicio : 'No aplica'}</td>
                                                                        <td>{row.descanso ? row.descanso : 'No aplica'}</td>
                                                                        <td>{row.ejercicio.Maquina ? row.ejercicio.Maquina.nombre : 'No aplica'}</td>
                                                                        <td >
                                                                            <>
                                                                                <OverlayTrigger
                                                                                    placement='top'
                                                                                    overlay={
                                                                                        <Tooltip id='intentandoesto'>
                                                                                            <strong>Eliminar Ejercicio</strong>.
                                                                                        </Tooltip>
                                                                                    }
                                                                                >
                                                                                    <Button variant="secondary" style={{ backgroundColor: 'red', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => { handleEliminarRegistro(row.id) }}>
                                                                                        <i className="bi bi-x" style={{ fontSize: '16px' }}></i>
                                                                                    </Button>
                                                                                </OverlayTrigger>
                                                                            </>

                                                                            <OverlayTrigger
                                                                                placement='top'
                                                                                overlay={
                                                                                    <Tooltip id='intentandoesto2'>
                                                                                        <strong>Modificar Ejercicio</strong>.
                                                                                    </Tooltip>
                                                                                }
                                                                            >
                                                                                <Button variant="secondary" style={{ backgroundColor: 'green', border: 'none', borderRadius: '50%', margin: '8px 2px 2px 2px' }} onClick={() => { abrirModalModificar(row) }}>
                                                                                    <i className="bi bi-check" style={{ fontSize: '16px' }}></i>
                                                                                </Button>
                                                                            </OverlayTrigger>
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
                <Modal.Header closeButton>
                    <Modal.Title>Modificar Ejercicio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(ejercicioAModificar !== null && !camposVaciosIniciales.tiempo) && (
                        <Form.Group>
                            <Form.Label>Tiempo</Form.Label>
                            <Form.Control
                                type="text"
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
                    {errorModifTiempo && <p>ERROR. INGRESA UN NUMERO</p>}

                    {(ejercicioAModificar !== null && !camposVaciosIniciales.series) && (
                        <Form.Group>
                            <Form.Label>Series</Form.Label>
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
                    {errorModifSeries && <p>ERROR. INGRESA UN NUMERO</p>}

                    {(ejercicioAModificar !== null && !camposVaciosIniciales.reps) && (
                        <Form.Group>
                            <Form.Label>Repeticiones</Form.Label>
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
                    {errorModifReps && <p>ERROR. INGRESA UN NUMERO</p>}
                    {(ejercicioAModificar !== null && !camposVaciosIniciales.descanso) && (
                        <Form.Group>
                            <Form.Label>Descanso</Form.Label>
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
                    {errorModifDescanso && <p>ERROR. INGRESA UN NUMERO</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalOpen(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={aplicarCambios}>
                        Aplicar cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export { AgregarEjercicios }