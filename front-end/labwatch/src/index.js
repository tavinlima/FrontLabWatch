import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Routes, Outlet, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion"

import './index.css';
import ListagemGestor from './Pages/Projetos/ListagemGestor/ListagemComum';
import ListagemConsultor from './Pages/Projetos/ListagemConsultor/ListagemGestor';
import ListagemOwner from './Pages/Projetos/ListagemOwner/ListagemOwner';
import Login from './Pages/Login/Login';
import CadastroU from './Pages/CadastroUsuario/CadastroU';
import reportWebVitals from './reportWebVitals';
import CadastroProjetos from './Pages/Projetos/CadastroProjetos';
import PerfilUsuario from './Pages/PerfilUsuario/PerfilUsuario';
import PaginaProjeto from './Pages/Projetos/Overview/PaginaProjeto';
import Cliente from './Pages/Clientes/ListagemClientes';
import Usuario from './Pages/Usuarios/ListagemUsuarios';

import './i18n';
import { usuarioAutenticado } from './services/auth';

const ProtectedRoute = () => {
  return usuarioAutenticado ? <Outlet /> : <Navigate to='/Login' />;
}

const routing = (
  <Router>
    <div>
      <AnimatePresence>
        <Routes>
          {/* <ProtectedRoute path="ListaProjetos" element={<ListagemComum />} roles={[usuarioAutenticado()]} /> */}
          <Route exact path='/' element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/ListaProjetos' element={<ListagemGestor />} />
            <Route path='/ListaProjetosOwner' element={<ListagemOwner />} />
            <Route path='/ListaProjetosConsultor' element={<ListagemConsultor />} />
            <Route path='/CadastroProjetos' element={<CadastroProjetos />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/CadastroUsuario' element={<CadastroU />} />
            <Route path='/ProjetoOverview' element={<PaginaProjeto />} />
            <Route path='/Clientes' element={<Cliente />} />
            <Route path='/PerfilUsuario' element={<PerfilUsuario />} />
            <Route path='/Usuarios' element={<Usuario />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  </Router>
)


ReactDOM.render(
  routing,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
