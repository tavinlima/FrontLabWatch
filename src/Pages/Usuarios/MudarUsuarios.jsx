import { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';
import { motion } from "framer-motion"
import { ToastContainer, toast } from 'react-toastify';
import { Icon } from '@iconify/react';

import Header from '../../Components/header';
import SideBar from '../../Components/sidebar'

import '../../assets/css/listaUsuarios.css';
import '../../assets/css/global.css'
import { parseJwt } from "../../services/auth";

export default function MudarUsuario() {
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [idTipoUsuario, setIdTipoUsuario] = useState(0);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(0);
    const [filteredResults, setFilteredResults] = useState([])
    const [searchInput, setSearchInput] = useState('')

    const searchItems = (searchValue) => {
        setSearchInput(searchValue)
        if (searchInput !== '') {
            const filteredData = listaUsuarios.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
            })
            setFilteredResults(filteredData)
        }
        else {
            setFilteredResults(listaUsuarios)
        }
    }

    function listarUsuarios() {
        api("/Usuarios/", {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        })
            .then(resposta => {
                if (resposta.status === 200) {
                    setListaUsuarios(resposta.data)
                    console.log(resposta.data)
                }
            })
            .catch(erro => console.log(erro))
    }

    useEffect(listarUsuarios, [])

    function MudarTipoUsuario() {
        console.log(idTipoUsuario)
        console.log(usuarioSelecionado)
        api.patch("/Usuarios/AlterarTipoUsuario?IdTipoUsuario=" + idTipoUsuario + "&idUsuario=" + parseInt(usuarioSelecionado), {
            idUsuario: usuarioSelecionado,
            idTipoUsuario: idTipoUsuario
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(() => setUsuarioSelecionado(0))
            .catch(erro => console.log(erro))
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            exit={{ opacity: 0 }}
        >
            <Header />
            <section>
                <SideBar />
            </section>
            <div className="box__usuarios">
                <section className="section__listagemUsuarios container">
                    <div className="div__titulo">
                        <h1>Accept Users</h1>
                    </div>
                    <div className="div__inputt">
                        <input
                            type="search"
                            id="usuarios"
                            name="usuarios"
                            autoComplete="off"
                            list="usuarios"
                            onChange={(e) => searchItems(e.target.value)}
                            placeholder="Search Users..." />
                        <Icon className='iconify lupa_usuario' icon="cil:magnifying-glass" />
                    </div>

                    <ToastContainer
                        position="top-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover />
                    {
                        listaUsuarios.length === 0 ?
                            <div className="box_semUsuarios">
                                <span>Não há Usuarios Inativos</span>
                            </div>

                            :

                            searchInput.length > 0 ?
                                (
                                    filteredResults.map((usuario) => {
                                        return (
                                            <div className="section__usuario" key={usuario.idUsuario}>
                                                <section className="box__usuario" key={usuario.idUsuario}>
                                                    <div className="container__Box">
                                                        <div className="divisoria__imgUsuario">
                                                            <img src={"https://labwatch-backend.azurewebsites.net/img/" + usuario.fotoUsuario}
                                                                alt="Imagem do Usuario" />
                                                        </div>
                                                        <div id="usuario" className="box__infoUsuario">
                                                            <span>Name: {usuario.nomeUsuario} {usuario.sobreNome}</span>
                                                            <span>Email: {usuario.email}</span>

                                                        </div>
                                                        <div className="div__linha">
                                                            <hr />
                                                        </div>
                                                        <select className='select__filterProjects' onChange={(e) => {
                                                            setUsuarioSelecionado(usuario.idUsuario)
                                                            setIdTipoUsuario(e.target.value)
                                                        }} value={idTipoUsuario}>
                                                            <option value='1'>Gestor</option>
                                                            <option value='2'>Consultor</option>
                                                            <option value='3'>Owner</option>
                                                            {/* <option value='1'>Todos os projetos</option> */}
                                                        </select>

                                                        {
                                                            idTipoUsuario !== 0 ? <button>Mudar situação</button> : ''
                                                        }
                                                    </div>
                                                </section>
                                            </div>
                                        )
                                    })
                                ) :
                                listaUsuarios.map((usuario) => {
                                    return (
                                        <div className="section__usuario" key={usuario.idUsuario}>
                                            <section className="box__usuario" key={usuario.idUsuario}>
                                                <div className="container__Box">
                                                    <div className="divisoria__imgUsuario">
                                                        <img src={"https://labwatch-backend.azurewebsites.net/img/" + usuario.fotoUsuario}
                                                            alt="Imagem do Usuario" />
                                                    </div>
                                                    <div id="usuario" className="box__infoUsuario">
                                                        <span>Name: {usuario.nomeUsuario} {usuario.sobreNome}</span>
                                                        <span>Email: {usuario.email}</span>

                                                    </div>
                                                    <div className="div__linha">
                                                        <hr />
                                                    </div>
                                                    <select className='select__filterProjects' onChange={(e) => {
                                                            setUsuarioSelecionado(usuario.idUsuario)
                                                            setIdTipoUsuario(e.target.value)
                                                        }} value={usuario.idUsuario === usuarioSelecionado ? idTipoUsuario : 0}>
                                                        <option value='0'>Selecione uma opção</option>
                                                        <option value='1'>Gestor</option>
                                                        <option value='2'>Consultor</option>
                                                        <option value='3'>Owner</option>
                                                        {/* <option value='1'>Todos os projetos</option> */}
                                                    </select>

                                                    {
                                                        parseInt(idTipoUsuario) !== 0 && usuario.idUsuario === usuarioSelecionado ? <button onClick={() => MudarTipoUsuario()}>Salvar alterações</button> : ''
                                                    }
                                                </div>
                                            </section>
                                        </div>
                                    )
                                })
                    }
                </section>
            </div>
        </motion.div>
    )
}