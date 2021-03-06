import { React, useState, useEffect, useLayoutEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion"

import '../../../assets/css/overview.css'

// import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Components/header';
import SideBar from '../../../Components/sidebar'
import Loading from '../../../Components/loading'

import { parseIdEquipe, parseIdProjeto } from '../../../services/auth.jsx'
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function PaginaProjeto() {
    const [listaProjetos, setListaProjetos] = useState([]);
    const [descricao, setDescricao] = useState('');
    const [equipe, setEquipe] = useState([]);
    const [searchInput, setSearchInput] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [nomeCliente, setNomeCliente] = useState([]);
    const [fotoCliente, setFotoCliente] = useState([]);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [idUsuario, setIdUsuario] = useState(0);
    const [erroMensagem, setErroMensagem] = useState('');
    const [count, setCount] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(true);
        }, 1500);
    })

    const notify = () => toast.success("Usuário retirado da equipe com sucesso!")
    const notifyCadastro = () => toast.success("Usuário cadastrado na equipe com sucesso!")

    let navigate = useNavigate();

    const searchItems = (searchValue) => {
        setSearchInput(searchValue)
        if (searchInput !== '') {
            console.log(equipe)
            const filteredData = equipe.filter((item) => {
                return Object.values(item.idUsuarioNavigation.email).join('').toLowerCase().includes(searchInput.toLowerCase())
            })
            setFilteredResults(filteredData)

        } else {
            setFilteredResults(equipe)
        }
    }

    const searchTeam = (valorProcurado) => {
        setSearchUsers(valorProcurado)
        if (searchUsers !== '') {
            let equipeBuscada = equipe.map((usuario) => {
                return usuario
            })

            let usuarioBuscado = listaUsuarios.filter((usuario) => {
                return usuario.idUsuario === equipeBuscada.idUsuario
            })

            console.log(usuarioBuscado)
            console.log(equipeBuscada)
            const filteredDados = listaUsuarios.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(searchUsers.toLowerCase())
            })
            setFilteredUsers(filteredDados)
        } else {
            setFilteredUsers(listaUsuarios)
        }
    }

    // Buscar projeto selecionado
    function buscarProjeto() {
        api("/Projetos/", {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
            if (resposta.status === 200) {
                resposta.data.map((projeto) => {
                    if (projeto.idProjeto === parseInt(parseIdProjeto())) {
                        setListaProjetos(projeto)
                        setDescricao(projeto.descricao)
                        setNomeCliente(projeto.idClienteNavigation.nomeCliente)
                        setFotoCliente("https://labwatch-backend.azurewebsites.net/img/" + projeto.idClienteNavigation.fotoCliente)
                        localStorage.setItem('idEquipe', projeto.idEquipe)
                    }
                    return projeto
                })
            }
        })
            .catch(erro => console.log(erro));
    }

    function buscarEquipe() {
        api("/UsuarioEquipes", {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
            console.log(resposta.data)
            let users = resposta.data.filter((equipe) => {
                return equipe.idEquipe === parseInt(parseIdEquipe())
            })
            setCount(users.length)
            console.log(users)
            setEquipe(users)
            console.log(users)
        })
    }

    function cadastrarEquipe() {
        if (listaProjetos.idEquipe == null) {
            api.post('/Equipes', {
                nomeEquipe: 'Equipe ok'
            }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
                }
            }).catch(erro => console.log(erro))
        }
    }

    function cadastrarNaEquipe(event) {
        var modal = document.getElementById("myModal");

        event.preventDefault()

        if (listaProjetos.idEquipe == null) {
            cadastrarEquipe();
        }

        api.post('/UsuarioEquipes', {
            idEquipe: listaProjetos.idEquipe,
            idUsuario: idUsuario
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        })
            .then(modal.style.display = "none")
            .then(notifyCadastro)
            .then(() => buscarEquipe())
            .catch(erro => console.log(erro))
    }

    function excluirUserEquipe(users) {
        console.log(users.idusuarioEquipe)
        api.delete('/UsuarioEquipes/' + users.idusuarioEquipe, {
            idEquipe: listaProjetos.idEquipe
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        })
            .then(() => buscarEquipe())
            .then(notify)
            .catch(erro => {
                console.log(erro)
                setErroMensagem("Algo deu errado, tente novamente mais tarde")
            })
    }

    function abrirModal() {
        var modal = document.getElementById("myModal");

        modal.style.display = "block";

        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }

    function buscarUsuarios() {
        api('/Usuarios', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
            if (resposta.status === 200) {
                setListaUsuarios(resposta.data)
            }
        }).catch(erro => console.log(erro))
    }

    useEffect(buscarUsuarios, [])
    useEffect(buscarProjeto, [count])
    useLayoutEffect(buscarEquipe, [])
    // useEffect(buscarFotoCliente, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            exit={{ opacity: 0 }}
        >
            {isLoading == false ?
                <Loading /> : ''}
            <div>
                <Header />
                <SideBar />
                <div className="box__listagemProjetos">
                    <section className="section__listagemProjetos container">
                        <h1>Overview</h1>

                        <div className='section__infoBox'>
                            <div className="overview__imgEmpresa">
                                <img
                                    src={fotoCliente}
                                    alt="Imagem do cliente" />
                            </div>

                            <div className='div__textBox'>
                                <h2 className='titulo__projeto'>{listaProjetos.tituloProjeto}</h2>

                                <div className='div__infBox'>
                                    <h2 className='subtitulo_projeto'>Cliente: </h2>
                                    <p>{nomeCliente}</p>
                                </div>

                                <div className='div__infBox'>
                                    <h2 className='subtitulo_projeto'>Data de conclusão:</h2>
                                    <p id='dataConclusao'>{new Date(listaProjetos.dataConclusao).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className='div__description'>
                            <h2>Project Description:</h2>

                            <textarea
                                className='input__descricao'
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)} />
                        </div>

                        <div className='div_tasks'>
                            <h2>Project Tasks: </h2>
                            <button className='btn__tasks' onClick={() => navigate('/Tasks')}>Acessar Tasks</button>
                        </div>

                        <div className='div__team'>
                            <h2>Project Team:</h2>

                            {/* <h3>{infEquipe.tituloEquipe}</h3> */}
                            <button type="submit" className='btn btnStyle btn__edit' onClick={() => abrirModal()}>Edit team</button>
                            <div id="myModal" className="modal">
                                <div className="modal-contentAdd">
                                    <div className="modal_container">
                                        <form onSubmit={(e) => cadastrarNaEquipe(e)}>

                                            <div className="div__teamRegister">
                                                <h3>Insert new users in your team!</h3>
                                                <input
                                                    type="search"
                                                    id='usuarios'
                                                    name='usuario'
                                                    autoComplete='off'
                                                    list='usuarios'
                                                    onChange={(e) => searchTeam(e.target.value)}
                                                    placeholder="Search anything..." />
                                            </div>

                                            {
                                                filteredUsers.map((usuarios) => {
                                                    return (
                                                        <div key={usuarios.idUsuario}>
                                                            <section className='section__membersRegister'>
                                                                <img className='equipe__fotoUsuario' src={"https://labwatch-backend.azurewebsites.net/img/" + usuarios.fotoUsuario} alt='Foto de perfil do usuário'></img>
                                                                <div className='section__infMembers'>
                                                                    <span>{usuarios.nomeUsuario} {usuarios.sobreNome}</span>
                                                                    <span>{usuarios.email}</span>
                                                                </div>
                                                                <button onClick={() => setIdUsuario(usuarios.idUsuario)} className='btn btnStyle btn__addTeam'>Adicionar na equipe</button>
                                                            </section>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </form>

                                    </div>
                                </div>
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


                            <div className="div__teamInput">
                                <input
                                    type="search"
                                    id='equipes'
                                    name='equipe'
                                    autoComplete='off'
                                    list='equipe'
                                    onChange={(e) => searchItems(e.target.value)}
                                    placeholder="Search anything..." />
                            </div>

                            <div className='div__listTeams'>
                                {
                                    searchInput.length > 0 ?
                                        filteredResults.map((usuarios) => {
                                            return (
                                                <div key={usuarios.idUsuarioNavigation.idUsuario}>
                                                    <section className='section__membersTeam'>
                                                        <img className='equipe__fotoUsuario' src={"https://labwatch-backend.azurewebsites.net/img/" + usuarios.idUsuarioNavigation.fotoUsuario} alt='Foto de perfil do usuário'></img>
                                                        <div className='section__infMembers'>
                                                            <span>{usuarios.idUsuarioNavigation.nomeUsuario}</span>
                                                            <span>Responsável por: {(usuarios.idUsuarioNavigation.tasks).length} tasks</span>
                                                        </div>
                                                    </section>
                                                </div>
                                            )
                                        })
                                        :
                                        equipe.map((users) => {
                                            return (
                                                <div key={users.idUsuarioNavigation.idUsuario}>
                                                    <section className='section__membersTeam'>
                                                        {/* <img className='equipe__fotoUsuario' src={fotoPerfil} alt='Foto de perfil do usuário'></img> */}
                                                        <img className='equipe__fotoUsuario' src={"https://labwatch-backend.azurewebsites.net/img/" + users.idUsuarioNavigation.fotoUsuario} alt='Foto de perfil do usuário'></img>
                                                        <div className='section__infMembers'>
                                                            <span>{users.idUsuarioNavigation.nomeUsuario} {users.idUsuarioNavigation.sobreNome}</span>
                                                            <span>Responsável por: {(users.idUsuarioNavigation.tasks).length} tasks</span>
                                                        </div>
                                                        <button className='btn_exclui_user' onClick={() => excluirUserEquipe(users)}><Icon className="X" icon="akar-icons:circle-x" /></button>
                                                    </section>
                                                </div>
                                            )
                                        })
                                }

                            </div>
                        </div>
                    </section>
                </div >
            </div >
        </motion.div>
    );
}