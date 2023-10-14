import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'; // importando funcion de navegacion entre componentes de react-router-dom

// importo componentes de estilos propios de la libreria react-bootstrap
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Nav, Table, Pagination } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { VerDetalleEjercicio } from '../../Ejercicios/VerDetalleEjercicio/VerDetalleEjercicio';


const VerDetalleMaquina = () => {

    const { id } = useParams(); // Obtenemos el parámetro 'id' de la URL
    const navigate = useNavigate(); // declaro la funcion de navegacion 

    const data = [
        {
            id: 4,
            name: 'a',
        },
        {
            id: 6,
            name: 'b'
        }
    ];

    // gestion del modal del detalle de un ejercicio:
    const [idEjercicio, setIdEjercicio] = useState(0);
    const [showME, setShowME] = useState(false);
    const handleCloseME = () => setShowME(false);
    const handleShowME = () => setShowME(true);

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

    const handleBack = () => {
        navigate('/bienvenida')
    }

    return (
        <>
            <Navbar style={{ backgroundColor: 'red' }}>
                <Container>
                    <Navbar.Brand style={{ color: 'white', fontWeight: 'bold' }}>Detalle Maquina</Navbar.Brand>
                    {/* aca sustituir por el nombre de la maquina */}
                </Container>
            </Navbar>

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src='https://i.pinimg.com/236x/81/56/85/815685403a6280474199bdb772d3dac4.jpg' width='200' height='200'></img>
            </div>

            <br></br>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card border="danger" style={{ width: '96%' }}>
                    <Card.Body>
                        <p>Ejercicios</p>
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
                                        <th>Numero</th>
                                        <th>Nombre</th>
                                        <th>Ver Ejercicio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((row, index) => (
                                        <tr key={row.id}>
                                            <td>{index + 1}</td>
                                            <td>{row.name}</td>
                                            <td className="d-flex justify-content-between">
                                                <OverlayTrigger
                                                    placement='top'
                                                    overlay={
                                                        <Tooltip id='intentandoesto'>
                                                            <strong>Ver Ejercicio</strong>.
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Button variant="secondary" style={{ backgroundColor: 'blue', border: 'none', borderRadius: '50%', margin: '2px' }} onClick={() => handleShowME()}>
                                                        <i className="bi bi-camera-video-fill" style={{ fontSize: '16px' }}></i>
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

            <VerDetalleEjercicio
                show={showME}
                handleClose={handleCloseME}
            />
        </>
    )
}

export { VerDetalleMaquina }