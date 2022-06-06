import { React, useState, useEffect } from "react";
// import { parseJwt } from "../../services/auth";
import { motion } from "framer-motion"
import { ToastContainer, toast } from 'react-toastify';

import Header from '../../Components/header';
import SideBar from '../../Components/sidebar'
import { parseJwt } from "../../services/auth";
import api from "../../services/api";

import '../../assets/css/perfil.css'

//Tradução
import { useTranslation } from 'react-i18next';
import { changeLanguage } from 'i18next';

export default function PerfilUsuario() {
    const { t } = useTranslation();
    const [listaPerfil, setListaPerfil] = useState([]);
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState('');
    // const [minhasTasks, setMinhasTasks] = useState([]);

    const ok = () => toast.success("Alteração feita com sucesso!")

    function buscarPerfil() {
        api('/Usuarios/' + parseJwt().jti, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        })
            .then(resposta => {
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

    function alterarSenha() {
        api.patch('/Usuarios/AlterarSenha?idUsuario=' + parseJwt().jti + '&senha=' + senha, {
            idUsuario: parseJwt().jti,
            senha: senha
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(buscarPerfil()).then(ok)
            .catch(erro => console.log(erro))
    }

    function editarPerfil(event) {
        event.preventDefault();

        // var modal = document.getElementById("editPerfil");

        // modal.style.display = "block"

        var formData = new FormData();

        const target = document.getElementById('arquivo')
        const file = target.files[0]
        console.log(file)

        formData.append('arquivo', file, file.name);
        formData.append('idUsuario', parseInt(parseJwt().jti));
        formData.append('idTipoUsuario', parseInt(parseJwt().role));
        formData.append('idStatus', parseInt(listaPerfil.idStatus));
        formData.append('nomeUsuario', nomeUsuario);
        formData.append('sobreNome', sobrenome);
        formData.append('cargaHoraria', parseInt(listaPerfil.cargaHoraria));
        formData.append('horasTrabalhadas', parseInt(listaPerfil.horasTrabalhadas));
        formData.append('email', listaPerfil.email);
        formData.append('senha', listaPerfil.senha);
        formData.append('ativo', true);

        // api.patch('/Usuarios/AlterarSenha?idUsuario=' + parseJwt().jti + '&senha=' + senha, {
        //     idUsuario: parseJwt().jti,
        //     senha: senha
        // }, {
        //     headers: {
        //         Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
        //     }
        // }).then(buscarPerfil()).then(ok)
        //     .catch(erro => console.log(erro))

        api.put('/CadastroUsuario?id=' + parseJwt().jti, formData, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
                "Content-Type": "multipart/form-data"
            }
        }).then(() => buscarPerfil()).then(() => alterarSenha())
            // .then(modal.style.display = "none")
            .catch(erro => console.log(erro))
    }

    // useEffect(buscarTasks, []);
    useEffect(buscarPerfil, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            exit={{ opacity: 0 }}
        >
            <div>
                <Header />
                <SideBar />
                <div className="box__listagemProjetos">
                    <section className="section__listagemProjetos container">

                        <h1>{t("Profile")}</h1>
                        <div className='section__infoPerfil' id="foto">
                            <label className="label__imgUpload">
                                <input type='file' id='arquivo' className='imgUpload' onChange={(e) => editarPerfil(e)} />
                                <img
                                    className="perfil__imgPerfil"
                                    src={fotoPerfil}
                                    alt="Imagem do cliente" />
                                <div id="comentario">{t("Change Profile Photo")}</div>
                            </label>


                            <div className='div__textPerfil'>
                                <form onSubmit={(e) => editarPerfil(e)}>
                                    <label className='label__infoPerfil'>
                                        {t('Name')}
                                        <input
                                            className='input__editPerfil'
                                            type='text'
                                            value={nomeUsuario}
                                            name='nomeUsuario'
                                            autoComplete='off'
                                            onChange={(e) => setNomeUsuario(e.target.value)} />
                                    </label>

                                    <label className='label__infoPerfil'>
                                        {t('Last name')}
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
                                            placeholder="senha"
                                            value={email}
                                            name='email'
                                            autoComplete='off'
                                            onChange={(e) => setEmail(e.target.value)} />
                                    </label>

                                    <label className='label__infoPerfil'>
                                        Password
                                        <input
                                            className='input__editPerfil'
                                            type='password'
                                            value={'********'}
                                            name='senha'
                                            autoComplete='off'
                                            onChange={(e) => setSenha(e.target.value)} />
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
                                        onClick={(e) => editarPerfil(e)}>{t('Edit profile')}</button>

                                </form>

                            </div>
                        </div>

                    </section>
                </div>
            </div>
        </motion.div>
    )
}