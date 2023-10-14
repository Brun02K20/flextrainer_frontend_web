import React, { useState, useEffect } from 'react'; // importo la libreria de React y las funcionalidades necesarias
import { useNavigate, useParams } from 'react-router-dom'; // importo la funcionalidad de navegacion entre componentes de react-router-dom
import { useForm, Controller } from 'react-hook-form'; // importo las funcionalidades necesarias para la gestion de formularios a travves de react-hook-form

// importo componentes bootstrap necesarios
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';

import './ModificarUsuario.css'; // importo los estilos asociados a esta pantalla
import axios from 'axios'; // importo axios para poder llevar a cabo la peticion

const ModificarUsuario = () => {
    const { dni } = useParams(); // indico que este componente, va a tener un parametro en su URL, que va a ser el dni del usuario a modificar
    const { handleSubmit, control, formState: { errors }, setValue } = useForm(); // declaro las funciones necearias para la gestion del formulario de registro
    const navigate = useNavigate(); // declaro la funcion de navegacion entre componentes
    const [user, setUser] = useState({}); // estaod en el que voy a almacenar la informacion del usuario a consultar
    const today = new Date().toISOString().split('T')[0]; // Obtén la fecha actual en el formato YYYY-MM-DD
    const [errorFecha, setErrorFecha] = useState(''); // si el usuario ingresa una fecha no valida, se activa este estado
    const [errorAlActualizar, setErrorAlActualizar] = useState(''); // si existen errores de actualizacion del lado del backend, se activa este estado

    // traer los datos del usaurio a modificar desde el backend
    useEffect(() => {
        const traerUser = async () => {
            const response = await axios.get(`http://localhost:4001/flextrainer/usuarios/usuario/${dni}`);
            setUser(response.data);
        }
        traerUser();
    }, [dni]);

    // seteando en los campos, por defecto, la info del usuario traida del backend
    useEffect(() => {
        if (user && Object.keys(user).length > 0) {
            setValue('dni', user.dni);
            setValue('nombre', user.nombre);
            setValue('apellido', user.apellido);
            setValue('fechaNacimiento', user.fechaNacimiento);
            setValue('genero', user.genero);
            setValue('correoElectronico', user.correoElectronico);
            setValue('numeroTelefono', user.numeroTelefono);
        }
    }, [setValue, user]);

    // NOTA: VER QUE HACER CON LOS CAMPOS DE DNI Y DE PASSWORD
    // DNI por ser PK, y PASSWORD por hasheo
    // estado que se utilizara para que el usuario pueda ver lo que esta ingresando en el campo de contraseña
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // funcion que se ejecutara en cuanto el usuario pulse REGISTRARSE, la cual procesara los datos ingresados, 
    // levara a cabo las respectivas validaciones, y enviara los datos al backend si dichas validaciones son todas exitosas
    const onSubmit = async (data) => {
        // parseando los datos
        data.nombre = data.nombre.toLowerCase();
        data.apellido = data.apellido.toLowerCase();
        data.dni = parseInt(data.dni);
        data.dniOriginal = parseInt(dni);

        // realizando la validacion de ingreso de la fecha
        const hoy = new Date();
        const fechaIngresada = new Date(data.fechaNacimiento);
        if (fechaIngresada >= hoy) {
            setErrorFecha('Error, ingresa una fecha valida');
            return;
        }
        setErrorFecha(''); // si supera la validacion desactiva el estado
        console.log(data); // consoleando lo que voy a enviar al backend
        const response = await axios.put(`http://localhost:4001/flextrainer/usuarios/usuario/update`, data); // llevando a cabo la peticion

        // si hay un error en la respuesta, desde el backend, que active el estado de error al actualizar, y detenga la funcion onSubmit
        if (response.data.error) {
            setErrorAlActualizar(response.data.error);
            return;
        }
        setErrorAlActualizar(''); // si no hubo errores desde el backend a la hora de actualizar, desactivar el estado
    };

    // funcion que se va a ejecutar en cuanto el usuario pulse el boton de volver, la cual lo llevara al componente Home (NO logueado)
    const handleBack = () => {
        navigate('/bandejaUsuarios');
    };

    return (
        <>
            {/* Header del formulario */}
            <Navbar style={{ backgroundColor: 'red' }}>
                <Container>
                    <Navbar.Brand style={{ color: 'white' }}>Modificar Usuario {dni}</Navbar.Brand>
                </Container>
            </Navbar>

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Form style={{ border: 'solid 1px red', width: '96%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '4px' }}>
                    <Card style={{ width: '96%', marginTop: '16px' }}>
                        <p>Los campos marcados con (*) son obligatorios</p>
                        <Card.Body>
                            <Card style={{ padding: '16px' }}>
                                <span>Información de Usuario</span>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>DNI*</Form.Label>
                                            <Controller
                                                name="dni"
                                                control={control}
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
                                                }
                                                render={({ field }) => (
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Ingresá tu DNI"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.dni && <p>{errors.dni.message}</p>}
                                        </Form.Group>
                                    </div>
                                </div>
                            </Card>
                        </Card.Body>

                        <br style={{ backgroundColor: 'red' }}></br>

                        <Card.Body>
                            <Card style={{ padding: '16px' }}>
                                <span>Información Personal</span>
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
                                                        pattern: {
                                                            value: /^[a-zA-Z]+$/,
                                                            message: 'Porfavor, ingresa solo letras en este campo. Si tu nombre tiene una ñ, bueno, `ni` flaco'
                                                        },
                                                        maxLength: {
                                                            value: 30,
                                                            message: 'Maximo 30 caracteres'
                                                        }
                                                    }
                                                }
                                                render={({ field }) => (
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Ingresá tu nombre"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.nombre && <p>{errors.nombre.message}</p>}
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                            <Form.Label>Apellido*</Form.Label>
                                            <Controller
                                                name="apellido"
                                                control={control}
                                                rules={
                                                    {
                                                        required: {
                                                            value: true,
                                                            message: 'Este campo es requerido'
                                                        },
                                                        pattern: {
                                                            value: /^[a-zA-Z]+$/,
                                                            message: 'Porfavor, ingresa solo letras en este campo. Si tu nombre tiene una ñ, bueno, `ni` flaco'
                                                        },
                                                        maxLength: {
                                                            value: 30,
                                                            message: 'Maximo 30 caracteres'
                                                        }
                                                    }
                                                }
                                                render={({ field }) => (
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Ingresá tu apellido"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.apellido && <p>{errors.apellido.message}</p>}
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                                            <Form.Label>Fecha de Nacimiento*</Form.Label>
                                            <Controller
                                                name='fechaNacimiento'
                                                control={control}
                                                rules={{ required: 'Este campo es requerido' }}
                                                render={({ field }) => (
                                                    <div>
                                                        <input type='date' {...field} max={today} />
                                                    </div>
                                                )}
                                            />
                                            {errors.fechaNacimiento && <p>{errors.fechaNacimiento.message}</p>}
                                            {errorFecha && <p>{errorFecha}</p>}
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                                            <Form.Label>Género*</Form.Label>
                                            <Controller
                                                name="genero"
                                                control={control}
                                                rules={{ required: 'Este campo es requerido' }}
                                                render={({ field }) => (
                                                    <Form.Select aria-label="select-genero-busqueda-usuarios" {...field}>
                                                        <option value="Masculino">Masculino</option>
                                                        <option value="Femenino">Femenino</option>
                                                        <option value="X">X</option>
                                                    </Form.Select>
                                                )}
                                            />
                                            {errors.genero && <p>{errors.genero.message}</p>}
                                        </Form.Group>
                                    </div>
                                </div>
                            </Card>
                        </Card.Body>

                        <br style={{ backgroundColor: 'red' }}></br>

                        <Card.Body>
                            <Card style={{ padding: '16px' }}>
                                <span>Información de Contacto*</span>
                                <div className='row'>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
                                            <Form.Label>Correo Electronico</Form.Label>
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
                                            {errors.correoElectronico && <p>{errors.correoElectronico.message}</p>}
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
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
                                                            message: 'El numero de telefono no puede tener mas de 13 caracteres'
                                                        },
                                                        minLength: {
                                                            value: 10,
                                                            message: 'El numero de telefono no puede tener menos de 10 caracteres'
                                                        },
                                                        pattern: {
                                                            value: /^\+?\d+$/,
                                                            message: 'El numero de telefono debe ser valido'
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
                                            {errors.numeroTelefono && <p>{errors.numeroTelefono.message}</p>}
                                            {errorAlActualizar && <p>{errorAlActualizar}</p>}
                                        </Form.Group>
                                    </div>
                                </div>
                            </Card>
                        </Card.Body>

                        <Modal.Footer>
                            <Button variant="danger" style={{ marginRight: '8px' }} onClick={() => handleBack()}>
                                Volver
                            </Button>
                            <Button variant="success" onClick={handleSubmit(onSubmit)}>
                                Modificar
                            </Button>
                        </Modal.Footer>
                    </Card>
                </Form>
            </div>
        </>
    )
}

export { ModificarUsuario }