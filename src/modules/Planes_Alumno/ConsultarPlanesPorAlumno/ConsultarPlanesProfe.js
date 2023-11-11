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
import { NavHeader } from '../../../components/NavHeader/NavHeader';
import { BackButton } from '../../../components/BackButton/BackButton';

// importo el servicio de traer los objetivos
import { objetivosServices } from '../../Planes/services/objetivos.service.js';
import { EliminarPlan } from '../EliminarPlan/EliminarPlan.js';
import { ActivarPlan } from '../ActivarPlan/ActivarPlan.js';

const ConsultarPlanesProfe = ({ usuarioEnSesion }) => {
    // declaro las funcionalidades necesarias para gestionar formularios, en este caso, tendremos un formulario de
    // busqueda, que se utilizara como un filtrador de datos
    const { handleSubmit, control, formState: { errors }, reset, setValue, register } = useForm();
    const navigate = useNavigate(); // declaro la funcion de navegacion
    const [planesAlumnos, setPlanesAlumnos] = useState([]); // estado en el que voy a almacenar todos los datos de los planes y sus alumnos


    const [objetivosTraidos, setObjetivosTraidos] = useState([])

    useEffect(() => {
        const traerObjetivos = async () => {
            const response = await objetivosServices.getObjetivos();
            setObjetivosTraidos(response)
        }
        traerObjetivos();
    }, [])

    const traerPlanesAlumnos = async () => {
        const response = await axios.post(`api/flextrainer/planes/getByProfeByFilters/${usuarioEnSesion.dni}`, { dadosBaja: 1 });
        setPlanesAlumnos(response.data);
    }

    // traigo los datos a mostrar en la grilla desde el backend
    useEffect(() => {
        traerPlanesAlumnos();
    }, [])

    // funcion que se va a ejecutar si el usuario pulsa el boton de LIMPIAR los filtros
    const handleClean = () => {
        reset(); // resetea los valores internos de los campos
        setValue('nombre', '');
        setValue('objetivo', '');
        setValue('cantSesiones', '');
        setValue('dadosBaja', false); // Limpiar visualmente el checkbox
    }

    // funcion que se va a ejecutar en cuanto el usuario pulse BUSCAR, enviando los datos ingresados en los filtros
    // al backend
    const onSubmit = async (data) => {
        data.objetivo = parseInt(data.objetivo);
        if (isNaN(data.objetivo)) {
            data.objetivo = 0;
        }

        data.cantSesiones = parseInt(data.cantSesiones);
        if (isNaN(data.cantSesiones)) {
            data.cantSesiones = 0;
        }

        // parseo el checkbox de dados de baja
        if (data.dadosBaja === false) {
            data.dadosBaja = 1;
        } else {
            data.dadosBaja = 0;
        }
        console.log("a enviar al backend", data); // muestro los datos a enviar al backend
        const response = await axios.post(`api/flextrainer/planes/getByProfeByFilters/${usuarioEnSesion.dni}`, data); // llevo a cabo la peticion
        console.log("rta: ", response.data); // muestro por consola la respuesta
        setCurrentPage(1); // seteo la pagina actual como la primera
        setPlanesAlumnos(response.data); // seteo los planes traidos como el valor de la respuesta de la api
    };

    // GESTION DE LA GRILLA Y TEMAS DE PAGINACION
    const [currentPage, setCurrentPage] = useState(1); // que pagina se esta mostrando en el momento
    const [itemsPerPage, setItemsPerPage] = useState(10); // Inicialmente mostrar 10 filas por página
    const totalPages = Math.ceil(planesAlumnos.length / itemsPerPage); // calcular la cantidad de paginas
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = planesAlumnos.slice(startIndex, endIndex);

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

    // GESTION DE MODALES
    // gestion del modal de Eliminar Plan
    const [showModalEliminarPlan, setShowModalEliminarPlan] = useState(false);
    const handleCloseEliminarPlan = () => setShowModalEliminarPlan(false);
    const handleShowEliminarPlan = () => setShowModalEliminarPlan(true);

    // para que me muestre los datos del usuario en el modal que yo elija
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isPlanSelected, setIsPlanSelected] = useState(false);
    const handleRowClick = (plan) => {
        setSelectedPlan(plan);
        setIsPlanSelected(true);
    };

    // gestion del modal de Activar Usuario
    const [showModalActivarPlan, setShowModalActivarPlan] = useState(false);
    const handleCloseActivarPlan = () => setShowModalActivarPlan(false);
    const handleShowActivarPlan = () => setShowModalActivarPlan(true);



    // funcion que se va a ejecutar si el usuario pulsa el boton volver, redirigiendolo, en este caso, a la pantalla de bienvenida
    const handleBack = () => {
        navigate('/bienvenida')
    }

    return (
        <>
            <NavHeader encabezado='Consultar Mis Planes' />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '6%' }}>
                <Button style={{ backgroundColor: 'darkred', border: 'none', marginBottom: '8px' }} onClick={() => navigate('/generarPlan')}>
                    Nuevo
                </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p>Filtros de búsqueda</p>
                        <Card.Body>
                            <Form>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                            <Form.Label>Nombre</Form.Label>
                                            <Controller
                                                name="nombre"
                                                control={control}
                                                rules={
                                                    {
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
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                            <Form.Label>Objetivo*</Form.Label>
                                            <Controller
                                                name="objetivo"
                                                control={control}
                                                render={({ field }) => (
                                                    <Form.Select aria-label="select-objetivo-consultar-plan" {...field}>
                                                        <option value='0'>Sin Elegir</option>
                                                        {objetivosTraidos.map((e, index) => (
                                                            <option key={index + 1} value={e.id}>{e.nombre}</option>
                                                        ))}
                                                    </Form.Select>
                                                )}
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                            <Form.Label>Cantidad de Sesiones*</Form.Label>
                                            <Controller
                                                name="cantSesiones"
                                                control={control}
                                                render={({ field }) => (
                                                    <Form.Select
                                                        aria-label="select-sesiones-crear-plan"
                                                        required={false}
                                                        {...field}
                                                    >
                                                        <option value=''>Sin Elegir</option>
                                                        <option value='1'>1</option>
                                                        <option value='2'>2</option>
                                                        <option value='3'>3</option>
                                                        <option value='4'>4</option>
                                                        <option value='5'>5</option>
                                                        <option value='6'>6</option>
                                                        <option value='7'>7</option>
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
                                        />
                                    </div>
                                </div>
                                <Nav style={{ backgroundColor: '#F2F2F2', borderRadius: '12px', marginTop: '8px' }} className="justify-content-end">
                                    <Button style={{ backgroundColor: '#555555', marginRight: '8px' }} onClick={() => handleClean()}>
                                        Limpiar
                                    </Button>
                                    <Button style={{ backgroundColor: '#910012', marginRight: '8px' }} onClick={handleSubmit(onSubmit)}>
                                        Buscar
                                    </Button>
                                </Nav>
                            </Form>
                        </Card.Body>
                    </Card.Body>
                </Card>
            </div >

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p>Planes Encontrados</p>
                        {planesAlumnos.length !== 0 ? (
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
                                            <th>Nombre</th>
                                            <th>Objetivo</th>
                                            <th>Sesiones</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((row, index) => (
                                            <tr key={index + 1}>
                                                <td>{row.nombre}</td>
                                                <td>{row.Objetivo.nombre}</td>
                                                <td>{row.cantidadSesiones}</td>
                                                <td className="d-flex justify-content-center">

                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip id='intentandoesto'>
                                                                <strong>Ver mas info.</strong>.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Button variant="secondary" style={{ backgroundColor: '#EAD85A', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => navigate(`/verPlan/${row.id}`)}  >
                                                            {/* {onClick = {() => navigate(`/verUsuario/${row.dni}`)}} */}
                                                            <i className="bi bi-eye" style={{ fontSize: '16px' }}></i>
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip id='intentandoesto'>
                                                                <strong>Modificar Plan</strong>.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Button variant="secondary" style={{ backgroundColor: '#55E14E', border: 'none', borderRadius: '50%', margin: '2px' }} >
                                                            {/* {onClick = {() => navigate(`/modificarUsuario/${row.dni}`)}} */}
                                                            <i className="bi bi-pencil-square" style={{ fontSize: '16px' }}></i>
                                                        </Button>
                                                    </OverlayTrigger>
                                                    {row.esActivo === 1 && (
                                                        <OverlayTrigger
                                                            placement='top'
                                                            overlay={
                                                                <Tooltip id='intentandoesto'>
                                                                    <strong>Eliminar Plan</strong>.
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <Button variant="secondary" style={{ backgroundColor: 'red', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => { handleRowClick(row); handleShowEliminarPlan() }}>
                                                                <i className="bi bi-x" style={{ fontSize: '16px' }}></i>
                                                            </Button>
                                                        </OverlayTrigger>
                                                    )}
                                                    {row.esActivo === 0 && (
                                                        <OverlayTrigger
                                                            placement='top'
                                                            overlay={
                                                                <Tooltip id='intentandoesto'>
                                                                    <strong>Activar Plan</strong>.
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <Button variant="secondary" style={{ backgroundColor: 'green', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => { handleRowClick(row); handleShowActivarPlan() }}>
                                                                <i className="bi bi-check-lg" style={{ fontSize: '16px' }}></i>
                                                            </Button>
                                                        </OverlayTrigger>
                                                    )}
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

            <EliminarPlan
                showModalEliminarPlan={showModalEliminarPlan}
                handleCloseEliminarPlan={handleCloseEliminarPlan}
                setSelectedPlan={setSelectedPlan}
                setIsPlanSelected={setIsPlanSelected}
                selectedPlan={selectedPlan}
                traerPlanes={traerPlanesAlumnos}
                handleClean={handleClean}
            />

            <ActivarPlan
                showModalActivarPlan={showModalActivarPlan}
                handleCloseActivarPlan={handleCloseActivarPlan}
                setSelectedPlan={setSelectedPlan}
                setIsPlanSelected={setIsPlanSelected}
                selectedPlan={selectedPlan}
                traerPlanes={traerPlanesAlumnos}
                handleClean={handleClean}
            />
        </>
    )
}

export { ConsultarPlanesProfe }
