import { React, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from '@iconify/react';
import { parseJwt, parseIdProjeto, parseIdTask } from '../../../services/auth';

import Header from '../../../Components/header';
import SideBar from '../../../Components/sidebar';
import api from '../../../services/api';
import { motion } from "framer-motion"

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
    const [meuComentario, setMeuComentario] = useState('');


    async function listarMinhasTasks() {
        await api("/Tasks/Minhas/" + parseJwt().jti).then(resposta => {
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

    function buscarComentarios(idTask) {
        console.log(idTask)
        api('/Comentarios').then(resposta => {
            if (resposta.status === 200) {
                let myComent = resposta.data.filter((coment) => {
                    return (
                        coment.idTask == idTask
                    )
                })
                console.log(myComent)
                setComentarioTask(myComent)
            }
        })
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

        buscarComentarios(task.idTask)

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
        var modal = document.getElementById("myModal");

        e.preventDefault()
        let task = {
            idProjeto: parseInt(parseIdProjeto()),
            idTag: parseInt(idTag),
            idStatusTask: 3,
            idUsuario: parseInt(parseJwt().jti),
            tituloTask: tituloTask,
            descricao: descricaoTask,
            tempoTrabalho: tempoTrabalho,
        }

        console.log(task)
        api.post('/Tasks', task, {
            headers: { "Content-Type": "application/json" }
        }).then(modal.style.display = "none").then(() => listarMinhasTasks())
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

        let comentTask = {
            comentario1: meuComentario,
            idUsuario: parseJwt().jti,
            idTask: idTask
        }

        console.log(comentTask)

        api.post('/Comentarios', comentTask)
            .then(resposta => console.log(resposta.data))
            .then(() => buscarComentarios(idTask))
            .catch(erro => console.log(erro))
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
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
                            isLoading ? <button
                                className='boxCadastro__btnCriar btn btn_salvar1'
                                disabled>
                                Add task</button>
                                :
                                <button onClick={() => abrirModal()}
                                    className='boxCadastro__btnCriar btn btn_salvar1'
                                    type='submit'>Add Task</button>
                        }
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
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                >
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
                                                </motion.div>
                                            )
                                        }

                                        )
                                    )
                                    :
                                    //Lista das minhas tasks
                                    minhasTasks.map((task) => {
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
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
                                                </div>
                                            </motion.div>
                                        )
                                    })
                        }
                        {/* Modal Datails Task */}
                        <div id="ModalTask" className="modal">
                            <div className="modal-content1">
                                <div className="modal_container modal__task">
                                    <div>
                                        <div className='box__tituloTask'>
                                            <h2 className='tituloTask'>Task: {tituloTask}</h2>
                                        </div>
                                        <div className="box__DetailsTask">
                                            <h2 className='detailsTask'>Details: {tituloTag} </h2>

                                        </div>
                                        <div className='box__coment'>
                                            <h2 className='comentTask'>Comentários: </h2>
                                            <div className='section__coment'>
                                                {
                                                    comentariotask.map((comentario) => {
                                                        return (
                                                            <div className='box__comentario'>
                                                                <div key={comentario.idComentario} className='div__coment'>
                                                                    <div className='coment__infUser'>
                                                                        <span>{comentario.idUsuarioNavigation.nomeUsuario}</span>
                                                                        <img className="coment__imgUser" src={"http://labwatch-backend.azurewebsites.net/img/" + comentario.idUsuarioNavigation.fotoUsuario} />
                                                                    </div>
                                                                    <span>{comentario.comentario1}</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                        </div>
                                        <form onSubmit={(e) => cadastrarComentario(e)}>
                                            <label className='label_coment'>
                                                Comentario: 
                                                <input
                                                    className='input_add_coment'
                                                    type='text'
                                                    name='coment'
                                                    onChange={(e) => setMeuComentario(e.target.value)}
                                                    value={meuComentario}
                                                    placeholder='Escreva um comentário'
                                                />
                                            </label>

                                            <button className='btn__coment' >Escrever um comentário</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Modal ADD TASK */}
                        <div id="myModal" className="modal">
                            <div className="modal-content2">
                                <div className="modal_container modal__task">
                                    <div >
                                        <div className="div__Register">
                                            <h1 className='new_task'>Add new Task</h1>

                                        </div>

                                        <div>
                                            <h2>Title Task: </h2>
                                            <label>
                                                <input className='input_title' type="text"
                                                    id='title'
                                                    name='title'
                                                    autoComplete='off'
                                                    value={tituloTask}
                                                    onChange={(e) => setTituloTask(e.target.value)}
                                                    placeholder='Adicione o Titulo da Task' />

                                            </label>
                                        </div>

                                        <div className='box_input_tag'>
                                            <h2>Task tag: </h2>
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
                                            </div>
                                            <form onSubmit={(e) => cadastrarTag(e)} >
                                                <label>
                                                    <input
                                                        className='input_tag'
                                                        type="text"
                                                        name="tag"
                                                        id="tags"
                                                        value={tituloTag}
                                                        autoComplete='off'
                                                        onChange={(e) => setTituloTag(e.target.value)}
                                                        placeholder="Adicione uma Tag"
                                                    />
                                                </label>
                                            </form>
                                        </div>

                                        <div className='box_input_descricao'>
                                            <h2>Details: </h2>
                                            <label className='div__Register'>
                                                Add Description:
                                                <input
                                                    className='input_descricao'
                                                    type="search"
                                                    id='descriptions'
                                                    name='description'
                                                    autoComplete='off'
                                                    value={descricaoTask}
                                                    onChange={(e) => setDescricaoTask(e.target.value)}
                                                    placeholder="Descrição da task" />
                                            </label>
                                        </div>
                                        <div className='box_input_horas'>
                                            <label className='div__Register'>
                                                Add Hours:
                                                <input
                                                    className='input_horas'
                                                    type="number"
                                                    id='horas'
                                                    name='hora'
                                                    autoComplete='off'
                                                    value={tempoTrabalho}
                                                    onChange={(e) => setTempoTrabalho(e.target.value)}
                                                    placeholder="Horas de Trabalho" />
                                            </label>

                                        </div>
                                        <div className='box_btn_cadTask'>
                                            <button className='btn_cadTask' onClick={(e) => cadastrarTask(e)}>Cadastrar Task</button>
                                        </div>
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
        </motion.div>
    )
}