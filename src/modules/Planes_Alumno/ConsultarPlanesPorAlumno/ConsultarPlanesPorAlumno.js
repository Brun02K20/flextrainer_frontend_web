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

const ConsultarPlanesPorAlumno = () => {
    // declaro las funcionalidades necesarias para gestionar formularios, en este caso, tendremos un formulario de
    // busqueda, que se utilizara como un filtrador de datos
    const { handleSubmit, control, formState: { errors }, reset, setValue, register } = useForm();
    const navigate = useNavigate(); // declaro la funcion de navegacion
    const [planesAlumnos, setPlanesAlumnos] = useState([]); // estado en el que voy a almacenar todos los datos de los planes y sus alumnos

    // traigo los datos a mostrar en la grilla desde el backend
    useEffect(() => {
        const traerPlanesAlumnos = async () => {
            const response = await axios.post(`http://localhost:4001/flextrainer/planesAlumnos/byFilters`);
            setPlanesAlumnos(response.data);
        }
        traerPlanesAlumnos();
    }, [])

    // funcion que se va a ejecutar si el usuario pulsa el boton de LIMPIAR los filtros
    const handleClean = () => {
        reset(); // resetea los valores internos de los campos
        setValue('dni', ''); // Limpia visualmente usando setValue
        setValue('nombre', '');
        setValue('apellido', '');
        setValue('dadosBaja', false); // Limpiar visualmente el checkbox
    }

    // funcion que se va a ejecutar en cuanto el usuario pulse BUSCAR, enviando los datos ingresados en los filtros
    // al backend
    const onSubmit = async (data) => {
        data.dni = parseInt(data.dni); // parseo el dni

        // parseo el checkbox de dados de baja
        if (data.dadosBaja === false) {
            data.dadosBaja = 1;
        } else {
            data.dadosBaja = 0;
        }
        console.log("a enviar al backend", data); // muestro los datos a enviar al backend
        const response = await axios.post(`http://localhost:4001/flextrainer/planesAlumnos/byFilters`, data); // llevo a cabo la peticion
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

    // funcion que se va a ejecutar si el usuario pulsa el boton volver, redirigiendolo, en este caso, a la pantalla de bienvenida
    const handleBack = () => {
        navigate('/bienvenida')
    }

    return (
        <>
            <NavHeader encabezado='Consultar Planes por Alumno' />

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
                                                            message: 'Porfavor, ingresa solo letras en este campo. Si el nombre del alumno tiene una ñ, por favor usa `ni`'
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
                                                            message: 'Porfavor, ingresa solo letras en este campo. Si el apellido del alumno tiene una ñ, por favor usa `ni`'
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
                                    <div className='col-md-6'>
                                        <Form.Check
                                            type='checkbox'
                                            id='checkbox-busqueda-usuarios'
                                            label='Incluir dados de baja'
                                            {...register('dadosBaja')}
                                        />
                                    </div>
                                </div>
                                <Nav style={{ backgroundColor: '#a5a3a3', borderRadius: '12px', marginTop: '8px' }} className="justify-content-end">
                                    <Button variant="danger" style={{ margin: '8px' }} onClick={() => handleClean()}>
                                        Limpiar
                                    </Button>
                                    <Button variant="success" style={{ margin: '8px' }} onClick={handleSubmit(onSubmit)}>
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
                                            <th>DNI</th>
                                            <th>Nombres</th>
                                            <th>Apellidos</th>
                                            <th>Plan</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((row, index) => (
                                            <tr key={index + 1}>
                                                <td>{row.dniAlumno}</td>
                                                <td>{row.Usuario.nombre}</td>
                                                <td>{row.Usuario.apellido}</td>
                                                <td>{row.Plane.nombre}</td>
                                                <td className="d-flex justify-content-center">
                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip id='intentandoesto'>
                                                                <strong>Ver Detalle</strong>.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Button variant="secondary" style={{ backgroundColor: '#EAD85A', border: 'none', borderRadius: '50%', margin: '2px' }}>
                                                            <i className="bi bi-eye" style={{ fontSize: '16px' }}></i>
                                                        </Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip id='intentandoesto'>
                                                                <strong>Eliminar Plan</strong>.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Button variant="secondary" style={{ backgroundColor: 'red', border: 'none', borderRadius: '50%', margin: '2px' }}>
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
                                <h3 style={{ textAlign: 'center' }}>NO HAY PLANES ASIGNADOS A ALUMNOS QUE CUMPLAN CON LO QUE INGRESASTE</h3>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>

            <br></br>

            <BackButton handleBack={handleBack} />
        </>
    )
}

export { ConsultarPlanesPorAlumno }
