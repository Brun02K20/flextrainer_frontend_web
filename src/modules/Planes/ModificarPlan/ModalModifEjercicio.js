import React, { useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import "./ModificarPlan.css"

const ModalModifEjercicio = ({
    show,
    handleClose,
    ejercicioAModificar,
    nuevosValores,
    setNuevosValores,
    setEjercicioAModificar,
    setSesionIndexMod,
    setEjercicioIndexMod,
    ejercicioIndexMod,
    sesionIndexMod,
    planTraido,
    setPlanTraido
}) => {
    const { register, setValue, handleSubmit, formState: { errors }, reset, control } = useForm()

    useEffect(() => {
        if (ejercicioAModificar !== null && nuevosValores !== null) {
            if (ejercicioAModificar.tiempo) {
                setValue("tiempo", ejercicioAModificar.tiempo)
            }
            if (ejercicioAModificar.series) {
                setValue("series", ejercicioAModificar.series)
            }
            if (ejercicioAModificar.repeticiones) {
                setValue("repeticiones", ejercicioAModificar.repeticiones)
            }
            if (ejercicioAModificar.descanso) {
                setValue("descanso", ejercicioAModificar.descanso)
            }
        } else {
            reset()
        }
    }, [ejercicioAModificar, nuevosValores])

    const handleCleanValoresSetValue = () => {
        reset()
        setNuevosValores(null)
        setSesionIndexMod(null)
        setEjercicioIndexMod(null)
    }

    const onSubmit = async (data) => {
        data.tiempo = data.tiempo ? parseInt(data.tiempo) : ''
        data.series = data.series ? parseInt(data.series) : ''
        data.repeticiones = data.repeticiones ? parseInt(data.repeticiones) : ''
        data.descanso = data.descanso ? parseInt(data.descanso) : ''
        console.log("datos modificados: ", data)

        // Clonar el objeto planTraido para evitar mutaciones directas
        const nuevoPlanTraido = { ...planTraido };

        console.log("indice de la sesion: ", sesionIndexMod)
        console.log("que carajo pasa con el plan traido: ", nuevoPlanTraido.sesiones)

        // Actualizar los valores del ejercicio
        nuevoPlanTraido.sesiones[sesionIndexMod].ejercicios[ejercicioIndexMod].tiempo = data.tiempo;
        nuevoPlanTraido.sesiones[sesionIndexMod].ejercicios[ejercicioIndexMod].series = data.series;
        nuevoPlanTraido.sesiones[sesionIndexMod].ejercicios[ejercicioIndexMod].repeticiones = data.repeticiones;
        nuevoPlanTraido.sesiones[sesionIndexMod].ejercicios[ejercicioIndexMod].descanso = data.descanso;

        console.log("Nuevo planTraido: ", nuevoPlanTraido);
        setPlanTraido(nuevoPlanTraido)

        reset()
        handleClose()
        handleCleanValoresSetValue()
    }

    useEffect(() => {
        console.log("indice sesion: ", sesionIndexMod)
        console.log("indice ejercicio: ", ejercicioIndexMod)
    }, [sesionIndexMod, ejercicioIndexMod])

    return (
        <>
            <Modal show={show} onHide={() => { handleClose(); setNuevosValores(null); setEjercicioAModificar(null); handleCleanValoresSetValue() }}>
                <Modal.Header closeButton className='me-modal-header'>
                    <Modal.Title className='me-modal-title'>Modificar Ejercicio</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        {ejercicioAModificar && nuevosValores && (
                            <>
                                {ejercicioAModificar.tiempo && (
                                    <>
                                        <Form.Group controlId="formTiempo">
                                            <Form.Label>Tiempo*</Form.Label>
                                            {/* <Form.Control type="text" value={nuevosValores.tiempo} onChange={() => { console.log("a") }} /> */}
                                            <Controller
                                                name='tiempo'
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
                                                    // Form.Control es el campo que se va a mostrar por pantalla, y render es la funcion que permite mostrarlo
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Ingresá el tiempo de duración del ejercicio" // placeholder es el instructivo de que tiene que ingresar el usuario en ese campo
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </Form.Group>
                                        {errors.tiempo && <p>{errors.tiempo.message}</p>}
                                    </>
                                )}
                                {ejercicioAModificar.series && (
                                    <>
                                        <Form.Group controlId="formSeries">
                                            <Form.Label>Series*</Form.Label>
                                            <Controller
                                                name='series'
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
                                                    // Form.Control es el campo que se va a mostrar por pantalla, y render es la funcion que permite mostrarlo
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Ingresá la cantidad de series del ejercicio" // placeholder es el instructivo de que tiene que ingresar el usuario en ese campo
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </Form.Group>
                                        {errors.series && <p>{errors.series.message}</p>}
                                    </>
                                )}
                                {ejercicioAModificar.repeticiones && (
                                    <>
                                        <Form.Group controlId="formRepeticiones">
                                            <Form.Label>Repeticiones*</Form.Label>
                                            <Controller
                                                name='repeticiones'
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
                                                    // Form.Control es el campo que se va a mostrar por pantalla, y render es la funcion que permite mostrarlo
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Ingresá la cantidad de repeticiones por serie del ejercicio" // placeholder es el instructivo de que tiene que ingresar el usuario en ese campo
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </Form.Group>
                                        {errors.repeticiones && <p>{errors.repeticiones.message}</p>}
                                    </>
                                )}
                                {ejercicioAModificar.descanso && (
                                    <>
                                        <Form.Group controlId="formDescanso">
                                            <Form.Label>Descanso*</Form.Label>
                                            <Controller
                                                name='descanso'
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
                                                    // Form.Control es el campo que se va a mostrar por pantalla, y render es la funcion que permite mostrarlo
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Ingresá la cantidad de tiempo de descanso del ejercicio" // placeholder es el instructivo de que tiene que ingresar el usuario en ese campo
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </Form.Group>
                                        {errors.descanso && <p>{errors.descanso.message}</p>}
                                    </>
                                )}
                            </>
                        )}
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button style={{ backgroundColor: 'grey', border: 'none' }} onClick={() => { handleClose(); handleCleanValoresSetValue() }}>
                        Cancelar
                    </Button>
                    <Button style={{ backgroundColor: 'darkred', border: 'none' }} variant="success" onClick={handleSubmit(onSubmit)}>
                        Modificar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export { ModalModifEjercicio }