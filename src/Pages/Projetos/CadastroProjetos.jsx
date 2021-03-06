import React from 'react';
import { useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"

import '../../assets/css/global.css';
import '../../assets/css/cadastroProjetos.css';
import { parseJwt } from '../../services/auth';

import Header from '../../Components/header';
import SideBar from '../../Components/sidebar';

import api from '../../services/api';


export default function CadastroProjetos() {
    const data = new Date();
    const [nomeProjeto, setNomeProjeto] = useState('');
    const [dataInicio, setDataInicio] = useState(new Date());
    const [dataFinal, setDataFinal] = useState(new Date());
    const [descricaoProjeto, setDescricaoProjeto] = useState('');
    const [cliente, setCliente] = useState([]);
    const [idCliente, setIdCliente] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    let history = useNavigate();

    async function cadastrarProjetos(event) {
        event.preventDefault();
        setIsLoading(true);

        let projeto = {
            idUsuario: parseJwt().jti,
            idStatusProjeto: 1,
            tituloProjeto: nomeProjeto,
            dataInicio: dataInicio,
            dataConclusao: dataFinal,
            descricao: descricaoProjeto,
            idEquipe: 31,
            idCliente: idCliente
        }

        console.log(projeto)

        api.post("/Projetos", projeto, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }
        )
            .then((resposta) => {
                if (resposta.status === 201) {
                    switch (parseJwt().role) {
                        case '2':
                            history('/ListaProjetosGestor')
                            break;
                        case '3':
                            history('/ListaProjetosOwner')
                            break;

                        default:
                            break;
                    }
                    console.log("cadastrado")
                    setIsLoading(false);
                }
            })
            .catch(erro => {
                console.log(erro);
                setIsLoading(false);
            })
    }

    function buscarClientes() {
        api('/Clientes', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => setCliente(resposta.data))
    }

    useLayoutEffect(buscarClientes, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div>
                <Header />
                <SideBar />
                <div className='box__cadastroProjetos'>
                    <section className='section__cadastroProjetos container'>
                        <h1>Create a project to get start</h1>
                        <form encType="multipart/form-data">
                            <label className='boxCadastro__label'>
                                Project name
                                <input
                                    className='projetoNome__input'
                                    type='text'
                                    name='nomeProjeto'
                                    autoComplete='off'
                                    onChange={(e) => setNomeProjeto(e.target.value)}
                                    required />
                            </label>

                            <label className='boxCadastro__label'>
                                Description
                                <textarea
                                    className='projetoDescricao__input'
                                    type='text'
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
                                        type='date'
                                        required
                                        min={data.toISOString().split('T')[0]}
                                        // min="2023-01-02"
                                        onChange={(e) => setDataInicio(e.target.value)}
                                    />
                                </label>

                                <label className="boxCadastro__label">
                                    Final date 
                                    <input
                                        className="projetoData__input"
                                        name='dataFinalProjeto'
                                        type='date'
                                        min={dataInicio}
                                        required
                                        onChange={(e) => setDataFinal(e.target.value)}
                                    />
                                </label>

                            </div>
                            <label className="boxCadastro__label">
                                Client
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

                            <div className='div__buttons'>

                                {
                                    isLoading === false ? (
                                        <button
                                            className='boxCadastro__btnCriar btn'
                                            type='submit'
                                            onClick={(e) => cadastrarProjetos(e)}
                                        >
                                            Create project
                                        </button>
                                    ) : (
                                        <button className='btn_cadastro_carregando'
                                            type="submit"

                                            disabled>Carregando...</button>
                                    )
                                }
                            </div>
                        </form>
                        {/* <img src={ilustraTrabalhadores} alt='' className='box__ilustracao' /> */}
                    </section>
                </div>
            </div>
        </motion.div>
    )
}


