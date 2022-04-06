import { React, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Link } from 'react-router-dom';
import Header from '../../Components/header';
import SideBar from '../../Components/sidebar'

import "../../assets/css/listaProjetos.css"
import "../../assets/css/global.css"
import "../../assets/css/modalExcluir.css"

import "https://code.iconify.design/2/2.1.0/iconify.min.js";

import { parseJwt } from '../../services/auth';
import axios from 'axios';


export default function ListagemProjetos() {
    const [listaProjetos, setListaProjetos] = useState([])
    const [idProjeto, setIdProjeto] = useState([])
    const [filteredResults, setFilteredResults] = useState([]);
    const [nomeCliente, setNomeCliente] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tituloProjeto, setTituloProjeto] = useState('');
    const [dataInicio, setDataInicio] = useState(new Date());
    const [fotoCliente, setFotoCliente] = useState('');
    const [dataConclusao, setDataConclusao] = useState(new Date());
    const [descricaoProjeto, setDescricaoProjeto] = useState('');

    const notify = () => toast.success("Projeto deletado com sucesso!")
    const atualizado = () => toast.success("Projeto atualizado com sucesso!")

    /// Funções que não são de conexão com a API aqui:

    const searchItems = (searchValue) => {
        setSearchInput(searchValue)
        if (searchInput !== '') {
            const filteredData = listaProjetos.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
            })
            setFilteredResults(filteredData)
        }
        else {
            setFilteredResults(listaProjetos)
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
        setIdProjeto(projeto)

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
    function listarProjetos() {
        axios("http://labwatch-backend.azurewebsites.net/api/Projetos").then(resposta => {
            if (resposta.status === 200) {
                console.log(resposta.data)
                setListaProjetos(resposta.data)
            }
        })
            .catch(erro => console.log(erro));
    }

    // Cadastrar Equipe
    // function cadastrarEquipe(event) {
    //     event.preventDefault();

    //     console.log(event)

    //     let usuarios = {
    //         idUsuario: idUsuario
    //     }

    //     let equipe = {
    //         nomeEquipe: "novaEquipe",
    //         horasTrabalhadas: 0,
    //         projetos: idProjeto,
    //         usuarios: usuarios
    //     }

    //     console.log(equipe)

    //     api.post("/Equipes", equipe, {
    //         headers: { "Content-Type": "application/json" }
    //     })
    // }


    // Listar Usuários para cadastrar na equipe

    // function listarUsuarios() {
    //     api("/Usuarios").then(resposta => {
    //         if (resposta.status === 200) {
    //             console.log(resposta.data)
    //             setListaUsuarios(resposta.data)
    //             console.log(listaUsuarios)
    //         }
    //     })
    //         .catch(erro => console.log(erro));
    // }

    // Excluir projeto listada
    function excluirProjeto() {
        var modal = document.getElementById("myModal");
        var alerta = document.getElementById("alerta");
        console.log(idProjeto)
        axios.delete("http://labwatch-backend.azurewebsites.net/api/Projetos/" + idProjeto).then(resposta => {
            if (resposta.status === 204) {
                console.log(resposta + " Projeto deletado com sucesso!")
                modal.style.display = "none";
                alerta.style.display = "none";
            }
        }).then(() => listarProjetos()).then(notify)
            .catch(erro => {
                console.log(erro)
            })
    }

    // Atualizar Projeto
    function atualizarProjeto(event) {
        event.preventDefault();
        setIsLoading(true);

        console.log(tituloProjeto)
        let projeto = {
            tituloProjeto: tituloProjeto,
            nomeCliente: nomeCliente,
            descricaoProjeto: descricaoProjeto,
            dataInicio: dataInicio,
            dataConclusao: dataConclusao,
            idStatusProjeto: 1
        }

        console.log(projeto)
        console.log(tituloProjeto)

        axios.put("http://labwatch-backend.azurewebsites.net/api/Projetos/" + idProjeto, {
            tituloProjeto,
            nomeCliente,
            descricaoProjeto,
            dataInicio,
            dataConclusao,
        }, {
            headers: { "Content-Type": "application/json" }
        }).then(resposta => {
            console.log(resposta)
        }).then(() => listarProjetos()).then(atualizado)
            .catch(erro => console.log(erro))
    }


    /// UseEffects aqui:
    useEffect(listarProjetos, [])
    // useEffect(listarUsuarios, [])

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
                        // (() => {
                        //     switch (parseJwt().role) {
                        //         case "1":
                        //             return <span>Gestor</span>
                        //         case "2":
                        //             return <span>Consultor</span>
                        //         case "3":
                        //             return <span>Owner</span>

                        //         default:
                        //             return <span>Deu certo também</span>
                        //     }
                        // })()

                    }
                    <Link to='/CadastroProjetos' className="btn__criarProjeto btn">Create Project</Link>

                    {
                        listaProjetos.length === 0 ?
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
                                                                src={"http://labwatch-backend.azurewebsites.net/StaticFiles/Images/" + projeto.fotoCliente}
                                                                alt="Imagem do cliente" />
                                                        </div>
                                                        <div className="box__infProjeto">
                                                            <h2>{projeto.tituloProjeto}</h2>

                                                            <div>
                                                                <span>Cliente: </span>
                                                                <span>{projeto.nomeCliente}</span>
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
                                                            </div>
                                                            <button
                                                                aria-label="Configurações"
                                                                className="btn__settings"
                                                                onClick={() => abrirModal(projeto.idProjeto)}>
                                                                <span className="iconify projeto__icon" data-icon="bi:gear-fill"></span>
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
                                                                    Client name
                                                                    <input
                                                                        className='projetoNome__input'
                                                                        type='text'
                                                                        value={nomeCliente}
                                                                        name='nomeCliente'
                                                                        autoComplete='off'
                                                                        onChange={(e) => setNomeCliente(e.target.value)} />
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
                                                                <label className="boxCadastro__label">
                                                                    Imagem do cliente
                                                                    <input
                                                                        className="projetoArquivo__input"
                                                                        name='arquivo'
                                                                        id='arquivo'
                                                                        type='file'
                                                                        accept="image/png, image/jpeg"
                                                                        onChange={(e) => setFotoCliente(e)}
                                                                    />
                                                                </label>

                                                                <img
                                                                    className="box__imgEmpresa"
                                                                    src={"http://localhost:5000/StaticFiles/Images/" + projeto.fotoCliente}
                                                                    alt="Imagem do cliente" />

                                                                <button
                                                                    className='boxCadastro__btnCriar btn btn_salvar'
                                                                    type='submit'
                                                                >
                                                                    Salvar alterações</button>
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
                                                                    type="button"
                                                                    onClick={() => btnExcluir()}>Excluir projeto
                                                                </button>

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="alerta" className="modal">

                                                        <div className="alerta-content">
                                                            <h3>Deseja mesmo excluir esse projeto?</h3>
                                                            <button
                                                                className="btn__excluirProjeto btn"
                                                                onClick={() => excluirProjeto()}>Sim</button>
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
                                ) :
                                listaProjetos.map((projeto) => {
                                    return (
                                        <div className="section__projeto" key={projeto.idProjeto}>
                                            <section className="box__projeto">
                                                <div className="containerBox">
                                                    <div className="divisoria__imgEmpresa">
                                                        {/* {
                                                            projeto.fotoCliente === 0 ?
                                                                <span>{projeto.tituloProjeto.toUpperCase()}</span> :
                                                                <span>Teste</span>
                                                        } */}
                                                        <img
                                                            className="box__imgEmpresa"
                                                            src={"http://labwatch-backend.azurewebsites.net/img/" + projeto.fotoCliente}
                                                            alt="Imagem do cliente" />

                                                    </div>
                                                    <div className="box__infProjeto">
                                                        <h2>{projeto.tituloProjeto}</h2>

                                                        <div>
                                                            <span>Cliente: </span>
                                                            <span>{projeto.nomeCliente}</span>
                                                        </div>
                                                        <div>

                                                            <span>Data de entrega: </span>
                                                            <span>{Intl.DateTimeFormat("pt-BR",
                                                                {
                                                                    year: 'numeric', month: 'numeric', day: 'numeric'
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
                                                            onClick={() => abrirModal(projeto.idProjeto)}>
                                                            <span className="iconify projeto__icon" data-icon="bi:gear-fill"></span>
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
                                                                Client name
                                                                <input
                                                                    className='projetoNome__input'
                                                                    type='text'
                                                                    value={nomeCliente}
                                                                    name='nomeCliente'
                                                                    autoComplete='off'
                                                                    onChange={(e) => setNomeCliente(e.target.value)}
                                                                    required />
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
                                                            <label className="boxCadastro__label">
                                                                Imagem do cliente
                                                                <input
                                                                    className="projetoArquivo__input"
                                                                    name='arquivo'
                                                                    id='arquivo'
                                                                    type='file'
                                                                    accept="image/png, image/jpeg"
                                                                    onChange={(e) => setFotoCliente(e)}
                                                                />
                                                            </label>

                                                            {/* <img
                                                                className="box__imgEmpresa"
                                                                src={"http://localhost:5000/StaticFiles/Images/" + projeto.fotoCliente}
                                                                alt="Imagem do cliente" /> */}

                                                            <button
                                                                className='boxCadastro__btnCriar btn'
                                                                type='submit'
                                                            >
                                                                Salvar alterações</button>
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
                                                                type="button"
                                                                onClick={() => btnExcluir()}>Excluir projeto
                                                            </button>

                                                        </div>
                                                    </div>
                                                </div>

                                                <div id="alerta" className="modal">

                                                    <div className="alerta-content">
                                                        <h3>Deseja mesmo excluir esse projeto?</h3>
                                                        <button
                                                            className="btn__excluirProjeto btn"
                                                            onClick={() => excluirProjeto()}>Sim</button>
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
    )
}
