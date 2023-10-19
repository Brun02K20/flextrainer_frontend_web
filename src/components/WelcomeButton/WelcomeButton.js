import React from 'react';
import { Button } from 'react-bootstrap';

// botones del menu principal del HOME, como la estetica es siempr eigual, solo que varia la posicion
// , la direccion, y demas detalles, se puede hacer un componente, que sea ese boton, y mandarle las propiedades
const WelcomeButton = ({ containerStyles, buttonClass, goTo, icon, legend }) => {
    return (
        <div className="text-center" style={containerStyles}>
            <Button className={buttonClass} style={{ backgroundColor: 'red', border: 'none' }} onClick={goTo}>
                <i className={icon} style={{ fontSize: '32px' }}></i>
            </Button>
            <p>{legend}</p>
        </div>
    )
}

export { WelcomeButton }