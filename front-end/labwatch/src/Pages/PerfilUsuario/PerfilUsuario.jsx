import { React, useState, useEffect } from "react";
import axios from "axios";
// import { parseJwt } from "../../services/auth";

import Header from '../../Components/header';
import SideBar from '../../Components/sidebar'
import { parseJwt } from "../../services/auth";
import api from "../../services/api";

export default function PerfilUsuario() {
    const [listaPerfil, setListaPerfil] = useState([]);
    const [nomeUsuario, setNomeUsuario] = useState([]);
    const [sobrenome, setSobrenome] = useState([]);

    function buscarPerfil() {
        axios('http://labwatch-backend.azurewebsites.net/api/Usuarios/' + parseJwt().jti)
            .then(resposta => {
                console.log(resposta)
                if (resposta.status === 200) {
                    setListaPerfil(resposta.data)
                    setNomeUsuario(resposta.data.nomeUsuario)
                    setSobrenome(resposta.data.sobreNome)
                }
            }
            )
            .catch(erro => console.log(erro));
    }

    useEffect(buscarPerfil, []);

    function editarPerfil(event) {
        event.preventDefault();

        let usuario = {
            idUsuario: parseJwt().jti,
            nomeUsuario: nomeUsuario,
            sobreNome: sobrenome,
        }

        api.put('/Usuarios' + parseJwt().jti, usuario, {
            headers: { "Content-Type": "application/json" }
        }).then(resposta => {
            console.log(resposta)
        }).then(() => buscarPerfil())
            .catch(erro => console.log(erro))
    }

    return (
        <div>
            <Header />
            <SideBar />
            <div className="box__listagemProjetos">
                <section className="section__listagemProjetos container">

                        <h1>Profile</h1>
                    <div className='section__infoBox'>
                        <img
                            className="overview__imgEmpresa"
                            src={"http://labwatch-backend.azurewebsites.net/img/" + listaPerfil.fotoUsuario}
                            alt="Imagem do cliente" />

                        <div className='div__textBox'>
                            <h2>{listaPerfil.nomeUsuario}</h2>
                            <h2>{listaPerfil.sobreNome}</h2>
                            <h2>{listaPerfil.email}</h2>
                        </div>
                    </div>


                    <form onSubmit={(e) => editarPerfil(e)}>
                        <label className='boxCadastro__label'>
                            Name
                            <input
                                className='projetoNome__input'
                                type='text'
                                value={nomeUsuario}
                                name='nomeUsuario'
                                autoComplete='off'
                                onChange={(e) => setNomeUsuario(e.target.value)} />
                        </label>

                        <label className='boxCadastro__label'>
                            Surname
                            <input
                                className='projetoNome__input'
                                type='text'
                                value={sobrenome}
                                name='sobrenome'
                                autoComplete='off'
                                onChange={(e) => setSobrenome(e.target.value)} />
                        </label>
                        <button>Edit profile</button>
                    </form>


                </section>
            </div>
        </div>
    )
}