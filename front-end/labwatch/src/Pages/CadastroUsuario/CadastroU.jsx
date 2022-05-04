import {  useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../../assets/css/cadastroU.css';
import '../../assets/css/global.css'
import logo from '../../assets/img/logowatchh.png'
import desenho from '../../assets/img/desenhoCadastro.png'
import '../../assets/css/dark_mode.css';

import fotoPadrao from '../../assets/img/PerfilDefault.png'
import { useEffect } from "react";

export default function Usuario(){
    const [idTipoUsuario, setIdTipoUsuario] = useState('');
    const [idStatus, setIdStatus] = useState('');
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [sobreNome, setSobreNome] = useState('');
    const [cargaHoraria, setCargaHoraria] = useState('');
    const [horasTrabalhadas, setHorasTrabalhadas] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [ativo, setAtivo] = useState(false);
    const [fotoUsuario, setFotoUsuario] = useState('');

    let navigate = useNavigate();

    let form = document.querySelector('.color_mode');

    form.addEventListener('change', (e) => {
        let mode = e.target.value;

        if(mode === 'dark'){
            document.documentElement.classList.toggle('dark_mode');

        }else{
            document.documentElement.classList.toggle('dark_mode');

        }
    })

    function Cadastar(evento){
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

        axios.post('http://labwatch-backend.azurewebsites.net/api/CadastroUsuario', formData,{
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(resposta=>{
            if (resposta.status === 201) {
                console.log('Usuario Cadastrado')
                navigate('/Login')
            }
        })
        .catch(erro=> console.log(erro))
    }

    // useEffect(console.log(fotoPadrao.split(',', 2)[1]), [])
    return(
        <>
        <main className="main_login">
                    <div className="ContainerMain containerL">
                        <section className="box_cad">
                            <div className="box_tituloCad">
                                <span className="titulo-cad"> Register Now!</span>
                                <span className="subtitulo-cad"> Register New Users</span>
                            </div>
                            <form onSubmit={Cadastar} className="form-cad">
                                <label for="color_mode" >

                                    <input type="radio" name="color_mode" id="normal_mode" value="normal" checked/>
                                    Normal
                                </label>
                                <label for="dark_mode">
                                    <input type="radio" name="color_mode" id="dark_mode" value="dark" />
                                    Dark
                                </label>
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

                                <input className="input-cad" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(campo) => setEmail(campo.target.value)} 
                                name="email" 
                                type="email" 
                                id="email" />

                                <input className="input-cad" 
                                placeholder="Password" 
                                defaultValue={senha} 
                                onChange={(campo) => setSenha(campo.target.value)} 
                                name="password" type="password" 
                                id="password" />
                               
                                <div className="botao-cad">
                                    <button type='submit' className="btn-cad" id="btn_cad">
                                        Register
                                    </button>
                                </div>
                            </form>
                        </section>
                        <section className="box_azulCad">
                            <div>
                                <img className="img_logo" src= {logo} alt="Logo" />
                            </div>
                            <div className="box_desenhoCad">
                                <img className="img_desenhoCad" src = {desenho} alt="desenho"/>
                            </div>
                        </section>
                    </div>
                </main>
        </>
    )
}