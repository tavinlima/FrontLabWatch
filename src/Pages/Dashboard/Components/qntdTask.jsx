import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import ReactLoading from 'react-loading';
import { parseJwt, parseIdProjeto } from '../../../services/auth';
import api from '../../../services/api';
import { keysIn } from "lodash";

export default function QntdTask() {
    const [tasks, setTasks] = useState([]);
    const [pendentes, setPendentes] = useState(0);
    const [fazendo, setFazendo] = useState(0);
    const [concluidas, setConcluidas] = useState(0);

    function buscarTasks() {
        api("/Tasks/").then(resposta => {
            if (resposta.status === 200) {
                console.log(resposta.data)
                let minhasTasks = resposta.data.filter((tasks) => {
                    return tasks.idProjeto == parseIdProjeto()
                })

                let taskPendente = minhasTasks.filter((task) => {
                    return task.idStatusTaskNavigation.statusTaskE === 'Pendente'
                })

                let taskFazendo = minhasTasks.filter((task) => {
                    return task.idStatusTaskNavigation.statusTaskE === 'Em Andamento'
                })

                let taskConcluida = minhasTasks.filter((task) => {
                    return task.idStatusTaskNavigation.statusTaskE === 'Concluída'
                })

                setPendentes(taskPendente.length)
                setFazendo(taskFazendo.length)
                setConcluidas(taskConcluida.length)
                setTasks(minhasTasks);
            }
        }).catch(erro => console.log(erro))
    }

    const data = [
        ["Task", "Quantidade"],
        ["Pendentes", pendentes],
        ["Em andamento", fazendo],
        ["Concluidas", concluidas],
    ];

    const options = {
        title: "Andamento das tasks do projeto",
    };

    useEffect(buscarTasks, [])

    return (
        <Chart
            chartType="PieChart"
            data={data}
            options={options}
            width={"800px"}
            height={"400px"}
        />
    )
}