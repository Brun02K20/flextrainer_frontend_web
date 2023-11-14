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
import { Button } from 'react-bootstrap';

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
                            <NavDropdown.Item onClick={() => navigate(`/modificarUsuario/${usuarioEnSesion.dni}`)}>Modificar datos</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => { handleOpenModal() }}>Cerrar sesión</NavDropdown.Item>
                        </NavDropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar >

            {/* Body de la bienvenida */}
            <Container>
                {usuarioEnSesion.idRol === 3 && (
                    <div style={{
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), url(${logoFLEXTRAINER})`,
                        backgroundSize: '100%',  // Puedes ajustar 'cover', 'contain' u otros valores según tus necesidades
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    }}>
                        <WelcomeButton
                            containerStyles={{ marginRight: '12px' }}
                            buttonClass='btn-top button-bienvenida'
                            goTo={() => navigate('/bandejaUsuarios')}
                            icon='bi bi-people-fill'
                            legend='Bandeja de Usuarios'
                        />
                        <WelcomeButton
                            containerStyles={{ marginLeft: '12px' }}
                            buttonClass='btn-left button-bienvenida'
                            goTo={() => navigate('/maquinas')}
                            icon='bi bi-database'
                            legend='Ver Equipamiento'
                        />
                    </div>
                )}

                {usuarioEnSesion.idRol === 1 && (
                    <div style={{
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), url(${logoFLEXTRAINER})`,
                        backgroundSize: '100%',  // Puedes ajustar 'cover', 'contain' u otros valores según tus necesidades
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    }}>
                        <WelcomeButton
                            containerStyles={{ marginRight: '20px' }}
                            buttonClass='btn-top button-bienvenida'
                            goTo={() => navigate('/generarPlan')}
                            icon='bi bi-calendar-plus'
                            legend='Generar Plan'
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
                            <WelcomeButton
                                containerStyles={{ marginBottom: '20px' }}
                                buttonClass='btn-left button-bienvenida'
                                goTo={() => navigate('/maquinas')}
                                icon='bi bi-database'
                                legend='Ver Equipamiento'
                            />

                            <WelcomeButton
                                containerStyles={{ marginTop: '20px' }}
                                buttonClass='btn-right button-bienvenida'
                                goTo={() => navigate('/planesProfe')}
                                icon='bi bi-archive-fill'
                                legend='Mis Planes'
                            />
                        </div>

                        <WelcomeButton
                            containerStyles={{ marginLeft: '20px' }}
                            buttonClass='btn-right button-bienvenida'
                            goTo={() => navigate('/alumnosProfe')}
                            icon='bi bi-people-fill'
                            legend='Mis Alumnos'
                        />
                    </div>
                )}

                {usuarioEnSesion.idRol === 2 && (
                    <div style={{
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), url(${logoFLEXTRAINER})`,
                        backgroundSize: '100%',  // Puedes ajustar 'cover', 'contain' u otros valores según tus necesidades
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    }}>
                        <WelcomeButton
                            containerStyles={{ marginRight: '12px' }}
                            buttonClass='btn-top button-bienvenida'
                            goTo={() => navigate('/miPlan')}
                            icon='bi  bi-calendar-check'
                            legend='Mi Plan'
                        />
                        <WelcomeButton
                            containerStyles={{ marginLeft: '12px' }}
                            buttonClass='btn-left button-bienvenida'
                            goTo={() => navigate('/maquinas')}
                            icon='bi bi-database'
                            legend='Ver Equipamiento'
                        />
                    </div>
                )}

                {usuarioEnSesion.idRol === 4 && (
                    <div style={{
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), url(${logoFLEXTRAINER})`,
                        backgroundSize: '100%',  // Puedes ajustar 'cover', 'contain' u otros valores según tus necesidades
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    }}>

                        <h4 style={{ textAlign: 'center' }}>Bienvenido. Todavía no tenes un rol asignado, por favor, cerrá tu sesión y consultá en secretaría</h4>
                    </div>
                )}

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