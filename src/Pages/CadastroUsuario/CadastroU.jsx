import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/css/cadastroU.css';
import '../../assets/css/global.css'
import logo from '../../assets/img/logowatchh.png'
import desenho from '../../assets/img/desenhoCadastro.png'
import '../../assets/css/dark_mode.css';
import { motion } from "framer-motion"

import fotoPadrao from '../../assets/img/PerfilDefault.png'
import api from "../../services/api";

export default function Usuario() {
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [sobreNome, setSobreNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaConfirmacao, setSenhaConfirmacao] = useState('');

    let navigate = useNavigate();

    function Cadastar(evento) {
        evento.preventDefault()

        var formData = new FormData();

        // const target = document.getElementById('arquivo')
        // const file = target.files[0]
        console.log(nomeUsuario)
        console.log(sobreNome)
        console.log(email)
        console.log(senha)
        console.log(fotoPadrao)

        // formData.append('arquivo', file, file.name)
        formData.append('idTipoUsuario', 1)
        formData.append('idStatus', 1)
        formData.append('ativo', false)
        formData.append('nomeUsuario', nomeUsuario)
        formData.append('sobreNome', sobreNome)
        formData.append('fotoUsuario', fotoPadrao.name)
        // formData.append('fotoUsuario', fotoPadrao.split(',', 2)[1])
        // formData.append('cargaHoraria', cargaHoraria)
        // formData.append('horasTrabalhadas', horasTrabalhadas)
        formData.append('email', email)
        formData.append('senha', senha)
        formData.append('ativo', false)
        console.log(formData)

        api.post('/CadastroUsuario', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(resposta => {
                if (resposta.status === 201) {
                    console.log('Usuario Cadastrado')
                    navigate('/Login')
                }
            })
            .catch(erro => console.log(erro))
    }

    function lerCampos() {
        var temNum = /[0-9]/;
        var temMaius = /[A-Z]/;
        var temMinus = /[a-z]/;
        var emailCerto = /\S+@\S+.\S+/;
        var senha = document.getElementById("password").value
        var senhaConfirmacao = document.getElementById("passwordConfirmation").value
        var email = document.getElementById("email").value
    
        var feedback = document.getElementById("msgFeedback")
        console.log(senha)
    
        if (!emailCerto.exec(email)) {
            feedback.innerHTML = 'E-mail inválido!!!'
        } else {
            feedback.innerHTML = 'E-mail informado corretamente!'
        }
    
        if (senha !== senhaConfirmacao) {
            feedback.innerHTML = 'A senha informada deve ser a mesma na verificação.'
        } else if (senha.length < 8) {
            let qntdCampos = 8 - senha.length
            feedback.innerHTML = 'Campos insuficentes! Ainda faltam ' + qntdCampos + ' caracteres!'
        } else if (!temNum.exec(senha)) {
            feedback.innerHTML = 'A senha deve conter ao menos um número!'
        } else if (!temMaius.exec(senha)) {
            feedback.innerHTML = 'A senha deve conter ao menos uma letra maisucula!'
        } else if (!temMinus.exec(senha)) {
            feedback.innerHTML = 'A senha deve conter ao menos uma letra minuscula!'
        }
        else {
            feedback.innerHTML = 'Tudo certo!'
        }
    
        if (email === '' || senha === '' || senhaConfirmacao === '') {
            feedback.innerHTML = 'Erro!!! Alguns campos estão vazios'
        }
    }

    // useEffect(console.log(fotoPadrao.split(',', 2)[1]), [])
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <>
                <main className="main_login">
                    <div className="ContainerMain containerL">
                        <section className="box_cad">
                            <div className="box_tituloCad">
                                <span className="titulo-cad"> Register Now!</span>
                                <span className="subtitulo-cad"> Register New Users</span>
                            </div>
                            <form onSubmit={Cadastar} className="form-cad">
                                {/* <label for="color_mode" >

                                     <input type="radio" name="color_mode" id="normal_mode" value="normal" checked/>
                                    Normal
                                </label>
                                <label for="dark_mode">
                                    <input type="radio" name="color_mode" id="dark_mode" value="dark" />
                                    Dark
                                </label>  */}
                                <input className="input-cad"
                                    placeholder="First Name"
                                    value={nomeUsuario}
                                    onChange={(campo) => setNomeUsuario(campo.target.value)}
                                    name="nomeUsuario"
                                    type="text"
                                    id="nomeUsuario" />

                                <input className="input-cad"
                                    placeholder="Last Name"
                                    value={sobreNome}
                                    onChange={(campo) => setSobreNome(campo.target.value)}
                                    name="sobreNome"
                                    type="text"
                                    id="sobreNome" />

                                <input
                                    onClick={lerCampos}  
                                    className="input-cad"
                                    autoComplete="off"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(campo) => setEmail(campo.target.value)}
                                    name="email"
                                    type="email"
                                    id="email" />

                                <input
                                    onClick={lerCampos}  
                                    className="input-cad"
                                    autoComplete="off"
                                    placeholder="Password"
                                    defaultValue={senha}
                                    onChange={(campo) => setSenha(campo.target.value)}
                                    name="password" type="password"
                                    id="password" />

                                <input
                                    onClick={lerCampos} 
                                    className="input-cad"
                                    autoComplete="off"
                                    placeholder="Password Confirmation"
                                    defaultValue={senhaConfirmacao}
                                    onChange={(campo) => setSenhaConfirmacao(campo.target.value)}
                                    name="password" type="password"
                                    id="passwordConfirmation" />

                                <div className="botao-cad">
                                    <button type='submit' className="btn-cad" id="btn_cad">
                                        Register
                                    </button>
                                </div>
                            </form>
                        </section>
                        <section className="box_azulCad">
                            <div>
                                <img className="img_logo" src={logo} alt="Logo" />
                            </div>
                            <div className="box_desenhoCad">
                                <img className="img_desenhoCad" src={desenho} alt="desenho" />
                            </div>
                        </section>
                    </div>
                </main>
            </>
        </motion.div >
    )
}