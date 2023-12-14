// importo la libreria React, ademas de funcionalidades necesarias de la misma
// tambien, importo los componentes necesarios de la libreria react-bootstrap,
// tambien los componentes y funcionalidades necesarias de la libreria react-hook-form para la gestion de formularios,
// ademas de la funcionalidad useNavigate para llevar a cabo la navegacion entre componentes, 
// en este caso se usara para redireccionar a la creacion de la cuenta o bien a la pantalla de bienvenida
// si los datos son validos
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// importo los estilos CSS de este componente
import './LoginModal.css';

// importo axios para llevar a cabo la peticion de login al backend
import axios from 'axios';
import { API } from '../../constants/api.js';
import { RecoverPassword } from '../../modules/RecoverPassword/RecoverPassword.js';

// declaro el componente, explicitando las propiedades que recibira tal como se explico en el componente Home
const LoginModal = ({ show, handleClose, setUsuarioEnSesion }) => {
    const { handleSubmit, control, formState: { errors } } = useForm(); // funcionalidades y propiedades necesarias para la gestion del formulario de inicio de sesion
    const navigate = useNavigate(); // declarando la herramienta de navegacion entre componentes
    const [errorLoginBack, setErrorLoginBack] = useState(''); // en caso de que haya un error de login en las validaciones de backend, me devuelve un objeto de error, cuyo valor almacenare en este estado

    // estado que se utilizara para que el usuario pueda ver lo que esta ingresando en el campo de contraseña, 
    // basicamente va a cambiar cada vez que el usuario haga click en el icono del ojo
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // gestion de modales de recoverPassword en la aplicación
    const [showModalRecover, setShowModalRecover] = useState(false);
    const handleCloseModalRecover = () => setShowModalRecover(false);
    const handleShowModalRecover = () => setShowModalRecover(true);

    // funcion que se llevara a cabo en cuanto el usuario pulse INGRESAR, llevando a cabo las validaciones necesarias
    //, y en caso de que todas las validaciones sean exitosas, enviara los parametros al backend para su procesamiento
    const onSubmit = async (data) => {
        data.dni = parseInt(data.dni); // convirtiendo el DNI a un numero entero
        console.log(data); // consoleando los datos ingresados por el usuario

        // haciendo la peticion de login al backend a traves de axios
        const user = await axios.post(`${API}/flextrainer/usuarios/login`, data);
        console.log(user.data); // imprime la respuesta por consola

        // si el backend devuelve un error, me setea el estado de error, como el valor correspondiente, y corta la funcion de peticion
        if (user.data.error) {
            setErrorLoginBack(user.data.error);
            return;
        };
        setUsuarioEnSesion(user.data); // si no hay error, me setea el usuario en sesion, el que se autentico, como los datos provenientes del backend
        handleClose(); // cerrando el modal de inicio de sesion
        navigate('/bienvenida'); // redirigir al usuario a la pantalla de bienvenida
    };

    return (
        <>
            // declarando que habra un modal en el compoennte, que recibe 2 propiedades, el show, que es un booleano, donde
            // si es true, muestra el modal, y si es falso, se cierra. handleClose basicamente setea ese booleando en false
            <Modal show={show} onHide={handleClose}>
                {/* Header del modal */}
                <Modal.Header closeButton className='login-modal-header'>
                    <Modal.Title className='login-modal-title'>Iniciar sesión</Modal.Title>
                </Modal.Header>

                {/* Boton que si el usuario lo presiona, lo redirigira al componente de registrarse, de CrearUsuario.js */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <Button style={{ marginRight: '8px', backgroundColor: 'darkred', border: 'none' }} onClick={() => navigate('/registrarse')}>Crear cuenta</Button>
                </div>

                {/* Body del modal, el body es basicamente la parte principal del modal, este caso, va a ser un formulario de login */}
                <Modal.Body>
                    <Form>
                        {/* cada Form.Group va a ser un campo del formulario */}
                        {/* La logica explicada en este Form.Group aplica para TODOS LOS FORMULARIOS habidos y por haber, es literalmente copiar y pegar esto */}
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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
                            {errors.dni && <p>{errors.dni.message}</p>}
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
                                            message: 'La contraseña no puede tener mas de 15 caracteres'
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
                                            defaultValue=""
                                            style={{ borderRadius: '8px' }}
                                            {...field}
                                        />
                                        {/* Boton del icono del ojo que oculta y muestra la contraseña en forma alternada */}
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
                            {errors.password && <p>{errors.password.message}</p>}
                            {errorLoginBack && <p>{errorLoginBack}</p>}
                        </Form.Group>
                    </Form>

                    {/* boton con aspecto de link, que va a redireccionar al usuario a la pantalla de recuperacion de password */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
                        <Button variant='link' onClick={() => { handleShowModalRecover(); handleClose() }}>¿Olvidaste tu contraseña?</Button>
                    </div>
                </Modal.Body>

                {/* Footer del modal, la parte final del mismo, que contendra los botones de cancelar y de ingresar  */}
                <Modal.Footer>
                    <Button style={{ backgroundColor: 'grey', border: 'none' }} onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button style={{ backgroundColor: 'darkred', border: 'none' }} variant="success" onClick={handleSubmit(onSubmit)}>
                        Ingresar
                    </Button>
                </Modal.Footer>
            </Modal>



            {/* Si es verdadero el estado de SHOWMODAL, que renderice el Modal de Inicio de Sesion */}
            <RecoverPassword
                showModalRecover={showModalRecover}
                handleCloseModalRecover={handleCloseModalRecover}
            />
        </>
    );
};

export { LoginModal };