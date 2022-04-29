import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"

import '../../assets/css/global.css';
import '../../assets/css/cadastroProjetos.css';

import Header from '../../Components/header';
import SideBar from '../../Components/sidebar';

import ilustraTrabalhadores from '../../assets/img/ilustraTrabalhadores.png'
import axios from 'axios';


export default function CadastroProjetos() {
    const [nomeProjeto, setNomeProjeto] = useState('');
    const [dataInicio, setDataInicio] = useState(new Date());
    const [dataFinal, setDataFinal] = useState(new Date());
    const [descricaoProjeto, setDescricaoProjeto] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    let history = useNavigate();

    // function listarUsuarios() {
    //     api("/Usuarios").then(resposta => {
    //         if (resposta.status === 200) {
    //             console.log(resposta.data)
    //             setListaUsuarios(resposta.data)
    //         }
    //     })
    //         .catch(erro => console.log(erro));
    // }



    // const searchItems = (searchValue) => {
    //     setSearchInput(searchValue)
    //     if (searchInput !== '') {
    //         const filteredData = listaUsuarios.filter((item) => {
    //             return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
    //         })
    //         setFilteredResults(filteredData)
    //     }
    //     else {
    //         setFilteredResults(listaUsuarios)
    //     }
    // }


    function cadastrarProjetos(event) {
        event.preventDefault();
        setIsLoading(true);

        // var formData = new FormData();

        // const target = document.getElementById('arquivo')
        // const file = target.files[0]
        // console.log(file)

        // formData.append('arquivo', file, file.name)

        // formData.append('tituloProjeto', nomeProjeto);
        // formData.append('descricao', descricaoProjeto);
        // formData.append('dataInicio', dataInicio);
        // formData.append('dataConclusao', dataFinal);
        // formData.append('idStatusProjeto', 1);
        // formData.append('idEquipe', 2);
        // formData.append('idCliente', 2);

        let projeto = {
            tituloProjeto: nomeProjeto,
            descricao: descricaoProjeto,
            dataInicio: dataInicio,
            dataConclusao: dataFinal,
            idStatusProjeto: 1,
            idEquipe: 2,
            idCliente: 2
        }

        axios.post("http://labwatch-backend.azurewebsites.net/api/Projetos", projeto, {
            headers: { "Content-Type": "application/json" }
        })
            .then((resposta) => {
                if (resposta.status === 201) {
                    history('/ListaProjetos');
                    console.log("cadastrado")
                    setIsLoading(false);
                }
            })
            .catch(erro => {
                console.log(erro);
                setIsLoading(false);
            })

    }

    // function cadastrarEquipe() {
    //     let usuarios = {
    //         idUsuario: idUsuario
    //     }
    //     let equipe = {
    //         nomeEquipe: "novaEquipe",
    //         usuarios: usuarios
    //     }

    //     api.post("/Equipes", equipe, {
    //         headers: { "Content-Type": "application/json" }
    //     })
    // }

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

                            {/* <label className='boxCadastro__label'>
                            Client name
                            <input
                                className='projetoNome__input'
                                type='text'
                                name='nomeCliente'
                                autoComplete='off'
                                onChange={(e) => setNomeCliente(e.target.value)}
                                required />
                        </label> */}

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
                                        type='datetime-local'
                                        required
                                        onChange={(e) => setDataInicio(e.target.value)}
                                    />
                                </label>

                                <label className="boxCadastro__label">
                                    Final date
                                    <input
                                        className="projetoData__input"
                                        name='dataFinalProjeto'
                                        type='datetime-local'
                                        required
                                        onChange={(e) => setDataFinal(e.target.value)}
                                    />
                                </label>

                            </div>
                            {/* <label className="boxCadastro__label">
                            Imagem do cliente
                            <input
                                className="projetoArquivo__input"
                                name='arquivo'
                                id='arquivo'
                                type='file'
                                required
                                accept="image/png, image/jpeg"
                                onChange={(e) => setFotoCliente(e)}
                            />
                        </label> */}

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


