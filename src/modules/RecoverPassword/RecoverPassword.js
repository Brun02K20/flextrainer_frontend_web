import React, { useState, useEffect } from 'react'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useForm, Controller } from 'react-hook-form';

// importo axios para llevar a cabo la peticion de login al backend
import axios from 'axios';
import { API } from '../../constants/api.js';
import './RecoverPassword.css'
import { RP } from './RP.js';

const RecoverPassword = ({ showModalRecover, handleCloseModalRecover }) => {
    const { handleSubmit, control, formState: { errors }, reset, setValue } = useForm(); // funcionalidades y propiedades necesarias para la gestion del formulario de recover password
    const [errorGetBack, setErrorGetBack] = useState(''); // en caso de que haya un error en las validaciones de backend, me devuelve un objeto de error, cuyo valor almacenare en este estado
    const [usuarioAActualizar, setUsuarioAActualizar] = useState({})

    // gestion del modal de la recuperacion de contraseña
    const [showModalRP, setShowModalRP] = useState(false);
    const handleCloseModalRP = () => setShowModalRP(false);
    const handleShowModalRP = () => setShowModalRP(true);

    const onSubmit = async (data) => {
        data.dni = parseInt(data.dni)
        console.log(data)
        const response = await axios.get(`${API}/flextrainer/usuarios/usuario/getRecover/${data.dni}/${data.correoElectronico}/${data.numeroTelefono}`, { timeout: 500000 })
        console.log("rta: ", response)

        if (response.data.error) {
            setErrorGetBack(response.data.error)
            return
        }
        setErrorGetBack('')

        setUsuarioAActualizar(response.data)
        handleShowModalRP()
        handleCloseModalRecover();
        handleClean()
    }


    const handleClean = () => {
        reset();
        setValue("dni", "")
        setValue("correoElectronico", "")
        setValue("numeroTelefono", "")
    }


    return (
        <>
            <Modal show={showModalRecover} onHide={handleCloseModalRecover}>
                <Modal.Header closeButton className='recover-modal-header'>
                    <Modal.Title className='recover-modal-title'>Recuperar contraseña</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput9">
                            <Form.Label>DNI*</Form.Label>
                            <Controller
                                name="dni" // nombre del campo, este nombre es el que se va a usar en la funcion que envia los datos al backend
                                control={control} // esto va asi SI O SI, si no, no anda nada
                                rules={
                                    {
                                        required: {
                                            value: true,
                                            message: 'Este campo es requerido'
                                        },
                                        maxLength: {
                                            value: 8,
                                            message: 'El DNI no puede tener mas de 8 caracteres'
                                        },
                                        minLength: {
                                            value: 7,
                                            message: 'El DNI no puede tener menos de 7 caracteres'
                                        },
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: 'Solo se permiten números positivos en este campo'
                                        }
                                    }
                                } // las reglas son validaciones, podemos validar longitud de caracteres por ejemplo
                                render={({ field }) => (
                                    // Form.Control es el campo que se va a mostrar por pantalla, y render es la funcion que permite mostrarlo
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingresá tu DNI" // placeholder es el instructivo de que tiene que ingresar el usuario en ese campo
                                        defaultValue=""
                                        {...field}
                                    />
                                )}
                            />
                            {/* si alguna validacion declarada en el objeto rules no funciona, se muestra el respectivo mensaje */}
                            {errors.dni && <p style={{ color: 'darkred' }}> {errors.dni.message}</p>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
                            <Form.Label>Correo Electrónico*</Form.Label>
                            <Controller
                                name="correoElectronico"
                                control={control}
                                rules={
                                    {
                                        required: {
                                            value: true,
                                            message: 'Este campo es requerido'
                                        },
                                        pattern: {
                                            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
                                            message: 'Dirección de correo electrónico no válida',
                                        }
                                    }
                                }
                                render={({ field }) => (
                                    <Form.Control
                                        type="email"
                                        placeholder="Ingresá tu correo electrónico"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.correoElectronico && <p style={{ color: 'darkred' }}>{errors.correoElectronico.message}</p>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput7">
                            <Form.Label>Celular*</Form.Label>
                            <Controller
                                name="numeroTelefono"
                                control={control}
                                rules={
                                    {
                                        required: {
                                            value: true,
                                            message: "Este campo es requerido"
                                        },
                                        maxLength: {
                                            value: 13,
                                            message: 'El número de teléfono no puede tener mas de 13 caracteres'
                                        },
                                        minLength: {
                                            value: 10,
                                            message: 'El número de teléfono no puede tener menos de 10 caracteres'
                                        },
                                        pattern: {
                                            value: /^\+?\d+$/,
                                            message: 'El número de teléfono debe ser válido'
                                        }
                                    }
                                }
                                render={({ field }) => (
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingresá tu celular"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.numeroTelefono && <p style={{ color: 'darkred' }}>{errors.numeroTelefono.message}</p>}
                            {errorGetBack && <p style={{ color: 'darkred' }}>{errorGetBack}</p>}
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button style={{ backgroundColor: 'grey', border: 'none' }} onClick={() => { handleCloseModalRecover(); handleClean() }}>
                        Cancelar
                    </Button>
                    <Button style={{ backgroundColor: 'darkred', border: 'none' }} variant="success" onClick={handleSubmit(onSubmit)}>
                        Recuperar
                    </Button>
                </Modal.Footer>
            </Modal>

            <RP
                showModalRP={showModalRP}
                handleCloseModalRP={handleCloseModalRP}
                usuarioAActualizar={usuarioAActualizar}
                setUsuarioAActualizar={setUsuarioAActualizar}
            />
        </>
    )
}

export { RecoverPassword }