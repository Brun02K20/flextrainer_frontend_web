import React from 'react';
import { Nav } from 'react-bootstrap';

// este componente basicamente es reutilizar el footer del home y de la bienvenida ya que son iguales
// recibira 2 props, que se usaran para los estilos del mismo
const Footer = ({ navId, spanText }) => {
    return (
        <Nav className="justify-content-center" id={navId}>
            <Nav.Item>
                <Nav.Link href='https://www.facebook.com/profile.php?id=61554508115919' target="_blank">
                    <div className="icon-text-container">
                        <i
                            className="bi bi-facebook"
                            style={{ fontSize: '2rem', color: 'white' }}
                        ></i>
                        <span className={spanText}>Flextrainer</span>
                    </div>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href='https://instagram.com/flex_trainer?igshid=NGVhN2U2NjQ0Yg==' target="_blank">
                    <div className="icon-text-container">
                        <i
                            className="bi bi-instagram"
                            style={{ fontSize: '2rem', color: 'white' }}
                        ></i>
                        <span className={spanText}>Flextrainer</span>
                    </div>
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
};

export { Footer }
