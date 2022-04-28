import { React, useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import Header from '../../../Components/header';
import SideBar from '../../../Components/sidebar'

import "../../../assets/css/listaProjetos.css"
import "../../../assets/css/global.css"
import "../../../assets/css/modalExcluir.css"

import { Icon } from '@iconify/react';

import api from '../../../services/api';
import { parseIdEquipe, parseJwt } from '../../../services/auth';

export default function ListarConsultor() {
    const [filteredResults, setFilteredResults] = useState([]);
    // const [projetosAtivos, setProjetosAtivos] = useState([]);
    // const [projetosConcluidos, setProjetosConcluidos] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [minhaEquipe, setMinhaEquipe] = useState('');
    const [meusProjetos, setMeusProjetos] = useState([]);


    let navigate = useNavigate();

    /// Funções que não são de conexão com a API aqui:

    const searchItems = (searchValue) => {
        setSearchInput(searchValue)
        if (searchInput !== '') {

            const filteredData = meusProjetos.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
            })
            setFilteredResults(filteredData)

        } else {
            setFilteredResults(meusProjetos)
        }
    }

    /// Funções que fazem conexão com a API aqui:

    // Listar todas os projetos na página

    function selecionarProjeto(projeto) {
        api("/Projetos/" + projeto.idProjeto).then(resposta => {
            if (resposta.status === 200) {
                console.log(resposta.data)
                var valorProjeto = resposta.data.idProjeto;
                localStorage.setItem('idProjetoSelect', resposta.data.idProjeto)
                navigate('/ProjetoOverview', { state: { id: projeto.idProjeto, name: projeto.idProjeto, value: valorProjeto } })
            }
        })
            .catch(erro => console.log(erro));
    }

    function buscarEquipe() {
        api("/Equipes").then(resposta => {
            if (resposta.status === 200) {
                resposta.data.map((equipe) => {
                    return equipe.usuarios.map((usuario) => {
                        if (usuario.idUsuario == parseJwt().jti) {
                            setMinhaEquipe(equipe)
                            localStorage.setItem('idEquipe', equipe.idEquipe)
                        }
                        return equipe
                    })
                })
            }
        }).then(() => listarMeusProjetos())
            .catch(erro => console.log(erro))
    }

    async function listarMeusProjetos() {
        await api("/Projetos/Minhas/" + parseIdEquipe()).then(resposta => {
            // console.log(resposta.data)
            if (resposta.status === 200) {
                console.log(resposta.data)
                setMeusProjetos(resposta.data);
                // console.log(meusProjetos)
            }
        }).catch(erro => console.log(erro))
    }

    /// UseEffects aqui:
    useEffect(buscarEquipe, [])
    // useEffect(listarMeusProjetos, [])

    return (
        <div>
            <Header />
            <section>
                <SideBar />
            </section>
            <div className="box__listagemProjetos">
                <section className="section__listagemProjetos container">
                    <div className="div__tituloInput">
                        <h1>Projects</h1>
                        <input
                            type="search"
                            id='projetos'
                            name='projeto'
                            autoComplete='off'
                            list='projetos'
                            onChange={(e) => searchItems(e.target.value)}
                            placeholder="Search anything..." />
                        <Icon className='iconify lupa' icon="cil:magnifying-glass" />
                    </div>

                    <label className="box__filter"><span className="iconify" data-icon="mi:filter"></span>Mais recentes primeiro</label>
                    {
                        meusProjetos.length === 0 ?
                            <div className="box__semProjetos">
                                <span>Não há projetos cadastrados</span>
                            </div>

                            :

                            searchInput.length > 0 ?
                                (
                                    filteredResults.map((projeto) => {
                                        return (
                                            <div className="section__projeto" key={projeto.idProjeto}>
                                                <section className="box__projeto" key={projeto.idProjeto}>
                                                    <div className="containerBox">
                                                        <div className="divisoria__imgEmpresa">
                                                            <img
                                                                className="box__imgEmpresa"
                                                                src={"http://labwatch-backend.azurewebsites.net/img/" + projeto.idClienteNavigation.fotoCliente}
                                                                alt="Imagem do cliente" />
                                                        </div>
                                                        <div className="box__infProjeto">
                                                            <button className="button_selectProject" onClick={() => selecionarProjeto(projeto)}>
                                                                <h2>{projeto.tituloProjeto}</h2>
                                                            </button>

                                                            <div>
                                                                <span>Cliente: </span>
                                                                <span>{projeto.idClienteNavigation.nomeCliente}</span>
                                                            </div>

                                                            <span>Data de entrega:</span>
                                                            <span>{Intl.DateTimeFormat("pt-BR",
                                                                {
                                                                    year: 'numeric', month: 'numeric', day: 'numeric',
                                                                    hour: 'numeric', minute: 'numeric'
                                                                }
                                                            ).format(new Date(projeto.dataConclusao))}</span>
                                                        </div>

                                                    </div>
                                                </section>

                                            </div>
                                        )
                                    })
                                ) :
                                meusProjetos.map((projeto) => {
                                    return (
                                        <div className="section__projeto" key={projeto.idProjeto}>
                                            <section className="box__projeto" key={projeto.idProjeto}>
                                                <div className="containerBox">
                                                    <div className="divisoria__imgEmpresa">
                                                        <img
                                                            className="box__imgEmpresa"
                                                            src={"http://labwatch-backend.azurewebsites.net/img/" + projeto.idClienteNavigation.fotoCliente}
                                                            alt="Imagem do cliente" />
                                                    </div>
                                                    <div className="box__infProjeto">
                                                        <button className="button_selectProject" onClick={() => selecionarProjeto(projeto)}>
                                                            <h2>{projeto.tituloProjeto}</h2>
                                                        </button>

                                                        <div>
                                                            <span>Cliente: </span>
                                                            <span>{projeto.idClienteNavigation.nomeCliente}</span>
                                                        </div>

                                                        <span>Data de entrega:</span>
                                                        <span>{Intl.DateTimeFormat("pt-BR",
                                                            {
                                                                year: 'numeric', month: 'numeric', day: 'numeric',
                                                                hour: 'numeric', minute: 'numeric'
                                                            }
                                                        ).format(new Date(projeto.dataConclusao))}</span>
                                                    </div>

                                                </div>
                                            </section>
                                        </div>
                                    )
                                })
                    }

                </section>
            </div >
        </div >
    )
}
