import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom'

import axios from 'axios';
import { API } from '../../../constants/api.js';
import { NavHeader } from '../../../components/NavHeader/NavHeader.js';
import { Button, Card, Form } from 'react-bootstrap';


import { objetivosServices } from '../services/objetivos.service.js';
import { AgregarModificarEjercicios } from './AgregarModificarEjercicios.js';


const ModificarPlan = () => {

    // hooks generales
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleSubmit, reset, register, setValue, formState: { errors }, control } = useForm()

    // estados para el control del objeto plan
    const [planTraido, setPlanTraido] = useState({}); // almacenar el plan a modificar aca
    const [objetivosTraidos, setObjetivosTraidos] = useState([]) // traer todos los objetivos para el combobox
    const [errorCantidadSesiones, setErrorCantidadSesiones] = useState(false); // si indico que cantidad sesiones es sin elegir, esto es true
    const [cantidadSesionesIndicadas, setCantidadSesionesIndicadas] = useState(0); // estado que almacena lo que puso en el combobox de cantidad de sesiones

    const [errorSesiones, setErrorSesiones] = useState(false)

    // traer el plan a modificar desde el backend
    useEffect(() => {
        const traerPlan = async () => {
            const response = await axios.get(`${API}/flextrainer/planes/plan/${id}`)
            setPlanTraido(response.data)
        }
        traerPlan()
    }, []);
    // consoleo el plan traido
    useEffect(() => {
        console.log("plan traido ahora: ", planTraido)
    }, [planTraido])

    // traer todos los objetivos del backend
    useEffect(() => {
        const traerObjetivos = async () => {
            const response = await objetivosServices.getObjetivos();
            setObjetivosTraidos(response)
        }
        traerObjetivos();
    }, [])

    // seteando en los campos del formulario general, por defecto, la info del plan traido del backend
    useEffect(() => {
        if (planTraido && Object.keys(planTraido).length > 0) {
            setValue('nombre', planTraido.nombre);
            setValue('objetivo', planTraido.objetivo.id);
            setValue('cantSesiones', planTraido.cantSesiones);
        }
    }, [setValue, planTraido]);

    // enviar todo al backend
    const onSubmit = async (data) => {
        // valida si ingreso una cantidad de sesiones
        if (!parseInt(data.cantSesiones)) {
            setErrorCantidadSesiones(true)
            return
        }
        setErrorCantidadSesiones(false)
        data.objetivo = parseInt(data.objetivo) // parsea el objetivo

        // Verifica si hay alguna sesión sin ejercicios en el planTraido
        const sesionSinEjercicios = planTraido.sesiones.some(sesion => sesion.ejercicios.length === 0);
        if (sesionSinEjercicios) {
            setErrorSesiones(true)
            return;
        }
        setErrorSesiones(false)

        // Agrega el atributo 'id' al planTraido
        const planConId = { ...planTraido, id: parseInt(id), objetivo: data.objetivo, nombre: data.nombre };
        setPlanTraido(planConId)

        console.log(data) // consolea los datos

        const response = await axios.put(`${API}/flextrainer/planes/plan/update`, planConId)
        console.log("respouesta de axios: ", response.data)
        handleBack()
    }

    // cuando el usuario pulse volver, se ejecuta esto
    const handleBack = () => {
        navigate('/planesProfe')
        setPlanTraido({})
        setCantidadSesionesIndicadas(0)
        setObjetivosTraidos([])
        reset()
    }

    return (
        <>
            <NavHeader encabezado={`Modificar plan`} />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p style={{ color: 'darkred', fontWeight: '600' }}>Plan</p>

                        <div className='row'>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
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
                                                    value: 256,
                                                    message: 'Máximo 256 caracteres'
                                                }
                                            }
                                        }
                                        render={({ field }) => (
                                            <Form.Control
                                                type="text"
                                                placeholder='Ingresá el nombre del plan'
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
                                                <option value=''>Sin Elegir</option>
                                                {objetivosTraidos.map((e, index) => (
                                                    <option key={index + 1} value={e.id}>{e.nombre}</option>
                                                ))}
                                            </Form.Select>
                                        )}
                                    />
                                </Form.Group>
                                {errors.objetivo && <p style={{ color: 'darkred' }}>{errors.objetivo.message}</p>}
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
                                                onChange={(e) => {
                                                    setCantidadSesionesIndicadas(e.target.value ? parseInt(e.target.value) : 0);
                                                    setValue("cantSesiones", parseInt(e.target.value) ? parseInt(e.target.value) : '');
                                                    setPlanTraido((prevPlan) => {
                                                        const newCantSesiones = e.target.value ? parseInt(e.target.value) : 0;

                                                        // Si la nueva cantidad es menor que la actual, eliminamos las sesiones extras
                                                        const nuevasSesiones = prevPlan.sesiones.slice(0, newCantSesiones);

                                                        // Si la nueva cantidad es mayor que la actual, agregamos sesiones vacías
                                                        const sesionesRestantes = newCantSesiones - prevPlan.sesiones.length;
                                                        const sesionesAgregadas = Array.from({ length: sesionesRestantes }, (_, index) => ({
                                                            nombre: "Nueva Sesión",  // Puedes ajustar el nombre según tus necesidades
                                                            ejercicios: [],  // Sesión vacía
                                                        }));

                                                        return {
                                                            ...prevPlan,
                                                            cantSesiones: newCantSesiones,
                                                            sesiones: [...nuevasSesiones, ...sesionesAgregadas],
                                                        };
                                                    });

                                                }}
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
                            {errorCantidadSesiones && <p style={{ color: 'darkred' }}>ERROR. Porfavor Elegí una cantidad de sesiones y completa todas las sesiones con al menos un ejercicio cada una.</p>}
                            {errorSesiones && <p style={{ color: 'darkred' }}>ERROR. Por favor, completá todas las sesiones con al menos un ejercicio cada una</p>}
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <br></br>

            {planTraido.nombre && <AgregarModificarEjercicios
                planTraido={planTraido}
                setPlanTraido={setPlanTraido}
            />}

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }} >
                <Button variant="danger" style={{ margin: '8px', border: 'none', backgroundColor: 'grey' }} onClick={() => handleBack()}>
                    Volver
                </Button>
                <Button style={{ margin: '8px', border: 'none', backgroundColor: 'darkred' }} onClick={handleSubmit(onSubmit)}>
                    Modificar
                </Button>
            </div>
        </>
    )
}

export { ModificarPlan }
