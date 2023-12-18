import React, { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';

// importo componentes bootstrap necesarios
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

import './ModificarMaquina.css';
import axios from 'axios'; // importo axios para poder llevar a cabo la peticion
import { NavHeader } from '../../../components/NavHeader/NavHeader.js';
import { API } from '../../../constants/api.js';

const ModificarMaquina = () => {
    const { id } = useParams(); // indico que este componente, va a tener un parametro en su URL, que va a ser el id de la maquina a modificar
    const { handleSubmit, control, formState: { errors }, setValue } = useForm(); // declaro las funciones necearias para la gestion del formulario de modificacion
    const navigate = useNavigate(); // declaro la funcion de navegacion entre componentes
    const [maquina, setMaquina] = useState({}); // estaod en el que voy a almacenar la informacion de la maquina a consultar

    const [errorAlActualizar, setErrorAlActualizar] = useState(''); // si existen errores de actualizacion del lado del backend, se activa este estado

    // traer los datos de la maquina a modificar desde el backend
    useEffect(() => {
        const traerMaquina = async () => {
            const response = await axios.get(`${API}/flextrainer/maquinas/maquina/${id}`, { timeout: 500000 });
            setMaquina(response.data);
        }
        traerMaquina();
    }, [id]);

    // seteando en los campos, por defecto, la info dela maquina traida del backend
    useEffect(() => {
        if (maquina && Object.keys(maquina).length > 0) {
            setValue('nombre', maquina.nombre);
            setValue('marca', maquina.marca);
            setValue('peso', maquina.peso);
        }
    }, [setValue, maquina]);

    // funcion que se va a ejecutar en cuanto el usuario pulse el boton de volver
    const handleBack = () => {
        navigate(-1);
    };

    // funcion que se ejecutara en cuanto el usuario pulse MODIFICAR, la cual procesara los datos ingresados, 
    // levara a cabo las respectivas validaciones, y enviara los datos al backend si dichas validaciones son todas exitosas
    const onSubmit = async (data) => {
        // parseando los datos
        data.nombre = data.nombre.toLowerCase();
        data.marca = data.marca.toLowerCase();
        data.peso = parseInt(data.peso);
        data.id = parseInt(id);

        console.log("a ebviar al back: ", data); // consoleando lo que voy a enviar al backend
        const response = await axios.put(`${API}/flextrainer/maquinas/update`, data, { timeout: 500000 }); // llevando a cabo la peticion

        // si hay un error en la respuesta, desde el backend, que active el estado de error al actualizar, y detenga la funcion onSubmit
        if (response.data.error) {
            setErrorAlActualizar(response.data.error);
            return;
        }
        setErrorAlActualizar(''); // si no hubo errores desde el backend a la hora de actualizar, desactivar el estado
        navigate(-1);
    }

    return (
        <>
            <NavHeader encabezado={`Modificar máquina ${id}`} />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Form style={{ border: 'solid 1px red', width: '96%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '4px' }}>
                    <Card style={{ width: '96%', marginTop: '16px' }}>

                        <p style={{ color: 'darkred', fontWeight: '600' }}>Los campos marcados con (*) son obligatorios</p>
                        <Card.Body>
                            <Card style={{ padding: '16px' }}>
                                <span style={{ color: 'darkred', fontWeight: '600' }}>Información de la Máquina</span>
                                <div className="row">
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
                                                            value: 30,
                                                            message: 'Máximo 30 caracteres'
                                                        }
                                                    }
                                                }
                                                render={({ field }) => (
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Ingresá nombre de la máquina"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.nombre && <p style={{ color: 'darkred' }}>{errors.nombre.message}</p>}
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Peso (en kg)</Form.Label>
                                            <Controller
                                                name="peso"
                                                control={control}
                                                rules={
                                                    {
                                                        maxLength: {
                                                            value: 3,
                                                            message: 'El peso no puede tener mas de 3 caracteres'
                                                        },
                                                        minLength: {
                                                            value: 1,
                                                            message: 'El peso no puede tener menos de 1 caracter'
                                                        },
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message: 'Solo se permiten números positivos en este campo'
                                                        },
                                                        max: {
                                                            value: 999,
                                                            message: "El valor maximo a ingresar es de 999 kg"
                                                        }
                                                    }
                                                }
                                                render={({ field }) => (
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Ingresá el peso de la máquina"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.peso && <p style={{ color: 'darkred' }}>{errors.peso.message}</p>}
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                            <Form.Label>Marca*</Form.Label>
                                            <Controller
                                                name="marca"
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
                                                        placeholder="Ingresá el nombre de la marca de la máquina"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.marca && <p style={{ color: 'darkred' }}>{errors.marca.message}</p>}
                                        </Form.Group>
                                    </div>
                                </div>
                            </Card>
                        </Card.Body>


                        <Modal.Footer>
                            <Button style={{ backgroundColor: '#555555', margin: '8px', border: 'none' }} onClick={() => handleBack()}>
                                Cancelar
                            </Button>
                            <Button style={{ backgroundColor: '#910012', margin: '8px', border: 'none' }} onClick={handleSubmit(onSubmit)}>
                                Modificar
                            </Button>
                        </Modal.Footer>
                    </Card>
                </Form>
            </div>
        </>
    )
}

export { ModificarMaquina }