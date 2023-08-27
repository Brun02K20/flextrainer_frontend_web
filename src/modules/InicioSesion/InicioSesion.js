import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './InicioSesion.css';
import { useNavigate } from 'react-router-dom';
import logoFLEXTRAINER from '../../images/logo-origi.png'

const InicioSesion = ({ usuarioEnSesion, setUsuarioEnSesion }) => {
    const { register, reset, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();

    const [errorUsuario, setErrorUsuario] = useState(false)

    const handleBack = () => {
        navigate('/')
    }

    const onSubmit = async (data) => {
        console.log(data)
        // const userOnline = await axios.get(`nuestraAPI`);
        // const userOnlineData = userOnline.data;
        // console.log("usuario: ", userOnlineData)

        // if (userOnlineData.error !== undefined) {
        //     setErrorUsuario(true)
        //     return;
        // }

        // setErrorUsuario(false)
        // setUsuarioEnSesion(userOnlineData)


        navigate('/bienvenida')
        reset()
    }

    return (
        <div className='row'>
            <div className="col s12 m6 offset-m3" id='PI-container'>
                <div className="logo-container">
                    <img src={logoFLEXTRAINER} alt="Logo FLEXTRAINER" width="300" />
                </div>
                <h4 className="center-align">Iniciar Sesión!</h4>
                <br />
                <form className='col s12' onSubmit={handleSubmit(onSubmit)}>
                    <div className='col s12'>
                        <label className='loginLabel' htmlFor='emailLogin'>Correo Electrónico</label>
                        <input type='text' className='validate' id='emailLogin' {...register('email', { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })} />
                    </div>
                    {errors.email && <span>ERROR. Por favor ingresá un mail valido <br></br></span>}

                    <div className='col s12'>
                        <label className='loginLabel' htmlFor="passwordInicioSesion">Contraseña</label>
                        <input id="passwordInicioSesion" type="password" className="validate" {...register('password', { required: true, minLength: 4, maxLength: 15 })} />
                    </div>
                    {errors.password && <span className='error-message'>ERROR. Por favor ingresá una contraseña válida</span>}

                    {errorUsuario && <span>ERROR. Usuario no existe</span>}

                    <div className='col s12 center'>
                        <button className='btn waves-effect waves-light' id='login-button' >
                            INICIAR SESION
                        </button>
                    </div>
                </form>
                <div className='col s12 center' id='btn-back-sesion'>
                    <button className='btn waves-effect waves-light' type='button' onClick={() => handleBack()}>
                        VOLVER
                    </button>
                </div>
            </div>
        </div>
    )
}

export { InicioSesion }