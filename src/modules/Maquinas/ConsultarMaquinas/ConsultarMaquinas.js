import React, { useState, useEffect } from 'react'; // importo las funcionalidades react necesarias
import { useNavigate } from 'react-router-dom'; // importando funcion de navegacion entre componentes de react-router-dom
import { useForm, Controller } from 'react-hook-form'; // importando funcionalidades necesarias para la gestion de formularios

// importo componentes de estilos propios de la libreria react-bootstrap
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { NavHeader } from '../../../components/NavHeader/NavHeader';
import { BackButton } from '../../../components/BackButton/BackButton';

import { API } from '../../../constants/api.js';
import { SearchNavBar } from '../../../components/SearchNavbar/SearchNavBar.js';
import { Paginator } from '../../../components/Pagination/Pagination.js';
import { RowsPerPage } from '../../../components/Pagination/RowsPerPage.js';
import { ActionButton } from '../../../components/ActionButton/ActionButton.js';
import { EliminarMaquina } from '../EliminarMaquina/EliminarMaquina.js';
import { ActivarMaquina } from '../ActivarMaquina/ActivarMaquina.js';


const ConsultarMaquinas = ({ usuarioEnSesion }) => {
    // declaro las funcionalidades necesarias para gestionar formularios, en este caso, tendremos un formulario de
    // busqueda, que se utilizara como un filtrador de datos
    const { handleSubmit, control, formState: { errors }, register, setValue, reset } = useForm();
    const navigate = useNavigate(); // declaro la funcion de navegacion 
    const [maquinas, setMaquinas] = useState([]); // estado para almacenar las maquinas que provengan del backend

    // trayendo inicialmente las maquinas del backend
    const traerMaquinas = async () => {
        const response = await axios.post(`${API}/flextrainer/maquinas/byFilters`, null, { timeout: 500000 });
        setMaquinas(response.data)
    }
    useEffect(() => {
        traerMaquinas()
    }, [])

    useEffect(() => {
        console.log("maquinas traidas desde el back: ", maquinas)
    }, [maquinas])

    // funcion que se va a ejecutar en cuanto el usuario pulse BUSCAR, enviando los datos al backend para su procesamiento
    const onSubmit = async (data) => {
        // convierte el filtro de dados baja, de booleano, a entero, para su procesamiento en el backend
        if (data.dadosBaja === false) {
            data.dadosBaja = 1;
        } else {
            data.dadosBaja = 0;
        }

        if (data.peso) {
            data.peso = parseInt(data.peso)
        }

        console.log(data); // mostrando por consola que voy a enviar al backend
        const response = await axios.post(`${API}/flextrainer/maquinas/byFilters`, data, { timeout: 500000 }); // haciendo la peticion
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

    // gestion del modal de Eliminar Maquina
    const [showModalEliminarMaquina, setShowModalEliminarMaquina] = useState(false);
    const handleCloseEliminarMaquina = () => setShowModalEliminarMaquina(false);
    const handleShowEliminarMaquina = () => setShowModalEliminarMaquina(true);

    // para que me muestre los datos de la maquina en el modal que yo elija
    const [selectedMaquina, setSelectedMaquina] = useState(null);
    const [isMaquinaSelected, setIsMaquinaSelected] = useState(false);
    const handleRowClick = (plan) => {
        setSelectedMaquina(plan);
        setIsMaquinaSelected(true);
    };

    // gestion del modal de Activar Maquina
    const [showModalActivarMaquina, setShowModalActivarMaquina] = useState(false);
    const handleCloseActivarMaquina = () => setShowModalActivarMaquina(false);
    const handleShowActivarMaquina = () => setShowModalActivarMaquina(true);

    return (
        <>
            <NavHeader encabezado='Consultar máquinas y equipamientos' />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '6%', paddingLeft: '6%' }}>
                <Button
                    variant="secondary"
                    style={{ backgroundColor: "darkred", border: 'none', borderRadius: '50%', marginBottom: '8px' }}
                    onClick={() => navigate("/probarQR")}
                >
                    <i
                        className={`bi bi-qr-code-scan`}
                        style={{ fontSize: '24px' }}
                    />
                </Button>

                {usuarioEnSesion.idRol === 3 &&
                    <Button style={{ backgroundColor: 'darkred', border: 'none', marginBottom: '16px', marginLeft: 'auto' }} onClick={() => navigate('/registrarMaquina')}>
                        Nuevo
                    </Button>
                }
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p style={{ color: 'darkred', fontWeight: '600' }}>Filtros de búsqueda</p>
                        <Card.Body>
                            <Form>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Nombre</Form.Label>
                                            <Controller
                                                name="nombre"
                                                control={control}
                                                rules={
                                                    {
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

                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                            <Form.Label>Peso</Form.Label>
                                            <Controller
                                                name="peso"
                                                control={control}
                                                rules={
                                                    {
                                                        maxLength: {
                                                            value: 3,
                                                            message: 'El peso no puede tener mas de 3 caracteres'
                                                        },
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message: 'Solo se permiten números positivos en este campo'
                                                        },
                                                        max: {
                                                            value: 999,
                                                            message: "El valor maximo a ingresar es de 999 kg"
                                                        }
                                                    }
                                                }
                                                render={({ field }) => (
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Ingresá un peso mínimo"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.peso && <p style={{ color: 'darkred' }}>{errors.peso.message}</p>}
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Marca</Form.Label>
                                            <Controller
                                                name="marca"
                                                control={control}
                                                rules={
                                                    {
                                                        maxLength: {
                                                            value: 30,
                                                            message: 'Máximo 30 caracteres'
                                                        }
                                                    }
                                                }
                                                render={({ field }) => (
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Ingresá el nombre de la marca de la máquina que estás buscando"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.marca && <p style={{ color: 'darkred' }}>{errors.marca.message}</p>}
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
                                            <th>Marca</th>
                                            <th>Peso</th>
                                            <th>Ver Detalle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((row, index) => (
                                            <tr key={index + 1}>
                                                <td>{row.nombre?.toUpperCase()}</td>
                                                <td>{row.marca?.toUpperCase()}</td>
                                                <td>{row.peso} kg</td>
                                                <td className="d-flex justify-content-center">
                                                    <ActionButton
                                                        tooltipText="Ver Detalle"
                                                        color="#EAD85A"
                                                        icon="bi-eye"
                                                        onClickFunction={() => navigate(`/maquina/${row.id}`)}
                                                    />
                                                    {usuarioEnSesion.idRol === 3 &&
                                                        <ActionButton
                                                            tooltipText="Modificar Máquina"
                                                            color="#55E14E"
                                                            icon="bi-pencil-square"
                                                            onClickFunction={() => navigate(`/modificarMaquina/${row.id}`)}
                                                        />
                                                    }
                                                    {row.esActivo === 1 && usuarioEnSesion.idRol === 3 && (
                                                        <ActionButton
                                                            tooltipText="Eliminar Máquina"
                                                            color="red"
                                                            icon="bi-x"
                                                            onClickFunction={() => { handleRowClick(row); handleShowEliminarMaquina() }}
                                                        />
                                                    )}
                                                    {(row.esActivo === 0 && usuarioEnSesion.idRol === 3) && (
                                                        <ActionButton
                                                            tooltipText="Activar Máquina"
                                                            color="green"
                                                            icon="bi-check-lg"
                                                            onClickFunction={() => { handleRowClick(row); handleShowActivarMaquina() }}
                                                        />
                                                    )}
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

            <EliminarMaquina
                showModalEliminarMaquina={showModalEliminarMaquina}
                handleCloseEliminarMaquina={handleCloseEliminarMaquina}
                setSelectedMaquina={setSelectedMaquina}
                setIsMaquinaSelected={setIsMaquinaSelected}
                selectedMaquina={selectedMaquina}
                traerMaquinas={traerMaquinas}
                handleClean={handleClean}
            />

            <ActivarMaquina
                showModalActivarMaquina={showModalActivarMaquina}
                handleCloseActivarMaquina={handleCloseActivarMaquina}
                setSelectedMaquina={setSelectedMaquina}
                setIsMaquinaSelected={setIsMaquinaSelected}
                selectedMaquina={selectedMaquina}
                traerMaquinas={traerMaquinas}
                handleClean={handleClean}
            />
        </>
    );
}

export { ConsultarMaquinas }