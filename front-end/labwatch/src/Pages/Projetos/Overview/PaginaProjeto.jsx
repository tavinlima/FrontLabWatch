import { React, useState, useEffect } from 'react';

import '../../../assets/css/overview.css'

// import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Components/header';
import SideBar from '../../../Components/sidebar'

import { parseIdEquipe, parseIdProjeto } from '../../../services/auth.jsx'
import api from '../../../services/api';
import axios from 'axios';

export default function PaginaProjeto() {
    const [listaProjetos, setListaProjetos] = useState([]);
    const [descricao, setDescricao] = useState('');
    const [equipe, setEquipe] = useState([]);
    const [searchInput, setSearchInput] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [nomeCliente, setNomeCliente] = useState([]);
    const [fotoCliente, setFotoCliente] = useState([]);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [infEquipe, setInfEquipe] = useState([]);
    const [idUsuario, setIdUsuario] = useState(0);

    const searchItems = (searchValue) => {
        setSearchInput(searchValue)
        if (searchInput !== '') {
            console.log(equipe)
            const filteredData = equipe.filter((item) => {
                return Object.values(item.nomeUsuario).join('').toLowerCase().includes(searchInput.toLowerCase())
            })
            setFilteredResults(filteredData)
        } else {
            setFilteredResults(equipe)
        }
    }

    // Buscar projeto selecionado
    function buscarProjeto() {
        api("/Projetos/").then(resposta => {
            if (resposta.status === 200) {
                resposta.data.map((projeto) => {
                    if (projeto.idProjeto == parseIdProjeto()) {
                        setListaProjetos(projeto)
                        setDescricao(projeto.descricao)
                        setNomeCliente(projeto.idClienteNavigation.nomeCliente)
                        setFotoCliente(projeto.idClienteNavigation.fotoCliente)
                    }
                    return projeto
                })
            }
        })
            .catch(erro => console.log(erro));
    }

    function buscarEquipe() {
        console.log(parseIdEquipe())
        api("/UsuarioEquipes", {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
            resposta.data.map((equipe) => {
                if (equipe.idEquipe == parseIdEquipe()) {
                    let equipeBuscada = equipe.idEquipeNavigation.usuarioEquipes.map((usuarios) => {
                        return usuarios
                    });
                    let membrosEquipe = equipeBuscada.map((equipe) => {
                        return equipe.idUsuarioNavigation
                    })
                    setEquipe(membrosEquipe)
                    console.log(membrosEquipe)
                }
                return equipe
            })
        })
    }

    function mudarEquipe(event) {
        event.preventDefault()
        axios.patch('http://localhost:5000/api/UsuarioEquipes/' + idUsuario, {
            idEquipe: listaProjetos.idEquipe
        }).then(resposta => console.log(resposta))
    }

    function excluirUserEquipe() {
        axios.patch('http://localhost:5000/api/Equipes/' + idUsuario, {
            idEquipe: listaProjetos.idEquipe
        }).then(resposta => console.log(resposta))
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
        api('/Usuarios').then(resposta => setListaUsuarios(resposta.data))
    }

    useEffect(buscarUsuarios, [])

    useEffect(buscarProjeto, [])
    useEffect(buscarEquipe, [])
    // useEffect(buscarFotoCliente, [])

    return (
        <div>
            <Header />
            <SideBar />
            <div className="box__listagemProjetos">
                <section className="section__listagemProjetos container">
                    <h1>Overview</h1>

                    <div className='section__infoBox'>
                        <div className="overview__imgEmpresa">
                            <img
                                src={"http://labwatch-backend.azurewebsites.net/img/" + fotoCliente}
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
                        <h2>Project description:</h2>

                        <textarea
                            className='input__descricao'
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)} />
                    </div>

                    <div className='div__team'>
                        <h2>Project team:</h2>

                        {/* <h3>{infEquipe.tituloEquipe}</h3> */}
                        <button type="submit" className='btn btnStyle btn__edit' onClick={() => abrirModal()}>Edit team</button>
                        <div id="myModal" className="modal">
                            <div className="modal-content">
                                <div className="modal_container">
                                    <form onSubmit={(e) => mudarEquipe(e)}>
                                        <select
                                            onChange={(e) => setIdUsuario(e.target.value)}
                                            value={idUsuario}>
                                            <option aria-disabled="true" value="0" disabled>Selecione um usuario</option>
                                            {
                                                listaUsuarios.map((consultor) => {
                                                    return (
                                                        <option key={consultor.idUsuario} value={consultor.idUsuario}>{consultor.nomeUsuario}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <button type="submit" className='btn btnStyle btn__edit' onClick={() => mudarEquipe()}>Edit team</button>
                                    </form>

                                </div>
                            </div>
                        </div>


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
                                    filteredResults.map((equipe) => {
                                        return (
                                            <div key={equipe.idUsuario}>
                                                <section className='section__membersTeam'>
                                                    <img className='equipe__fotoUsuario' src={"http://labwatch-backend.azurewebsites.net/img/" + equipe.fotoUsuario} alt='Foto de perfil do usuário'></img>
                                                    <div className='section__infMembers'>
                                                        <span>{equipe.nomeUsuario}</span>
                                                        <span>Responsável por: {(equipe.tasks).length} tasks</span>
                                                    </div>
                                                </section>
                                            </div>
                                        )
                                    })
                                    :
                                    equipe.map((equipe) => {
                                        return (
                                            <div key={equipe.idUsuario}>
                                                <section className='section__membersTeam'>
                                                    {/* <img className='equipe__fotoUsuario' src={fotoPerfil} alt='Foto de perfil do usuário'></img> */}
                                                    <img className='equipe__fotoUsuario' src={"http://labwatch-backend.azurewebsites.net/img/" + equipe.fotoUsuario} alt='Foto de perfil do usuário'></img>
                                                    <div className='section__infMembers'>
                                                        <span>{equipe.nomeUsuario}</span>
                                                        <span>Responsável por: {(equipe.tasks).length} tasks</span>
                                                    </div>
                                                </section>
                                            </div>
                                        )
                                    })
                            }
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}