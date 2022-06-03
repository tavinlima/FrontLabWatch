import { React, useState, useLayoutEffect, useEffect } from 'react';
import { motion } from "framer-motion"

import { useNavigate } from 'react-router-dom';
import Header from '../../../Components/header';
import SideBar from '../../../Components/sidebar'
import Loading from '../../../Components/loading'

import "../../../assets/css/listaProjetos.css"
import "../../../assets/css/global.css"
import "../../../assets/css/modalExcluir.css"

import { Icon } from '@iconify/react';

import api from '../../../services/api';
import { parseIdEquipe, parseJwt } from '../../../services/auth';
import { useTranslation } from 'react-i18next';


export default function ListarConsultor() {
    const { t } = useTranslation();
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [meusProjetos, setMeusProjetos] = useState([]);

    let navigate = useNavigate();

    /// Funções que não são de conexão com a API aqui:
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(true);
        }, 1500);
    })


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
        api("/Projetos/" + projeto.idProjeto, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
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
        // console.log('entrou')
        api("/UsuarioEquipes", {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
            if (resposta.status === 200) {
                resposta.data.map((equipe) => {
                    if (equipe.idUsuarioNavigation.idUsuario != null) {
                        let usuarioEquipes = equipe.idEquipeNavigation.usuarioEquipes
                        usuarioEquipes.map((usuario) => {
                            if (usuario.idUsuario == parseJwt().jti) {
                                localStorage.setItem('idEquipe', usuario.idEquipe)
                            }
                        })
                    }
                })
            }
        }).then(() => listarMeusProjetos())
            .catch(erro => console.log(erro))
    }

    useLayoutEffect(buscarEquipe, [])

    async function listarMeusProjetos() {
        console.log(parseIdEquipe());
        await api("/Projetos/Minhas/" + parseJwt().jti, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
            if (resposta.status === 200) {
                setMeusProjetos(resposta.data);
            }
        }).catch(erro => console.log(erro))
    }

    /// UseEffects aqui:
    // useEffect(listarMeusProjetos, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2}}
            exit={{ opacity: 0 }}
        >
            {isLoading == false ?
                <Loading /> : ''}
            <div>
                <Header />
                <section>
                    <SideBar />
                </section>
                <div className="box__listagemProjetos">
                    <section className="section__listagemProjetos container">
                        <div className="div__tituloInput">
                            <h1>{t('welcomeProjects')}</h1>
                            <input
                                type="search"
                                id='projetos'
                                name='projeto'
                                autoComplete='off'
                                list='projetos'
                                onChange={(e) => searchItems(e.target.value)}
                                placeholder={t('inputSearch')} />
                            <Icon className='iconify lupa' icon="cil:magnifying-glass" />
                        </div>

                        <label className="box__filter"><span className="iconify" data-icon="mi:filter"></span>{t('h3Projects')}</label>
                        {
                            meusProjetos.length === 0 ?
                                <div className="box__semProjetos">
                                    <span>{t("There are no projects registered")}</span>
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
                                                                    src={"https://labwatch-backend.azurewebsites.net/img/" + projeto.idClienteNavigation.fotoCliente}
                                                                    alt="Imagem do cliente" />
                                                            </div>
                                                            <div className="box__infProjeto">
                                                                <button className="button_selectProject" onClick={() => selecionarProjeto(projeto)}>
                                                                    <h2>{projeto.tituloProjeto}</h2>
                                                                </button>

                                                                <div>
                                                                    <span style={{ "fontWeight": 'bold' }}>{t('titleClient')} </span>
                                                                    <span>{projeto.idClienteNavigation.nomeCliente}</span>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className='box__data'>
                                                            <span style={{ "fontWeight": 'bold' }}>{t('dataDelivery')}  </span>
                                                            <span>{Intl.DateTimeFormat("pt-BR",
                                                                {
                                                                    year: 'numeric', month: 'numeric', day: 'numeric',
                                                                    hour: 'numeric', minute: 'numeric'
                                                                }
                                                            ).format(new Date(projeto.dataConclusao))}</span>
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
                                                                src={"https://labwatch-backend.azurewebsites.net/img/" + projeto.idClienteNavigation.fotoCliente}
                                                                alt="Imagem do cliente" />
                                                        </div>
                                                        <div className="box__infProjeto">
                                                            <button className="button_selectProject" onClick={() => selecionarProjeto(projeto)}>
                                                                <h2>{projeto.tituloProjeto}</h2>
                                                            </button>

                                                            <div>
                                                                <span style={{ "fontWeight": 'bold' }}>{t('titleClient')} </span>
                                                                <span>{projeto.idClienteNavigation.nomeCliente}</span>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className='box__data'>
                                                        <span style={{ "fontWeight": 'bold' }}>{t('dataDelivery')} </span>
                                                        <span>{Intl.DateTimeFormat("pt-BR",
                                                            {
                                                                year: 'numeric', month: 'numeric', day: 'numeric',
                                                                hour: 'numeric', minute: 'numeric'
                                                            }
                                                        ).format(new Date(projeto.dataConclusao))}</span>
                                                    </div>
                                                </section>
                                            </div>
                                        )
                                    })
                        }

                    </section>
                </div >
            </div >
        </motion.div>
    )
}
