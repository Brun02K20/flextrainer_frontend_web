import React, { useEffect, useState } from 'react'; // importando funcionalidades necesarias de react, ademas de la libreria en si
import { useForm, Controller } from 'react-hook-form'; // importando las funcionalidades neecsarias para gestion de formularios 

// importando componentes bootstrap necesarios
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';

// importando estilos asociados a esta pantalla
import './AsignarRol.css';
import { entrenadoresActivosServices } from '../services/entrenadoresActivos.service';
import axios from 'axios';
import { API } from '../../../../constants/api.js';

const AsignarRol = ({ showModalAsignarRol, handleCloseAsignarRol, selectedUser, setIsUserSelected, setSelectedUser, isUserSelected, setUsuarios, usuarios, traerUsuarios }) => {
    const { handleSubmit, control, formState: { errors }, setValue } = useForm(); // funcionalidades y propiedades necesarias para la gestion del formulario
    const [coaches, setCoaches] = useState([]); // estado en el que voy a almacenar los profesores
    const [rolElegido, setRolElegido] = useState(''); // seteando en un estado el rol elegido por el usuario, esto para que funcione el tema del select concatenado especificado en la H.U.

    // funcion que me permite traer los entrenadores actios del backend
    const traerEntrenadoresActivos = async () => {
        const coachesTraidos = await entrenadoresActivosServices.getEntrenadoresActivos();
        setCoaches(coachesTraidos);
    }

    // cada vez que cambien los usuarios, o que cambie el estado de muestra de este modal, trae a los entrenadores activos
    useEffect(() => {
        traerEntrenadoresActivos();
    }, [usuarios, showModalAsignarRol]);

    // muestro a que usuario le voy a asignar un rol
    useEffect(() => {
        console.log("usuario a asignarle rol: ", selectedUser)
    }, [selectedUser]);

    // cada vez que el usuario cambie el rol elegido, se ejecuta este efecto, seteando el rol elegido 
    // para enviar al backend, en lo elegido por el usuario
    useEffect(() => {
        setValue('rol', rolElegido);
    }, [setValue, rolElegido]);

    // cada vez que cambien el usuario elegido, trae los usuarios del backend
    useEffect(() => {
        const a = async () => {
            await traerUsuarios();
        }
        a();
    }, [selectedUser, isUserSelected, showModalAsignarRol, rolElegido]);

    // funcion que se va a ejecutar en cuanto el usuario pulse el boton asignar, que procesara los datos
    // y los enviara al backend para llevar a cabo el correspondiente servicio de asignacion de rol
    const onSubmit = async (data) => {
        data.rol = rolElegido; // indicando que el rol sera el rolElegido, obviamente

        if (data.rol === 'Entrenador') { // si el rol elegido es el de entrenador, que borre el atributo entrenador del objeto a enviar al backend
            delete data.entrenador;
        };

        // parseando los datos
        if (data.rol === 'Entrenador') {
            data.rol = 1;
        } else if (data.rol === 'Alumno') {
            data.rol = 2;
            data.entrenador = parseInt(data.entrenador);
        } else {
            data.rol = 3;
        }
        data.dni = selectedUser.dni;
        console.log(data); // consoleando lo que voy a enviar al backend

        // intentando llevar a cabo la peticion
        try {
            const response = await axios.put(`${API}/flextrainer/usuarios/usuario/asignarRol`, data); // peticion
            console.log(response.data);
            setIsUserSelected(false); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
            setSelectedUser({}); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
            handleCloseAsignarRol(); // cerrar el modal de asignacion de rol
            setRolElegido(''); // setear el rol elegido como que no eligio ninguno, para que cuando vuelva a abrir el modal, tenga que elegir de nuevo el rol
            setValue('entrenador', ''); // setear el atributo entrenador como '' de los datos a enviar al backend
            await traerUsuarios(); // traigo todos los usuarios desde el backend
        } catch (error) {
            console.log("error al realizar la peticion de asignacion de rol: ", error);
        }
    };

    return (
        // modales y formualrios ya lo explique en el modal de inicio de sesion, y ante la duda siempre me pueden mandar un wsp
        <Modal show={showModalAsignarRol} onHide={handleCloseAsignarRol}>
            <Modal.Header closeButton className='asignarRol-modal-header'>
                <Modal.Title className='asignarRol-modal-title'>Asignar rol</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Modal.Title>DNI: {selectedUser?.dni}</Modal.Title>
                <br></br>
                <Modal.Title>Nombres: {selectedUser?.nombre?.toUpperCase()}</Modal.Title>
                <br></br>
                <Modal.Title>Apellidos: {selectedUser?.apellido?.toUpperCase()}</Modal.Title>
                <br></br>
                <Form>
                    <>
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
                            {errors.rol && <p style={{ color: 'darkred' }}>{errors.rol.message}</p>}
                        </Form.Group>
                        {rolElegido === 'Alumno' && (
                            <>
                                {coaches.length === 0 ? (
                                    <h1>Lo sentimos, no hay entrenadores activos</h1>
                                ) : (
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                        <Form.Label>Entrenador</Form.Label>
                                        <Controller
                                            name="entrenador"
                                            control={control}
                                            render={({ field }) => (
                                                <Form.Select aria-label="select-entrenador-asignacion-usuarios" {...field} >
                                                    <option value='' >Sin Asignar</option>
                                                    {coaches.map((e, index) => (
                                                        <option key={index} value={e.dni}>{e.nombre} {e.apellido}</option>
                                                    ))}
                                                </Form.Select>
                                            )}
                                        />
                                        {errors.entrenador && <p style={{ color: 'darkred' }}>{errors.entrenador.message}</p>}
                                    </Form.Group>
                                )}
                            </>
                        )}
                    </>
                    <Modal.Footer>
                        <Button style={{ backgroundColor: 'grey', marginRight: '8px', border: 'none' }} onClick={handleCloseAsignarRol}>
                            Cancelar
                        </Button>
                        <Button style={{ backgroundColor: 'darkred', marginRight: '8px', border: 'none' }} onClick={handleSubmit(onSubmit)}>
                            Asignar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export { AsignarRol };