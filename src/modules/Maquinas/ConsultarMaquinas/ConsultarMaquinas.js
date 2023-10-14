import React, { useState, useEffect } from 'react'; // importo las funcionalidades react necesarias
import { useNavigate } from 'react-router-dom'; // importando funcion de navegacion entre componentes de react-router-dom
import { useForm, Controller } from 'react-hook-form'; // importando funcionalidades necesarias para la gestion de formularios

// importo componentes de estilos propios de la libreria react-bootstrap
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Nav, Table, Pagination } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


const ConsultarMaquinas = () => {
    // declaro las funcionalidades necesarias para gestionar formularios, en este caso, tendremos un formulario de
    // busqueda, que se utilizara como un filtrador de datos
    const { handleSubmit, control, formState: { errors } } = useForm();
    const navigate = useNavigate(); // declaro la funcion de navegacion 


    // funcion que se va a ejecutar en cuanto el usuario pulse BUSCAR, enviando los datos al backend para su procesamiento
    const onSubmit = async (data) => {
        console.log(data)
    }

    //gestion del boton volver, por ahora solo lo lleva a la pantalla de bienvenida
    const handleBack = () => {
        navigate('/bienvenida');
    };

    const data = [
        {
            id: 1,
            name: 'a',
        },
        {
            id: 2,
            name: 'b',
        },
        {
            id: 3,
            name: 'c',
        },
        {
            id: 4,
            name: 'd',
        },
        {
            id: 5,
            name: 'e',
        },
        {
            id: 6,
            name: 'f',
        },
    ]

    // GESTION DE LA GRILA Y TEMAS DE PAGINACION
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

    return (
        <>
            <Navbar style={{ backgroundColor: 'red' }}>
                <Container>
                    <Navbar.Brand style={{ color: 'white', fontWeight: 'bold' }}>Consultar Maquinas</Navbar.Brand>
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
                                        <div className="col-md-9">
                                            <Form.Group className="mb-12" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Nombre</Form.Label>
                                                <Controller
                                                    name="nombre"
                                                    control={control}
                                                    rules={{ required: 'Este campo es requerido' }}
                                                    render={({ field }) => (
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Ingresá el nombre de la maquina que estas buscando"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                {errors.nombre && <p>{errors.nombre.message}</p>}
                                            </Form.Group>
                                        </div>
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
                        <p>Maquinas Encontradas</p>
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
                                        <th>Ver Detalle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((row) => (
                                        <tr key={row.id}>
                                            <td>{row.name}</td>
                                            <td className="d-flex justify-content-between">
                                                <OverlayTrigger
                                                    placement='top'
                                                    overlay={
                                                        <Tooltip id='intentandoesto'>
                                                            <strong>Ver Detalle</strong>.
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Button variant="secondary" style={{ backgroundColor: 'blue', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => navigate(`/maquina/${row.id}`)} >
                                                        <i className="bi bi-grid-3x2" style={{ fontSize: '16px' }}></i>
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
        </>
    );
}

export { ConsultarMaquinas }