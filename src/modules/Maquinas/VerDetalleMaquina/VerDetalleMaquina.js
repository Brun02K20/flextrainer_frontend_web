import React, { useState, useEffect } from 'react'; // importo funcionalidades react necesarias
import { useNavigate, useParams } from 'react-router-dom'; // importando funcion de navegacion entre componentes de react-router-dom

// importo componentes de estilos propios de la libreria react-bootstrap
import Card from 'react-bootstrap/Card';
import { Table } from 'react-bootstrap';
import { VerDetalleEjercicio } from '../../Ejercicios/VerDetalleEjercicio/VerDetalleEjercicio';
import axios from 'axios';
import { NavHeader } from '../../../components/NavHeader/NavHeader';
import { BackButton } from '../../../components/BackButton/BackButton';

import { API } from '../../../constants/api.js';
import { RowsPerPage } from '../../../components/Pagination/RowsPerPage.js';
import { ActionButton } from '../../../components/ActionButton/ActionButton.js';
import { Paginator } from '../../../components/Pagination/Pagination.js';

const VerDetalleMaquina = () => {
    const { id } = useParams(); // Obtenemos el parámetro 'id' de la URL
    const navigate = useNavigate(); // declaro la funcion de navegacion 
    const [maquina, setMaquina] = useState({}); // estado en el que voy a almacenar los datos de la maquina y sus ejercicios

    useEffect(() => {
        console.log("maquina en este momento: ", maquina)
    }, [maquina])

    // gestion del modal del detalle de un ejercicio:
    const [idEjercicioElegido, setIdEjercicioElegido] = useState(0);
    const [showME, setShowME] = useState(false);
    const handleCloseME = () => setShowME(false);
    const handleShowME = () => setShowME(true);

    // traer la maquina y sus ejercicios desde el backend
    useEffect(() => {
        const traerMaquina = async () => {
            if (id !== null && id != 0 && !showME && idEjercicioElegido == 0) {
                const response = await axios.get(`${API}/flextrainer/maquinas/maquina/${id}`)
                setMaquina(response.data)
            }
        }
        traerMaquina()
    }, []);

    // GESTION DE LA GRILLA Y TEMAS DE PAGINACION
    const [currentPage, setCurrentPage] = useState(1); // que pagina se esta mostrando en el momento
    const [itemsPerPage, setItemsPerPage] = useState(10); // Inicialmente mostrar 10 filas por página
    const ejerciciosLength = maquina && maquina.ejercicios ? maquina.ejercicios.length : 0;
    const totalPages = Math.ceil(ejerciciosLength / itemsPerPage); // calcular la cantidad de paginas
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = maquina && maquina.ejercicios ? maquina.ejercicios.slice(startIndex, endIndex) : [];

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

    // funcion que se va a ejecutar si el usuairo pulsa el boton VOLVER, por ahora solo lo lleva a la pantalla de bienvenida
    const handleBack = () => {
        navigate('/maquinas')
        setMaquina({})
    }

    useEffect(() => {
        console.log("por que no andaaaaaa?: ", API)
    }, [API])

    const [imagenCargada, setImagenCargada] = useState(false);
    const handleImagenCarga = () => {
        setImagenCargada(true);
    };

    return (
        <>
            <NavHeader encabezado={maquina.nombre ? maquina.nombre.toUpperCase() : ''} />

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={maquina.urlFoto ? maquina.urlFoto : ''} width='200' height='200'></img>
            </div>

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p style={{ color: 'darkred', fontWeight: '600' }}>Ejercicios</p>
                        {currentData.length !== 0 ? (
                            <div>
                                <RowsPerPage
                                    itemsPerPage={itemsPerPage}
                                    handleItemsPerPageChange={handleItemsPerPageChange}
                                />
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Ver Ejercicio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((row, index) => (
                                            <tr key={index}>
                                                <td>{row.Ejercicio.nombre?.toUpperCase()}</td>
                                                <td className="d-flex justify-content-center">
                                                    <ActionButton
                                                        tooltipText="Ver Ejercicio"
                                                        color="#881313"
                                                        icon="bi-camera-video-fill"
                                                        onClickFunction={() => { console.log(row.id); setIdEjercicioElegido(row.id); handleShowME() }}
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
                                <h3 style={{ textAlign: 'center' }}>NO EXISTEN EJERCICIOS PARA ESTA MAQUINA</h3>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>

            <br></br>

            <BackButton handleBack={handleBack} />

            {showME && (
                <VerDetalleEjercicio
                    show={showME}
                    handleClose={handleCloseME}
                    idEjercicioElegido={idEjercicioElegido}
                    setIdEjercicioElegido={setIdEjercicioElegido}
                />
            )}
        </>
    )
}

export { VerDetalleMaquina }
