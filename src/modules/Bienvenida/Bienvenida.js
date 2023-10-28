import React, { useEffect } from 'react'; // importando react y funcionalidades necesarias
import { useNavigate } from 'react-router-dom'; // importando funcion de navegacion entre componentes

// importando componentes de react-bootstrap
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';

import './Bienvenida.css'; // importando estilos asociados a este componente
import logoFLEXTRAINER from '../../images/logo-origi.png'; // importando el logo de la app

// importando el componente Modal de cierre de sesion, que se mostrara en caso de que el usuario pulse esa opcion
import { CerrarSesionModal } from '../../components/CerrarSesionModal/CerrarSesionModal';
import { Footer } from '../../components/Footer/Footer';
import { WelcomeButton } from '../../components/WelcomeButton/WelcomeButton';

// Se decidio separar la pantalla del Home en 2, donde una es el Home en si, donde el usuario NO esta logueado, 
// mientras que esta pantalla de bienvenida sera el Home del usuario que SI este logueado, se hizo esto
// debido a que ambas pantallas llevan a cabo funcionalidades y proveen accesos muy diferenciados

// lo mismo de siempre, declaro componente, desestructuro el objeto props que contiene las propiedades del componente 
// y que este a a usar
const Bienvenida = ({ showModal, handleCloseModal, handleOpenModal, setUsuarioEnSesion, usuarioEnSesion }) => {
    const navigate = useNavigate(); // declaro la funcion de navegacion

    // la primera vez que se muestre este componente, muestro por consola que usuario se logueo
    useEffect(() => {
        console.log('UsuarioEnBienvenida: ', usuarioEnSesion);
    }, []);

    // renderizado del componente
    return (
        <>
            {/* Header de la pantalla de bienvenida */}
            <Navbar id='header-navbar-bienvenida'>
                <Container>
                    <img src={logoFLEXTRAINER} alt='logo FLEXTRAINER' className='logo-bienvenida-navbar'></img>
                    <Navbar.Collapse id='navbar-collapse-bienvenida'>
                        <NavDropdown
                            title={
                                <div className="icon-text-container">
                                    <span className='user-bienvenida'>{usuarioEnSesion.nombre.toUpperCase()} {usuarioEnSesion.apellido.toUpperCase()}</span>
                                    <i
                                        className="bi bi-person-circle"
                                        id='user-icon-bienvenida'
                                    ></i>
                                    <span></span>
                                </div>
                            }
                            id="basic-nav-dropdown"
                        >
                            <NavDropdown.Item id='opciones-responsive-dropdown-bienvenida-1'>{usuarioEnSesion.nombre.toUpperCase()} {usuarioEnSesion.apellido.toUpperCase()}</NavDropdown.Item>
                            <NavDropdown.Divider id='opciones-responsive-dropdown-bienvenida-2' />
                            <NavDropdown.Item onClick={() => navigate(`/modificarUsuario/${usuarioEnSesion.dni}`)}>Modificar Datos</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => { handleOpenModal() }}>Cerrar Sesión</NavDropdown.Item>
                        </NavDropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar >

            {/* Body de la bienvenida */}
            <Container className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }}>
                {usuarioEnSesion.idRol === 3 && (
                    <WelcomeButton
                        containerStyles={{ marginTop: '10%' }}
                        buttonClass='btn-top button-bienvenida'
                        goTo={() => navigate('/bandejaUsuarios')}
                        icon='bi bi-people-fill'
                        legend='Bandeja de Usuarios'
                    />
                )}

                {usuarioEnSesion.idRol === 1 && (
                    <WelcomeButton
                        containerStyles={{ marginTop: '10%' }}
                        buttonClass='btn-top button-bienvenida'
                        goTo={() => navigate('/generarPlan')}
                        icon='bi bi-people-fill'
                        legend='Generar Plan'
                    />

                )}

                {/* imagen centrada en la pantalla */}
                <img src={logoFLEXTRAINER} alt="logo FLEXTRAINER" width='400' className='flex-logo' />

                {/* contenedor de los botones alojados a la izquierda y a la derecha */}
                <div className="d-flex justify-content-between">
                    {/* boton alojado a la izquierda */}
                    <WelcomeButton
                        containerStyles={{ marginRight: '10%', position: 'relative', top: '-200%', left: '-36%' }}
                        buttonClass='btn-left button-bienvenida'
                        goTo={() => navigate('/maquinas')}
                        icon='bi bi-database'
                        legend='Ver Equipamiento'
                    />

                    {/* boton alojado a la derecha */}
                    <WelcomeButton
                        containerStyles={{ marginLeft: '10%', position: 'relative', top: '-200%', right: '-36%' }}
                        buttonClass='btn-right button-bienvenida'
                        goTo={() => navigate('/planesPorAlumnos')}
                        icon='bi bi-archive-fill'
                        legend='Planes por Alumno'
                    />
                </div>
            </Container>

            {/* Footer de la pantalla de bienvenida  */}
            <Footer
                navId='footer-bienvenida'
                spanText='footer-bienvenida-link-socialNetwork'
            />

            {/* modal de cierre de sesion, que recibe las propiedades estandar de un modal que son el show y el 
            handleClose, ademas de recibir que usuario es el que quiere cerrar su sesion */}
            <CerrarSesionModal
                show={showModal}
                handleClose={handleCloseModal}
                setUsuarioEnSesion={setUsuarioEnSesion}
                usuarioEnSesion={usuarioEnSesion}
            />
        </>
    );
};

export { Bienvenida };