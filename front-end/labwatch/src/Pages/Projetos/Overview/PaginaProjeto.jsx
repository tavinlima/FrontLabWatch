import { React, useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

import '../../../assets/css/overview.css'

// import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Components/header';
import SideBar from '../../../Components/sidebar'

import { parseIdEquipe, parseIdProjeto } from '../../../services/auth.jsx'
import api from '../../../services/api';

import fotoPerfil from '../../../assets/img/PerfilDefault.png';

export default function PaginaProjeto() {
    const [listaProjetos, setListaProjetos] = useState([]);
    const [descricao, setDescricao] = useState('');
    const [equipe, setEquipe] = useState([]);
    const [searchInput, setSearchInput] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);

    const searchItems = (searchValue) => {
        setSearchInput(searchValue)
        if (searchInput !== '') {
            const filteredData = equipe.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
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
                    }
                    return projeto
                })
            }
        })
            .catch(erro => console.log(erro));
    }

    function buscarEquipe() {
        console.log(parseIdEquipe())
        api("/Equipes", {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
            resposta.data.map((equipe) => {
                if (equipe.idEquipe == parseIdEquipe()) {
                    console.log(equipe.usuarios);
                    console.log(equipe.usuarios[0].tasks)
                    let equipeBuscada = equipe.usuarios.map((usuarios) => {
                        return (usuarios)
                    });
                    setEquipe(equipeBuscada)
                }
            })
        })
    }

    // function BuscarCliente() {
    //     api("/Clientes").then(resposta => {
    //         if (resposta.data.idCliente === listaProjetos.idCliente) {
    //             if (resposta.status === 200) {
    //                 console.log(resposta.data)
    //                 setCliente(resposta.data)
    //                 console.log(Cliente)
    //             }
    //         }
    //     })
    // }

    // useEffect(BuscarCliente, [])

    useEffect(buscarProjeto, [])
    useEffect(buscarEquipe, [])

    return (
        <div>
            <Header />
            <SideBar />
            <div className="box__listagemProjetos">
                <section className="section__listagemProjetos container">
                    <h1>Overview</h1>

                    <div className='section__infoBox'>
                        <img
                            className="overview__imgEmpresa"
                            src={fotoPerfil}
                            alt="Imagem do cliente" />

                        <div className='div__textBox'>
                            <h2 className='titulo__projeto'>{listaProjetos.tituloProjeto}</h2>

                            <div className='div__infBox'>
                                <h2 className='subtitulo_projeto'>Cliente: </h2>
                                <p>{listaProjetos.tituloProjeto}</p>
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

                        <button className='btn btnStyle btn__edit'>Edit team</button>
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
                                                    <img className='equipe__fotoUsuario' src={fotoPerfil} alt='Foto de perfil do usuário'></img>
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
                                                    <img className='equipe__fotoUsuario' src={fotoPerfil} alt='Foto de perfil do usuário'></img>
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