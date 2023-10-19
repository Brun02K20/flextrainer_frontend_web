import React, { useState, useEffect } from 'react'; // importo funcionalidades propias de react
import { useNavigate, useParams } from 'react-router-dom'; // importo la funcionalidad de navegacion entre componentes de react-router-dom
import { useForm, Controller } from 'react-hook-form'; // importo las funcionalidades necesarias para la gestion de formularios a travves de react-hook-form

// importo componentes bootstrap necesarios
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

import './VerDetalleUsuario.css'; // importar estilos asociados al componente
import axios from 'axios'; // importo axios para llevar a cabo la peticion
import { NavHeader } from '../../../../components/NavHeader/NavHeader';
import { BackButton } from '../../../../components/BackButton/BackButton';

const VerDetalleUsuario = () => {
    const { control, formState: { errors } } = useForm(); // declaro las funciones necearias para la gestion del formulario de registro
    const navigate = useNavigate(); // declaro la funcion de navegacion entre componentes
    const { dni } = useParams(); // declaro que yo en el routeo de este componente, voy a estar esperando un parametro en la url, en este caso, se llama "dni"
    const [user, setUser] = useState({}); // estaod en el que voy a almacenar la informacion del usuario a consultar

    // efecto para traer la info del usuario a consultar desde el backend, donde va a ejecutarse cada vez
    //que elija un usuario distinto, es decir, cada vez que cambie el dni
    useEffect(() => {
        const traerDatosUsuario = async () => {
            const user = await axios.get(`http://localhost:4001/flextrainer/usuarios/usuario/${dni}`);
            setUser(user.data);
        }
        traerDatosUsuario();
    }, [dni]);

    // funcion que se va a ejecutar si el usuairo pulsa el boton volver, en este caso, solo lo redirige a la bandeja de usuarios
    const handleBack = () => {
        navigate('/bandejaUsuarios');
    }

    return (
        <>
            <NavHeader encabezado='Detalle de Usuario' />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card style={{ width: '96%', marginTop: '16px' }}>
                    <Card.Body>
                        <Card style={{ padding: '16px' }}>
                            <span>Información de Usuario</span>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="col-md-12">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>DNI</Form.Label>
                                            <Controller
                                                name="dni"
                                                control={control}
                                                rules={{ required: 'Este campo es requerido' }}
                                                render={({ field }) => (
                                                    <Form.Control
                                                        type="number"
                                                        placeholder={user.dni}
                                                        {...field}
                                                        disabled
                                                    />
                                                )}
                                            />
                                            {errors.dni && <p>{errors.dni.message}</p>}
                                        </Form.Group>
                                    </div>
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
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                        <Form.Label>Nombre*</Form.Label>
                                        <Controller
                                            name="nombre"
                                            control={control}
                                            rules={{ required: 'Este campo es requerido' }}
                                            render={({ field }) => (
                                                <Form.Control
                                                    type="text"
                                                    placeholder={user.nombre}
                                                    {...field}
                                                    disabled
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
                                            rules={{ required: 'Este campo es requerido' }}
                                            render={({ field }) => (
                                                <Form.Control
                                                    type="text"
                                                    placeholder={user.apellido}
                                                    {...field}
                                                    disabled
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
                                                <Form.Control
                                                    type="text"
                                                    placeholder={user.fechaNacimiento}
                                                    {...field}
                                                    disabled
                                                />
                                            )}
                                        />
                                        {errors.fechaNacimiento && <p>{errors.fechaNacimiento.message}</p>}
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
                                                <Form.Select disabled aria-label="select-genero-busqueda-usuarios" {...field}>
                                                    <option value='0'>{user.genero}</option>
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

                    <Card.Body>
                        <Card style={{ padding: '16px' }}>
                            <span>Información de Contacto*</span>
                            <div className='row'>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
                                        <Form.Label>Correo Electronico</Form.Label>
                                        <Controller
                                            name="email"
                                            control={control}
                                            rules={{ required: 'Este campo es requerido' }}
                                            render={({ field }) => (
                                                <Form.Control
                                                    type="email"
                                                    placeholder={user.correoElectronico}
                                                    {...field}
                                                    disabled
                                                />
                                            )}
                                        />
                                        {errors.email && <p>{errors.email.message}</p>}
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput7">
                                        <Form.Label>Celular*</Form.Label>
                                        <Controller
                                            name="telefono"
                                            control={control}
                                            rules={{ required: 'Este campo es requerido' }}
                                            render={({ field }) => (
                                                <Form.Control
                                                    type="number"
                                                    placeholder={user.numeroTelefono}
                                                    {...field}
                                                    disabled
                                                />
                                            )}
                                        />
                                        {errors.telefono && <p>{errors.telefono.message}</p>}
                                    </Form.Group>
                                </div>
                            </div>
                        </Card>
                    </Card.Body>
                </Card>
            </div>

            <br></br>

            <BackButton handleBack={handleBack} />
        </>
    )
}

export { VerDetalleUsuario }