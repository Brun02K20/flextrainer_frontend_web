import React, { useState, useEffect } from 'react'; // importo la libreria de React y las funcionalidades necesarias
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

// importo los estilos asociados a esta pantalla
import './ModificarUsuario.css';

const ModificarUsuario = () => {
    const { id } = useParams(); // indico que este componente, va a tener un parametro en su URL, que va a ser el id del usuario a modificar
    const { handleSubmit, control, formState: { errors } } = useForm(); // declaro las funciones necearias para la gestion del formulario de registro

    // declaro la funcion de navegacion entre componentes
    const navigate = useNavigate();

    // estado que se utilizara para que el usuario pueda ver lo que esta ingresando en el campo de contraseña
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // funcion que se ejecutara en cuanto el usuario pulse REGISTRARSE, la cual procesara los datos ingresados, 
    // levara a cabo las respectivas validaciones, y enviara los datos al backend si dichas validaciones son todas exitosas
    const onSubmit = async (data) => {
        console.log(data);
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
                    <Navbar.Brand style={{ color: 'white' }}>Modificar Usuario {id}</Navbar.Brand>
                </Container>
            </Navbar>

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Form style={{ border: 'solid 1px red', width: '96%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '4px' }}>
                    <Card style={{ width: '96%', marginTop: '16px' }}>
                        <p>Los campos marcados con (*) son obligatorios</p>
                        <Card.Body>
                            <span>Información de Usuario</span>


                            <Modal.Footer>
                                <Button variant="danger" style={{ marginRight: '8px' }} onClick={() => handleBack()}>
                                    Volver
                                </Button>
                                <Button variant="success" onClick={handleSubmit(onSubmit)}>
                                    Modificar
                                </Button>
                            </Modal.Footer>
                        </Card.Body>
                    </Card>
                </Form>
            </div>
        </>
    )
}

export { ModificarUsuario }