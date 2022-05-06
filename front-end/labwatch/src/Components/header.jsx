import React from "react";
import { Link } from 'react-router-dom';
import logo from '../assets/img/logowatch.png'
import foto from '../assets/img/PerfilDefault.png'
import '../assets/css/components.css'
import '../assets/css/global.css'
import { parseJwt } from '../services/auth';

export default function Header() {
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
                        <img src={foto} alt='imagem de perfil padrão' className='header__imgPerfil' />
                        <span>{parseJwt().name}</span>
                    </Link>
                </div>
            </div>
        </header>
    )
}