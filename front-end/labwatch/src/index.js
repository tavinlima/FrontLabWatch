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
import Settings from './Pages/Settings/Settings';
import ListagemTasks from './Pages/Projetos/Tarefas/ListaTasks';
import Tarefas from './Pages/Projetos/Tarefas/ListaTasks';

import './i18n';
import { parseJwt, usuarioAutenticado } from './services/auth';


const ProtectedRoute = () => {
  return usuarioAutenticado ? <Outlet /> : <Navigate to='/Login' />;
}

//Children : "filho" (CadastrarConsulta) que está dentro do PermissaoAdm.
const PermissaoConsultor = ({ children }) => {
  return( 
    usuarioAutenticado() && parseJwt().role === '1' ?
     children : <Navigate to="/ListaProjetosConsultor" /> 
  );
}

const PermissaoMedico = ({ children }) => {
  return( 
    usuarioAutenticado() && parseJwt().role === '2' ?
     children : <Navigate to="/login" /> 
  );
}

const PermissaoAdm = ({ children }) => {
  return( 
    usuarioAutenticado() && parseJwt().role === '3' ?
     children : <Navigate to="/login" /> 
  );
}

const routing = (
  <Router>
    <div>
      <AnimatePresence>
        <Routes>
          {/* <ProtectedRoute path="ListaProjetos" element={<ListagemComum />} roles={[usuarioAutenticado()]} /> */}
          {/* <Route exact path='/' element={<Login />} /> */}
          <Route path='/Login' element={<Login />} />
          <Route path='/ListaProjetos' element={<ListagemGestor />} />
          <Route path='/ListaProjetosOwner' element={<ListagemOwner />} />
          <Route path='/ListaProjetosConsultor' element={<ListagemConsultor />} />
          <Route path='/CadastroProjetos' element={<CadastroProjetos />} />
          <Route path='/CadastroUsuario' element={<CadastroU />} />
          <Route path='/ProjetoOverview' element={<PaginaProjeto />} />
          <Route path='/Clientes' element={<Cliente />} />
          <Route path='/PerfilUsuario' element={<PerfilUsuario />} />
          <Route path='/PerfilUsuario' element={<PerfilUsuario />} />
          <Route path='/Tarefas' element={<Tarefas />} />
          <Route path='/Settings' element={<Settings />} />
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
