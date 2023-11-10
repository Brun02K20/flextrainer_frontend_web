import React, { useState, useEffect } from 'react'; // importando React y funcionalidades necesarias del mismo
import { useNavigate } from 'react-router-dom'; // importando funcion de navegacion entre componentes de react-router-dom
import { useForm, Controller } from 'react-hook-form'; // importando funcionalidades necesarias para la gestion de formularios

// importando componentes de react-bootstrap necesarios
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Nav, Table, Pagination } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

// importo axios para poder realizar las peticiones necesarias al backend
import axios from 'axios';
import { NavHeader } from '../../../components/NavHeader/NavHeader.js';
import { BackButton } from '../../../components/BackButton/BackButton.js';
import { EliminarAlumno } from '../EliminarAlumno/EliminarAlumno.js';

const ConsultarAlumnosProfe = ({ usuarioEnSesion }) => {
    // declaro las funcionalidades necesarias para gestionar formularios, en este caso, tendremos un formulario de
    // busqueda, que se utilizara como un filtrador de datos
    const { handleSubmit, control, formState: { errors }, reset, setValue, register } = useForm();
    const navigate = useNavigate(); // declaro la funcion de navegacion
    const [alumnosProfe, setAlumnosProfe] = useState([]); // almacenare aca los datos traidos del backend

    const [planesTraidos, setPlanesTraidos] = useState([]); // planes para el combobox filtrador

    const handleBack = () => {
        navigate("/bienvenida")
    }

    const traerAlumnosDelProfesor = async () => {
        const alumnos = await axios.post(`http://localhost:4001/flextrainer/planesAlumnos/alumnosProfeFiltrados/${usuarioEnSesion.dni}`, { dadosBaja: 1 })
        setAlumnosProfe(alumnos.data)
    }

    useEffect(() => {
        const traerPlanesProfesor = async () => {
            const planes = await axios.get(`http://localhost:4001/flextrainer/planes/byProfesor/${usuarioEnSesion.dni}`)
            setPlanesTraidos(planes.data)
        }
        traerPlanesProfesor()
    }, [])

    useEffect(() => {
        traerAlumnosDelProfesor()
    }, [])

    useEffect(() => {
        console.log("planes traidos: ", planesTraidos)
    }, [planesTraidos])

    useEffect(() => {
        console.log("alumnos traidos del profesor: ", alumnosProfe)
    }, [alumnosProfe])


    // GESTION DE LA GRILLA Y TEMAS DE PAGINACION
    const [currentPage, setCurrentPage] = useState(1); // que pagina se esta mostrando en el momento
    const [itemsPerPage, setItemsPerPage] = useState(10); // Inicialmente mostrar 10 filas por página
    const totalPages = Math.ceil(alumnosProfe.length / itemsPerPage); // calcular la cantidad de paginas
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = alumnosProfe.slice(startIndex, endIndex);

    // setear la pagina actual en la que pulse el usuario
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // se ejecuta esta funcion cada vez que el usuario modifique la cantidad de filas a ver por pagina
    const handleItemsPerPageChange = (event) => {
        const newItemsPerPage = parseInt(event.target.value); // convirtiendo a int lo que eligio
        setItemsPerPage(newItemsPerPage); // setear cantidad de filas por pagina
        setCurrentPage(1); // Reiniciar a la primera página cuando cambia el número de elementos por página
    };


    const onSubmit = async (data) => {
        data.idPlan = parseInt(data.idPlan);
        if (isNaN(data.idPlan)) {
            data.idPlan = 0;
        }

        if (data.dadosBaja === false) {
            data.dadosBaja = 1;
        } else {
            data.dadosBaja = 0;
        }
        console.log(data)
        const response = await axios.post(`http://localhost:4001/flextrainer/planesAlumnos/alumnosProfeFiltrados/${usuarioEnSesion.dni}`, data); // llevo a cabo la peticion
        console.log("rta: ", response.data); // muestro por consola la respuesta
        setAlumnosProfe(response.data)
        setCurrentPage(1); // seteo la pagina actual como la primera
    }

    const handleClean = () => {
        reset();
        setValue('dni', '');
        setValue('nombre', '');
        setValue('apellido', '')
        setValue('dadosBaja', false);
        setValue('genero', 0);
        setValue('idPlan', '');
    }

    // GESTION DE MODALES
    // gestion del modal de Eliminar Usuario
    const [showModalEliminarAlumno, setShowModalEliminarAlumno] = useState(false);
    const handleCloseEliminarAlumno = () => setShowModalEliminarAlumno(false);
    const handleShowEliminarAlumno = () => setShowModalEliminarAlumno(true);

    // para que me muestre los datos del usuario en el modal que yo elija
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserSelected, setIsUserSelected] = useState(false);
    const handleRowClick = (user) => {
        setSelectedUser(user);
        setIsUserSelected(true);
    };


    return (
        <>
            <NavHeader encabezado="Consultar alumnos" />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p>Filtros de búsqueda</p>
                        <Card.Body>
                            <Form>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>DNI</Form.Label>
                                            <Controller
                                                name="dni"
                                                control={control}
                                                rules={
                                                    {
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message: 'Solo se permiten números positivos en este campo'
                                                        },
                                                        maxLength: {
                                                            value: 8,
                                                            message: 'El DNI no puede tener mas de 8 caracteres'
                                                        },
                                                        minLength: {
                                                            value: 7,
                                                            message: 'El DNI no puede tener menos de 7 caracteres'
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
                                            <Form.Label>Nombre</Form.Label>
                                            <Controller
                                                name="nombre"
                                                control={control}
                                                rules={
                                                    {
                                                        pattern: {
                                                            value: /^[a-zA-Z]+$/,
                                                            message: 'Porfavor, ingresa solo letras en este campo. Si el nombre tiene una ñ, por favor usa `ni`'
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
                                            <Form.Label>Apellido</Form.Label>
                                            <Controller
                                                name="apellido"
                                                control={control}
                                                rules={
                                                    {
                                                        pattern: {
                                                            value: /^[a-zA-Z]+$/,
                                                            message: 'Porfavor, ingresa solo letras en este campo. Si el apellido tiene una ñ, porfavor usa `ni`'
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
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                                            <Form.Label>Género</Form.Label>
                                            <Controller
                                                name="genero"
                                                control={control}
                                                // rules={{ required: 'Este campo es requerido' }}
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
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                            <Form.Label>Plan</Form.Label>
                                            <Controller
                                                name="idPlan"
                                                control={control}
                                                render={({ field }) => (
                                                    <Form.Select aria-label="select-plan-consultar-alumnos" {...field}>
                                                        <option value='0'>Sin Elegir</option>
                                                        {planesTraidos.map((e, index) => (
                                                            <option key={index + 1} value={e.id}>{e.nombre}</option>
                                                        ))}
                                                    </Form.Select>
                                                )}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className='col-md-6'>
                                        <Form.Check
                                            type='checkbox'
                                            id='checkbox-busqueda-usuarios'
                                            label='Incluir dados de baja'
                                            {...register('dadosBaja')}
                                        // style={{ border: '4px red solid' }}
                                        />
                                    </div>
                                </div>
                                <Nav style={{ backgroundColor: '#F2F2F2', borderRadius: '12px', marginTop: '8px' }} className="justify-content-end">
                                    <Button style={{ backgroundColor: '#555555' }} onClick={() => handleClean()}>
                                        Limpiar
                                    </Button>
                                    <Button style={{ backgroundColor: '#910012' }} onClick={handleSubmit(onSubmit)}>
                                        {/* onClick = { handleSubmit(onSubmit) } */}
                                        Buscar
                                    </Button>
                                </Nav>
                            </Form>
                        </Card.Body>
                    </Card.Body>
                </Card>
            </div>

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p>Alumnos Encontrados</p>
                        {alumnosProfe.length !== 0 ? (
                            <div>
                                <div className="mb-3">
                                    Filas por página:{' '}
                                    <Form.Select
                                        value={itemsPerPage}
                                        onChange={handleItemsPerPageChange}
                                        style={{ width: '25%' }}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                    </Form.Select>
                                </div>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>DNI</th>
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>Plan</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((row, index) => (
                                            <tr key={index + 1}>
                                                <td>{row.alumno.dni}</td>
                                                <td>{row.alumno.nombre}</td>
                                                <td>{row.alumno.apellido}</td>
                                                <td>{row.plan ? row.plan.nombre : 'Sin Plan'}</td>
                                                <td className="d-flex justify-content-center">

                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip id='intentandoesto'>
                                                                <strong>Asignar Plan</strong>.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Button variant="secondary" style={{ backgroundColor: '#05a7e8', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => navigate(`/asignarPlanAAlumno/${row.alumno.dni}`)} >
                                                            {/* {onClick = {() => navigate(`/verUsuario/${row.dni}`)}} */}
                                                            <i className="bi bi-calendar-check-fill" style={{ fontSize: '16px' }}></i>
                                                        </Button>
                                                    </OverlayTrigger>

                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip id='intentandoesto'>
                                                                <strong>Ver mas info.</strong>.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Button variant="secondary" style={{ backgroundColor: '#EAD85A', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => navigate(`/alumnoProfe/${row.alumno.dni}`)}   >
                                                            {/* {onClick = {() => navigate(`/verUsuario/${row.dni}`)}} */}
                                                            <i className="bi bi-eye" style={{ fontSize: '16px' }}></i>
                                                        </Button>
                                                    </OverlayTrigger>

                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip id='intentandoesto'>
                                                                <strong>Eliminar Alumno</strong>.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Button variant="secondary" style={{ backgroundColor: 'red', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => { handleRowClick(row); handleShowEliminarAlumno() }}>
                                                            <i className="bi bi-x" style={{ fontSize: '16px' }}></i>
                                                        </Button>
                                                    </OverlayTrigger>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <Pagination>
                                    <Pagination.Prev
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    />
                                    {[...Array(totalPages)].map((_, index) => (
                                        <Pagination.Item
                                            key={index + 1}
                                            active={index + 1 === currentPage}
                                            onClick={() => handlePageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    />
                                </Pagination>
                            </div>
                        ) : (
                            <div className='col s12 center'>
                                <h3 style={{ textAlign: 'center' }}>NO HAY PLANES QUE CUMPLAN CON LO QUE INGRESASTE</h3>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>

            <br></br>

            <BackButton handleBack={handleBack} />

            <EliminarAlumno
                showModalEliminarAlumno={showModalEliminarAlumno}
                handleCloseEliminarAlumno={handleCloseEliminarAlumno}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                setIsUserSelected={setIsUserSelected}
                handleClean={handleClean}
                traerAlumnos={traerAlumnosDelProfesor}
            />
        </>
    );
}

export { ConsultarAlumnosProfe }