import React from 'react'
import { Form } from 'react-bootstrap'

const RowsPerPage = ({ itemsPerPage, handleItemsPerPageChange }) => {
    return (
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
    )
}

export { RowsPerPage }
