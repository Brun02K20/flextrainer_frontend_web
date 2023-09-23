// importo la libreria React, y los componentes necesarios de react-bootstrap
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// importo componente de Inicio de Sesion desarrollado por nosotros
import { LoginModal } from '../../components/LoginModal/LoginModal';

// importo los estilos CSS de este componente, ademas del logo de la aplicacion
import './Home.css';
import logoFLEXTRAINER from '../../images/logo-origi.png';

// declaro el componente Home, ademas de desestructurar el objeto de props, explicitando que propiedades
// recibira este componente, en este caso, solo recibira las propiedades de gestion de modal, a fin
// de gestionar el modal del login
const Home = ({ showModal, handleOpenModal, handleCloseModal }) => {
    return (
        <>
            {/* Header de la pantalla Home */}
            <Navbar id='header-navbar-home'>
                <Container>
                    <img src={logoFLEXTRAINER} alt='logo FLEXTRAINER' className='logo-home-navbar' />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <div className="icon-text-container">
                                <span className='login-button-home' onClick={handleOpenModal}>Iniciar Sesion</span>
                                <i
                                    className="bi bi-person-circle"
                                    style={{ fontSize: '2rem', color: 'white', marginLeft: '8px', cursor: 'pointer' }}
                                    onClick={handleOpenModal}
                                ></i>
                            </div>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar >

            {/* El logo centralizado en la pantalla  */}
            <div className="centered-image-home">
                <img src={logoFLEXTRAINER} alt="logo FLEXTRAINER" width='400' />
            </div>

            {/* Footer de la aplicacion */}
            <Nav className="justify-content-center" id='footer-home'>
                <Nav.Item>
                    <Nav.Link>
                        <div className="icon-text-container">
                            <i
                                className="bi bi-facebook"
                                style={{ fontSize: '2rem', color: 'white' }}
                            ></i>
                            <span className='footer-home-link-socialNetwork'>Flextrainer</span>
                        </div>
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                    <Nav.Link>
                        <div className="icon-text-container">
                            <i
                                className="bi bi-instagram"
                                style={{ fontSize: '2rem', color: 'white' }}
                            ></i>
                            <span className='footer-home-link-socialNetwork'>Flextrainer</span>
                        </div>
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {/* Si es verdadero el estado de SHOWMODAL, que renderice el Modal de Inicio de Sesion */}
            <LoginModal
                show={showModal}
                handleClose={handleCloseModal}
            />
        </>
    );
};

export { Home };