import { React, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from '@iconify/react';
import { parseJwt, parseIdProjeto, parseIdTask } from '../../../services/auth';

import Header from '../../../Components/header';
import SideBar from '../../../Components/sidebar';
import api from '../../../services/api';

import "../../../assets/css/minhasTasks.css";
import { Navigate } from 'react-router-dom';

export default function TaskTarefa() {
    const notify = () => toast.warning("Cuidado! Palavras inadequadas foram encontradas")
    const date = new Date().toLocaleDateString();

    const [searchInput, setSearchInput] = useState('');
    const [tituloTag, setTituloTag] = useState('');
    const [tempoTrabalho, setTempoTrabalho] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [minhasTasks, setMinhasTasks] = useState([]);
    const [tituloTask, setTituloTask] = useState([]);
    const [descricaoTask, setDescricaoTask] = useState([]);
    const [comentariotask, setComentarioTask] = useState([]);
    const [listaTag, setListaTag] = useState([]);
    const [erroMod, setErroMod] = useState('');
    const [idTag, setIdTag] = useState([]);
    const [idTask, setIdTask] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    async function listarMinhasTasks() {
        await api("/Tasks/Minhas/" + parseJwt().jti).then(resposta => {
            // console.log(resposta.data)
            if (resposta.status === 200) {
                console.log(resposta.data)
                let minhasTasks = resposta.data.filter((tasks) => {
                    return tasks.idProjeto == parseIdProjeto()
                })
                setMinhasTasks(minhasTasks);
                console.log(minhasTasks)
            }
        }).catch(erro => console.log(erro))
    }

    function selecionarTask(task) {
        api("/Tasks/" + task.idTask).then(resposta => {
            if (resposta.status === 200) {
                var valorTask = resposta.data.idTask;
                localStorage.setItem('idTaskSelect', valorTask)
            }
        })
            .catch(erro => console.log(erro));
    }


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

    function abrirModalTask(task) {

        var modal = document.getElementById("ModalTask")
        modal.style.display = "block";
        console.log(task);
        setIdTask(task.idTask)
        setTempoTrabalho(task.tempoTrabalho)
        setTituloTask(task.tituloTask)
        setIdTag(task.idTag)
        setTituloTag(task.idTag)
        setComentarioTask(task.comentariosTask)


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
            idStatusTask: 3,
            idUsuario: parseJwt().jti,
            tituloTask: tituloTask,
            descricao: descricaoTask,
            tempoTrabalho: tempoTrabalho,

        }
        api.post('/Tasks', task, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .catch(erro => console.log(erro))
    }
    
        
    //     )   
    //         .catch(erro =>{
    //             if(erro.toJSON().status === 400){
    //                 notify();
    //             }
    //         })
    //         console.log(task)
    // }
    function cadastrarComentario(e) {
        e.preventDefault()
        setComentarioTask('FUNCIONA')
        let comentTask = {
            comentario1: comentariotask,
            idUsuario: parseJwt().jti,
            idTask: parseIdTask
        }
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
    useEffect(listarMinhasTasks, [])

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
                            <h2>Date: {date}</h2>
                        </div>
                        <input
                            type="search"
                            id='taks'
                            name='task'
                            autoComplete='off'
                            list='tasks'
                            onChange={(e) => searchItems(e.target.value)}
                            placeholder="Find a task" />
                        <Icon className='iconify lupaTask' icon="cil:magnifying-glass" />
                    </div>

                    {
                        minhasTasks.length === 0 ?
                            <div className="box__semTasks">
                                <span>
                                    Não há nenhuma tarefa para ser feita hoje!
                                </span>
                            </div>

                            :

                            searchInput.length > 0 ?
                                (
                                    filteredResults.map((task) => {
                                        return (
                                            <div className="section__task" key={task.idTask}>
                                                <section className="box__task" key={task.idTask}>
                                                    <div className="containerBox">
                                                        <div className="box__infTask">
                                                            <span>
                                                                {task.idStatusTask === 1 ? <Icon className='checkTask' icon="ic:baseline-check-circle" />
                                                                    : <Icon className='alertTask' icon="akar-icons:circle-alert-fill" />
                                                                }
                                                            </span>
                                                            <button className="button_selectTask" onClick={() => abrirModalTask(task)}>
                                                                <h2>{task.tituloTask}</h2>
                                                            </button>

                                                            <div className='infoTask'>
                                                                <span>
                                                                    <span className='span_title'>Project Title: </span>
                                                                    <span className='titleTask'>{task.idProjetoNavigation.tituloProjeto}</span>
                                                                </span>
                                                                <span >
                                                                    <span className='span_description'>Description: </span>
                                                                    <span className='description'>{task.descricao}</span>
                                                                </span>
                                                            </div>
                                                            <div className='div__hours'>
                                                                <span >
                                                                    <span className='span_hours'>Worked Hours: </span>
                                                                    <span className='hours'>{task.tempoTrabalho}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                            </div>
                                        )
                                    }

                                    )
                                )
                                :
                                //Lista das minhas tasks
                                minhasTasks.map((task) => {
                                    return (
                                        <div>
                                            <div className="section__task" key={task.idTask}>
                                                <section className="box__task" key={task.idTask}>
                                                    <div className="containerBox">
                                                        <div className="box__infTask">
                                                            <span>
                                                                {task.idStatusTask === 1 ? <Icon className='checkTask' icon="ic:baseline-check-circle" />
                                                                    : <Icon className='alertTask' icon="akar-icons:circle-alert-fill" />
                                                                }
                                                            </span>
                                                            <button className="button_selectTask" onClick={() => abrirModalTask(task)}>
                                                                <h2>{task.tituloTask}</h2>
                                                            </button>

                                                            <div className='infoTask'>
                                                                <span>
                                                                    <span className='span_title'>Project Title: </span>
                                                                    <span className='titleTask'>{task.idProjetoNavigation.tituloProjeto}</span>
                                                                </span>
                                                                <span >
                                                                    <span className='span_description'>Description: </span>
                                                                    <span className='description'>{task.descricao}</span>
                                                                </span>
                                                            </div>
                                                            <div className='div__hours'>
                                                                <span >
                                                                    <span className='span_hours'>Worked Hours: </span>
                                                                    <span className='hours'>{task.tempoTrabalho}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                            </div>
                                            {
                                                isLoading ? <button
                                                    className='boxCadastro__btnCriar btn btn_salvar'
                                                    disabled>
                                                    Add task</button>
                                                    :
                                                    <button onClick={() => abrirModal()}
                                                        className='boxCadastro__btnCriar btn btn_salvar'
                                                        type='submit'>Add Task</button>
                                            }
                                        </div>
                                    )
                                })
                    }
                    {/* Modal Datails Task */}
                    <div id="ModalTask" className="modal">
                        <div className="modal-content">
                            <div className="modal_container modal__task">
                                <div>
                                    <div>
                                        <h1>Task: {tituloTask}</h1>
                                    </div>
                                    <div className="div__RegisterTask">
                                        <h2>Details: {tempoTrabalho} {}</h2>
                                        
                                    </div>
                                    <div>
                                        <h2>Comentários</h2>
                                        {
                                            minhasTasks.map(() => {
                                                return (
                                                    <button>aa</button>
                                                )
                                            })
                                        }
                                    </div>
                                    <button onClick={(e) => cadastrarComentario(e)}>Escrever um comentário</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Modal ADD TASK */}
                    <div id="myModal" className="modal">
                        <div className="modal-content">
                            <div className="modal_container modal__task">
                                <div >
                                    <div className="div__Register">
                                        <h2>Add new Task</h2>

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
                                    <div>
                                        <h2>Details</h2>
                                        <label className='div__Register'>
                                            Add Horas
                                            <input
                                                type="search"
                                                id='horas'
                                                name='hora'
                                                autoComplete='off'
                                                value={tempoTrabalho}
                                                onChange={(e) => setTempoTrabalho(e.target.value)}
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