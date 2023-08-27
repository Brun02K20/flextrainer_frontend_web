import React from 'react';
import './PantallaInicial.css';
import { useNavigate } from 'react-router-dom';
import logoFLEXTRAINER from '../../images/logo-origi.png'

const PantallaInicial = () => {
    const navigate = useNavigate()
    return (
        <div className="row">
            <div className="col s12 m6 offset-m3" id='PI-container'>
                <div className="logo-container">
                    <img src={logoFLEXTRAINER} alt="Logo FLEXTRAINER" width="300" />
                </div>
                <h4 className="center-align">Bienvenido a FLEXTRAINER!</h4>
                <br />
                <div className="button-container">
                    <div className="center-align">
                        <button className="btn btn-floating red" onClick={() => { navigate('/registrarse') }}>
                            <i className="material-icons">person_add</i>
                        </button>
                        <p className='PI-text'>Registrarse</p>
                        <p className='PI-text2'></p>
                    </div>
                    <div className="center-align">
                        <button className="btn btn-floating green" onClick={() => { navigate('/inicioSesion') }}>
                            <i className="material-icons">forward</i>
                        </button>
                        <p className='PI-text'>Iniciar</p>
                        <p className='PI-text2'>Sesión</p>
                    </div>
                    <div className="center-align">
                        <button className="btn btn-floating yellow" onClick={() => { navigate('/recuperarContrasena') }}>
                            <i className="material-icons">dehaze</i>
                        </button>
                        <p className='PI-text'>Recuperar</p>
                        <p className='PI-text2'>Contraseña</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { PantallaInicial }