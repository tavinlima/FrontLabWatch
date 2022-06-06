import { React, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { parseJwt, parseIdProjeto, parseIdEquipe } from '../../../services/auth';

import Header from '../../../Components/header';
import SideBar from '../../../Components/sidebar';
import api from '../../../services/api';
import { motion } from "framer-motion"

import "../../../assets/css/minhasTasks.css";

//Tradução
import { useTranslation } from 'react-i18next';
import { changeLanguage } from 'i18next';

export default function TaskTarefa() {
    const { t } = useTranslation();
    const date = new Date().toLocaleDateString();
    const [tituloTag, setTituloTag] = useState('');
    const [tempoTrabalho, setTempoTrabalho] = useState('');
    const [minhasTasks, setMinhasTasks] = useState([]);
    const [tituloTask, setTituloTask] = useState([]);
    const [descricaoTask, setDescricaoTask] = useState([]);
    const [descricao, setDescricao] = useState('');
    const [comentariotask, setComentarioTask] = useState([]);
    const [listaTag, setListaTag] = useState([]);
    const [listaPendentes, setListaPendentes] = useState([]);
    const [listaFazendo, setListaFazendo] = useState([]);
    const [listaConcluido, setListaConcluido] = useState([]);
    const [horasTrabalhadas, setHorasTrabalhadas] = useState(0);
    // const [erroMod, setErroMod] = useState('');
    const [idTag, setIdTag] = useState([]);
    const [statusDaTask, setStatusDaTask] = useState([]);
    const [idTask, setIdTask] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [meuComentario, setMeuComentario] = useState('');
    const [equipe, setEquipe] = useState([]);
    const [idResp, setIdResp] = useState([]);
    const [idUsuario, setIdUsuario] = useState([]);
    
    const notify = () => toast.success("Horas confirmadas!")
    
    function listarMinhasTasks() {
        api("/Tasks/Minhas/" + parseJwt().jti, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
            if (resposta.status === 200) {
                console.log(resposta.data)
                let minhasTasks = resposta.data.filter((tasks) => {
                    return tasks.idProjeto == parseIdProjeto()
                })
                setMinhasTasks(minhasTasks);
            }
        }).catch(erro => console.log(erro))
    }

    function listarTodasTasks() {
        api('/Tasks', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
            if (resposta.status === 200) {
                console.log(resposta.data)

                let taskCerta = resposta.data.filter((tasks) => {
                    return tasks.idProjeto === parseInt(parseIdProjeto())
                })

                let taskPendente = taskCerta.filter((task) => {
                    return task.idStatusTask === 3
                })

                let taskConcluidas = taskCerta.filter((task) => {
                    return task.idStatusTask === 1
                })

                let taskAndamento = taskCerta.filter((task) => {
                    return task.idStatusTask === 2
                })

                console.log(taskPendente)
                setListaPendentes(taskPendente)
                setListaFazendo(taskAndamento)
                setListaConcluido(taskConcluidas)

            }
        })
    }

    function buscarComentarios(idTask) {
        console.log(idTask)
        api('/Comentarios', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
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
        setDescricao(task.descricao)
        setDescricaoTask(task.descricaoTask)
        setStatusDaTask(task.idStatusTask)
        setIdTag(task.idTag)
        setTituloTag(task.idTagNavigation.tituloTag)

        buscarComentarios(task.idTask)

        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }

    function listarTags() {
        api('/Tags', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
            if (resposta.status === 200) {
                setListaTag(resposta.data)
            }
        })
    }

    function cadastrarTask(e) {
        var modal = document.getElementById("myModal");
        setIsLoading(true);

        e.preventDefault()
        let task = {
            idProjeto: parseInt(parseIdProjeto()),
            idTag: parseInt(idTag),
            idStatusTask: 3,
            idUsuario: idResp,
            tituloTask: tituloTask,
            descricao: descricaoTask,
            tempoTrabalho: tempoTrabalho,
        }

        console.log(task)
        api.post('/Tasks', task, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
                "Content-Type": "application/json"
            }
        }
        ).then(modal.style.display = "none").then(resposta => {
            if (resposta.status === 200) {
                setIsLoading(false)
            }
        }).then(() => listarTodasTasks())
            .catch(erro => {
                console.log(erro)
                setIsLoading(false)
            })
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

        api.post('/Comentarios', comentTask, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        })
            .then(resposta => console.log(resposta.data))
            .then(() => buscarComentarios(idTask))
            .catch(erro => console.log(erro))
    }

    function cadastrarTag(e) {
        e.preventDefault()
        api.post('/Tags', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }, {
            tituloTag: tituloTag
        }).then(resposta => {
            console.log(resposta)
        }).then(() => listarTags())
            .catch(erro => console.log(erro))

    }

    function buscarEquipe() {
        api("/UsuarioEquipes", {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
            console.log(resposta.data)
            let users = resposta.data.filter((equipe) => {
                return equipe.idEquipe == parseIdEquipe()
            })
            console.log(users)
            setEquipe(users)
            console.log(users)
        })
    }

    function mudarSituacao(idTask, idStatus) {
        console.log(idTask + " " + idStatus)
        api.patch('/Tasks/MudarSituacao/' + idTask + '?idStatus=' + idStatus, {
            idTask: idTask,
            idStatus: idStatus
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(() => listarMinhasTasks())
            .catch(erro => console.log(erro))
    }

    const cards = document.querySelectorAll('.card');
    const dropZones = document.querySelectorAll('.dropZone');

    cards.forEach((card) => {
        card.addEventListener('dragstart', dragStart);
        card.addEventListener('drag', drag);
        card.addEventListener('dragend', dragEnd);
    })

    function dragStart() {
        dropZones.forEach(dropZone => dropZone.classList.add('highlight'));
        this.classList.add('dragging');

        switch (this.parentElement.id) {
            case 'todo':
                this.firstElementChild.classList.remove('todo');
                break;
            case 'doing':
                this.firstElementChild.classList.remove('doing');
                break;
            case 'done':
                this.firstElementChild.classList.remove('done');
                break;
            case 'garbage':
                this.firstElementChild.classList.remove('todo');
                break;
            default:
                break;
        }
    }

    function drag() {

    }

    function dragEnd() {
        dropZones.forEach(dropZone => dropZone.classList.remove('highlight'));
        this.classList.remove('dragging');

        switch (this.parentElement.id) {
            case 'todo':
                this.firstElementChild.classList.add('todo');
                console.log(this.parentElement.firstElementChild)
                mudarSituacao(this.lastElementChild.lastElementChild.id, 3)
                break;
            case 'doing':
                this.firstElementChild.classList.add('doing');
                mudarSituacao(this.lastElementChild.lastElementChild.id, 2)
                break;
            case 'done':
                this.firstElementChild.classList.add('done');
                mudarSituacao(this.lastElementChild.lastElementChild.id, 1)
                break;
            case 'garbage':
                this.parentElement.removeChild(this);
                break;
            default:
                break;
        }
    }

    dropZones.forEach(dropZone => {
        dropZone.addEventListener('dragenter', dragEnter);
        dropZone.addEventListener('dragover', dragOver);
        dropZone.addEventListener('dragleave', dragLeave);
        dropZone.addEventListener('drop', drop);
    })

    function dragEnter() {

    }

    function dragOver() {
        this.classList.add('over');

        const cardBeingDragged = document.querySelector('.dragging');

        this.appendChild(cardBeingDragged);
    }

    function dragLeave() {
        this.classList.remove('over');
    }

    function drop() {
        this.classList.remove('over');
    }

    function mudarResponsavel(idUser) {
        console.log(idUser)
        api.patch('/tasks/' + idUser, {
            idTask: idTask
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => console.log(resposta))
    }

    useEffect(listarTodasTasks, [])
    useEffect(buscarEquipe, [])
    useEffect(listarTags, [])
    useEffect(listarMinhasTasks, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
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
                                <h1>  {t('Active Tasks')}</h1>
                                <h2>  {t('Date:')}{date}</h2>
                            </div>
                        </div>

                        {
                            (() => {
                                switch (parseJwt().role) {
                                    case "2":
                                        return (
                                            isLoading ? <button
                                                className='boxCadastro__btnCriar btn btn_salvar1'
                                                disabled>
                                                {t("Add task")} </button>
                                                :
                                                <button onClick={() => abrirModal()}
                                                    className='boxCadastro__btnCriar btn btn_salvar1'
                                                    type='submit'>{t('Add Task')}</button>
                                        )
                                    case "3":
                                        return (
                                            isLoading ? <button
                                                className='boxCadastro__btnCriar btn btn_salvar1'
                                                disabled>
                                                {t("Add task")}</button>
                                                :
                                                <button onClick={() => abrirModal()}
                                                    className='boxCadastro__btnCriar btn btn_salvar1'
                                                    type='submit'>{t("Add task")}</button>
                                        )

                                    default:
                                        return
                                }
                            })()
                        }

                        {/* <Kanban /> */}

                        <section className="section__kanban container">
                            <div className='board'>
                                <h2 className='board_title'>TO-DO</h2>
                                <div className="dropZone" id="todo">
                                    {
                                        listaPendentes.map((tasks) => {
                                            return (
                                                <label className="card" draggable="true" key={tasks.idTask}>
                                                    <div className="status todo"></div>
                                                    <button style={{ display: 'none' }} onClick={() => abrirModalTask(tasks)}></button>
                                                    {/* <div className="card" draggable="true"> */}
                                                    <div className='infoTask' id='content'>
                                                        <h2 className='button_selectTask'>{tasks.tituloTask}</h2>
                                                        <span>
                                                            <span className='span_title'> {t('Project Title:')} </span>
                                                            <span className='titleTask'>{tasks.idProjetoNavigation.tituloProjeto}</span>
                                                        </span>
                                                        <span >
                                                            <span className='span_description'> {t('Description')}</span>
                                                            <span className='description'>{tasks.descricao}</span>
                                                        </span>
                                                        <span>
                                                            <span className='span_hours'> {t('Worked Hours:')} </span>
                                                            <span className='hours'>{tasks.tempoTrabalho}</span>
                                                        </span>
                                                        <span id={tasks.idTask} style={{ display: 'none' }}></span>
                                                    </div>
                                                    {/* </div> */}
                                                </label>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="board">
                                <h2 className='board_title'>DOING</h2>
                                <div className="dropZone" id="doing">
                                    {
                                        listaFazendo.map((tasks) => {
                                            return (
                                                <label className="card" draggable="true" key={tasks.idTask}>
                                                    <div className="status doing"></div>
                                                    <button style={{ display: 'none' }} onClick={() => abrirModalTask(tasks)}></button>
                                                    {/* <div> */}
                                                    <div className='infoTask' id='content'>
                                                        <h2 className='button_selectTask'>{tasks.tituloTask}</h2>
                                                        <span>
                                                            <span className='span_title'> {t('Project Title:')} </span>
                                                            <span className='titleTask'>{tasks.idProjetoNavigation.tituloProjeto}</span>
                                                        </span>
                                                        <span >
                                                            <span className='span_description'> {t("Description")}</span>
                                                            <span className='description'>{tasks.descricao}</span>
                                                        </span>
                                                        <span >
                                                            <span className='span_hours'> {t('Worked Hours:')} </span>
                                                            <span className='hours'>{tasks.tempoTrabalho}</span>
                                                        </span>
                                                        <span id={tasks.idTask} style={{ display: 'none' }}></span>
                                                    </div>
                                                    {/* </div> */}
                                                </label>
                                            )
                                        })
                                    }
                                </div>

                            </div>
                            <div className="board">
                                <h2 className='board_title'>DONE!</h2>
                                <div className="dropZone" id="done">
                                    {
                                        listaConcluido.map((tasks) => {
                                            return (
                                                <label className="card" draggable="true" key={tasks.idTask}>
                                                    <div className="status done"></div>
                                                    <button style={{ display: 'none' }} onClick={() => abrirModalTask(tasks)}></button>
                                                    {/* <div> */}
                                                    <div className='infoTask' id='content'>
                                                        <h2 className='button_selectTask'>{tasks.tituloTask}</h2>
                                                        <span>
                                                            <span className='span_title'> {t('Project Title:')} </span>
                                                            <span className='titleTask'>{tasks.idProjetoNavigation.tituloProjeto}</span>
                                                        </span>
                                                        <span >
                                                            <span className='span_description'> {t('Description')}</span>
                                                            <span className='description'>{tasks.descricao}</span>
                                                        </span>
                                                        <span >
                                                            <span className='span_hours'> {t('Worked Hours:')} </span>
                                                            <span className='hours'>{tasks.tempoTrabalho}</span>
                                                        </span>
                                                        <span id={tasks.idTask} style={{ display: 'none' }}></span>
                                                    </div>
                                                    {/* </div> */}
                                                </label>
                                            )
                                        })
                                    }
                                </div>

                            </div>
                        </section>
                        {/* Modal Datails Task */}
                        <div id="ModalTask" className="modal">
                            <div className="modal-content1">
                                <div className="modal_container modal__task">
                                    <div>
                                        <div className='box__tituloTask'>
                                            <h2 className='tituloTask'>{t("Task: ")} {tituloTask}</h2>
                                        </div>
                                        <div className="box__DetailsTask">
                                            <h2 className='detailsTask'>{t("Details: ")} {tituloTag} (Tag) </h2>
                                            <h2 className='detailsTask'>{t("Description")} {descricao}</h2>
                                            {
                                                (() => {
                                                    switch (parseJwt().role) {
                                                        case "2":
                                                            return (
                                                                <div className='box_input_respon'>
                                                                    <h2 className='respo_title'>{t("Add a responsable for the task:")} </h2>
                                                                    <select
                                                                        className='select_respon'
                                                                        required
                                                                        name='idResponsavel'
                                                                        onChange={(e) => setIdUsuario(e.target.value)}
                                                                        value={idUsuario}
                                                                        multiple={false}
                                                                    >
                                                                        <option value="0" >{t("Select a responsible")}</option>
                                                                        {
                                                                            equipe.map((usuario) => {
                                                                                return (
                                                                                    <option key={usuario.idUsuarioNavigation.idUsuario} value={usuario.idUsuarioNavigation.idUsuario}>{usuario.idUsuarioNavigation.nomeUsuario}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            )
                                                        case "3":
                                                            return (
                                                                <div className='box_input_respon'>
                                                                    <label>
                                                                        <h2 className='respo_title'>{t("Change the responsable for the task")}</h2>
                                                                        <select
                                                                            className='select_respon'
                                                                            required
                                                                            name='idResponsavel'
                                                                            onChange={(e) => setIdUsuario(e.target.value)}
                                                                            value={idUsuario}
                                                                            multiple={false}
                                                                        >
                                                                            <option aria-disabled="true" value="0">{t("Select a responsible")}</option>
                                                                            {
                                                                                equipe.map((usuario) => {
                                                                                    return (
                                                                                        <option key={usuario.idUsuarioNavigation.idUsuario} value={usuario.idUsuarioNavigation.idUsuario}>{usuario.idUsuarioNavigation.nomeUsuario}</option>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </select>
                                                                        <button className='btn__change' onClick={() => mudarResponsavel(idUsuario)}>{t("Change responsable")}</button>
                                                                    </label>
                                                                </div>
                                                            )
                                                        case "1":
                                                            return (
                                                                <div className='box_input_respon'>
                                                                    {
                                                                        statusDaTask === 1 ?
                                                                            <label>
                                                                                <h2 className='respo_title'>Worked hours</h2>
                                                                                <input
                                                                                    className='input_add_coment'
                                                                                    type='text'
                                                                                    name='coment'
                                                                                    onChange={(e) => setHorasTrabalhadas(e.target.value)}
                                                                                    value={horasTrabalhadas}
                                                                                    placeholder='Worked hours'
                                                                                />
                                                                                <button className='btn__change' onClick={notify}>Confirm</button>
                                                                            </label> : ''
                                                                    }
                                                                </div>
                                                            )
                                                        default:
                                                            return
                                                    }
                                                })()
                                            }
                                        </div>
                                        <div className='box__coment'>
                                            <h2 className='comentTask'>{t("Comments")} </h2>
                                            <div className='section__coment'>
                                                {
                                                    comentariotask.map((comentario) => {
                                                        return (
                                                            <div className='box__comentario' key={comentario.idComentario}>
                                                                <div className='div__coment'>
                                                                    <div className='coment__infUser'>
                                                                        <span>{comentario.idUsuarioNavigation.nomeUsuario}</span>
                                                                        <img className="coment__imgUser" alt='Foto de perfil do usuário' src={"https://labwatch-backend.azurewebsites.net/img/" + comentario.idUsuarioNavigation.fotoUsuario} />
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
                                                {t("Comment:")}
                                                <input
                                                    className='input_add_coment'
                                                    type='text'
                                                    name='coment'
                                                    onChange={(e) => setMeuComentario(e.target.value)}
                                                    value={meuComentario}
                                                    placeholder='Escreva um comentário'
                                                />
                                            </label>

                                            <button className='btn__coment' >{t("Write a comment")}
                                            </button>
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
                                            <h1 className='new_task'>{t("Add new Task")}</h1>

                                        </div>

                                        <div>
                                            <h2 className='titulo_addTask'>{t("Title Task:")} </h2>
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
                                            <h2 className='titulo_addTask'>{("Task tag:")} </h2>
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
                                            <h2>{t("Details:")} </h2>
                                            <label className='div__Register'>
                                                {t("Add Description:")}
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

                                            <div className='box_input_respo'>
                                                {t("Add a responsable for the task:")}
                                                <select
                                                    className='select_respo'
                                                    required
                                                    name='idResponsavel'
                                                    onChange={(e) => setIdResp(e.target.value)}
                                                    value={idResp}
                                                >
                                                    <option aria-disabled="true" value="0" >{t("Select a responsible")}</option>
                                                    {
                                                        equipe.map((usuario) => {
                                                            return (
                                                                <option key={usuario.idUsuarioNavigation.idUsuario} value={usuario.idUsuarioNavigation.idUsuario}>{usuario.idUsuarioNavigation.nomeUsuario}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>

                                        </div>
                                        <div className='box_input_horas'>
                                            <label className='div__Register'>
                                                {t("Add Hours:")}
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
                                            <button className='btn_cadTask' onClick={(e) => cadastrarTask(e)}>{t("Register Task")}</button>
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
        </motion.div >
    )
}