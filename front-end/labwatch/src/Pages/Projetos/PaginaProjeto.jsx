import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import { Link } from 'react-router-dom';
import Header from '../../Components/header';
import SideBar from '../../Components/sidebar'


export default function PaginaProjeto() {
    const atualizado = () => toast.success("Projeto atualizado com sucesso!")
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

    function fecharAlerta() {
        var alerta = document.getElementById("alerta");
        alerta.style.display = "none"
    }

    function fecharModal() {
        var modal = document.getElementById("myModal");
        modal.style.display = "none"
    }

    // Modal de configurações
    // function abrirModal(projeto) {
    //     var modal = document.getElementById("myModal");

    //     const target = document.getElementById('arquivo')
    //     const file = projeto.fotoCliente

    //     console.log(projeto)
    //     setIdProjeto(projeto.idProjeto)
    //     setTituloProjeto(projeto.tituloProjeto)
    //     setNomeCliente(projeto.nomeCliente)
    //     setDescricaoProjeto(projeto.descricaoProjeto)
    //     setDataInicio(projeto.dataInicio)
    //     setDataConclusao(projeto.dataConclusao)
    //     setFotoCliente(file)

    //     modal.style.display = "block";

    //     window.onclick = function (event) {
    //         if (event.target === modal) {
    //             modal.style.display = "none";
    //         }
    //     }
    // }

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
        }).then(() => listarProjetos()).then(atualizado)
            .catch(erro => console.log(erro))
    }
    return (
        <div>
            <Header />
            <section>
                <SideBar />
            </section>
            <div className="box__listagemProjetos">
                <section className="section__listagemProjetos container">
                    <h1>Overview</h1>
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
                                            onChange={(e) => setFotoCliente(e.target.value)}
                                        />
                                    </label>

                                    {/* <img
                                        className="box__imgEmpresa"
                                        src={"http://localhost:5000/StaticFiles/Images/" + projeto.fotoCliente}
                                        alt="Imagem do cliente" /> */}

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

                        <div id="alerta" className="modal_mini">

                            <div className="alerta-content">
                                <h3>Deseja mesmo excluir esse projeto?</h3>
                                <button
                                    className="btn__excluirProjetoModal btn"
                                    >Sim
                                    </button>
                                <button
                                    className="btn__Excluir"
                                    onClick={() => fecharAlerta()}
                                >Não</button>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}