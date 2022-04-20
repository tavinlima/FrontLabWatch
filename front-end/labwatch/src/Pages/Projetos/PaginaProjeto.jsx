import { React, useState, useEffect } from 'react';

import '../../assets/css/overview.css'

// import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/header';
import SideBar from '../../Components/sidebar'

import { parseIdProjeto } from '../../services/auth.jsx'
import api from '../../services/api';

export default function PaginaProjeto() {
    const [listaProjetos, setListaProjetos] = useState([])
    const [Cliente, setCliente] = useState([])

    // Buscar projeto selecionado
    function BuscarProjeto() {
        // var idProjetoSelect = location.state.value;
        // var idProjeto = idProjetoSelect;
        api("/Projetos/").then(resposta => {
            if (resposta.status === 200) {
                resposta.data.map((projeto) => {
                    if (projeto.idProjeto == parseIdProjeto()) {
                        setListaProjetos(projeto)
                    }
                })
            }
        })
            .catch(erro => console.log(erro));
    }

    // function BuscarCliente() {
    //     api("/Clientes").then(resposta => {
    //         if (resposta.data.idCliente === listaProjetos.idCliente) {
    //             if (resposta.status === 200) {
    //                 console.log(resposta.data)
    //                 setCliente(resposta.data)
    //                 console.log(Cliente)
    //             }
    //         }
    //     })
    // }

    // useEffect(BuscarCliente, [])

    function BuscarEquipe() {
        api("/Equipes")
    }

    useEffect(BuscarProjeto, [])

    return (
        <div>
            <Header />
            <SideBar />
            <div className="box__listagemProjetos">
                <section className="section__listagemProjetos container">
                    <h1>Overview</h1>
                    {
                        // document.getElementById('dataConclusao').innerHTML = Intl.DateTimeFormat("pt-BR",
                        //     {
                        //         year: 'numeric', month: 'numeric', day: 'numeric'
                        //     }
                        // ).format(new Date(listaProjetos.dataConclusao))
                    }
                    <div className='section__infoBox'>
                        {/* <img
                            className="overview__imgEmpresa"
                            src={"http://labwatch-backend.azurewebsites.net/Images/" + listaProjetos.idClienteNavigation.fotoCliente}
                            alt="Imagem do cliente" /> */}

                        <div className='div__textBox'>
                            <h2 className='titulo__projeto'>{listaProjetos.tituloProjeto}</h2>

                            <div className='div__infBox'>
                                <h2 className='subtitulo_projeto'>Cliente: </h2>
                                <p>{listaProjetos.tituloProjeto}</p>
                            </div>

                            <div className='div__infBox'>
                                <h2 className='subtitulo_projeto'>Data de conclusão:</h2>
                                <p id='dataConclusao'>{listaProjetos.dataConclusao}</p>
                            </div>
                        </div>
                    </div>

                    <h2>Project description:</h2>

                    <textarea>{listaProjetos.descricao}</textarea>

                    <h2>Project team:</h2>

                    <button>Edit team</button>


                </section>
            </div>
        </div>
    );
}