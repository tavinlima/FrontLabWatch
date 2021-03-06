import { React, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion"

import { useNavigate, Link } from 'react-router-dom';
import Header from '../../../Components/header';
import SideBar from '../../../Components/sidebar'
import Loading from '../../../Components/loading'

import "../../../assets/css/listaProjetos.css"
import "../../../assets/css/global.css"
import "../../../assets/css/modalExcluir.css"

import { Icon } from '@iconify/react';
import api from '../../../services/api';
import { parseIdEquipe, parseJwt } from '../../../services/auth';

//Tradução
import { useTranslation } from 'react-i18next';
import { changeLanguage } from 'i18next';

export default function ListarMinhas() {
    const { t } = useTranslation();
    const [idProjeto, setIdProjeto] = useState([])
    const [filteredResults, setFilteredResults] = useState([]);
    const [nomeCliente, setNomeCliente] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [tituloProjeto, setTituloProjeto] = useState('');
    const [dataInicio, setDataInicio] = useState(new Date());
    const [fotoCliente, setFotoCliente] = useState('');
    const [dataConclusao, setDataConclusao] = useState(new Date());
    const [descricaoProjeto, setDescricaoProjeto] = useState('');
    const [meusProjetos, setMeusProjetos] = useState([]);

    // const notify = () => toast.success("Projeto deletado com sucesso!")
    const atualizado = () => toast.success("Projeto atualizado com sucesso!")

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
        api("/UsuarioEquipes", {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
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
                            return usuario
                        })
                    }

                    return equipe
                })
            }
        }).then(() => listarProjetosMeus())
            .catch(erro => console.log(erro))
    }

    async function listarProjetosMeus() {
        await api("/Projetos", {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
            if (resposta.status === 200) {
                console.log(resposta.data)
                let projetoCerto = resposta.data.filter((projeto) => {
                    return projeto.idUsuario = parseJwt().jti
                })
                setMeusProjetos(projetoCerto);
            }
        }).catch(erro => console.log(erro))
    }

    // async function listarMeusProjetos() {
    //     await api("/Projetos/Minhas/" + parseJwt().jti, {
    //         headers: {
    //             Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
    //         }
    //     }).then(resposta => {
    //         if (resposta.status === 200) {
    //             console.log(resposta.data)
    //             setMeusProjetos(resposta.data);
    //         }
    //     }).catch(erro => console.log(erro))
    // }

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

        api.put("/Projetos/" + idProjeto, {
            tituloProjeto,
            nomeCliente,
            descricaoProjeto,
            dataInicio,
            dataConclusao,
            fotoCliente
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
                "Content-Type": "application/json"
            }
        }).then(resposta => {
            console.log(resposta)
        }).then(() => listarProjetosMeus()).then(atualizado)
            .catch(erro => console.log(erro))
    }


    /// UseEffects aqui:
    useEffect(buscarEquipe, [])
    // useEffect(listarMeusProjetos, [])

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
                <section>
                    <SideBar />
                </section>
                <div className="box__listagemProjetos">
                    <section className="section__listagemProjetos container">
                        <div className="div__tituloInput">
                            <h1>{t("Projects")}</h1>
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

                        <label className="box__filter"><span className="iconify" data-icon="mi:filter"></span>{t("Most recent First")}</label>
                        <Link to='/CadastroProjetos' className="btn__criarProjeto btn">{t("Create Project")}</Link>
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
                                                                    <span>{t("Client: ")} </span>
                                                                    <span>{projeto.idClienteNavigation.nomeCliente}</span>
                                                                </div>

                                                                <span>{t("Delivery date:")}</span>
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
                                                                src={"https://labwatch-backend.azurewebsites.net/img/" + projeto.idClienteNavigation.fotoCliente}
                                                                alt="Imagem do cliente" />
                                                        </div>
                                                        <div className="box__infProjeto">
                                                            <button className="button_selectProject" onClick={() => selecionarProjeto(projeto)}>
                                                                <h2>{projeto.tituloProjeto}</h2>
                                                            </button>

                                                            <div className='div__infAdd'>
                                                                <span>{t("Client: ")}</span>
                                                                <span>{projeto.idClienteNavigation.nomeCliente}</span>
                                                            </div>
                                                            <div className='div__infAdd'>
                                                                <span>{t("Delivery date:")}</span>
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
                                                    </div>

                                                </section>
                                                <div id="myModal" className="modal">
                                                    <div className="modal-content">
                                                        <div className="modal_container">
                                                            <form onSubmit={(e) => atualizarProjeto(e)}>
                                                                <label className='boxCadastro__label'>
                                                                    {t("Project name")}
                                                                    <input
                                                                        className='projetoNome__input'
                                                                        type='text'
                                                                        value={tituloProjeto}
                                                                        name='nomeProjeto'
                                                                        autoComplete='off'
                                                                        onChange={(e) => setTituloProjeto(e.target.value)} />
                                                                </label>

                                                                <label className='boxCadastro__label'>
                                                                    {t("Client:")}
                                                                    <h3>{nomeCliente}</h3>
                                                                    <img
                                                                        className="box__imgEmpresa"
                                                                        src={"https://labwatch-backend.azurewebsites.net/img/" + fotoCliente}
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
                                                                        {t("Start Date")}
                                                                        <input
                                                                            className="projetoData__input"
                                                                            name='dataInicioProjeto'
                                                                            value={dataInicio}
                                                                            type='datetime-local'
                                                                            onChange={(e) => setDataInicio(e.target.value)}
                                                                        />
                                                                    </label>

                                                                    <label className="boxCadastro__label">
                                                                        {t("Final date")}
                                                                        <input
                                                                            className="projetoData__input"
                                                                            name='dataFinalProjeto'
                                                                            value={dataConclusao}
                                                                            type='datetime-local'
                                                                            onChange={(e) => setDataConclusao(e.target.value)}
                                                                        />
                                                                    </label>

                                                                </div>

                                                                {
                                                                    isLoading ? <button
                                                                        className='boxCadastro__btnCriar btn btn_salvar'
                                                                        disabled>
                                                                        {t("Save changes")}</button>
                                                                        :
                                                                        <button
                                                                            className='boxCadastro__btnCriar btn btn_salvar'
                                                                            type='submit'>{t("Save changes")}</button>
                                                                }

                                                            </form>

                                                            <div className="div__buttons">
                                                                <button
                                                                    className="btn__backProjeto btn"
                                                                    type="button"
                                                                    onClick={() => fecharModal()}
                                                                >
                                                                    {t("Back")}
                                                                </button>

                                                                <button
                                                                    className="btn__excluirProjeto btn"
                                                                    type="button">{t("Deactivate project")}
                                                                </button>

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="alerta" className="modal_mini">

                                                        <div className="alerta-content">
                                                            <h3>{t("Do you really want to delete this project?")}</h3>
                                                            {/* <button
                                                            className="btn__excluirProjetoModal btn"
                                                            onClick={() => excluirProjeto()}>Sim</button> */}
                                                            <button
                                                                className="btn__Excluir"
                                                                onClick={() => fecharAlerta()}
                                                            >{t("No")}</button>
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
