import { React, useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
// import { parseJwt } from "../../services/auth";

import "../../assets/css/minhasTasks.css";
import "../../assets/css/global.css";

import Header from '../../Components/header';
import SideBar from '../../Components/sidebar'
import { parseJwt } from "../../services/auth";
import api from "../../services/api";
import { Icon } from '@iconify/react';


export default function Task() {
    const date = new Date().toLocaleString();

    const [searchInput, setSearchInput] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [minhasTasks, setMinhasTasks] = useState([]);


    //Função da barra de busca
    const searchItems = (searchValue) => {
        setSearchInput(searchValue)
        if (searchInput !== '') {
            if (parseJwt().role == 3) {
                const filteredData = minhasTasks.filter((item) => {
                    return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
                })
                setFilteredResults(filteredData)
            }
        } else {
            setFilteredResults(minhasTasks)
        }
    }

    return (
        <>
            <div>
                <Header />
                <section>
                    <SideBar />
                </section>
                <div className="box__listagemTasks">
                    <section className="section__listagemTasks container" >
                        <div className="div__tInput">
                            <h1>{date}</h1>
                            <input
                                type="search"
                                id='taks'
                                name='task'
                                autoComplete='off'
                                list='tasks'
                                onChange={(e) => searchItems(e.target.value)}
                                placeholder="Find a task" />
                            <Icon className='iconify lupa' icon="cil:magnifying-glass" />
                        </div>

                        <ToastContainer
                            position="top-center"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover />

                       
                    </section>
                </div>
            </div>
        </>
    )
}