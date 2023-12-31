import React, { useState, useEffect } from 'react'; // importando React y funcionalidades necesarias del mismo
import { useNavigate } from 'react-router-dom'; // importando funcion de navegacion entre componentes de react-router-dom
import { useForm, Controller } from 'react-hook-form'; // importando funcionalidades necesarias para la gestion de formularios

// importando componentes de react-bootstrap necesarios
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Table } from 'react-bootstrap';

// importo axios para poder realizar las peticiones necesarias al backend
import axios from 'axios';
import { NavHeader } from '../../../components/NavHeader/NavHeader.js';
import { BackButton } from '../../../components/BackButton/BackButton.js';
import { EliminarAlumno } from '../EliminarAlumno/EliminarAlumno.js';
import { API } from '../../../constants/api.js';
import { SearchNavBar } from '../../../components/SearchNavbar/SearchNavBar.js';
import { RowsPerPage } from '../../../components/Pagination/RowsPerPage.js';
import { ActionButton } from '../../../components/ActionButton/ActionButton.js';
import { Paginator } from '../../../components/Pagination/Pagination.js';

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
        const alumnos = await axios.post(`${API}/flextrainer/planesAlumnos/alumnosProfeFiltrados/${usuarioEnSesion.dni}`, { dadosBaja: 1 }, { timeout: 500000 })
        setAlumnosProfe(alumnos.data)
    }

    useEffect(() => {
        const traerPlanesProfesor = async () => {
            const planes = await axios.get(`${API}/flextrainer/planes/byProfesor/${usuarioEnSesion.dni}`, { timeout: 500000 })
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
        const response = await axios.post(`${API}/flextrainer/planesAlumnos/alumnosProfeFiltrados/${usuarioEnSesion.dni}`, data, { timeout: 500000 }); // llevo a cabo la peticion
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
                        <p style={{ color: 'darkred', fontWeight: '600' }}>Filtros de búsqueda</p>
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
                                                        placeholder="Ingresá el DNI del alumno"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.dni && <p style={{ color: 'darkred' }}>{errors.dni.message}</p>}
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
                                                            value: /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]+$/,
                                                            message: 'Porfavor, ingresa solo letras en este campo.'
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
                                                        placeholder="Ingresá el nombre del alumno"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.nombre && <p style={{ color: 'darkred' }}>{errors.nombre.message}</p>}
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
                                                            value: /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]+$/,
                                                            message: 'Porfavor, ingresa solo letras en este campo.'
                                                        },
                                                        maxLength: {
                                                            value: 30,
                                                            message: 'Máximo 30 caracteres'
                                                        }
                                                    }
                                                }
                                                render={({ field }) => (
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Ingresá el apellido del alumno"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.apellido && <p style={{ color: 'darkred' }}>{errors.apellido.message}</p>}
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
                                            {errors.genero && <p style={{ color: 'darkred' }}>{errors.genero.message}</p>}
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
                                <SearchNavBar handleClean={handleClean} handleSubmit={handleSubmit(onSubmit)} />
                            </Form>
                        </Card.Body>
                    </Card.Body>
                </Card>
            </div>

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p style={{ color: 'darkred', fontWeight: '600' }}>Alumnos encontrados</p>
                        {alumnosProfe.length !== 0 ? (
                            <div>
                                <RowsPerPage
                                    itemsPerPage={itemsPerPage}
                                    handleItemsPerPageChange={handleItemsPerPageChange}
                                />
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
                                                <td>{row.alumno.nombre?.toUpperCase()}</td>
                                                <td>{row.alumno.apellido?.toUpperCase()}</td>
                                                <td>{row.plan ? row.plan.nombre?.toUpperCase() : 'Sin plan'}</td>
                                                <td className="d-flex justify-content-center">
                                                    <ActionButton
                                                        tooltipText="Asignar Plan"
                                                        color="#05a7e8"
                                                        icon="bi-calendar-check-fill"
                                                        onClickFunction={() => navigate(`/asignarPlanAAlumno/${row.alumno.dni}`)}
                                                    />

                                                    <ActionButton
                                                        tooltipText="Ver más info."
                                                        color="#EAD85A"
                                                        icon="bi-eye"
                                                        onClickFunction={() => navigate(`/alumnoProfe/${row.alumno.dni}`)}
                                                    />

                                                    <ActionButton
                                                        tooltipText="Eliminar Alumno"
                                                        color="red"
                                                        icon="bi-x"
                                                        onClickFunction={() => { handleRowClick(row); handleShowEliminarAlumno() }}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <Paginator
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    handlePageChange={handlePageChange}
                                />
                            </div>
                        ) : (
                            <div className='col s12 center'>
                                <h3 style={{ textAlign: 'center' }}>NO HAY ALUMNOS QUE CUMPLAN CON LO QUE INGRESASTE</h3>
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