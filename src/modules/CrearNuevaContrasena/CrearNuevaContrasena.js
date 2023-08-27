import React, { useState } from 'react';
import './CrearNuevaContrasena.css';
import logoFLEXTRAINER from '../../images/logo-origi.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const CrearNuevaContrasena = ({ usuarioEnSesion, setUsuarioEnSesion }) => {
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm()

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/recuperarContrasena')
        setUsuarioEnSesion({});
        reset();
    }

    const [errorPassword, setErrorPassword] = useState(false)

    const onSubmit = async (data) => {

        console.log("impresion inicial: ", data)

        if (data.newPassword !== data.repNewPassword) {
            setErrorPassword(true);
            return;
        }
        setErrorPassword(false)

        console.log(usuarioEnSesion)

        // await axios.put(`http://localhost:4001/api/ats/usuarios/update/password/${usuarioEnSesion.usuarios_email}/${usuarioEnSesion.usuarios_telefono}/${data.newPassword}`)
        navigate('/'); // volver a la pantalla de inicio de la app
    }


    return (
        <div className='row'>
            <div className="col s12 m6 offset-m3" id='PI-container'>
                <div className="logo-container">
                    <img src={logoFLEXTRAINER} alt="Logo FLEXTRAINER" width="300" />
                </div>
                <h4 className="center-align">Crear Nueva Contraseña!</h4>
                <br />
                <form className='col s12' onSubmit={handleSubmit(onSubmit)}>
                    <div className='col s12'>
                        <label className='createPasswordLabel' htmlFor='passwordCNP'>Contraseña</label>
                        <input type='password' className='validate' id='passwordCNP' {...register('newPassword', { required: true, minLength: 4, maxLength: 15 })} />
                    </div>
                    {errors.newPassword && <span>Error. Se requiere contraseña <br></br></span>}

                    <div className='col s12'>
                        <label className='createPasswordLabel' htmlFor="reppasswordCNP">Repetir Contraseña</label>
                        <input id="reppasswordCNP" type="password" className="validate" {...register('repNewPassword', { required: true, minLength: 4, maxLength: 15 })} />
                    </div>
                    {errors.repNewPassword && <span>Error. Se requiere rep contraseña</span>}

                    {errorPassword && <span>ERROR. Las contraseñas ingresadas no son iguales</span>}

                    <div className='col s12 center'>
                        <button className='btn waves-effect waves-light'>
                            CREAR CONTRASEÑA
                        </button>
                    </div>
                </form>

                <div className='col s12 center' id='btn-back-create-password'>
                    <button className='btn waves-effect waves-light' type='button' onClick={() => handleBack()}>
                        VOLVER
                    </button>
                </div>
            </div>
        </div>
    )
}

export { CrearNuevaContrasena }