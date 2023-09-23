import React, { useEffect, useState } from 'react'; // importando funcionalidades necesarias de react, ademas de la libreria en si
import { useNavigate } from 'react-router-dom'; // importando la funcionalidad de navegacion entre componentes
import { useForm, Controller } from 'react-hook-form'; // importando las funcionalidades neecsarias para gestion de formularios 

// importando componentes bootstrap necesarios
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';

// importando estilos asociados a esta pantalla
import './AsignarRol.css';

// tengo que explicar esto de nuevo?
const AsignarRol = ({ showModalAsignarRol, handleCloseAsignarRol }) => {

    // seteando en un estado el rol elegido por el usuario, esto para que funcione el tema del select concatenado
    // especificado en la H.U.
    const [rolElegido, setRolElegido] = useState('');

    // funcionalidades y propiedades necesarias para la gestion del formulario de inicio de sesion
    const { handleSubmit, control, formState: { errors }, setValue } = useForm();

    // cada vez que el usuario cambie el rol elegido, se ejecuta este efecto, seteando el rol elegido 
    // para enviar al backend, en lo elegido por el usuario
    useEffect(() => {
        setValue('rol', rolElegido);
    }, [setValue, rolElegido]);

    // funcion que se va a ejecutar en cuanto el usuario pulse el boton asignar, que procesara los datos
    // y los enviara al backend para llevar a cabo el correspondiente servicio de asignacion de rol
    const onSubmit = async (data) => {
        data.rol = rolElegido; // indicando que el rol sera el rolElegido, obviamente

        if (data.rol === 'Entrenador') { // si el rol elegido es el de entrenador, que borre el atributo entrenador del objeto a enviar al backend
            delete data.entrenador;
        };

        console.log(data); // consoleando lo que voy a enviar al backend

        handleCloseAsignarRol(); // cerrar el modal de asignacion de rol
        setRolElegido(''); // setear el rol elegido como que no eligio ninguno, para que cuando vuelva a abrir el modal, tenga que elegir de nuevo el rol
        setValue('entrenador', ''); // setear el atributo entrenador como '' de los datos a enviar al backend
    };

    return (
        // modales y formualrios ya lo explique en el modal de inicio de sesion, y ante la duda siempre me pueden mandar un wsp
        <Modal show={showModalAsignarRol} onHide={handleCloseAsignarRol}>
            <Modal.Header closeButton className='asignarRol-modal-header'>
                <Modal.Title className='asignarRol-modal-title'>Asignar Rol</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Modal.Title>DNI: 237864238</Modal.Title>
                <br></br>
                <Modal.Title>Nombres: Tu vieja</Modal.Title>
                <br></br>
                <Modal.Title>Apellidos: En tanga</Modal.Title>
                <br></br>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Rol</Form.Label>
                        <Controller
                            name="rol"
                            control={control}
                            rules={{ required: 'Este campo es requerido' }}

                            render={({ field }) => (
                                <Form.Select aria-label="select-rol-asignacion-usuarios" {...field} onChange={(e) => setRolElegido(e.target.value)}>
                                    <option value='' >Sin Asignar</option>
                                    <option value="Alumno">Alumno</option>
                                    <option value="Entrenador">Entrenador</option>
                                </Form.Select>
                            )}
                        />
                        {errors.rol && <p>{errors.rol.message + 'bbb'}</p>}
                    </Form.Group>
                    {rolElegido === 'Alumno' && (
                        <>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                <Form.Label>Entrenador</Form.Label>
                                <Controller
                                    name="entrenador"
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <Form.Select aria-label="select-entrenador-asignacion-usuarios" {...field} >
                                            <option value='' >Sin Asignar</option>
                                            <option value="E1">E1</option>
                                            <option value="E2">E2</option>
                                        </Form.Select>
                                    )}
                                />
                                {errors.entrenador && <p>{errors.entrenador.message + 'aaaaa'}</p>}
                            </Form.Group>
                        </>
                    )}
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleCloseAsignarRol}>
                            Cancelar
                        </Button>
                        <Button variant="success" onClick={handleSubmit(onSubmit)}>
                            Asignar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export { AsignarRol };