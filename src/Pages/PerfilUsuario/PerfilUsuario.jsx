import { React, useState, useEffect } from "react";
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
    // const [minhasTasks, setMinhasTasks] = useState([]);

    //Tradução

    function buscarPerfil() {
        api('/Usuarios/' + parseJwt().jti)
            .then(resposta => {
                console.log(resposta.data)
                if (resposta.status === 200) {
                    setListaPerfil(resposta.data)
                    setNomeUsuario(resposta.data.nomeUsuario)
                    setSobrenome(resposta.data.sobreNome)
                    setSobrenome(resposta.data.sobreNome)
                    setEmail(resposta.data.email)
                    setFotoPerfil("https://labwatch-backend.azurewebsites.net/img/" + resposta.data.fotoUsuario)
                }
            }
            )
            .catch(erro => console.log(erro));
    }

    function editarPerfil(event) {
        event.preventDefault();

        // var modal = document.getElementById("editPerfil");

        // modal.style.display = "block"

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
                "Content-Type": "multipart/form-data"
            }
        }).then(resposta => {
            console.log(resposta)
        }).then(() => buscarPerfil())
        // .then(modal.style.display = "none")
            .catch(erro => console.log(erro))
    }

    // function abrirModal() {
    //     var modal = document.getElementById("editPerfil");

    //     modal.style.display = "block";

    //     window.onclick = function (event) {
    //         if (event.target === modal) {
    //             modal.style.display = "none";
    //         }
    //     }
    // }

    // function buscarTasks() {
    //     api('/Tasks/Minhas/' + parseJwt().jti)
    //         .then(resposta => {
    //             console.log(resposta.data)
    //             setMinhasTasks(resposta.data)
    //         })
    // }

    // useEffect(buscarTasks, []);
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
                            <label className="label__imgUpload">
                                <input type='file' id='arquivo' className='imgUpload' onChange={(e) => editarPerfil(e)}/>
                                <img
                                    className="perfil__imgPerfil"
                                    src={fotoPerfil}
                                    alt="Imagem do cliente" />
                            </label>


                            <div className='div__textPerfil'>
                            <form onSubmit={(e) => editarPerfil(e)}>
                                            <label className='label__infoPerfil'>
                                                Name
                                                <input
                                                    className='input__editPerfil'
                                                    type='text'
                                                    value={nomeUsuario}
                                                    name='nomeUsuario'
                                                    autoComplete='off'
                                                    onChange={(e) => setNomeUsuario(e.target.value)} />
                                            </label>

                                            <label className='label__infoPerfil'>
                                                Last name
                                                <input
                                                    className='input__editPerfil'
                                                    type='text'
                                                    value={sobrenome}
                                                    name='sobrenome'
                                                    autoComplete='off'
                                                    onChange={(e) => setSobrenome(e.target.value)} />
                                            </label>

                                            <label className='label__infoPerfil'>
                                                E-mail
                                                <input
                                                    className='input__editPerfil'
                                                    type='text'
                                                    value={email}
                                                    name='email'
                                                    autoComplete='off'
                                                    onChange={(e) => setEmail(e.target.value)} />
                                            </label>

                                            {/* <label className='label__infoPerfil'>
                                                Foto de perfil
                                                <input
                                                    className='input__editPerfil'
                                                    type='file'
                                                    id='arquivo'
                                                    accept="image/png, image/jpeg"
                                                    name='fotoPerfil'
                                                    onChange={(e) => setFotoPerfil(e)} />
                                            </label> */}

                                            <button className='button__editProfileModal'
                                                onClick={(e) => editarPerfil(e)}>Editar perfil</button>

                                        </form>
                                {/* <h2 className='textPerfil__nomeUsuario'> {listaPerfil.nomeUsuario} {listaPerfil.sobreNome}</h2>
                                <h2 className='textPerfil__emailUsuario'> {listaPerfil.email}</h2> */}
                            </div>
                        </div>

                        {/* <button className='button__editProfile' onClick={() => abrirModal()}>Edit profile</button> */}

                                        


                        {/* <section>
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
                        </section> */}
                    </section>
                </div>
            </div>
        </motion.div>
    )
}