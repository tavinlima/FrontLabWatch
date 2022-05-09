import { useEffect, useState } from "react";
import axios from 'axios';
import { parseJwt } from '../../services/auth';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';
import { motion } from "framer-motion"

import Header from '../../Components/header';
import SideBar from '../../Components/sidebar'

import { Icon } from '@iconify/react';
import '../../assets/css/listaUsuarios.css';
import '../../assets/css/global.css'

export default function Usuario() {
    const [filteredResults, setFilteredResults] = useState([])
    const [searchInput, setSearchInput] = useState('')

    const [idUsuario, setIdUsuario] = useState([])
    const [listaUsuarios, setListaUsuarios] = useState([])
    const [nomeUsuario, setNomeUsuario] = useState('')
    const [sobreNome, setSobreNome] = useState('')
    const [email, setEmail] = useState('')
    const [ativo, setAtivo] = useState(false)
    const [fotoUsuario, setFotoUsuario] = useState(false)

    let navigate = useNavigate();

    ///FUNCAO DE BARRA DE PESQUISA
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

    function listarInativos(usuario) {
        return usuario.ativo === false
    }




    ///FUNCAO COM API
    function listarUsuarios() {
        api("http://labwatch-backend.azurewebsites.net/api/Usuarios")
            .then(resposta => {
                // let users = resposta.data.map((usuarios) => {
                //     if (usuarios.ativo === false) {
                //         console.log(usuarios);
                //         return usuarios
                //         array.forEach(element => {

                //         });
                //     }
                // })
                let users = resposta.data.filter((listarInativos))
                setListaUsuarios(users)
            })
            .catch(erro => console.log(erro))
    }

    function ativarUsuario(usuario) {
        // console.log(ativo)
        // console.log(usuario);
       
        api.patch("/Usuarios/",{
            idUsuario: usuario,
            ativo: true
        }   
            // {headers: {'Authorization': 'Bearer ' + localStorage.getItem('usuario-login')}
     ).then(resposta => {
            console.log(ativo)
            console.log(resposta.data)
            if (resposta.status === 200) {
                listarUsuarios()
                console.log("Deu certo")
            }
            console.log(resposta);
        }).catch(erro => console.log(erro))

    }

    function excluirUsuario(usuario) {
        console.log(usuario);
        api.delete("/Usuarios/" + usuario, {
            headers: { "Content-Type": "application/json" }
        }).then(resposta => {
            if (resposta.status===204) {
                listarUsuarios()
                console.log(usuario);
            }
            console.log(resposta)
        }).catch(erro => console.log(erro))
    }

    useEffect(listarUsuarios, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
                                                            <img src={"http://labwatch-backend.azurewebsites.net/img/" + usuario.fotoUsuario}
                                                                alt="Imagem do Usuario" />
                                                        </div>
                                                        <div id="usuario" className="box__infoUsuario">
                                                            <span>Name: {usuario.nomeUsuario} {usuario.sobreNome}</span>
                                                            <span>Email: {usuario.email}</span>

                                                        </div>
                                                        <div className="div__linha">
                                                            <hr />
                                                        </div>

                                                        <div className="div__check">
                                                            <button onClick={()=> ativarUsuario(usuario.idUsuario)} className="btn__check">
                                                                <Icon className="check" icon="ant-design:check-circle-outlined" />
                                                            </button>
                                                            <button onClick={() => excluirUsuario(usuario.idUsuario)} className="btn__X">
                                                                <Icon className="X" icon="akar-icons:circle-x" />
                                                            </button>
                                                        </div>

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
                                                        <img src={"http://labwatch-backend.azurewebsites.net/img/" + usuario.fotoUsuario}
                                                            alt="Imagem do Usuario" />
                                                    </div>
                                                    <div id="usuario" className="box__infoUsuario">
                                                        <span>Name: {usuario.nomeUsuario} {usuario.sobreNome}</span>
                                                        <span>Email: {usuario.email}</span>

                                                    </div>
                                                    <div className="div__linha">
                                                        <hr />
                                                    </div>

                                                    <div className="div__check">
                                                        <button className="btn__check" onClick={()=>ativarUsuario(usuario.idUsuario)}>
                                                            <Icon className="check" icon="ant-design:check-circle-outlined" />
                                                        </button>
                                                        <button onClick={() => excluirUsuario(usuario.idUsuario)} className="btn__X">
                                                            <Icon className="X" icon="akar-icons:circle-x" />
                                                        </button>
                                                    </div>

                                                </div>
                                            </section>
                                        </div>
                                    )
                                })
                    }
                </section>

            </div>
        </motion.div >
    )

}