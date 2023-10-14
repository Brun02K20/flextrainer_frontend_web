import React, { useState, useEffect } from 'react'; // importando React y funcionalidades necesarias del mismo
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
import { EliminarUsuario } from './EliminarUsuario/EliminarUsuario';
import { usuariosServices } from './services/usuarios.service';
import axios from 'axios';
import { ActivarUsuario } from './ActivarUsuario/ActivarUsuario';

// lo mismo, declaro componente y explicito props que va a recibir
const BandejaUsuarios = () => {
    // declaro la funcion de navegacion 
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([])

    const [errorDni, setErrorDni] = useState('');

    const traerUsuarios = async () => {
        const usuariosTraidos = await axios.get(`http://localhost:4001/flextrainer/usuarios/`);
        console.log('Trayendo los cambios')
        setUsuarios(usuariosTraidos.data)
    };

    useEffect(() => {
        console.log(usuarios)
    }, [usuarios])

    // declaro las funcionalidades necesarias para gestionar formularios, en este caso, tendremos un formulario de
    // busqueda, que se utilizara como un filtrador de datos
    const { handleSubmit, control, formState: { errors }, reset, setValue, register } = useForm();

    const handleClean = () => {
        reset();
        setValue('dni', '');
        setValue('nombre', '');
        setValue('apellido', '')
        setValue('dadosBaja', false);
        setValue('genero', 0);
        setValue('idRol', '0');
    }

    // funcion que se va a ejecutar en cuanto el usuario pulse BUSCAR, enviando los datos ingresados en los filtros
    // al backend
    const onSubmit = async (data) => {
        if (data.dadosBaja === false) {
            data.dadosBaja = 1;
        } else {
            data.dadosBaja = 0;
        }

        if (data.genero == 0) {
            data.genero = ""
        }

        console.log("data.dni; ", data.dni)

        if (data.dni != '' && parseInt(data.dni) == NaN) {
            setErrorDni('ERROR. Ingresa un DNI valido')
            return;
        }


        data.dni = parseInt(data.dni);
        data.idRol = parseInt(data.idRol)
        console.log(data);

        const response = await axios.post(`http://localhost:4001/flextrainer/usuarios/byFilters`, data);
        setCurrentPage(1);
        setUsuarios(response.data)
    };

    //gestion del boton volver, por ahora solo lo lleva a la pantalla de bienvenida
    const handleBack = () => {
        navigate('/bienvenida');
    };

    // gestion de la grilla, temas de paginacion
    const [currentPage, setCurrentPage] = useState(1); // que pagina se esta mostrando en el momento
    const [itemsPerPage, setItemsPerPage] = useState(10); // Inicialmente mostrar 10 filas por página

    const totalPages = Math.ceil(usuarios.length / itemsPerPage); // calcular la cantidad de paginas
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentData = usuarios.slice(startIndex, endIndex);

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
    // gestion del modal de Rol
    const [showModalAsignarRol, setShowModalAsignarRol] = useState(false);
    const handleCloseAsignarRol = () => setShowModalAsignarRol(false);
    const handleShowAsignarRol = () => setShowModalAsignarRol(true);

    // gestion del modal de Eliminar Usuario
    const [showModalEliminarUsuario, setShowModalEliminarUsuario] = useState(false);
    const handleCloseEliminarUsuario = () => setShowModalEliminarUsuario(false);
    const handleShowEliminarUsuario = () => setShowModalEliminarUsuario(true);

    // gestion del modal de Activar Usuario
    const [showModalActivarUsuario, setShowModalActivarUsuario] = useState(false);
    const handleCloseActivarUsuario = () => setShowModalActivarUsuario(false);
    const handleShowActivarUsuario = () => setShowModalActivarUsuario(true);

    // para que me muestre los datos del usuario en el modal que yo elija
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserSelected, setIsUserSelected] = useState(false);
    const handleRowClick = (user) => {
        setSelectedUser(user);
        setIsUserSelected(true);
    };

    useEffect(() => {
        traerUsuarios();
    }, [showModalAsignarRol])

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
                                            {errorDni && <p>{errorDni}</p>}
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
                                                            message: 'Porfavor, ingresa solo letras en este campo. Si tu nombre tiene una ñ, bueno, `ni` flaco'
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
                                                            message: 'Porfavor, ingresa solo letras en este campo. Si tu apellido tiene una ñ, bueno, `ni` flaco'
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
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                                            <Form.Label>Rol</Form.Label>
                                            <Controller
                                                name="idRol"
                                                control={control}
                                                // rules={{ required: 'Este campo es requerido' }}
                                                render={({ field }) => (
                                                    <Form.Select aria-label="select-rol-busqueda-usuarios" {...field}>
                                                        <option value='0'>Sin Elegir</option>
                                                        <option value={2}>Alumno</option>
                                                        <option value={1}>Entrenador</option>
                                                        <option value={4}>Sin Asignar</option>
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
                                            {...register('dadosBaja')}
                                        // style={{ border: '4px red solid' }}
                                        />
                                    </div>
                                </div>
                                <Nav style={{ backgroundColor: '#a5a3a3', borderRadius: '12px', marginTop: '8px' }} className="justify-content-end">
                                    <Button variant="danger" style={{ margin: '8px' }} onClick={() => handleClean()}>
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
            </div >

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p>Usuarios Encontrados</p>
                        {usuarios.length !== 0 ? (
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
                                        {currentData.map((row, index) => (
                                            <tr key={index + 1}>
                                                <td>{row.dni}</td>
                                                <td>{row.nombre}</td>
                                                <td>{row.apellido}</td>
                                                <td>{row.nombreRol}</td>
                                                <td className="d-flex justify-content-between">
                                                    {row.idRol === 4 && (
                                                        <OverlayTrigger
                                                            placement='top'
                                                            overlay={
                                                                <Tooltip id='intentandoesto'>
                                                                    <strong>Asignar rol</strong>.
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <Button variant="secondary" style={{ backgroundColor: 'blue', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => { handleRowClick(row); handleShowAsignarRol() }}>
                                                                <i className="bi bi-person-circle" style={{ fontSize: '16px' }}></i>
                                                            </Button>
                                                        </OverlayTrigger>
                                                    )}
                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip id='intentandoesto'>
                                                                <strong>Ver Usuario</strong>.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Button variant="secondary" style={{ backgroundColor: '#EAD85A', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => navigate(`/verUsuario/${row.dni}`)} >
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
                                                        <Button variant="secondary" style={{ backgroundColor: '#55E14E', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => navigate(`/modificarUsuario/${row.dni}`)}>
                                                            <i className="bi bi-pencil-square" style={{ fontSize: '16px' }}></i>
                                                        </Button>
                                                    </OverlayTrigger>
                                                    {row.esActivo === 1 && (
                                                        <OverlayTrigger
                                                            placement='top'
                                                            overlay={
                                                                <Tooltip id='intentandoesto'>
                                                                    <strong>Eliminar Usuario</strong>.
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <Button variant="secondary" style={{ backgroundColor: 'red', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => { handleRowClick(row); handleShowEliminarUsuario() }}>
                                                                <i className="bi bi-x" style={{ fontSize: '16px' }}></i>
                                                            </Button>
                                                        </OverlayTrigger>
                                                    )}
                                                    {row.esActivo === 0 && (
                                                        <OverlayTrigger
                                                            placement='top'
                                                            overlay={
                                                                <Tooltip id='intentandoesto'>
                                                                    <strong>Activar Usuario</strong>.
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <Button variant="secondary" style={{ backgroundColor: 'green', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => { handleRowClick(row); handleShowActivarUsuario() }}>
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
                                <h3 style={{ textAlign: 'center' }}>NO HAY USUARIOS QUE CUMPLAN CON LO QUE INGRESASTE</h3>
                            </div>
                        )}
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
                setSelectedUser={setSelectedUser}
                setIsUserSelected={setIsUserSelected}
                selectedUser={selectedUser}
                traerUsuarios={traerUsuarios}
                setUsuarios={setUsuarios}
                isUserSelected={isUserSelected}
                usuarios={usuarios}
            />

            <EliminarUsuario
                showModalEliminarUsuario={showModalEliminarUsuario}
                handleCloseEliminarUsuario={handleCloseEliminarUsuario}
                setSelectedUser={setSelectedUser}
                setIsUserSelected={setIsUserSelected}
                selectedUser={selectedUser}
                traerUsuarios={traerUsuarios}
                handleClean={handleClean}
            />

            <ActivarUsuario
                showModalActivarUsuario={showModalActivarUsuario}
                handleCloseActivarUsuario={handleCloseActivarUsuario}
                setSelectedUser={setSelectedUser}
                setIsUserSelected={setIsUserSelected}
                selectedUser={selectedUser}
                traerUsuarios={traerUsuarios}
                handleClean={handleClean}
            />
        </>
    );
};

export { BandejaUsuarios };