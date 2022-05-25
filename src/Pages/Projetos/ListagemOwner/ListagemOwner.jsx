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


export default function ListagemOwner() {
    const [listaProjetos, setListaProjetos] = useState([])
    const [idProjeto, setIdProjeto] = useState([])
    const [filteredResults, setFilteredResults] = useState([]);
    const [nomeCliente, setNomeCliente] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [tituloProjeto, setTituloProjeto] = useState('');
    const [dataInicio, setDataInicio] = useState(new Date());
    const [fotoCliente, setFotoCliente] = useState('');
    const [idCliente, setIdCliente] = useState('');
    const [cliente, setCliente] = useState([]);
    const [dataConclusao, setDataConclusao] = useState(new Date());
    const [descricaoProjeto, setDescricaoProjeto] = useState('');
    const [filtroSelecionado, setFiltroSelecionado] = useState('');

    const atualizado = () => toast.success("Projeto atualizado com sucesso!")
    const desativado = () => toast.success("Projeto desativado com sucesso!")

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

        console.log(projeto)
        setIdProjeto(projeto.idProjeto)
        setTituloProjeto(projeto.tituloProjeto)
        setNomeCliente(projeto.idClienteNavigation.nomeCliente)
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
    function listarProjetos() {
        api("/Projetos").then(resposta => {
            if (resposta.status === 200) {
                setListaProjetos(resposta.data)
                localStorage.removeItem('idEquipe')
            }
        })
            .catch(erro => console.log(erro));
    }

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

    function listarAtivos() {
        api("/Projetos").then(resposta => {
            if (resposta.status === 200) {
                let listaAtivos = resposta.data.filter((projeto) => {
                    return projeto.idStatusProjeto !== 2
                })

                setListaProjetos(listaAtivos)
                localStorage.removeItem('idEquipe')
            }
        })
            .catch(erro => console.log(erro));
    }

    function listarConcluidos() {
        api("/Projetos").then(resposta => {
            if (resposta.status === 200) {

                let listaConcluidos = resposta.data.filter((projeto) => {
                    return projeto.idStatusProjeto === 2
                })
                setListaProjetos(listaConcluidos)
                localStorage.removeItem('idEquipe')
            }
        })
            .catch(erro => console.log(erro));
    }


    // Atualizar Projeto
    function atualizarProjeto(event) {
        event.preventDefault();
        setIsLoading(true);

        console.log(tituloProjeto)
        let projeto = {
            idProjeto: idProjeto,
            idStatusProjeto: 1,
            tituloProjeto: tituloProjeto,
            dataInicio: dataInicio,
            dataConclusao: dataConclusao,
            descricao: descricaoProjeto,
            idCliente: parseInt(idCliente),
            idEquipe: 4,
        }

        console.log(projeto)
        console.log(tituloProjeto)
        console.log(idProjeto)

        api.put("/Projetos/" + idProjeto, {
            idProjeto: idProjeto,
            idStatusProjeto: 1,
            tituloProjeto: tituloProjeto,
            dataInicio: dataInicio,
            dataConclusao: dataConclusao,
            descricao: descricaoProjeto,
            idCliente: parseInt(idCliente),
            idEquipe: 2,
        },
            // {
            //     headers: {
            //         "Content-Type": "application/json"
            //     }
            // }
        ).then(resposta => {
            console.log(resposta.data)
        }).then(() => listarProjetos()).then(atualizado)
            .catch(erro => console.log(erro))
    }

    function desativarProjeto() {
        console.log(idProjeto)
        api.patch('/Projetos/MudarSituacao?idProjeto=' + idProjeto + '&statusProjeto=2',).then(resposta => {
            if (resposta.status === 200) {
                console.log(resposta)
                console.log(listaProjetos)
                window.location.reload();
                console.log(resposta)

            }
        }
        ).then(desativado).catch(erro => console.log(erro))
    }

    function buscarClientes() {
        api('/Clientes').then(resposta => setCliente(resposta.data))
    }

    /// UseEffects aqui:
    // useEffect(listarProjetos, [])
    useEffect(() => {
        if (filtroSelecionado === '1') {
            listarProjetos()
        } else if (filtroSelecionado === '3') {
            listarConcluidos()
        } else {
            listarAtivos()
        }
    })

    useEffect(buscarClientes, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {isLoading == false ?
                <Loading /> : ''}
            {/* <Loading /> */}
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

                        {/* <label className="box__filter"><span className="iconify" data-icon="mi:filter"></span>Mais recentes primeiro</label> */}
                        <div className='box__filter'>
                            <select className='select__filterProjects' onChange={(e) => setFiltroSelecionado(e.target.value)} value={filtroSelecionado}>
                                <option value='2'>Projetos em andamento</option>
                                <option value='3'>Projetos concluídos</option>
                                <option value='1'>Todos os projetos</option>
                            </select>
                        </div>
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
                                                                    src={"https://labwatch-backend.azurewebsites.net/img/" + projeto.idClienteNavigation.fotoCliente}
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
                                                                    <button
                                                                        aria-label="Configurações"
                                                                        className="btn__settings"
                                                                        onClick={() => abrirModal(projeto)}>
                                                                        <Icon className="iconify projeto__icon" icon="bi:gear-fill" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                            )
                                        })
                                    )
                                    :

                                    listaProjetos.map((projeto) => {
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
                                                                <button
                                                                    aria-label="Configurações"
                                                                    className="btn__settings"
                                                                    onClick={() => abrirModal(projeto)}>
                                                                    <Icon className="iconify projeto__icon" icon="bi:gear-fill" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                            </div>
                                        )
                                    })
                        }
                        {/* {

                        } */}
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

                                        <label className="boxCadastro__label">
                                            Client
                                            <span value={nomeCliente}>{nomeCliente}</span>
                                            <select
                                                className='select_cliente'
                                                required
                                                name='idCliente'
                                                onChange={(e) => setIdCliente(e.target.value)}
                                                value={idCliente}
                                            >
                                                <option aria-disabled="true" value="0" disabled>Selecione um dos clientes</option>
                                                {
                                                    cliente.map((cliente) => {
                                                        return (
                                                            <option key={cliente.idCliente} value={cliente.idCliente}>{cliente.nomeCliente}</option>
                                                        )
                                                    })
                                                }
                                            </select>
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
                                                onChange={(e) => setFotoCliente(e.target.value)}
                                            />
                                        </label>

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
                                        <button
                                            className="btn__excluirProjeto btn"
                                            type="button"
                                            onClick={() => btnExcluir()}>Desativar projeto
                                        </button>
                                    </form>
                                    <div className="div__buttons">
                                        <button
                                            className="btn__backProjeto btn"
                                            type="button"
                                            onClick={() => fecharModal()}
                                        >
                                            Voltar
                                        </button>

                                    </div>
                                </div>
                            </div>

                            <div id="alerta" className="modal_mini">

                                <div className="alerta-content">
                                    <h3>Deseja mesmo desativar esse projeto?</h3>
                                    <button
                                        className="btn__excluirProjetoModal btn"
                                        onClick={() => desativarProjeto()}>Sim</button>
                                    <button
                                        className="btn__Excluir"
                                        onClick={() => fecharAlerta()}
                                    >Não</button>
                                </div>

                            </div>
                        </div>
                    </section>
                </div >

            </div >
        </motion.div>
    )
}
