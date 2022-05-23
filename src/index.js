import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Routes, Outlet, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion"

import './index.css';
import ListagemGestor from './Pages/Projetos/ListagemGestor/ListagemGestor';
import ListagemConsultor from './Pages/Projetos/ListagemConsultor/ListagemConsultor';
import ListagemOwner from './Pages/Projetos/ListagemOwner/ListagemOwner';
import Login from './Pages/Login/Login';
import CadastroU from './Pages/CadastroUsuario/CadastroU';
import reportWebVitals from './reportWebVitals';
import CadastroProjetos from './Pages/Projetos/CadastroProjetos';
import PerfilUsuario from './Pages/PerfilUsuario/PerfilUsuario';
import PaginaProjeto from './Pages/Projetos/Overview/PaginaProjeto';
import Cliente from './Pages/Clientes/ListagemClientes';
import Usuario from './Pages/Usuarios/ListagemUsuarios';
import Settings from './Pages/Settings/Settings';
import ListagemTasks from './Pages/Projetos/Tarefas/ListaTasks';
import NotFound from './Pages/NotFound/NotFound';
import DashBoard from './Pages/Dashboard/Graficos'
import Kanban from './Pages/Kanban/App'


import './i18n';
import { usuarioAutenticado, parseJwt } from './services/auth';

const PermissaoConsultor = () => {
  return (
    usuarioAutenticado() && parseJwt().role === '1' ?
      <Outlet /> : <Navigate to="/Login" />
  );
}

const PermissaoGestor = () => {
  return (
    usuarioAutenticado() && parseJwt().role === '2' ?
      <Outlet /> : <Navigate to="/Login" />
  );
}

const PermissaoOwner = () => {
  return (
    usuarioAutenticado() && parseJwt().role === '3' ?
      <Outlet /> : <Navigate to="/Login" />
  );
}

const PermissaoOwnerGestor = () => {
  return (
    usuarioAutenticado() && (parseJwt().role === '2' || parseJwt().role === '3') ?
      <Outlet /> : <Navigate to='/Login' />
  )
}

const UsuarioLogado = () => {
  return (
    usuarioAutenticado() ?
      <Outlet /> : <Navigate to="/Login" />
  )
}

const routing = (
  <Router>
    <div>
      <AnimatePresence>
        <Routes>
          <Route path='/*' element={<NotFound/>} />

          <Route path='/Login' element={<Login />} />
          <Route path='/CadastroUsuario' element={<CadastroU />} />

          <Route element={<PermissaoConsultor />}>
            <Route path='/ListaProjetosConsultor' element={<ListagemConsultor />} />
          </Route>

          <Route element={<PermissaoGestor />}>
            <Route path='/ListaProjetosGestor' element={<ListagemGestor />} />
            {/* <Route path='/CadastroProjetos' element={<CadastroProjetos />} /> */}
          </Route>

          <Route element={<PermissaoOwner />}>
            <Route path='/ListaProjetosOwner' element={<ListagemOwner />} />
            <Route path='/Clientes' element={<Cliente />} />
            <Route path='/Usuarios' element={<Usuario />} />
          </Route>

          <Route element={<PermissaoOwnerGestor />}>
            <Route path='/CadastroProjetos' element={<CadastroProjetos />} />
          </Route>

          <Route element={<UsuarioLogado />}>
            <Route path='/PerfilUsuario' element={<PerfilUsuario />} />
            <Route path='/ProjetoOverview' element={<PaginaProjeto />} />
            <Route path='/Tasks' element={<ListagemTasks />} />
            <Route path='/Settings' element={<Settings />} />
            <Route path='/DashBoard' element={<DashBoard />} />
            <Route path='/Kanban' element={<Kanban />} />

          </Route>

          <Route path='/' element={<Navigate replace to='/Login' />} />
          {/* Navigate replace to='/Login' para redirecionar quando o / for utilizado */}
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