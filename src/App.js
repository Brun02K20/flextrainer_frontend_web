import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { PantallaInicial } from './modules/PantallaInicial/PantallaInicial.js';
import { InicioSesion } from './modules/InicioSesion/InicioSesion.js';
import { RecuperarContrasena } from './modules/RecuperarContrasena/RecuperarContrasena.js';
import { CrearNuevaContrasena } from './modules/CrearNuevaContrasena/CrearNuevaContrasena';
import { Registrarse } from './modules/Registrarse/Registrarse';

function App() {
  // gestion del usuario en sesion a traves de un estado (en un futuro cambiar esto por auth y JWT)
  const [usuarioEnSesion, setUsuarioEnSesion] = useState({});


  return (
    <BrowserRouter>
      <Routes>
        {/* PARTE 1: MODULO DE REGISTRO Y SESION */}
        <Route
          path='/'
          element={
            <PantallaInicial />
          }
        />

        <Route
          path='/inicioSesion'
          element={
            <InicioSesion
              usuarioEnSesion={usuarioEnSesion}
              setUsuarioEnSesion={setUsuarioEnSesion}
            />
          }
        />

        <Route
          path='/recuperarContrasena'
          element={
            <RecuperarContrasena
              usuarioEnSesion={usuarioEnSesion}
              setUsuarioEnSesion={setUsuarioEnSesion}
            />
          }
        />

        <Route
          path='/crearNuevaContrasena'
          element={
            <CrearNuevaContrasena
              usuarioEnSesion={usuarioEnSesion}
              setUsuarioEnSesion={setUsuarioEnSesion}
            />
          }
        />

        <Route
          path='/registrarse'
          element={
            <Registrarse

            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
