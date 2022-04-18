import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/components.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faFileWaveform } from "@fortawesome/free-solid-svg-icons";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faTarp } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faBuildingUser } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { parseJwt, usuarioAutenticado } from '../services/auth';
{/* <script src="https://kit.fontawesome.com/e222487669.js" crossorigin="anonymous"></script> */ }

export default function SideBar() {
    let navigate = useNavigate();

    function realizarLogout() {
        localStorage.removeItem('usuario-login')
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

    return (
        <>
            <div className="sidebar">
                <ul>
                    <li><Link to="/ListaProjetos"><i><FontAwesomeIcon icon={faTarp} /></i>Back to Projects</Link></li>
                    <hr className="side_hr"></hr>
                    <li><Link to="/"><i> <FontAwesomeIcon icon={faChartLine} /></i>Overview</Link></li>
                    <li><Link to="/"><i> <FontAwesomeIcon icon={faListCheck} /></i>My Tasks</Link></li>
                    <li><Link to="/"><i> <FontAwesomeIcon icon={faFileWaveform} /></i>Activity</Link></li>
                    <li><Link to="/"><i><FontAwesomeIcon icon={faStar} /></i>Project</Link></li>
                    <li className="settings">
                        <Link onClick={BotaoDoMenu} to={'#'}><i><FontAwesomeIcon icon={faGear}></FontAwesomeIcon></i>More Settings<FontAwesomeIcon id="icon" className='seta' icon={faCaretDown}></FontAwesomeIcon></Link>
                            <ul id="links" className="settings">
                                <li className="sett_link"><Link to={'/Approve'}><i><FontAwesomeIcon icon={faUserCheck}></FontAwesomeIcon></i>Approve Users</Link></li>
                                <li className="sett_link"><Link to={'/Realocate'}><i><FontAwesomeIcon icon={faUsers}></FontAwesomeIcon></i>Realocate Users</Link></li>
                                <li className="sett_link"><Link to={'/List'}><i><FontAwesomeIcon icon={faBuildingUser}></FontAwesomeIcon></i>List of Clients</Link></li>
                            </ul>
                    </li>
                </ul>
                <ul>
                    <li className="li_logout" onClick={realizarLogout}><i><FontAwesomeIcon icon={faArrowRightFromBracket} /></i>Logout</li>
                </ul>
            </div>
        </>
    )
}


