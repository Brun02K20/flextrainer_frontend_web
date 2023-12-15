import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import './QrCode.css'; // Importa tu archivo CSS para estilos
import { BackButton } from '../components/BackButton/BackButton';
import { useNavigate } from 'react-router-dom';

const QrCode = () => {
    const [result, setResult] = useState(null); // Estado para almacenar el resultado del escaneo
    const navigate = useNavigate()

    const handleScan = data => {
        if (data) {
            setResult(data);
        }
    }

    const handleError = err => {
        console.error(err);
    }

    const handleBack = () => {
        navigate(-1)
    }

    return (
        <>
            <div className="qr-code-container">
                <QrScanner
                    onScan={handleScan}
                    onError={handleError}
                    style={{ width: '75%' }}
                />
                <br></br>
                <p style={{ textAlign: 'center' }}>Ingresá al siguiente link para ver la máquina: <a href={result?.text}>{result?.text}</a></p>

                <br></br>
                <BackButton handleBack={handleBack} />
            </div>


        </>
    );
}

export { QrCode };

