import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './Registrarse.css';
import { useNavigate } from 'react-router-dom';
import logoFLEXTRAINER from '../../images/logo-origi.png'

const Registrarse = () => {
    const navigate = useNavigate();
    const { register, setValue, reset, formState: { errors }, handleSubmit } = useForm();

    const [errorRol, setErrorRol] = useState(false)

    const handleBack = () => {
        reset()
        navigate('/')
    }

    const onSubmit = async (data) => {
        console.log(data)
        data.rol = parseInt(data.rol)
        if (data.rol === 0) {
            setErrorRol(true)
            return;
        }
        setErrorRol(false)

        navigate('/inicioSesion')
    }

    return (
        <div className='row'>
            <div className="col s12 m6 offset-m3">
                <div className="logo-container">
                    <img src={logoFLEXTRAINER} alt="Logo FLEXTRAINER" width="300" />
                </div>
                <div className='col s12 center'>
                    <h4>REGISTRARSE</h4>
                </div>

                <div className='col s12 center' id='btn-back-registro'>
                    <button className='btn waves-effect waves-light' onClick={handleBack}>
                        VOLVER
                    </button>
                </div>

                <form className='col s12' onSubmit={handleSubmit(onSubmit)}>
                    <div className='col s12'>
                        <label htmlFor="rol" className='registroLabel'>Rol</label>
                        <select className="browser-default validate" defaultValue={0} id="rol" name='rol' {...register('rol', { required: true })}>
                            <option value={0} disabled>Elegí una opcion</option>
                            <option value={1} >Cliente</option>
                            <option value={2} >Entrenador</option>
                            <option value={3} >Dueño</option>
                        </select>
                    </div>
                    {errorRol && <span> ERROR.Elegí tu rol, porfavor <br></br></span>}

                    <div className='col s12'>
                        <label htmlFor='fechaNacimiento' className='registroLabel'>Fecha De Nacimiento</label>
                        <input type="date" className="datepicker validate" id="fechaNacimiento" name="fechaNacimiento" {...register('fechaNacimiento', { required: true })} />
                    </div>
                    {errors.fechaNacimiento && <span>ERROR. Ingresá una fecha de nacimiento válida <br></br></span>}

                    <div className='col s12'>
                        <label htmlFor="telefono" className='registroLabel'>Teléfono</label>
                        <input type='text' id="telefono" className='validate' {...register('telefono', { required: true, minLength: 9, maxLength: 15, pattern: /^[0-9\b]+$/ })} />
                    </div>
                    {errors.telefono && <span>ERROR. Ingresá un número telefónico válido <br></br></span>}

                    <div className='col s12'>
                        <label htmlFor="dni" className='registroLabel'>dni</label>
                        <input type='text' id="dni" className='validate' {...register('dni', { required: true, minLength: 7, maxLength: 9, pattern: /^[0-9\b]+$/ })} />
                    </div>
                    {errors.dni && <span> ERROR.Ingresá un número de dni válido <br></br></span>}

                    <div className='col s12'>
                        <label className='registroLabel' htmlFor='nombreRegistro'>Nombre</label>
                        <input type='text' className='validate' id='nombreRegistro' {...register('nombre', { required: true, minLength: 4, maxLength: 50 })} />
                    </div>
                    {errors.nombre && <span>ERROR. Ingresá un nombre válido <br></br></span>}

                    <div className='col s12'>
                        <label className='registroLabel' htmlFor='apellidoRegistro'>Apellido</label>
                        <input type='text' className='validate' id='apellidoRegistro' {...register('apellido', { required: true, minLength: 4, maxLength: 50 })} />
                    </div>
                    {errors.apellido && <span>ERROR. Ingresá un apellido válido <br></br></span>}

                    <div className='col s12'>
                        <label className='registroLabel' htmlFor='emailRegistro'>Correo Electrónico</label>
                        <input type='email' className='validate' id='emailRegistro' {...register('email', { required: true, minLength: 4, maxLength: 50, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })} />
                    </div>
                    {errors.email && <span>ERROR. Ingresá un nombre válido <br></br></span>}

                    <div className='col s12'>
                        <label htmlFor='password' className='registroLabel'>Contraseña</label>
                        <input type='password' id="password" className='validate' {...register('password', { required: true, minLength: 4, maxLength: 15 })} />
                    </div>
                    {errors.password && <span>ERROR. Ingresá una contraseña válida <br></br></span>}

                    <div className='col s12'>
                        <label htmlFor='repPassword' className='registroLabel'>Repetí la Contraseña</label>
                        <input type='password' id="repPassword" className='validate' {...register('repPassword', { required: true, minLength: 4, maxLength: 15 })} />
                    </div>
                    {errors.repPassword && <span>ERROR. La repetición de la contraseña debe ser válida <br></br></span>}
                    {/* {errorContrasena && <span>Error. Las contraseñas ingresadas no son iguales <br></br></span>} */}

                    <div className='col s12 center'>
                        <button className='btn waves-effect waves-light' id="registrarse-button">
                            REGISTRARSE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export { Registrarse }