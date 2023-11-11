import React, { useState } from 'react'; // importo la libreria de React y las funcionalidades necesarias
import { useNavigate } from 'react-router-dom'; // importo la funcionalidad de navegacion entre componentes de react-router-dom
import { useForm, Controller } from 'react-hook-form'; // importo las funcionalidades necesarias para la gestion de formularios a travves de react-hook-form

// importo componentes bootstrap necesarios
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Nav } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

// importo los estilos asociados a esta pantalla
import './CrearUsuario.css';
import axios from 'axios';

const CrearUsuario = () => {
    const { handleSubmit, control, formState: { errors } } = useForm(); // declaro las funciones necearias para la gestion del formulario de registro

    const [errorAlCrear, setErrorAlCrear] = useState('');
    // declaro la funcion de navegacion entre componentes
    const navigate = useNavigate();

    // estado que se utilizara para que el usuario pueda ver lo que esta ingresando en el campo de contraseña
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const [errorFecha, setErrorFecha] = useState('')

    // funcion que se ejecutara en cuanto el usuario pulse REGISTRARSE, la cual procesara los datos ingresados, 
    // levara a cabo las respectivas validaciones, y enviara los datos al backend si dichas validaciones son todas exitosas
    const onSubmit = async (data) => {
        data.nombre = data.nombre.toLowerCase();
        data.apellido = data.apellido.toLowerCase();

        const hoy = new Date()
        const fechaIngresada = new Date(data.fechaNacimiento)
        if (fechaIngresada >= hoy) {
            setErrorFecha('Error, ingresa una fecha valida')
            return
        }
        setErrorFecha('')

        data.dni = parseInt(data.dni);
        console.log(data);

        const response = await axios.post('api/flextrainer/usuarios/', data);
        console.log("rta creacion: ", response.data)

        if (response.data.error) {
            setErrorAlCrear(response.data.error)
            return;
        }
        setErrorAlCrear('')


        navigate('/')
    };

    // Obtén la fecha actual en el formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // funcion que se va a ejecutar en cuanto el usuario pulse el boton de volver, la cual lo llevara al componente Home (NO logueado)
    const handleBack = () => {
        navigate('/');
    };

    return (
        <>
            {/* Header del formulario de registro */}
            <Navbar style={{ backgroundColor: '#881313' }}>
                <Container>
                    <Navbar.Brand style={{ color: 'white' }}>Registrarse</Navbar.Brand>
                </Container>
            </Navbar>

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Form style={{ border: 'solid 1px red', width: '96%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '4px' }}>
                    <Card style={{ width: '96%', marginTop: '16px' }}>
                        <p>Los campos marcados con (*) son obligatorios</p>
                        <Card.Body>
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
                                <div className="col-md-6">
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
                                        {errors.password && <p>{errors.password.message}</p>}
                                    </Form.Group>
                                </div>
                            </div>
                        </Card.Body>

                        <br style={{ backgroundColor: 'red' }}></br>

                        <Card.Body>
                            <span>Información Personal</span>
                            <div className='row'>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
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
                                                        message: 'Porfavor, ingresa solo letras en este campo. Si tu nombre tiene una ñ, por favor usa `ni`'
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
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
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
                                                        message: 'Porfavor, ingresa solo letras en este campo. Si tu apellido tiene una ñ, por favor usa `ni`'
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
                                                <option value='0'>Sin Elegir</option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Femenino">Femenino</option>
                                                <option value="X">X</option>
                                            </Form.Select>
                                        )}
                                    />
                                    {errors.genero && <p>{errors.genero.message}</p>}
                                </Form.Group>
                            </div>
                        </Card.Body>

                        <br style={{ backgroundColor: 'red' }}></br>

                        <Card.Body>
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
                                        {errorAlCrear && <p>{errorAlCrear}</p>}
                                    </Form.Group>
                                </div>
                            </div>
                            <Modal.Footer>
                                <Button variant="danger" style={{ marginRight: '8px' }} onClick={() => handleBack()}>
                                    Cancelar
                                </Button>
                                <Button variant="success" onClick={handleSubmit(onSubmit)}>
                                    Registrarse
                                </Button>
                            </Modal.Footer>
                        </Card.Body>
                    </Card>
                </Form>
            </div>
        </>
    );
};

export { CrearUsuario };