// importo funcionalidades propias de la libreria, además de la información necesaria para que funcione
// la libreria de bootstrap
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// importo componentes desarrollados por nosotros
import { Home } from './modules/Home/Home.js';
import { Bienvenida } from './modules/Bienvenida/Bienvenida.js';
import { BandejaUsuarios } from './modules/Administrador/BandejaUsuarios/BandejaUsuarios.js';
import { CrearUsuario } from './modules/CrearUsuario/CrearUsuario.js';

function App() {
  // gestion del usuario en sesion a traves de un estado (en un futuro posiblemente cambiar esto por auth y JWT)
  const [usuarioEnSesion, setUsuarioEnSesion] = useState({});

  // gestion de modales en la aplicación
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // la aplicación al levantarse lo que ejecutará es el Home del sistema, sin que el usuario esté logueado 
  return (
    // sistema de navegacion de React Router, usando react-router-dom, donde el usuario entrará al sistema 
    // (esto en el deploy), únicamente a traves del home, que es el que tiene el path '/'
    <BrowserRouter>
      <Routes>
        {/* cada ruta se define con la siguiente estructura: 
          path --> es el nombre de la url, siempre inicia con /algo, puede ser /algo/algo/algo tambien, es lo mismo
          element --> propiedad que recibe un componente, donde ese es el componente que se va a mostrar si el 
          usuario accede a esa ruta, esdecir, que si accede a la ruta '/', el componente que se va a mostrar es Home,
          con sus respectivas propiedades las cuales son las pasadas por parametro
        */}
        <Route
          path="/"
          element={
            <Home
              showModal={show}
              handleCloseModal={handleClose}
              handleOpenModal={handleShow}
            />
          }
        />

        <Route
          path="/bienvenida"
          element={
            <Bienvenida
              showModal={show}
              handleCloseModal={handleClose}
              handleOpenModal={handleShow}
              setUsuarioEnSesion={setUsuarioEnSesion}
              usuarioEnSesion={usuarioEnSesion}
            />
          }
        />

        <Route
          path="/bandejaUsuarios"
          element={
            <BandejaUsuarios
              // showModal={show}
              // handleCloseModal={handleClose}
              // handleOpenModal={handleShow}
              setUsuarioEnSesion={setUsuarioEnSesion}
              usuarioEnSesion={usuarioEnSesion}
            />
          }
        />

        <Route
          path='/registrarse'
          element={
            <CrearUsuario
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
