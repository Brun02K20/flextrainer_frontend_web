// importo funcionalidades propias de la libreria, información necesaria para que funcione
// la libreria de bootstrap, y funciones referidas a la definicion de rutas en la web app
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// IMPORTO COMPONENTES DESARROLLADOS
// importacion del Home
import { Home } from './modules/Home/Home.js';
import { Bienvenida } from './modules/Bienvenida/Bienvenida.js';

// importacion de las funcionalidades de usuarios
import { BandejaUsuarios } from './modules/Administrador/BandejaUsuarios/BandejaUsuarios.js';
import { CrearUsuario } from './modules/CrearUsuario/CrearUsuario.js';
import { ModificarUsuario } from './modules/Administrador/BandejaUsuarios/ModificarUsuario/ModificarUsuario.js';
import { VerDetalleUsuario } from './modules/Administrador/BandejaUsuarios/VerDetalleUsuario/VerDetalleUsuario.js';

// importacion de componentes del modulo de maquinas
import { ConsultarMaquinas } from './modules/Maquinas/ConsultarMaquinas/ConsultarMaquinas.js';
import { VerDetalleMaquina } from './modules/Maquinas/VerDetalleMaquina/VerDetalleMaquina.js';

// importacion de componentes del modulo de planes
import { ConsultarPlanesPorAlumno } from './modules/Planes_Alumno/ConsultarPlanesPorAlumno/ConsultarPlanesPorAlumno.js';
import { GenerarPlan } from './modules/Planes/GenerarPlan/GenerarPlan.js';


// declaro la funcion principal de la aplicacion
function App() {
  // gestion del usuario en sesion a traves de un estado (en un futuro posiblemente cambiar esto por auth y JWT, lo intente, y no lo logre, se quedara asi)
  const [usuarioEnSesion, setUsuarioEnSesion] = useState({});

  // gestion de modales de sesion en la aplicación
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
              setUsuarioEnSesion={setUsuarioEnSesion}
              usuarioEnSesion={usuarioEnSesion}
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
            />
          }
        />

        <Route
          path='/modificarUsuario/:dni'
          element={
            <ModificarUsuario
            />
          }
        />

        <Route
          path='/verUsuario/:dni'
          element={
            <VerDetalleUsuario />
          }
        />

        <Route
          path='/registrarse'
          element={
            <CrearUsuario
            />
          }
        />

        <Route
          path='/maquinas'
          element={
            <ConsultarMaquinas />
          }
        />

        <Route
          path='/maquina/:id'
          element={
            <VerDetalleMaquina
            />
          }
        />

        <Route
          path='/planesPorAlumnos'
          element={
            <ConsultarPlanesPorAlumno
            />
          }
        />

        <Route
          path='/generarPlan'
          element={
            <GenerarPlan />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
