import React, { useState, useEffect } from 'react'; // importo las funcionalidades react necesarias
import { useNavigate } from 'react-router-dom'; // importando funcion de navegacion entre componentes de react-router-dom
import { useForm, Controller } from 'react-hook-form'; // importando funcionalidades necesarias para la gestion de formularios

// importo componentes de estilos propios de la libreria react-bootstrap
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Nav, Table, Pagination } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import axios from 'axios';
import { NavHeader } from '../../../components/NavHeader/NavHeader';
import { BackButton } from '../../../components/BackButton/BackButton';


const ConsultarMaquinas = () => {
    // declaro las funcionalidades necesarias para gestionar formularios, en este caso, tendremos un formulario de
    // busqueda, que se utilizara como un filtrador de datos
    const { handleSubmit, control, formState: { errors }, register, setValue, reset } = useForm();
    const navigate = useNavigate(); // declaro la funcion de navegacion 
    const [maquinas, setMaquinas] = useState([]); // estado para almacenar las maquinas que provengan del backend

    // trayendo inicialmente las maquinas del backend
    useEffect(() => {
        const traerMaquinas = async () => {
            const response = await axios.post('http://localhost:4001/flextrainer/maquinas/byFilters');
            setMaquinas(response.data)
        }
        traerMaquinas()
    }, [])

    // funcion que se va a ejecutar en cuanto el usuario pulse BUSCAR, enviando los datos al backend para su procesamiento
    const onSubmit = async (data) => {
        // convierte el filtro de dados baja, de booleano, a entero, para su procesamiento en el backend
        if (data.dadosBaja === false) {
            data.dadosBaja = 1;
        } else {
            data.dadosBaja = 0;
        }

        console.log(data); // mostrando por consola que voy a enviar al backend
        const response = await axios.post(`http://localhost:4001/flextrainer/maquinas/byFilters`, data); // haciendo la peticion
        setCurrentPage(1); // seteando l pagina que se va amostrar de la grilla
        setMaquinas(response.data); // seteo el estado de usuarios, como lo devuelto por la api
    }

    //gestion del boton volver, por ahora solo lo lleva a la pantalla de bienvenida
    const handleBack = () => {
        navigate('/bienvenida');
    };

    // funcion que se va a ejecutar si el usuario pulsa el boton LIMPIAR, que limpia tanto interna como 
    // visualmente lo escrito en los campos
    const handleClean = () => {
        reset();
        setValue('nombre', '');
        setValue('dadosBaja', false)
    }

    // GESTION DE LA GRILA Y TEMAS DE PAGINACION
    const [currentPage, setCurrentPage] = useState(1); // que pagina se esta mostrando en el momento
    const [itemsPerPage, setItemsPerPage] = useState(10); // Inicialmente mostrar 10 filas por página
    const totalPages = Math.ceil(maquinas.length / itemsPerPage); // calcular la cantidad de paginas
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = maquinas.slice(startIndex, endIndex);

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
            <NavHeader encabezado='Consultar Maquinas y Equipamientos' />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p>Filtros de búsqueda</p>
                        <Card.Body>
                            <Form>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="col-md-12">
                                            <Form.Group className="mb-12" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Nombre</Form.Label>
                                                <Controller
                                                    name="nombre"
                                                    control={control}
                                                    rules={
                                                        {
                                                            pattern: {
                                                                value: /^[a-zA-Z]+$/,
                                                                message: 'Porfavor, ingresa solo letras en este campo. Si el nombre de la maquina tiene una ñ, por favor usa `ni`'
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
                                                            placeholder="Ingresá el nombre de la maquina que estas buscando"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                {errors.nombre && <p>{errors.nombre.message}</p>}
                                            </Form.Group>
                                        </div>
                                        <br></br>
                                        <div className='col-md-6'>
                                            <Form.Check
                                                type='checkbox'
                                                id='checkbox-busqueda-maquinas'
                                                label='Incluir dados de baja'
                                                {...register('dadosBaja')}
                                            // style={{ border: '4px red solid' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Nav style={{ backgroundColor: '#a5a3a3', borderRadius: '12px', marginTop: '8px' }} className="justify-content-end">
                                    <Button variant="danger" style={{ margin: '8px' }} onClick={handleClean}>
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
                        {maquinas.length !== 0 ? (
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
                                        {currentData.map((row, index) => (
                                            <tr key={index + 1}>
                                                <td>{row.nombre}</td>
                                                <td className="d-flex justify-content-center">
                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip id='intentandoesto'>
                                                                <strong>Ver Detalle</strong>.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Button variant="secondary" style={{ backgroundColor: '#881313', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => navigate(`/maquina/${row.id}`)} >
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
                        ) : (
                            <div className='col s12 center'>
                                <h3 style={{ textAlign: 'center' }}>NO EXISTEN MAQUINAS QUE CUMPLAN CON LO INGRESADO</h3>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>

            <br></br>

            <BackButton handleBack={handleBack} />
        </>
    );
}

export { ConsultarMaquinas }