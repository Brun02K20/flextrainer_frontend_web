import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useForm, Controller } from 'react-hook-form';

// importo axios para llevar a cabo la peticion de login al backend
import axios from 'axios';
import { API } from '../../constants/api.js';
import './RecoverPassword.css'
import { RPExitoso } from './RPExitoso.js';

const RP = ({ showModalRP, handleCloseModalRP, usuarioAActualizar, setUsuarioAActualizar }) => {
    const { handleSubmit, control, formState: { errors }, reset, setValue } = useForm(); // funcionalidades y propiedades necesarias para la gestion del formulario de recover password

    const [equalPassword, setEqualPassword] = useState('')
    const [errorPassword, setErrorPassword] = useState('');

    // estado que se utilizara para que el usuario pueda ver lo que esta ingresando en el campo de contraseña
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // gestion del modal de la informacion de la recuperacion de contraseña exitos
    const [showModalRPExitoso, setShowModalRPExitoso] = useState(false);
    const handleCloseModalRPExitoso = () => setShowModalRPExitoso(false);
    const handleShowModalRPExitoso = () => setShowModalRPExitoso(true);

    const onSubmit = async (data) => {
        data.dni = usuarioAActualizar.dni

        if (data.password !== data.confPassword) {
            setEqualPassword('Error. Las contraseñas deben ser iguales.')
            return;
        }
        setEqualPassword('')

        const response = await axios.put(`${API}/flextrainer/usuarios/usuario/recover/${data.dni}/${data.confPassword}`)
        if (response.data.esIgual) {
            setErrorPassword('Error. La contraseña no puede ser exactamente la misma que la anterior.')
            return;
        }
        setErrorPassword('')

        handleClean()
        handleCloseModalRP()
        handleShowModalRPExitoso()

        console.log(data)
    }

    const handleClean = () => {
        reset();
        setValue("password", "")
        setValue("confPassword", "")
    }

    return (
        <>
            <Modal show={showModalRP} onHide={handleCloseModalRP}>
                <Modal.Header closeButton className='recover-modal-header'>
                    <Modal.Title className='recover-modal-title'>Recuperar contraseña</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>DNI</Form.Label>
                            <Controller
                                name="dni"
                                control={control}
                                rules={
                                    {
                                        required: false
                                    }
                                }
                                render={({ field }) => (
                                    <Form.Control
                                        type="number"
                                        placeholder={usuarioAActualizar.dni}
                                        disabled
                                        {...field}
                                    />
                                )}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <Form.Label>Contraseña*</Form.Label>
                            <Controller
                                name='password'
                                control={control}
                                rules={
                                    {
                                        required: {
                                            value: true,
                                            message: 'Este campo es requerido'
                                        },
                                        maxLength: {
                                            value: 15,
                                            message: 'La contraseña no puede tener más de 15 caracteres'
                                        },
                                        minLength: {
                                            value: 8,
                                            message: 'La contraseña no puede tener menos de 8 caracteres'
                                        },
                                    }
                                }
                                render={({ field }) => (
                                    <div className="input-group">
                                        <Form.Control
                                            type={passwordVisible ? 'text' : 'password'}
                                            placeholder="Ingresá tu contraseña"
                                            style={{ borderRadius: '8px' }}
                                            {...field}
                                        />
                                        <Button
                                            variant="secondary"
                                            onClick={togglePasswordVisibility}
                                            style={{ marginLeft: '8px', borderRadius: '12%', color: 'black', backgroundColor: 'white', border: 'none' }}
                                        >
                                            {passwordVisible ?
                                                <i className="bi bi-eye-slash" style={{ fontWeight: 'bold' }}></i>
                                                :
                                                <i className="bi bi-eye"></i>
                                            }
                                        </Button>
                                    </div>
                                )}
                            />
                            {errors.password && <p style={{ color: 'darkred' }}>{errors.password.message}</p>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                            <Form.Label>Repetición de la Contraseña*</Form.Label>
                            <Controller
                                name='confPassword'
                                control={control}
                                rules={
                                    {
                                        required: {
                                            value: true,
                                            message: 'Este campo es requerido'
                                        },
                                        maxLength: {
                                            value: 15,
                                            message: 'La contraseña no puede tener más de 15 caracteres'
                                        },
                                        minLength: {
                                            value: 8,
                                            message: 'La contraseña no puede tener menos de 8 caracteres'
                                        },
                                    }
                                }
                                render={({ field }) => (
                                    <div className="input-group">
                                        <Form.Control
                                            type={passwordVisible ? 'text' : 'password'}
                                            placeholder="Repetí tu nueva contraseña"
                                            style={{ borderRadius: '8px' }}
                                            {...field}
                                        />
                                    </div>
                                )}
                            />
                            {errors.confPassword && <p style={{ color: 'darkred' }}>{errors.confPassword.message}</p>}
                            {equalPassword && <p style={{ color: 'darkred' }}>{equalPassword}</p>}
                            {errorPassword && <p style={{ color: 'darkred' }}>{errorPassword}</p>}
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button style={{ backgroundColor: 'grey', border: 'none' }} onClick={handleCloseModalRP}>
                        Cancelar
                    </Button>
                    <Button style={{ backgroundColor: 'darkred', border: 'none' }} variant="success" onClick={handleSubmit(onSubmit)}>
                        Recuperar
                    </Button>
                </Modal.Footer>
            </Modal>

            <RPExitoso
                showModalRPExitoso={showModalRPExitoso}
                handleCloseModalRPExitoso={handleCloseModalRPExitoso}
                setUsuarioAActualizar={setUsuarioAActualizar}
            />
        </>
    )
}

export { RP }
