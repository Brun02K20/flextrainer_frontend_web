import React, { useEffect, useState } from 'react';

// importando componentes de react-bootstrap necesarios
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import axios from 'axios'; // importo axios para llevar a cabo las peticiones al backend
import { NavHeader } from '../../../components/NavHeader/NavHeader.js';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, set } from 'react-hook-form';
import { objetivosServices } from '../services/objetivos.service.js';
import { AgregarEjercicios } from './AgregarEjercicios.js';

import { API } from '../../../constants/api.js';

const GenerarPlan = ({ usuarioEnSesion }) => {
    const navigate = useNavigate();
    const { formState: { errors }, register, setValue, handleSubmit, control } = useForm();
    const [cantidadSesionesIndicadas, setCantidadSesionesIndicadas] = useState(0);
    const [objetivosTraidos, setObjetivosTraidos] = useState([])
    const [ejerciciosAgregados, setEjerciciosAgregados] = useState([]);
    const [errorEjercicios, setErrorEjercicios] = useState(false);
    const [errorObjetivo, setErrorObjetivo] = useState(false);
    const [errorCantidadSesiones, setErrorCantidadSesiones] = useState(false);

    useEffect(() => {
        console.log("USUARIO EN GENERANDO PLAN: ", usuarioEnSesion)
    }, [usuarioEnSesion])

    useEffect(() => {
        const traerObjetivos = async () => {
            const response = await objetivosServices.getObjetivos();
            setObjetivosTraidos(response)
        }
        traerObjetivos();
    }, [])

    useEffect(() => {
        console.log("cantidad de sesiones: ", cantidadSesionesIndicadas)
    }, [cantidadSesionesIndicadas])

    useEffect(() => {
        if (cantidadSesionesIndicadas != 0) {
            setErrorCantidadSesiones(false)
        }
    }, [cantidadSesionesIndicadas])

    const onSubmit = async (data) => {
        if (cantidadSesionesIndicadas == 0) {
            setErrorCantidadSesiones(true);
            return;
        }
        setErrorCantidadSesiones(false);

        data.cantSesiones = cantidadSesionesIndicadas;
        // Verifica que para cada número de sesión del 1 al cantidadSesiones haya al menos un objeto
        // Crea un objeto que contará cuántas veces aparece cada número de sesión
        const sesionesContadas = {};
        for (const ejercicio of ejerciciosAgregados) {
            const sesion = ejercicio.sesion;
            sesionesContadas[sesion] = (sesionesContadas[sesion] || 0) + 1;
        }

        // Verifica que para cada número de sesión del 1 al cantidadSesionesIndicadas haya al menos un objeto
        const validacionExitosa = Array.from({ length: cantidadSesionesIndicadas }, (_, index) => {
            const numeroSesion = index + 1;
            return sesionesContadas[numeroSesion] > 0;
        }).every(Boolean);

        if (!validacionExitosa) {
            console.log("validacion fallo")
            // Eliminar objetos con números de sesión mayores que cantidadSesionesIndicadas
            const ejerciciosFiltrados = ejerciciosAgregados.filter(ejercicio => ejercicio.sesion <= cantidadSesionesIndicadas);
            console.log('Objetos filtrados:', ejerciciosFiltrados);
            setEjerciciosAgregados(ejerciciosFiltrados)
            setErrorEjercicios(true)
            return;
        }

        // si el objetivo es 0, que devuelva un requerido
        if (parseInt(data.objetivo) === 0) {
            setErrorObjetivo(true);
            return;
        }
        setErrorObjetivo(false);

        const ejerciciosAgrupados = ejerciciosAgregados.reduce((resultado, ejercicio) => {
            const sesionExistente = resultado.find((item) => item.sesion === ejercicio.sesion);

            if (sesionExistente) {
                sesionExistente.ejercicios.push(ejercicio);
            } else {
                resultado.push({
                    sesion: ejercicio.sesion,
                    ejercicios: [ejercicio],
                });
            }

            return resultado;
        }, []);

        if (ejerciciosAgrupados.length > cantidadSesionesIndicadas) {
            setErrorEjercicios(true);
            return;
        }

        data.sesiones = ejerciciosAgrupados;
        data.objetivo = parseInt(data.objetivo);
        data.dniProfesor = usuarioEnSesion.dni;
        console.log("a enviar al backend: ", data)
        await axios.post(`${API}/flextrainer/planes/createPlan`, data, { timeout: 500000 })
        setErrorEjercicios(false)

        // NOTA: EL PARSEO DEL TIEMPO, SERIES, REPS, Y DESCANSO, LO VOY A HACER EN EL BACKEND
    }

    const handleBack = () => {
        navigate('/bienvenida')
    }

    return (
        <>
            <NavHeader encabezado='Generar plan' />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Form style={{ width: '96%' }}>
                    <Card>
                        <Card.Body >
                            <div className="row">
                                <p style={{ color: 'darkred', fontWeight: '600' }}>Plan</p>
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
                                                    maxLength: {
                                                        value: 30,
                                                        message: 'Máximo 30 caracteres'
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
                                        {errors.nombre && <p style={{ color: 'darkred' }}>{errors.nombre.message}</p>}
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
                                        {errors.objetivo && <p style={{ color: 'darkred' }}>{errors.objetivo.message}</p>}
                                    </Form.Group>
                                    {errorObjetivo && <p style={{ color: 'darkred' }}>Este campo es requerido</p>}
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                        <Form.Label>Cantidad de sesiones*</Form.Label>
                                        <Controller
                                            name="cantSesiones"
                                            control={control}
                                            render={({ field }) => (
                                                <Form.Select
                                                    aria-label="select-sesiones-crear-plan"
                                                    required={false}
                                                    {...field}
                                                    onChange={(e) => setCantidadSesionesIndicadas(e.target.value ? parseInt(e.target.value) : 0)}
                                                >
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
                                    </Form.Group>
                                </div>
                                {errorCantidadSesiones && <p style={{ color: 'darkred' }}>Elegí una cantidad de sesiones</p>}
                                {/* {errorEjercicios && <span style={{ color: 'darkred' }}>Tenés que tener al menos un ejercicio por cada sesión y además no podés tener un ejercicio para una sesión que no existe</span>} */}
                                {errorEjercicios && <span style={{ color: 'darkred' }}>Tenés que tener al menos un ejercicio por cada sesión</span>}
                            </div>
                        </Card.Body>
                    </Card>

                    <br></br>

                    <AgregarEjercicios
                        cantidadSesionesIndicadas={cantidadSesionesIndicadas}
                        ejerciciosAgregados={ejerciciosAgregados}
                        setEjerciciosAgregados={setEjerciciosAgregados}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }} >
                        <Button variant="danger" style={{ margin: '8px', border: 'none', backgroundColor: 'grey' }} onClick={() => handleBack()}>
                            Volver
                        </Button>
                        <Button style={{ margin: '8px', border: 'none', backgroundColor: 'darkred' }} onClick={handleSubmit(onSubmit)}>
                            Generar
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    );
};

export { GenerarPlan };
