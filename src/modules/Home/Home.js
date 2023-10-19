// importo la libreria React, y los componentes necesarios de react-bootstrap
import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

// importo componente de Inicio de Sesion desarrollado por nosotros
import { LoginModal } from '../../components/LoginModal/LoginModal';

// importo los estilos CSS de este componente, ademas del logo de la aplicacion
import './Home.css';
import logoFLEXTRAINER from '../../images/logo-origi.png';
import { Footer } from '../../components/Footer/Footer';

// declaro el componente Home, ademas de desestructurar el objeto de props, explicitando que propiedades
// recibira este componente, en este caso, solo recibira las propiedades de gestion de modal, a fin
// de gestionar el modal del login
const Home = ({ showModal, handleOpenModal, handleCloseModal, setUsuarioEnSesion, usuarioEnSesion }) => {

    useEffect(() => {
        console.log('UsuarioEnHome: ', usuarioEnSesion);
    }, []);

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
                <img src={logoFLEXTRAINER} alt="logo FLEXTRAINER" width='400' className='flex-logo' />
            </div>

            {/* Footer de la aplicacion */}
            <Footer
                navId='footer-home'
                spanText='footer-home-link-socialNetwork'
            />

            {/* Si es verdadero el estado de SHOWMODAL, que renderice el Modal de Inicio de Sesion */}
            <LoginModal
                show={showModal}
                handleClose={handleCloseModal}
                setUsuarioEnSesion={setUsuarioEnSesion}
            />
        </>
    );
};

export { Home };