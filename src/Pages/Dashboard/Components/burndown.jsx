import moment from "moment";
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { parseIdEquipe, parseIdProjeto } from '../../../services/auth';
import api from "../../../services/api";

export default function Burndown() {
    const [tempoProjeto, setTempoProjeto] = useState(0);
    const [diasDeProjeto, setDiasDeProjeto] = useState(0);
    function buscarProjeto() {
        api("/Projetos/").then(resposta => {
            if (resposta.status === 200) {
                let meuProjeto = resposta.data.filter((projeto) => {
                    return projeto.idProjeto == parseIdProjeto()
                })
                buscarDataFinal(meuProjeto)
            }
        }).then()
            .catch(erro => console.log(erro));
    }

    function buscarDataFinal(projeto) {
        let dataInicial = projeto[0].dataInicio
        let dataFinal = projeto[0].dataConclusao

        setTempoProjeto(moment(dataFinal).diff(dataInicial, 'days'))
        let diasProjeto = [];
        diasProjeto.push(tempoProjeto, 23, 45)

        setDiasDeProjeto(diasProjeto);
        console.log(diasProjeto);
    }

    useEffect(buscarProjeto, [])

    const data = [
        ["Days", "Previous", "Real"],
        diasDeProjeto
    ];

    // const data = [
    //     diasDeProjeto
    // ];

    const options = {
        isStacked: "relative",
        title: 'Project burndown',
        backgroundColor: 'white',
        height: 400,
        legend: { position: "top", maxLines: 3 },
        vAxis: {
            minValue: 0,
            ticks: [0, 0.3, 0.6, 0.9, 1],
        },
    };


    return (
        <Chart
            chartType="AreaChart"
            data={data}
            options={options}
            width="800px"
            height="450px"
        />
    )
}