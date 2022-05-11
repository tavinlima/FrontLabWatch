import { React, useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
// import { parseJwt } from "../../services/auth";
import { motion } from "framer-motion"

import Header from '../../Components/header';
import SideBar from '../../Components/sidebar'
import { parseJwt } from "../../services/auth";
import api from "../../services/api";

import '../../assets/css/perfil.css'

export default function PerfilUsuario() {
    const [listaPerfil, setListaPerfil] = useState([]);
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState('');
    const [minhasTasks, setMinhasTasks] = useState([]);

    //Tradução

    function buscarPerfil() {
        axios('http://labwatch-backend.azurewebsites.net/api/Usuarios/' + parseJwt().jti)
            .then(resposta => {
                console.log(resposta.data)
                if (resposta.status === 200) {
                    setListaPerfil(resposta.data)
                    setNomeUsuario(resposta.data.nomeUsuario)
                    setSobrenome(resposta.data.sobreNome)
                    setSobrenome(resposta.data.sobreNome)
                    setEmail(resposta.data.email)
                    setFotoPerfil("http://labwatch-backend.azurewebsites.net/img/" + resposta.data.fotoUsuario)
                }
            }
            )
            .catch(erro => console.log(erro));
    }

    function editarPerfil(event) {
        event.preventDefault();

        var modal = document.getElementById("editPerfil");

        modal.style.display = "block"

        var formData = new FormData();

        const target = document.getElementById('arquivo')
        const file = target.files[0]
        console.log(file)

        formData.append('idUsuario', parseJwt().jti);
        formData.append('idTipoUsuario', parseJwt().role);
        formData.append('idStatus', listaPerfil.idStatus);
        formData.append('nomeUsuario', nomeUsuario);
        formData.append('sobreNome', sobrenome);
        formData.append('cargaHoraria', listaPerfil.cargaHoraria);
        formData.append('horasTrabalhadas', listaPerfil.horasTrabalhadas);
        formData.append('email', listaPerfil.email);
        formData.append('senha', listaPerfil.senha);
        formData.append('arquivo', file, file.name);
        formData.append('ativo', true);

        console.log(parseJwt().jti)
        console.log(parseJwt().role)
        console.log(listaPerfil.idStatus)
        console.log(nomeUsuario)
        console.log(sobrenome)
        console.log(listaPerfil.cargaHoraria)
        console.log(listaPerfil.horasTrabalhadas)
        console.log(listaPerfil.email)
        console.log(listaPerfil.senha)


        api.put('/CadastroUsuario?id=' + parseJwt().jti, formData, {
            headers: { 
                "Content-Type": "multipart/form-data" }
        }).then(resposta => {
            console.log(resposta)
        }).then(() => buscarPerfil()).then(modal.style.display == "none")
            .catch(erro => console.log(erro))
    }

    function abrirModal() {
        var modal = document.getElementById("editPerfil");

        modal.style.display = "block";

        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }

    function buscarTasks() {
        api('/Tasks/Minhas/' + parseJwt().jti)
            .then(resposta => {
                console.log(resposta.data)
                setMinhasTasks(resposta.data)
            })
    }

    useEffect(buscarTasks, []);
    useEffect(buscarPerfil, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div>
                <Header />
                <SideBar />
                <div className="box__listagemProjetos">
                    <section className="section__listagemProjetos container">

                        <h1>Profile</h1>
                        <div className='section__infoPerfil'>
                            <img
                                className="perfil__imgPerfil"
                                src={fotoPerfil}
                                alt="Imagem do cliente" />

                            <div className='div__textPerfil'>
                                <h2 className='textPerfil__nomeUsuario'> {listaPerfil.nomeUsuario} {listaPerfil.sobreNome}</h2>
                                <h2 className='textPerfil__emailUsuario'> {listaPerfil.email}</h2>
                            </div>
                        </div>

                        <button className='button__editProfile' onClick={() => abrirModal()}>Edit profile</button>

                        <div id='editPerfil' className='modal'>
                            <div className="modal__addTask">
                                <div className="modal_container ">
                                    <div className='modal__content'>
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

                                            <label className='boxCadastro__label'>
                                                E-mail
                                                <input
                                                    className='projetoNome__input'
                                                    type='text'
                                                    value={email}
                                                    name='email'
                                                    autoComplete='off'
                                                    onChange={(e) => setEmail(e.target.value)} />
                                            </label>

                                            <label className='boxCadastro__label'>
                                                Foto de perfil
                                                <input
                                                    className='projetoNome__input'
                                                    type='file'
                                                    id='arquivo'
                                                    accept="image/png, image/jpeg"
                                                    name='fotoPerfil'
                                                    onChange={(e) => setFotoPerfil(e)} />
                                            </label>

                                            <button className='button__editProfile'
                                                onClick={(e) => editarPerfil(e)}>Editar perfil</button>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <section>
                            <h2>Events</h2>
                            {
                                minhasTasks.map((tasks) => {
                                    return (
                                        <ul key={tasks.idTask}>
                                            <li>{tasks.tituloTask}</li>
                                        </ul>
                                    )
                                })
                            }
                        </section>
                    </section>
                </div>
            </div>
        </motion.div>
    )
}