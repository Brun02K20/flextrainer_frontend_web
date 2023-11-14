import React, { useState, useEffect } from 'react'; // importo las funcionalidades react necesarias
import { useNavigate } from 'react-router-dom'; // importando funcion de navegacion entre componentes de react-router-dom
import { useForm, Controller } from 'react-hook-form'; // importando funcionalidades necesarias para la gestion de formularios

// importo componentes de estilos propios de la libreria react-bootstrap
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { NavHeader } from '../../../components/NavHeader/NavHeader';
import { BackButton } from '../../../components/BackButton/BackButton';

import { API } from '../../../constants/api.js';
import { SearchNavBar } from '../../../components/SearchNavbar/SearchNavBar.js';
import { Paginator } from '../../../components/Pagination/Pagination.js';
import { RowsPerPage } from '../../../components/Pagination/RowsPerPage.js';
import { ActionButton } from '../../../components/ActionButton/ActionButton.js';


const ConsultarMaquinas = () => {
    // declaro las funcionalidades necesarias para gestionar formularios, en este caso, tendremos un formulario de
    // busqueda, que se utilizara como un filtrador de datos
    const { handleSubmit, control, formState: { errors }, register, setValue, reset } = useForm();
    const navigate = useNavigate(); // declaro la funcion de navegacion 
    const [maquinas, setMaquinas] = useState([]); // estado para almacenar las maquinas que provengan del backend

    // trayendo inicialmente las maquinas del backend
    useEffect(() => {
        const traerMaquinas = async () => {
            const response = await axios.post(`${API}/flextrainer/maquinas/byFilters`);
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
        const response = await axios.post(`${API}/flextrainer/maquinas/byFilters`, data); // haciendo la peticion
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
            <NavHeader encabezado='Consultar máquinas y equipamientos' />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p style={{ color: 'darkred', fontWeight: '600' }}>Filtros de búsqueda</p>
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
                                                                message: 'Por favor, ingresá solo letras en este campo.'
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
                                                            placeholder="Ingresá el nombre de la máquina que estás buscando"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                {errors.nombre && <p style={{ color: 'darkred' }}>{errors.nombre.message}</p>}
                                            </Form.Group>
                                        </div>
                                        <br></br>
                                        <div className='col-md-6'>
                                            <Form.Check
                                                type='checkbox'
                                                id='checkbox-busqueda-maquinas'
                                                label='Incluir dados de baja'
                                                {...register('dadosBaja')}
                                            />
                                        </div>
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
                        <p style={{ color: 'darkred', fontWeight: '600' }}>Máquinas encontradas</p>
                        {maquinas.length !== 0 ? (
                            <div>
                                <RowsPerPage
                                    itemsPerPage={itemsPerPage}
                                    handleItemsPerPageChange={handleItemsPerPageChange}
                                />
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
                                                <td>{row.nombre?.toUpperCase()}</td>
                                                <td className="d-flex justify-content-center">
                                                    <ActionButton
                                                        tooltipText="Ver Detalle"
                                                        color="#881313"
                                                        icon="bi-grid-3x2"
                                                        onClickFunction={() => navigate(`/maquina/${row.id}`)}
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