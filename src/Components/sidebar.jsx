import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/components.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faStar } from "@fortawesome/free-solid-svg-icons";
import { faFileWaveform } from "@fortawesome/free-solid-svg-icons";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { faTarp } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faBuildingUser } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { parseIdProjeto, parseJwt } from '../services/auth';

import { useTranslation } from 'react-i18next';
import { changeLanguage } from 'i18next';

export default function SideBar() {
    let navigate = useNavigate();
    const { t } = useTranslation();


    function realizarLogout() {
        localStorage.removeItem('usuario-login')
        localStorage.removeItem('idProjetoSelect')
        localStorage.removeItem('idEquipe')
        navigate('/Login')

    }

    function BotaoDoMenu() {
        var links = document.getElementById("links")
        if (links.style.display === "none") {
            links.style.display = "inline";
        } else {
            links.style.display = "none";
        }
    }

    function AbrirFecharMenu() {
        var itens = document.getElementById("itensMenu")
        var itensbaixo = document.getElementById("itensMenuBaixo")
        var sidebar = document.getElementById("sidebar")
        if (window.innerWidth <= 763) {
            if (itens.style.display === "none") {
                itens.style.display = "inline";
                itensbaixo.style.display = "inline";
                sidebar.style.width = "50%";
            }
            else {
                itens.style.display = "none";
                itensbaixo.style.display = "none";
                sidebar.style.width = "9%";
            }
        }
    }

    return (
        <>
            <div className="sidebar" id='sidebar'>
                <a onClick={() => AbrirFecharMenu()}>
                    <i><FontAwesomeIcon icon={faBars} /></i>
                </a>

                <ul id="itensMenu">
                    {parseJwt().role === '1' ? <li><Link to="/ListaProjetosConsultor"><i><FontAwesomeIcon icon={faTarp} /></i>{t('sidebarItem1')}</Link></li> : ''}
                    {parseJwt().role === '2' ? <li><Link to="/ListaProjetosGestor"><i><FontAwesomeIcon icon={faTarp} /></i>{t('sidebarItem1')}</Link></li> : ''}
                    {parseJwt().role === '3' ? <li><Link to="/ListaProjetosOwner"><i><FontAwesomeIcon icon={faTarp} /></i>{t('sidebarItem1')}</Link></li> : ''}
                    <hr className="side_hr"></hr>

                    {
                        parseJwt().role === '2' || parseJwt().role === '3' ? <li><Link to="/DashBoard"><i> <FontAwesomeIcon icon={faFileWaveform} /></i>{t('sidebarItem3')}</Link></li> : ''
                    }
                    {
                        parseIdProjeto() != null ? <li><Link to="/ProjetoOverview"><i><FontAwesomeIcon icon={faStar} /></i>{t('sidebarItem4')}</Link></li> : ''
                    }
                    {parseJwt().role === '3' ? <li className="settings">
                        <Link id="more" onClick={BotaoDoMenu} to={'#'}><i><FontAwesomeIcon id="icon" icon={faSliders}></FontAwesomeIcon></i>{t('sidebarItem5')}<FontAwesomeIcon id="icon" className='seta' icon={faCaretDown}></FontAwesomeIcon></Link>
                        <ul id="links" className="settings" style={{ display: "none" }}>
                            <li className="sett_link"><Link to={'/Usuarios'}><i><FontAwesomeIcon icon={faUserCheck}></FontAwesomeIcon></i>{t('sidebarItem6')}</Link></li>
                            <li className="sett_link"><Link to={'/MudarUsuario'}><i><FontAwesomeIcon icon={faUsers}></FontAwesomeIcon></i>List of Users</Link></li>
                            <li className="sett_link"><Link to={'/Clientes'}><i><FontAwesomeIcon icon={faBuildingUser}></FontAwesomeIcon></i>{t('sidebarItem8')}</Link></li>
                        </ul>
                    </li> : ''}
                </ul>
                <ul className="side_baixo" id="itensMenuBaixo">
                    <li><Link to={'/Settings'}><i><FontAwesomeIcon icon={faGear}></FontAwesomeIcon></i>{t('sidebarItem9')}</Link></li>
                    <li className="li_logout" onClick={realizarLogout}><i><FontAwesomeIcon icon={faArrowRightFromBracket} /></i>{t('sidebarItem10')}</li>
                </ul>
            </div>
        </>
    )
}