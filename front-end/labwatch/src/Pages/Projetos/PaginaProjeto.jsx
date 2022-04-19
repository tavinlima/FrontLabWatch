import { React, useState, useEffect } from 'react';

import '../../assets/css/overview.css'

// import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/header';
import SideBar from '../../Components/sidebar'

import { parseIdProjeto } from '../../services/auth.jsx'
import api from '../../services/api';

export default function PaginaProjeto() {
    const [listaProjetos, setListaProjetos] = useState([])

    // const location = useLocation();
    // const navigate = useNavigate();


    // Listar todas os projetos na página
    function BuscarProjeto() {
        // var idProjetoSelect = location.state.value;
        // var idProjeto = idProjetoSelect;
        api("/Projetos/" + parseIdProjeto).then(resposta => {
            if (resposta.status === 200) {
                console.log(resposta.data)
                setListaProjetos(resposta.data)
                // var valorProjeto = resposta.data.idProjeto;
                // navigate('/ProjetoOverview', { state: { idProjeto: resposta.data.idProjeto, name: resposta.data.idProjeto, value: valorProjeto } })
            }
        })
            .catch(erro => console.log(erro));
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
                        <img
                            className="overview__imgEmpresa"
                            src={"http://labwatch-backend.azurewebsites.net/img/" + listaProjetos.fotoCliente}
                            alt="Imagem do cliente" />

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