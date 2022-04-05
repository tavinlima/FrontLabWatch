import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/components.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {faFileWaveform} from "@fortawesome/free-solid-svg-icons";
import {faListCheck} from "@fortawesome/free-solid-svg-icons";
import {faChartLine} from "@fortawesome/free-solid-svg-icons";
import {faTarp} from "@fortawesome/free-solid-svg-icons";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import { parseJwt, usuarioAutenticado } from '../services/auth';
<script src="https://kit.fontawesome.com/e222487669.js" crossorigin="anonymous"></script>

export default function SideBar(){
    let navigate = useNavigate();

    function realizarLogout(){
        localStorage.removeItem('usuario-login')
        navigate('/Login')
        
    }

    return(
    <>
    <div className="sidebar">
        <ul>
            <li><Link to="/ListaProjetos"><i><FontAwesomeIcon icon={faTarp} /></i>Back to Projects</Link></li>
            <hr className="side_hr"></hr>
            <li><Link to="/"><i> <FontAwesomeIcon icon={faChartLine} /></i>Overview</Link></li>
            <li><Link to="/"><i> <FontAwesomeIcon icon={faListCheck} /></i>My Tasks</Link></li>
            <li><Link to="/"><i> <FontAwesomeIcon icon={faFileWaveform} /></i>Activity</Link></li>
            <li><Link to="/"><i><FontAwesomeIcon icon={faStar} /></i>Project</Link></li>
        </ul>
        <ul>
            <li className="li_logout" onClick={realizarLogout}><i><FontAwesomeIcon icon={faArrowRightFromBracket}/></i>Logout</li>
        </ul>
    </div>
    </>
        )
}


