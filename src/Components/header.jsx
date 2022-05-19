import { React, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import logo from '../assets/img/logowatch.png'
import '../assets/css/components.css'
import '../assets/css/global.css'
import { parseJwt } from '../services/auth';
import api from "../services/api";

export default function Header() {
    const [fotoPerfil, setFotoPerfil] = useState([]);

    function buscarPerfil() {
        api('/Usuarios/' + parseJwt().jti)
            .then(resposta => {
                if (resposta.status === 200) {
                    // setListaPerfil(resposta.data)
                    setFotoPerfil("http://labwatch-backend.azurewebsites.net/img/" + resposta.data.fotoUsuario)
                }
            }
            )
            .catch(erro => console.log(erro));
    }

    useEffect(buscarPerfil, []);

    return (
        <header>
            <div className='header__conteudo container'>
                {/* <Link to='/ListaProjetos'><img src={logo} alt='Logo da Lab Watch' className='header__logo'></img> </Link> */}
                {
                    parseJwt().role === '1' ? <Link to='/ListaProjetosConsultor'><img src={logo} alt='Logo da Lab Watch' className='header__logo'></img> </Link> : ''
                }
                {
                    parseJwt().role === '2' ? <Link to='/ListaProjetosGestor'><img src={logo} alt='Logo da Lab Watch' className='header__logo'></img> </Link> : ''
                }
                {
                    parseJwt().role === '3' ? <Link to='/ListaProjetosOwner'><img src={logo} alt='Logo da Lab Watch' className='header__logo'></img> </Link> : ''
                }
                <div className='div__imgNomePerfil'>
                    <Link to='/PerfilUsuario'>
                        <img
                            src={fotoPerfil}
                            alt='imagem de perfil padrão'
                            className='header__imgPerfil' />
                        <span>{parseJwt().name}</span>
                    </Link>
                </div>
            </div>
        </header>
    )
}