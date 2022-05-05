import { useEffect, useState } from "react";
import axios from 'axios';
import { parseJwt } from '../../services/auth';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';
import { motion } from "framer-motion"

import Header from '../../Components/header';
import SideBar from '../../Components/sidebar'

import { Icon } from '@iconify/react';
import '../../assets/css/listaClientes.css';
import '../../assets/css/global.css'

export default function Cliente() {
    const [filteredResults, setFilteredResults] = useState([])
    const [searchInput, setSearchInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [listaClientes, setListaClientes] = useState([])
    // const [idCliente, setIdCliente] = useState([])
    const [nomeCliente, setNomeCliente] = useState('')
    const [descricao, setDescricao] = useState('')
    const [dataCadastro, setDataCadastro] = useState(new Date())
    const [fotoCliente, setFotoCliente] = useState('')

    const notify = () => toast.success("Cliente cadastrado com sucesso!")

    let navigate = useNavigate();

    ///FUNCAO DE BARRA DE PESQUISA
    const searchItems = (searchValue) => {
        setSearchInput(searchValue)
        if (searchInput !== '') {
            const filteredData = listaClientes.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
            })
            setFilteredResults(filteredData)
        }
        else {
            setFilteredResults(listaClientes)
        }
    }

    ///FUNCAO COM A API
    function listarClientes() {
        api("http://labwatch-backend.azurewebsites.net/api/Clientes")
            .then(resposta => {
                if (resposta.status === 200) {
                    console.log(resposta.data)
                    setListaClientes(resposta.data)
                }
            })
            .catch(erro => console.log(erro))
    }

    function cadastrarCliente(event) {
        event.preventDefault();
        setIsLoading(true);

        var formData = new FormData();

        const target = document.getElementById('arquivo')
        const file = target.files[0]
        console.log(file)

        formData.append('arquivo', file, file.name);
        // formData.append('idCliente', idCliente);
        formData.append('nomeCliente', nomeCliente);
        formData.append('descricao', descricao);
        formData.append('dataCadastro', dataCadastro);
        console.log(nomeCliente);
        console.log(descricao);
        console.log(dataCadastro);
        console.log(file.name);

        axios.post("http://labwatch-backend.azurewebsites.net/api/ClientesCadastrar", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then((resposta) => {
                if (resposta.status === 201) {
                    navigate('/Clientes');
                    console.log('cadastrado')
                    setIsLoading(false)
                }
            }).then(() => listarClientes().then(notify))
            .catch(erro => {
                console.log(erro);
                setIsLoading(false);
            })
    }

    useEffect(listarClientes, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Header />
            <section>
                <SideBar />
            </section>
            <div className="box__clientes">
                <section className="section__listagemClientes container">
                    <div className="div__tituloInput">
                        <h1>LabWatch Clients</h1>
                        <input
                            type='search'
                            id='clientes'
                            name="cliente"
                            autoComplete="off"
                            list="clientes"
                            onChange={(e) => searchItems(e.target.value)}
                            placeholder="Search Clients..." />
                        <Icon className='iconify lupa_cliente' icon="cil:magnifying-glass" />
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

                    {
                        listaClientes.length === 0 ?
                            <div className="box_semClientes">
                                <span>Não há Clientes Cadastrados</span>
                            </div>

                            :

                            searchInput.length > 0 ?
                                (
                                    filteredResults.map((cliente) => {
                                        return (
                                            <section className="section__cliente" key={cliente.idCliente}>
                                                <div className="box__cliente" key={cliente.idCliente}>
                                                    <div className="containerBox">
                                                        <div className="divisoria__imgCliente">
                                                            <img className="img_cliente" src={"http://labwatch-backend.azurewebsites.net/img/" + cliente.fotoCliente}
                                                                alt="Imagem do Cliente" />
                                                        </div>
                                                        <div className="box__infoCliente">
                                                            <h2>Client: {cliente.nomeCliente}</h2>

                                                            <div className="div__working">
                                                                <span>Working Since: {new Date(cliente.dataCadastro).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>

                                                        <div className="div__descricao">
                                                            <span>Descrição: {cliente.descricao}</span>
                                                        </div>

                                                    </div>
                                                </div>
                                            </section>
                                        )
                                    })
                                ) :
                                listaClientes.map((cliente) => {
                                    return (
                                        <section className="section__cliente" key={cliente.idCliente}>
                                                <div className="box__cliente" key={cliente.idCliente}>
                                                    <div className="containerBox">
                                                        <div className="divisoria__imgCliente">
                                                            <img className="img_cliente" src={"http://labwatch-backend.azurewebsites.net/img/" + cliente.fotoCliente}
                                                                alt="Imagem do Cliente" />
                                                        </div>
                                                        <div className="box__infoCliente">
                                                            <h2>Client: {cliente.nomeCliente}</h2>

                                                            <div className="div__working">
                                                                <span>Working Since: {new Date(cliente.dataCadastro).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>

                                                        <div className="div__descricao">
                                                            <span>Descrição: {cliente.descricao}</span>
                                                        </div>

                                                    </div>
                                                </div>
                                            </section>
                                    )
                                })
                    }
                </section>
                <section className="section__BoxCadastro">
                    <div className="box__cadastro">
                        <form className="form_cad" encType="multipart/form-data">
                            <label className="box__cadastroLabel continer">
                                Client Name:
                                <input
                                    className="input_clienteName"
                                    type="text"
                                    autoComplete="off"
                                    name="nomeCliente"
                                    onChange={(e) => setNomeCliente(e.target.value)}
                                    required
                                />
                            </label>
                            <label className="box__cadastroLabel">
                                Description:
                                <input
                                    className="input_description"
                                    type="text"
                                    autoComplete="off"
                                    name="descricao"
                                    onChange={(e) => setDescricao(e.target.value)}
                                    required />
                            </label>
                            <label className="box__cadastroLabel">
                                Client Image:
                            </label>
                            <label className="label_btn" for="arquivo">Selecionar Foto</label>
                            <input
                                className="input_file"
                                type="file"
                                name="arquivo"
                                id="arquivo"
                                required
                                accept="image/png, image/jpeg"
                                onChange={(e) => setFotoCliente(e)} />
                            <div className="div_btnCliente">
                                {
                                    isLoading === false ? (
                                        <button
                                            className='btn_cadCliente'
                                            type='submit'
                                            onClick={(e) => cadastrarCliente(e)}
                                        >
                                            Add Client
                                        </button>
                                    ) : (
                                        <button className='btn_cadastro_carregando'
                                            type="submit"

                                            disabled>Loading...</button>
                                    )
                                }
                            </div>
                        </form>
                    </div>
                </section>
            </div >
        </motion.div >
    )

}