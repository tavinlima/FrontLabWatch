import React from "react";
import { useEffect } from "react";
import { Chart } from "react-google-charts";
import { parseIdEquipe, parseIdProjeto } from '../../../services/auth';
import api from '../../../services/api';
import { useState } from "react";

export default function DiffCapacity() {
    const [equipe, setEquipe] = useState([]);
    const [capacity, setCapacity] = useState(0);
    const [listaProjetos, setListaProjetos] = useState([]);
    const [tempoProjeto, setTempoProjeto] = useState([]);
    const [dataInicio, setDataInicio] = useState(new Date());
    const [dataConclusao, setDataConclusao] = useState(new Date());

    function buscarProjeto() {
        api("/Projetos/").then(resposta => {
            if (resposta.status === 200) {
                resposta.data.map((projeto) => {
                    if (projeto.idProjeto == parseIdProjeto()) {
                        localStorage.setItem('idEquipe', projeto.idEquipe)
                        setDataInicio(projeto.dataInicio.split('T')[0])
                        setDataConclusao(projeto.dataConclusao.split('T')[0])

                        const date1 = new Date('7/13/2010');
                        const date2 = new Date('12/15/2010');
                        const diffTime = Math.abs(date2 - date1);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        console.log(diffDays);
                    }
                    return projeto
                })
            }
        })
            .catch(erro => console.log(erro));
    }

    async function calcularTempo() {
        let tempoTeste = Math.abs(dataConclusao - dataInicio)
        const difDias = Math.ceil(tempoTeste / (1000 * 60 * 60 * 24));

        console.log(tempoTeste)
        console.log(difDias)
    }

    function buscarEquipe() {
        api("/UsuarioEquipes", {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
            }
        }).then(resposta => {
            let users = resposta.data.filter((equipe) => {
                return equipe.idEquipe == parseIdEquipe()
            })
            setEquipe(users)
            console.log(users[0].idUsuarioNavigation.cargaHoraria)
            console.log(users[0].idUsuarioNavigation.horasTrabalhadas)
            // console.log(users[0].idUsuarioNavigation.cargaHoraria * )
            console.log(users)
        })
    }

    const dataOld = [
        ["Name", "Capacity"],
        ["Gustavo", 250],
        ["Rachel", 4200],
        ["Patrick", 2900],
        ["Eric", 8200],
    ];

    const dataNew = [
        ["Name", "Popularity"],
        ["Gustavo", 370],
        ["Rachel", 600],
        ["Patrick", 700],
        ["Eric", 1500],
    ];

    const diffdata = {
        old: dataOld,
        new: dataNew,
    };

    const options = {
        legend: { position: "top" },
    };

    useEffect(buscarEquipe, [])
    useEffect(buscarProjeto, [])
    useEffect(calcularTempo, [])

    return (
        <Chart
            chartType="BarChart"
            width="100%"
            height="400px"
            diffdata={diffdata}
            options={options}
        />
    );
}