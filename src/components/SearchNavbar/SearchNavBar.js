import React from 'react'
import { Nav, Button } from 'react-bootstrap'

const SearchNavBar = ({ handleClean, handleSubmit }) => {
    return (
        <Nav style={{ backgroundColor: '#F2F2F2', borderRadius: '12px', marginTop: '8px' }} className="justify-content-end">
            <Button style={{ margin: '8px', backgroundColor: 'grey', border: 'none' }} onClick={handleClean}>
                Limpiar
            </Button>
            <Button style={{ margin: '8px', backgroundColor: 'darkred', border: 'none' }} onClick={handleSubmit}>
                Buscar
            </Button>
        </Nav>
    )
}

export { SearchNavBar }