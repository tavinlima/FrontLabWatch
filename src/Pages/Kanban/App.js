import React, { useEffect, useState } from "react";
import Header from "../../Components/header";
import SideBar from "../../Components/sidebar";
import api from "../../services/api";
import '../../assets/css/quadroKanban.css'

export default function Kanban() {
  const [listaTasks, setListaTasks] = useState([]);
  const [listaPendentes, setListaPendentes] = useState([]);
  const [listaFazendo, setListaFazendo] = useState([]);
  const [listaConcluido, setListaConcluido] = useState([]);

  const listarTodasTasks = () => {
    api('/Tasks', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
      }
    }).then(resposta => {
      if (resposta.status === 200) {

        let taskPendente = resposta.data.filter((task) => {
          return task.idStatusTask === 3
        })

        let taskConcluidas = resposta.data.filter((task) => {
          return task.idStatusTask === 1
        })

        let taskAndamento = resposta.data.filter((task) => {
          return task.idStatusTask === 2
        })

        console.log(taskPendente)
        setListaPendentes(taskPendente)
        setListaFazendo(taskAndamento)
        setListaConcluido(taskConcluidas)
        setListaTasks(resposta.data)
      }
    })
  }

  useEffect(listarTodasTasks, [])

  return (
    <div>
      <Header />
      <SideBar />
      <div className="box__listagemProjetos boards">
        <section className="section__kanban container">
          <div className='board'>
            <h2>TO-DO</h2>
            {
              listaPendentes.map((tasks) => {
                return (
                  <div className="dropZone" id="todo" key={tasks.idTask}>
                    <div className="card" draggable="true">
                      <div className="status todo"></div>
                      <span>{tasks.tituloTask}</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className="board">
            <h2>DOING</h2>
            {
              listaFazendo.map((tasks) => {
                return (
                  <div className="dropZone" id="todo" key={tasks.idTask}>
                    <div className="card" draggable="true">
                      <div className="status doing">
                      <span>{tasks.tituloTask}</span>
                      <span>{tasks.descricao}</span>
                      <span>{tasks.hour}</span>
                      </div>
                      
                    </div>
                  </div>
                )
              })
            }

          </div>
          <div className="board">
            <h2>DONE!</h2>
            {
              listaConcluido.map((tasks) => {
                return (
                  <div className="dropZone" id="todo" key={tasks.idTask}>
                    <div className="card" draggable="true">
                      <div className="status done"></div>
                      <span>{tasks.tituloTask}</span>
                    </div>
                  </div>
                )
              })
            }

          </div>
        </section>
      </div>

    </div>
  )
}