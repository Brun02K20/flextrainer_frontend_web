import React, { useState } from 'react'; // importando React y funcionalidades necesarias del mismo
import { useNavigate } from 'react-router-dom'; // importando funcion de navegacion entre componentes de react-router-dom
import { useForm, Controller } from 'react-hook-form'; // importando funcionalidades necesarias para la gestion de formularios

// importando componentes de react-bootstrap necesarios
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Nav, Table, Pagination } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

// importar componentes desarrollados por mi
import { AsignarRol } from './AsignarRol/AsignarRol';

// lo mismo, declaro componente y explicito props que va a recibir
const BandejaUsuarios = () => {
    // declaro la funcion de navegacion 
    const navigate = useNavigate();

    // declaro las funcionalidades necesarias para gestionar formularios, en este caso, tendremos un formulario de
    // busqueda, que se utilizara como un filtrador de datos
    const { handleSubmit, control, formState: { errors } } = useForm();

    // funcion que se va a ejecutar en cuanto el usuario pulse BUSCAR, enviando los datos ingresados en los filtros
    // al backend
    const onSubmit = async (data) => {
        data.dadosBaja = dadosBaja;
        data.dni = parseInt(data.dni);
        console.log(data);
    };

    //gestion del boton volver, por ahora solo lo lleva a la pantalla de bienvenida
    const handleBack = () => {
        navigate('/bienvenida');
    };

    // declarando las columnas de la tabla, esto se podria llevar a un archivo aparte y cambiar por los nombres que corresponden
    const columns = [
        {
            dataField: 'id',
            text: 'ID',
        },
        {
            dataField: 'name',
            text: 'Nombre',
        },
        {
            dataField: 'email',
            text: 'Email',
        },
        {
            dataField: 'phone',
            text: 'Teléfono',
        },
        {
            dataField: 'city',
            text: 'Ciudad',
        },
    ];

    // despues cambiar esto por una api y traer los datos que correspondan, esto es todo hardcodeado
    const data = [
        {
            id: 1,
            name: 'a',
            email: 'a',
            phone: '1',
            city: 'a'
        },
        {
            id: 2,
            name: 'a',
            email: 'a',
            phone: '1',
            city: 'a'
        },
        {
            id: 3,
            name: 'a',
            email: 'a',
            phone: '1',
            city: 'a'
        },
        {
            id: 4,
            name: 'a',
            email: 'a',
            phone: '1',
            city: 'a'
        },
        {
            id: 5,
            name: 'a',
            email: 'a',
            phone: '1',
            city: 'a'
        },
        {
            id: 6,
            name: 'a',
            email: 'a',
            phone: '1',
            city: 'a'
        },
        {
            id: 7,
            name: 'a',
            email: 'a',
            phone: '1',
            city: 'a'
        },
        {
            id: 8,
            name: 'a',
            email: 'a',
            phone: '1',
            city: 'a'
        },
        {
            id: 9,
            name: 'a',
            email: 'a',
            phone: '1',
            city: 'a'
        },
        {
            id: 10,
            name: 'a',
            email: 'a',
            phone: '1',
            city: 'a'
        },
        {
            id: 11,
            name: 'a',
            email: 'a',
            phone: '1',
            city: 'a'
        },
        {
            id: 12,
            name: 'a',
            email: 'a',
            phone: '1',
            city: 'a'
        },
        {
            id: 13,
            name: 'a',
            email: 'a',
            phone: '1',
            city: 'a'
        },
        {
            id: 14,
            name: 'a',
            email: 'a',
            phone: '1',
            city: 'a'
        },
        {
            id: 15,
            name: 'a',
            email: 'a',
            phone: '1',
            city: 'a'
        },
    ];


    // gestion de la grilla, temas de paginacion
    const [currentPage, setCurrentPage] = useState(1); // que pagina se esta mostrando en el momento
    const [itemsPerPage, setItemsPerPage] = useState(10); // Inicialmente mostrar 10 filas por página

    const totalPages = Math.ceil(data.length / itemsPerPage); // calcular la cantidad de paginas
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentData = data.slice(startIndex, endIndex);

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

    const [dadosBaja, setDadosBaja] = useState(false); // para saber si incluir a los dados de baja o no en la busqueda por filtros

    // GESTION DE MODALES
    // gestion del modal de Rol
    const [showModalAsignarRol, setShowModalAsignarRol] = useState(false);
    const handleCloseAsignarRol = () => setShowModalAsignarRol(false);
    const handleShowAsignarRol = () => setShowModalAsignarRol(true);

    // renderizando todo (NOTA: ESTARIA BUENO MODULAR ESTA SECCION, EN VARIOS ARCHIVOS)
    return (
        <>
            <Navbar style={{ backgroundColor: 'red' }}>
                <Container>
                    <Navbar.Brand style={{ color: 'white', fontWeight: 'bold' }}>Consultar Usuarios</Navbar.Brand>
                </Container>
            </Navbar>

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
                                                rules={{ required: 'Este campo es requerido' }}
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
                                                rules={{ required: 'Este campo es requerido' }}
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
                                                rules={{ required: 'Este campo es requerido' }}
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
                                                rules={{ required: 'Este campo es requerido' }}
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
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                                            <Form.Label>Rol</Form.Label>
                                            <Controller
                                                name="rol"
                                                control={control}
                                                rules={{ required: 'Este campo es requerido' }}
                                                render={({ field }) => (
                                                    <Form.Select aria-label="select-rol-busqueda-usuarios" {...field}>
                                                        <option value='0'>Sin Elegir</option>
                                                        <option value="Alumno">Alumno</option>
                                                        <option value="Entrenador">Entrenador</option>
                                                        <option value="Sin Asignar">Sin Asignar</option>
                                                    </Form.Select>
                                                )}
                                            />
                                            {errors.rol && <p>{errors.rol.message}</p>}
                                        </Form.Group>
                                    </div>

                                    <div className='col-md-6'>
                                        <Form.Check
                                            type='checkbox'
                                            id='checkbox-busqueda-usuarios'
                                            label='Incluir dados de baja'
                                            onClick={() => setDadosBaja(!dadosBaja)}
                                        // style={{ border: '4px red solid' }}
                                        />
                                    </div>
                                </div>
                                <Nav style={{ backgroundColor: '#a5a3a3', borderRadius: '12px', marginTop: '8px' }} className="justify-content-end">
                                    <Button variant="danger" style={{ margin: '8px' }}>
                                        Limpiar
                                    </Button>
                                    <Button variant="success" style={{ margin: '8px' }} onClick={handleSubmit(onSubmit)}>
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
                        <p>Usuarios Encontrados</p>
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
                                        <th>Rol</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((row) => (
                                        <tr key={row.id}>
                                            <td>{row.id}</td>
                                            <td>{row.name}</td>
                                            <td>{row.email}</td>
                                            <td>{row.phone}</td>
                                            <td className="d-flex justify-content-between">
                                                <OverlayTrigger
                                                    placement='top'
                                                    overlay={
                                                        <Tooltip id='intentandoesto'>
                                                            <strong>Asignar rol</strong>.
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Button variant="secondary" style={{ backgroundColor: 'blue', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => handleShowAsignarRol()}>
                                                        <i className="bi bi-person-circle" style={{ fontSize: '16px' }}></i>
                                                    </Button>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    placement='top'
                                                    overlay={
                                                        <Tooltip id='intentandoesto'>
                                                            <strong>Ver Usuario</strong>.
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
                                                            <strong>Modificar Usuario</strong>.
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Button variant="secondary" style={{ backgroundColor: '#55E14E', border: 'none', borderRadius: '50%', margin: '2px' }}>
                                                        <i className="bi bi-pencil-square" style={{ fontSize: '16px' }}></i>
                                                    </Button>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    placement='top'
                                                    overlay={
                                                        <Tooltip id='intentandoesto'>
                                                            <strong>Eliminar Usuario</strong>.
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
                    </Card.Body>
                </Card>
            </div>

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button style={{ marginBottom: '16px' }} onClick={handleBack}>
                    Volver
                </Button>
            </div>

            <AsignarRol
                showModalAsignarRol={showModalAsignarRol}
                handleCloseAsignarRol={handleCloseAsignarRol}
            />
        </>
    );
};

export { BandejaUsuarios };