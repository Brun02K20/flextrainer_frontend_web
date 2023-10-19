import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

// este componente basicamente sera el encabezado de esas pantallas, que tienen el encabezado igual en los
// prototipos, que recibe como prop que encabezado va a tener, el texto de ese encabezado
const NavHeader = ({ encabezado }) => {
    return (
        <Navbar style={{ backgroundColor: '#881313' }}>
            <Container>
                <Navbar.Brand style={{ color: 'white' }}>{encabezado}</Navbar.Brand>
            </Container>
        </Navbar>
    )
}

export { NavHeader }