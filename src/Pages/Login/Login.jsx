import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { parseJwt } from "../../services/auth";
import '../../assets/css/login.css';
import '../../assets/css/global.css';
import logo from '../../assets/img/logowatchh.png'
import desenho from '../../assets/img/desenho.png'

import Loading from '../../Components/loading'

//Imports i18 (Tradução)
import { useTranslation } from 'react-i18next';

import { Icon } from '@iconify/react';
import api from "../../services/api";


export default function Login() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [erroMensagem, setErroMensagem] = useState('');
    const [usuarioInvalido, setUsuarioInvalido] = useState('');

    let navigate = useNavigate();

    const [carregando, setCarregando] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setCarregando(true);
        }, 2500);
    })

    function efetuarLogin(event) {

        event.preventDefault();

        setErroMensagem('')
        setIsLoading(true)
        api.post("/Login", {
            email: email,
            senha: senha
        })
            .then((resposta) => {
                if (resposta.status === 200) {
                    console.log(resposta)
                    localStorage.setItem('usuario-login', resposta.data.tokenGerado)

                    setSenha('')

                    setEmail('')

                    setIsLoading(false)

                    if (parseJwt().role === '1') {
                        navigate('/ListaProjetosConsultor');
                    }

                    else if (parseJwt().role === '2') {
                        navigate('/ListaProjetosGestor');
                    }

                    else if (parseJwt().role === '3') {
                        navigate('/ListaProjetosOwner');
                    }

                    else {
                        navigate('/Login');
                    }
                }
            })
            .catch(erro => {
                console.log(erro);
                setIsLoading(false)
                if (erro.toJSON().status === 400) {
                    setUsuarioInvalido(`Ops! Parece que você não foi aprovado para entrar na aplicação!!! 
                    Consulte seu gestor para mais informações!`)
                    mostrarAviso()
                    setIsLoading(false)
                } else if (erro.toJSON().status === 404) {
                    setIsLoading(false)
                    setErroMensagem("E-mail e/ou Senha inválidos")
                }
            });
    }

    function mostrarAviso() {
        var modal = document.getElementById("avisoModal");

        modal.style.display = "block";

        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }

    function show() {
        var senha = document.getElementById("senha");
        if (senha.type === "password") {
            senha.type = "text";
        } else {
            senha.type = "password";
        }
    }

    return (
        <>
         {carregando == false ?
                <Loading /> : ''}
            <main className="main_login">
                <div className="ContainerMain">
                    <section className="box_login">
                        <div className="box_titulo">
                            <span className="titulo-login"> {t('welcome')}</span>
                            <span className="subtitulo-login"> {t('subtitle')}</span>
                        </div>
                        <form onSubmit={efetuarLogin} className="form-login">
                            <input className="input-login"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                                type="email"
                                id="login_email" />

                            <input className="input-login"
                                placeholder="Password" required
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                name="senha"
                                type="password"
                                id="senha" />
                                <p className="erro_login">{erroMensagem}</p>
                            <button type='button' className="botao_olho" onClick={show}>
                                <Icon className="iconify olho" icon="akar-icons:eye-open" />



                            </button>
                            <div className="box_recovery">
                                <Link to="/CadastroUsuario" className="link_recovery ">Register</Link>
                            </div>
                            <div className="botao-login">
                                {

                                    isLoading === false ? (
                                        <button type='submit' className="btn-login" id="btn_login">
                                            Login
                                        </button>
                                    ) : (
                                        <button
                                            className="btn_carregando"
                                            type="submit"
                                            disabled>Carregando...</button>
                                    )
                                }
                            </div>
                        </form>

                        <div id='avisoModal' className='modalAviso'>
                            <div className="modalAviso-content">
                                <div className="modal_container ">
                                    <div className='modalAviso__text'>
                                        <p>{usuarioInvalido}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="box_azul">
                        <div>
                            <img className="img_logo" src={logo} alt="Logo" />
                        </div>
                        <div className="box_desenho">
                            <img className="img_desenho" src={desenho} alt="desenho" />
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}