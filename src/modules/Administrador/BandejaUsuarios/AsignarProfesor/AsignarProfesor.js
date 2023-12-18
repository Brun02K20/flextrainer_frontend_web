import React, { useEffect, useState } from 'react'; // importando funcionalidades necesarias de react, ademas de la libreria en si
import { useForm, Controller } from 'react-hook-form'; // importando las funcionalidades neecsarias para gestion de formularios 

// importando componentes bootstrap necesarios
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';

import './AsignarProfesor.css';
import { entrenadoresActivosServices } from '../services/entrenadoresActivos.service.js';
import axios from 'axios';
import { API } from '../../../../constants/api.js';


const AsignarProfesor = ({ showModalAsignarProfe, handleCloseAsignarProfe, selectedUser, setIsUserSelected, setSelectedUser, isUserSelected, setUsuarios, usuarios, traerUsuarios }) => {
    const { handleSubmit, control, formState: { errors }, setValue } = useForm(); // funcionalidades y propiedades necesarias para la gestion del formulario
    const [coaches, setCoaches] = useState([]); // estado en el que voy a almacenar los profesores

    // funcion que me permite traer los entrenadores actios del backend
    const traerEntrenadoresActivos = async () => {
        const coachesTraidos = await entrenadoresActivosServices.getEntrenadoresActivos();
        setCoaches(coachesTraidos);
    }

    // cada vez que cambien los usuarios, o que cambie el estado de muestra de este modal, trae a los entrenadores activos
    useEffect(() => {
        traerEntrenadoresActivos();
    }, [usuarios, showModalAsignarProfe]);

    // muestro a que usuario le voy a asignar un profe
    useEffect(() => {
        console.log("usuario a asignarle profe: ", selectedUser)
    }, [selectedUser]);

    const onSubmit = async (data) => {
        // intentando llevar a cabo la peticion
        try {
            data.entrenador = parseInt(data.entrenador)
            data.dniUser = selectedUser.dni
            const response = await axios.put(`${API}/flextrainer/usuarios/usuario/asignarProfe`, data, { timeout: 500000 }); // peticion
            console.log(response.data);
            setIsUserSelected(false); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
            setSelectedUser({}); // indico que mis acciones con este usuario ya finalizaron, indicando que ya no hay un usuario elegido
            handleCloseAsignarProfe(); // cerrar el modal de asignacion de rol
            setValue('entrenador', ''); // setear el atributo entrenador como '' de los datos a enviar al backend
            await traerUsuarios(); // traigo todos los usuarios desde el backend
            console.log(data)
        } catch (error) {
            console.log("error al realizar la peticion de asignacion de profe: ", error);
        }
    }

    return (
        // modales y formualrios ya lo explique en el modal de inicio de sesion, y ante la duda siempre me pueden mandar un wsp
        <Modal show={showModalAsignarProfe} onHide={handleCloseAsignarProfe}>
            <Modal.Header closeButton className='asignarProfe-modal-header'>
                <Modal.Title className='asignarProfe-modal-title'>Asignar Profe</Modal.Title>
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
                        {coaches.length === 0 ? (
                            <h1>Lo sentimos, no hay entrenadores activos</h1>
                        ) : (
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                <Form.Label>Entrenador</Form.Label>
                                <Controller
                                    name="entrenador"
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
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
                    <Modal.Footer>
                        <Button style={{ marginRight: '8px', border: 'none', backgroundColor: 'grey' }} onClick={handleCloseAsignarProfe}>
                            Cancelar
                        </Button>
                        <Button style={{ marginRight: '8px', border: 'none', backgroundColor: 'darkred' }} onClick={handleSubmit(onSubmit)}>
                            Asignar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export { AsignarProfesor }