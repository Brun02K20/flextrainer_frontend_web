import React from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

const ActionButton = ({ color, tooltipText, icon, onClickFunction }) => {
    return (
        <OverlayTrigger
            placement='top'
            overlay={
                <Tooltip id={tooltipText}>
                    <strong>{tooltipText}</strong>
                </Tooltip>
            }
        >
            <Button
                variant="secondary"
                style={{ backgroundColor: color, border: 'none', borderRadius: '50%', margin: '2px' }}
                onClick={onClickFunction}
            >
                <i
                    className={`bi ${icon}`}
                    style={{ fontSize: '16px' }}
                />
            </Button>
        </OverlayTrigger>
    )
}

export { ActionButton }
