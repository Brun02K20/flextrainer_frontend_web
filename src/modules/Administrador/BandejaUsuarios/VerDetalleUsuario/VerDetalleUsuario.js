import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // importo la funcionalidad de navegacion entre componentes de react-router-dom
import { useForm, Controller } from 'react-hook-form'; // importo las funcionalidades necesarias para la gestion de formularios a travves de react-hook-form

// importo componentes bootstrap necesarios
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Nav } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

// importar estilos asociados al componente
import './VerDetalleUsuario.css';
import axios from 'axios';

const VerDetalleUsuario = () => {
    const { handleSubmit, control, formState: { errors } } = useForm(); // declaro las funciones necearias para la gestion del formulario de registro
    const navigate = useNavigate();
    const { dni } = useParams();
    const [user, setUser] = useState({})

    useEffect(() => {
        const traerDatosUsuario = async () => {
            const user = await axios.get(`http://localhost:4001/flextrainer/usuarios/usuario/${dni}`)
            setUser(user.data)
        }
        traerDatosUsuario();
    }, [dni])

    useEffect(() => {
        console.log("usuario que toy viendo: ", user)
    }, [user])

    const handleBack = () => {
        navigate('/bandejaUsuarios')
    }
    return (
        <>
            <Navbar style={{ backgroundColor: 'red' }}>
                <Container>
                    <Navbar.Brand style={{ color: 'white' }}>Detalle de Usuario</Navbar.Brand>
                </Container>
            </Navbar>

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

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button style={{ marginBottom: '16px' }} onClick={handleBack}>
                    Volver
                </Button>
            </div>
        </>
    )
}

export { VerDetalleUsuario }