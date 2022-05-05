import { React, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from '@iconify/react';
import { parseJwt, parseIdProjeto } from '../../../services/auth';

import Header from '../../../Components/header';
import SideBar from '../../../Components/sidebar';
import api from '../../../services/api';

import "../../../assets/css/minhasTasks.css";

export default function TaskTarefa() {
    const date = new Date().toLocaleDateString();

    const [searchInput, setSearchInput] = useState('');
    const [tituloTag, setTituloTag] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [minhasTasks, setMinhasTasks] = useState([]);
    const [tituloTask, setTituloTask] = useState([]);
    const [descricaoTask, setDescricaoTask] = useState([]);
    const [listaTag, setListaTag] = useState([]);
    const [idTag, setIdTag] = useState([]);


    //Função da barra de busca
    const searchItems = (searchValue) => {
        setSearchInput(searchValue)
        if (searchInput !== '') {
            const filteredData = minhasTasks.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
            })
            setFilteredResults(filteredData)
        } else {
            setFilteredResults(minhasTasks)
        }
    }

    function abrirModal() {
        var modal = document.getElementById("myModal");

        modal.style.display = "block";

        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }

    function listarTags() {
        api('/Tags').then(resposta => {
            if (resposta.status === 200) {
                setListaTag(resposta.data)
            }
        })
    }

    function cadastrarTask(e) {
        e.preventDefault()
        let task = {
            idProjeto: parseIdProjeto(),
            idTag: idTag,
            idUsuario: parseJwt().jti,
            tituloTask: tituloTask,
            descricao: descricaoTask,
            idStatusTask: 1
        }
        console.log(task)
        api.post('/Tasks', task
        // {
        //     headers: { "Content-Type": "multipart/form-data" }
        // }
        )
            .catch(erro => console.log(erro))
    }

    function listarTasks() {
        api('/Tasks').then(resposta => console.log(resposta.data))
    }

    function cadastrarTag(e) {
        e.preventDefault()
        api.post('/Tags', {
            tituloTag: tituloTag
        }).then(resposta => {
            console.log(resposta)
        }).then(() => listarTags())
            .catch(erro => console.log(erro))

    }

    useEffect(listarTags, [])
    useEffect(listarTasks, [])

    return (
        <div>
            <Header />
            <section>
                <SideBar />
            </section>
            <div className="box__listagemProjetos">
                <section className="section__listagemProjetos container" >
                    <div className="div__tInput">
                        <div className='div__titlesTasks'>
                            <h1>Active Tasks</h1>
                            <h2>{date}</h2>
                        </div>
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

                    <button onClick={() => abrirModal()}>Add Task</button>
                    <div id="myModal" className="modal">
                        <div className="modal__addTask">
                            <div className="modal_container ">
                                <div className='modal__conteudo'>

                                    <div className="div__Register">
                                        <h2>Add new Task</h2>

                                        <label className=''>
                                            Title
                                            <input
                                                type="search"
                                                id='usuarios'
                                                name='usuario'
                                                autoComplete='off'
                                                list='usuarios'
                                                autoFocus='on'
                                                value={tituloTask}
                                                onChange={(e) => setTituloTask(e.target.value)}
                                                placeholder="Título da task" />
                                        </label>
                                    </div>

                                    <div>
                                        <h2>Task tag</h2>
                                        <div className='div__tags'>
                                            {
                                                listaTag.map((tag) => {
                                                    return (
                                                        <div key={tag.idTag}>
                                                            <button type='' onClick={() => setIdTag(tag.idTag)}>{tag.tituloTag}</button>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <form onSubmit={(e) => cadastrarTag(e)} >
                                                <label>
                                                    <input
                                                        type="text"
                                                        name="tag"
                                                        id="tags"
                                                        value={tituloTag}
                                                        autoComplete='off'
                                                        onChange={(e) => setTituloTag(e.target.value)}
                                                        placeholder="Tag"
                                                    />
                                                </label>
                                            </form>
                                        </div>
                                    </div>

                                    <div>
                                        <h2>Details</h2>
                                        <label className='div__Register'>
                                            Add description
                                            <input
                                                type="search"
                                                id='descriptions'
                                                name='description'
                                                autoComplete='off'
                                                value={descricaoTask}
                                                onChange={(e) => setDescricaoTask(e.target.value)}
                                                placeholder="Descrição da task" />
                                        </label>
                                    </div>
                                    <button onClick={(e) => cadastrarTask(e)}>Cadastrar Task</button>
                                </div>

                            </div>
                        </div>
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
    )
}