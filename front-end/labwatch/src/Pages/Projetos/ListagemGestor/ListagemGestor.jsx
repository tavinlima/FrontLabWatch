import { React, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion"

import { useNavigate } from 'react-router-dom';
import Header from '../../../Components/header';
import SideBar from '../../../Components/sidebar'

import "../../../assets/css/listaProjetos.css"
import "../../../assets/css/global.css"
import "../../../assets/css/modalExcluir.css"

import { Icon } from '@iconify/react';

import axios from 'axios';
import api from '../../../services/api';
import { parseIdEquipe, parseJwt } from '../../../services/auth';

export default function ListarMinhas() {
    const [idProjeto, setIdProjeto] = useState([])
    const [filteredResults, setFilteredResults] = useState([]);
    // const [projetosAtivos, setProjetosAtivos] = useState([]);
    // const [projetosConcluidos, setProjetosConcluidos] = useState([]);
    const [nomeCliente, setNomeCliente] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tituloProjeto, setTituloProjeto] = useState('');
    const [dataInicio, setDataInicio] = useState(new Date());
    const [fotoCliente, setFotoCliente] = useState('');
    const [dataConclusao, setDataConclusao] = useState(new Date());
    const [descricaoProjeto, setDescricaoProjeto] = useState('');
    const [minhaEquipe, setMinhaEquipe] = useState('');
    const [meusProjetos, setMeusProjetos] = useState([]);

    // const notify = () => toast.success("Projeto deletado com sucesso!")
    const atualizado = () => toast.success("Projeto atualizado com sucesso!")

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

    function fecharAlerta() {
        var alerta = document.getElementById("alerta");
        alerta.style.display = "none"
    }

    function fecharModal() {
        var modal = document.getElementById("myModal");
        modal.style.display = "none"
    }

    // Modal de configurações
    function abrirModal(projeto) {
        var modal = document.getElementById("myModal");

        console.log(projeto)

        console.log(projeto)
        setIdProjeto(projeto.idProjeto)
        setTituloProjeto(projeto.tituloProjeto)
        setNomeCliente(projeto.idClienteNavigation.nomeCliente)
        setFotoCliente(projeto.idClienteNavigation.fotoCliente)
        setDescricaoProjeto(projeto.descricao)
        setDataInicio(projeto.dataInicio)
        setDataConclusao(projeto.dataConclusao)
        setFotoCliente(projeto.fotoCliente)

        modal.style.display = "block";

        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }

    // Modal de excluir projeto
    function btnExcluir() {
        var alerta = document.getElementById("alerta");

        alerta.style.display = "block"

        window.onclick = function (event) {
            if (event.target === alerta) {
                alerta.style.display = "none";
            }
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
        api("/UsuarioEquipes").then(resposta => {
            if (resposta.status === 200) {
                console.log(resposta.data)
                resposta.data.map((equipe) => {
                    if (equipe.idUsuarioNavigation.idUsuario != null) {
                        let usuarioEquipes = equipe.idEquipeNavigation.usuarioEquipes
                        usuarioEquipes.map((usuario) => {
                            if (usuario.idUsuario == parseJwt().jti) {
                                console.log(usuario)
                                localStorage.setItem('idEquipe', usuario.idEquipe)
                            }
                        })
                    }
                })
            }
        }).then(() => listarMeusProjetos())
            .catch(erro => console.log(erro))
    }


    async function listarMeusProjetos() {
        console.log(parseIdEquipe());
        await api("/Projetos/Minhas/" + parseJwt().jti).then(resposta => {
            if (resposta.status === 200) {
                console.log(resposta.data)
                setMeusProjetos(resposta.data);
            }
        }).catch(erro => console.log(erro))
    }

    // Atualizar Projeto
    function atualizarProjeto(event) {
        event.preventDefault();
        setIsLoading(true);

        console.log(tituloProjeto)
        let projeto = {
            tituloProjeto: tituloProjeto,
            nomeCliente: nomeCliente,
            descricao: descricaoProjeto,
            dataInicio: dataInicio,
            dataConclusao: dataConclusao,
            fotoCliente: fotoCliente,
            idStatusProjeto: 1
        }

        console.log(projeto)
        console.log(tituloProjeto)
        console.log(fotoCliente)

        axios.put("http://labwatch-backend.azurewebsites.net/api/Projetos/" + idProjeto, {
            tituloProjeto,
            nomeCliente,
            descricaoProjeto,
            dataInicio,
            dataConclusao,
            fotoCliente
        }, {
            headers: { "Content-Type": "application/json" }
        }).then(resposta => {
            console.log(resposta)
        }).then(() => listarMeusProjetos()).then(atualizado)
            .catch(erro => console.log(erro))
    }


    /// UseEffects aqui:
    useEffect(buscarEquipe, [])
    // useEffect(listarMeusProjetos, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
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
                                                        <div className="div__membersGear">
                                                            <div className="div__members">
                                                                {/* <span>Members</span> */}
                                                            </div>
                                                            <button
                                                                aria-label="Configurações"
                                                                className="btn__settings"
                                                                onClick={() => abrirModal(projeto)}>
                                                                {/* <span className="iconify projeto__icon" data-icon="bi:gear-fill"></span> */}
                                                                <Icon className="iconify projeto__icon" icon="bi:gear-fill" />
                                                            </button>
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
                                                        <div className="div__membersGear">
                                                            <div className="div__members">
                                                                {/* <span>Members</span> */}
                                                            </div>
                                                            <button
                                                                aria-label="Configurações"
                                                                className="btn__settings"
                                                                onClick={() => abrirModal(projeto)}>
                                                                {/* <span className="iconify projeto__icon" data-icon="bi:gear-fill"></span> */}
                                                                <Icon className="iconify projeto__icon" icon="bi:gear-fill" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                </section>
                                                <div id="myModal" className="modal">
                                                    <div className="modal-content">
                                                        <div className="modal_container">
                                                            <form onSubmit={(e) => atualizarProjeto(e)}>
                                                                <label className='boxCadastro__label'>
                                                                    Project name
                                                                    <input
                                                                        className='projetoNome__input'
                                                                        type='text'
                                                                        value={tituloProjeto}
                                                                        name='nomeProjeto'
                                                                        autoComplete='off'
                                                                        onChange={(e) => setTituloProjeto(e.target.value)} />
                                                                </label>

                                                                <label className='boxCadastro__label'>
                                                                    Client
                                                                    <h3>{nomeCliente}</h3>
                                                                    <img
                                                                        className="box__imgEmpresa"
                                                                        src={"http://labwatch-backend.azurewebsites.net/img/" + fotoCliente}
                                                                        alt="Imagem do cliente" />
                                                                </label>

                                                                <label className='boxCadastro__label'>
                                                                    Description
                                                                    <textarea
                                                                        className='projetoDescricao__input'
                                                                        type='text'
                                                                        value={descricaoProjeto}
                                                                        name='descricaoProjeto'
                                                                        maxLength="200"
                                                                        onChange={(e) => setDescricaoProjeto(e.target.value)}
                                                                    />
                                                                </label>

                                                                <div className="div__inputDate">
                                                                    <label className="boxCadastro__label">
                                                                        Start Date
                                                                        <input
                                                                            className="projetoData__input"
                                                                            name='dataInicioProjeto'
                                                                            value={dataInicio}
                                                                            type='datetime-local'
                                                                            onChange={(e) => setDataInicio(e.target.value)}
                                                                        />
                                                                    </label>

                                                                    <label className="boxCadastro__label">
                                                                        Final date
                                                                        <input
                                                                            className="projetoData__input"
                                                                            name='dataFinalProjeto'
                                                                            value={dataConclusao}
                                                                            type='datetime-local'
                                                                            onChange={(e) => setDataConclusao(e.target.value)}
                                                                        />
                                                                    </label>

                                                                </div>
                                                                {/* 
                                                                <img
                                                                    className="box__imgEmpresa"
                                                                    src={"http://localhost:5000/StaticFiles/Images/" + projeto.fotoCliente}
                                                                    alt="Imagem do cliente" /> */}

                                                                {
                                                                    isLoading ? <button
                                                                        className='boxCadastro__btnCriar btn btn_salvar'
                                                                        disabled>
                                                                        Salvar Alterações</button>
                                                                        :
                                                                        <button
                                                                            className='boxCadastro__btnCriar btn btn_salvar'
                                                                            type='submit'>Salvar alterações</button>
                                                                }

                                                            </form>

                                                            <div className="div__buttons">
                                                                <button
                                                                    className="btn__backProjeto btn"
                                                                    type="button"
                                                                    onClick={() => fecharModal()}
                                                                >
                                                                    Voltar
                                                                </button>

                                                                <button
                                                                    className="btn__excluirProjeto btn"
                                                                    type="button">Desativar projeto
                                                                </button>

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="alerta" className="modal_mini">

                                                        <div className="alerta-content">
                                                            <h3>Deseja mesmo excluir esse projeto?</h3>
                                                            {/* <button
                                                            className="btn__excluirProjetoModal btn"
                                                            onClick={() => excluirProjeto()}>Sim</button> */}
                                                            <button
                                                                className="btn__Excluir"
                                                                onClick={() => fecharAlerta()}
                                                            >Não</button>
                                                        </div>

                                                    </div>
                                                </div>
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
