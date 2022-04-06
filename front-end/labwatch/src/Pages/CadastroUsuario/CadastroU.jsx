import {  useState } from "react";
import axios from 'axios';
import '../../assets/css/cadastroU.css';
import '../../assets/css/global.css'
import logo from '../../assets/img/logowatchh.png'
import desenho from '../../assets/img/desenhoCadastro.png'

export default function Usuario(){
    const [idTipoUsuario, setIdTipoUsuario] = useState('');
    const [idStatus, setIdStatus] = useState('');
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [sobreNome, setSobreNome] = useState('');
    const [cargaHoraria, setCargaHoraria] = useState('');
    const [horasTrabalhadas, setHorasTrabalhadas] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [fotoUsuario, setFotoUsuario] = useState('');

    function Cadastar(evento){
        evento.preventDefault()

        console.log(nomeUsuario)
        console.log(sobreNome)
        console.log(email)
        console.log(senha)

        axios.post('http://labwatch-backend.azurewebsites.net/api/Usuarios',{
            idTipoUsuario: idTipoUsuario,
            idStatus: idStatus,
            nomeUsuario: nomeUsuario,
            sobreNome: sobreNome,
            cargaHoraria: cargaHoraria,
            horasTrabalhadas: horasTrabalhadas,
            email: email,
            senha: senha,
            fotoUsuario: fotoUsuario
        })
        .then(resposta=>{
            if (resposta.status === 201) {
                console.log('Usuario Cadastrado')
                setIdTipoUsuario('');
                setIdStatus('');
                setNomeUsuario('');
                setSobreNome('');
                setCargaHoraria('');
                setHorasTrabalhadas('');
                setEmail('');
                setSenha('');
                setFotoUsuario('');
            }
        })
        .catch(erro=> console.log(erro))
    }
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