import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import './index.css';
import ListagemProjetos from './Pages/Projetos/ListagemGestor/ListagemComum';
import Login from './Pages/Login/Login';
import CadastroU from './Pages/CadastroUsuario/CadastroU';
import reportWebVitals from './reportWebVitals';
import CadastroProjetos from './Pages/Projetos/CadastroProjetos';
import PerfilUsuario from './Pages/PerfilUsuario/PerfilUsuario';
import PaginaProjeto from './Pages/Projetos/Overview/PaginaProjeto';
import Cliente from './Pages/Clientes/ListagemClientes';

import './i18n';
import { usuarioAutenticado } from './services/auth';
// const PermisaoAutenticado = ({ component: Component }) => (
//   <Route
//     render={(props) =>
//       usuarioAutenticado() ? (
//         <Component {...props} />
//       ) : (
//         <Redirect to="Login" />
//       )}
//   />
// )

const routing = (
  <Router>
    <div>
      <Routes>
        {/* <PrivateRoute path="ListaProjetos" element={<ListagemProjetos />} roles={[usuarioAutenticado()]} /> */}
        <Route exact path='/ListaProjetos' element={<ListagemProjetos />} />
        <Route path = '/CadastroProjetos' element={<CadastroProjetos />}/>
        <Route exact path = '/' element = {<Login/>}/>
        <Route exact path = '/Login' element = {<Login/>}/>
        <Route exact path = '/CadastroUsuario' element = {<CadastroU/>}/>
        <Route exact path = '/ProjetoOverview' element = {<PaginaProjeto/>}/>
        <Route exact path = '/Clientes' element = {<Cliente/>}/>
        {/* <Route exact path = '/PerfilUsuario' element = {<PerfilUsuario/>}/> */}
      </Routes>
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
