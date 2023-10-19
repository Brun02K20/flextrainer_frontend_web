import React from 'react';
import { Button } from 'react-bootstrap';

// como el boton de volver esteticamente va a ser igual en todas las pantallas (nuevas ventanas, no modales)
// en las que exista, y lo unico que va a variar va a ser la serie de estados que se reconfiguren al presionarlo,
// entonces puedo crear un componente unico en donde lo unico que varie sea esa funcionalidad de "handleBack()"
const BackButton = ({ handleBack }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button style={{ marginBottom: '16px', backgroundColor: 'grey', border: 'black 2px solid', fontWeight: '600' }} onClick={handleBack}>
                Volver
            </Button>
        </div>
    )
}
export { BackButton }