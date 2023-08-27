import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecuperarContrasena.css';
import logoFLEXTRAINER from '../../images/logo-origi.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const RecuperarContrasena = ({ setUsuarioEnSesion, usuarioEnSesion }) => {
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm()

    const navigate = useNavigate();

    const handleBack = () => {
        setUsuarioEnSesion({})
        setErrorUsuario(false)
        navigate('/');
    }

    const [errorUsuario, setErrorUsuario] = useState(false);

    const onSubmit = async (data) => {
        console.log(data)
        // const userOnline = await axios.get(`NUESTRAAPI`);
        // const userOnlineData = userOnline.data;
        // console.log("usuario: ", userOnlineData)

        // if (userOnlineData.error !== undefined) {
        //     setErrorUsuario(true)
        //     return;
        // }

        // setErrorUsuario(false)
        // setUsuarioEnSesion(userOnlineData)

        navigate('/crearNuevaContrasena')
        reset()
    }

    return (
        <div className='row'>
            <div className="col s12 m6 offset-m3" id='PI-container'>
                <div className="logo-container">
                    <img src={logoFLEXTRAINER} alt="Logo FLEXTRAINER" width="300" />
                </div>
                <h4 className="center-align">Recuperar Contraseña!</h4>
                <br />
                <form className='col s12' onSubmit={handleSubmit(onSubmit)}>
                    <div className='col s12'>
                        <label className='recoverPasswordLabel' htmlFor='emailRP'>Correo Electrónico</label>
                        <input type='text' className='validate' id='emailRP' {...register('email', { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })} />
                    </div>
                    {errors.email && <span>ERROR. Por favor ingresá un mail valido <br></br></span>}

                    <div className='col s12'>
                        <label className='recoverPasswordLabel' htmlFor="telefonoRP">Teléfono</label>
                        <input id="telefonoRP" type="text" className="validate" {...register('phone', { required: true, minLength: 9, maxLength: 15 })} />
                    </div>
                    {errors.phone && <span>ERROR. Por favor ingresá un número de teléfono válido</span>}


                    {errorUsuario && <span>ERROR. Usuario no existe</span>}

                    <div className='col s12 center'>
                        <button className='btn waves-effect waves-light' id='boton-rp'>
                            RECUPERAR CONTRASEÑA
                        </button>
                    </div>
                </form>
                <div className='col s12 center' id='btn-back-recover-password'>
                    <button className='btn waves-effect waves-light' type='button' onClick={() => handleBack()}>
                        VOLVER
                    </button>
                </div>
            </div>
        </div>
    )
}

export { RecuperarContrasena }