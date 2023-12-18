import React, { useState, useEffect } from 'react'
import { NavHeader } from '../../../components/NavHeader/NavHeader.js'
import { useNavigate } from 'react-router-dom'
import { BackButton } from '../../../components/BackButton/BackButton.js';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useForm, Controller } from 'react-hook-form';
import { Button, Modal, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const RegistrarMaquina = () => {
    const { handleSubmit, reset, setValue, control, formState: { errors }, register } = useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); // Nuevo estado para el loader

    const onSubmit = async (data) => {
        setIsLoading(true); // Activa el loader al iniciar la carga
        try {
            const formData = new FormData();
            formData.append('file', data.file[0]);
            formData.append("nombre", data.nombre);
            formData.append("peso", parseInt(data.peso))
            formData.append("cantidadTotal", parseInt(data.cantidadTotal))
            formData.append("marca", data.marca)

            console.log("a enviar los datos: ", formData)

            const response = await axios.post('http://localhost:4001/flextrainer/maquinas/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 500000
            });

            console.log(response.data);
        } catch (error) {
            console.error('Error al subir el archivo:', error);
        } finally {
            setIsLoading(false); // Desactiva el loader después de la carga, ya sea éxito o error
        }
    }

    const handleBack = () => {
        navigate('/maquinas')
    }

    return (
        <>
            <NavHeader encabezado='Registrar máquina o equipamiento' />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Form style={{ border: 'solid 1px red', width: '96%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '4px' }}>
                    <Card style={{ width: '96%', marginTop: '16px' }}>
                        <p style={{ color: 'darkred', fontWeight: '600' }}>Los campos marcados con (*) son obligatorios</p>
                        <Card.Body>
                            <span style={{ color: 'darkred', fontWeight: '600' }}>Información de la máquina</span>
                            <div className='row'>
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
                                                    placeholder="Ingresá el nombre de la máquina"
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
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
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

                                <div className='col-md-6'>
                                    <Form.Group controlId="formFile" className="mb-3">
                                        <Form.Label>Ingresá una foto de la máquina*</Form.Label>
                                        <Form.Control
                                            type="file"
                                            {...register('file', {
                                                required: 'El archivo es requerido',
                                                validate: {
                                                    acceptedFormats: (value) => {
                                                        const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
                                                        return allowedFormats.includes(value[0]?.type) || 'Formato de archivo no permitido, solo se permite .jpeg, .jpg, o .png';
                                                    },
                                                },
                                            })}
                                            accept=".jpeg, .jpg, .png"
                                        />
                                        {errors.file && <p style={{ color: 'darkred' }}>{errors.file.message}</p>}
                                    </Form.Group>
                                </div>
                            </div>

                            <Modal.Footer>
                                <Button variant="danger" style={{ marginRight: '8px', border: 'none', backgroundColor: 'grey' }} onClick={() => handleBack()} >
                                    Cancelar
                                </Button>
                                <Button variant="success" onClick={handleSubmit(onSubmit)} style={{ border: 'none', backgroundColor: 'darkred' }}>
                                    Registrar
                                </Button>
                            </Modal.Footer>
                        </Card.Body>
                    </Card>
                </Form>
            </div>

            <br></br>

            <BackButton handleBack={handleBack} />

            {/* Loader */}
            {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.8)' }}>
                    <div style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <Spinner
                            animation="border" role="status" style={{ color: 'darkred', fontSize: '24px' }}
                        />
                        <p style={{ color: 'darkred', fontSize: '24px', fontWeight: '500' }}>Cargando...</p>
                    </div>
                </div>
            )}

        </>
    )
}

export { RegistrarMaquina }