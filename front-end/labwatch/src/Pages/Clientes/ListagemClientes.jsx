import { useEffect, useState } from "react";
import axios from 'axios';
import { parseJwt } from '../../services/auth';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../../Components/header';
import SideBar from '../../Components/sidebar'

import { Icon } from '@iconify/react';
import '../../assets/css/listaClientes.css';
import '../../assets/css/global.css'
import logo from '../../assets/img/logowatchh.png'

export default function Cliente() {
    const [filteredResults, setFilteredResults] = useState([])
    const [searchInput, setSearchInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [listaClientes, setListaClientes] = useState([])
    const [idCliente, setIdCliente] = useState([])
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
        axios("http://labwatch-backend.azurewebsites.net/api/Clientes")
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
        formData.append('idCliente', idCliente);
        formData.append('nomeCliente', nomeCliente);
        formData.append('descricao', descricao);
        formData.append('dataCadastro', dataCadastro);


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

    useEffect(listarClientes,[])

    return (
        <div>
            <Header />
            <section>
                <SideBar />
            </section>
            <div className="box__clientes">
                <section className="section__listagemClientes container">
                    <div className="div__tituloinput">
                        <h1>LabWatch Clients</h1>
                        <input
                            type='search'
                            id='clientes'
                            name="cliente"
                            autoComplete="off"
                            list="clientes"
                            onChange={(e) => searchItems(e.target.value)}
                            placeholder="Search Clients..." />
                        <Icon className="iconify lupa" icon="cil: magnifying-glass" />
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
                                            <div className="section__cliente" key={cliente.idCliente}>
                                                <section className="box__cliente" key={cliente.idCliente}>
                                                    <div className="containerBox">
                                                        <div className="divisoria__imgCliente">
                                                            <img src={"http://labwatch-backend.azurewebsites.net/StaticFiles/Images/" + cliente.fotoCliente}
                                                                alt="Imagem do Cliente" />
                                                        </div>
                                                        <div className="box__infoCliente">
                                                            <h2>{cliente.nomeCliente}</h2>

                                                            <div>
                                                                <span>Working Since: {cliente.dataCadastro}</span>
                                                            </div>

                                                            <div>
                                                                <span>Description:</span>
                                                                <span>{cliente.descricao}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                            </div>
                                        )
                                    })
                                ):
                                listaClientes.map((cliente)=>{
                                    return(
                                        <div className="section__cliente" key={cliente.idCliente}>
                                                <section className="box__cliente" key={cliente.idCliente}>
                                                    <div className="containerBox">
                                                        <div className="divisoria__imgCliente">
                                                            <img src={"http://labwatch-backend.azurewebsites.net/StaticFiles/Images/" + cliente.fotoCliente}
                                                                alt="Imagem do Cliente" />
                                                        </div>
                                                        <div className="box__infoCliente">
                                                            <h2>{cliente.nomeCliente}</h2>

                                                            <div>
                                                                <span>Working Since: {cliente.dataCadastro}</span>
                                                            </div>

                                                            <div>
                                                                <span>Description:</span>
                                                                <span>{cliente.descricao}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                            </div>
                                    )
                                })
                     }
                </section>
            </div>
        </div>
    )

}