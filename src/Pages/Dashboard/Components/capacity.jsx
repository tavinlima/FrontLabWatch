import React from "react";
import { useEffect } from "react";
import { Chart } from "react-google-charts";
import { parseIdEquipe, parseIdProjeto } from '../../../services/auth';
import api from '../../../services/api';
import { useState } from "react";
import moment from "moment";

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

                    }
                    return projeto
                })
            }
        })
            .catch(erro => console.log(erro));
    }


    async function calcularTempo() {
        setTimeout(() => {
            // var date = new Date()
            console.log("E a data")
            // console.log(moment().diff(date, moment().add(2, "years")))
            let tempoTeste = Math.abs(dataConclusao - dataInicio)

            console.log(dataConclusao)
            console.log(dataInicio)
            console.log(moment().diff(dataConclusao, dataInicio, "days"))
            // console.log(dataConclusao = new Date().toLocaleDateString())
            console.log(dataInicio)
            const difDias = Math.ceil(tempoTeste / (1000 * 60 * 60 * 24))
            console.log(difDias)

        }, 2000)
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
            console.log(users)
        }).then(() => calcularTempo())
    }


    const dataOld = [
        ["Consultor", "Ideal working hours"],
        // equipe.map((equipe) => {
        //     return [equipe.idUsuarioNavigation.nomeUsuario, equipe.idUsuarioNavigation.cargaHoraria]
        // }),
        [equipe[0].idUsuarioNavigation.nomeUsuario, equipe[0].idUsuarioNavigation.cargaHoraria],
        // [equipe[1].idUsuarioNavigation.nomeUsuario, equipe[1].idUsuarioNavigation.cargaHoraria],
    ];

    const dataNew = [
        ["Consultor", "Real working hours"],
        // equipe.map((equipe) => {
        //     return [equipe.idUsuarioNavigation.nomeUsuario, equipe.idUsuarioNavigation.horasTrabalhadas]
        // }),
        [equipe[0].idUsuarioNavigation.nomeUsuario, equipe[0].idUsuarioNavigation.horasTrabalhadas],
        // [equipe[1].idUsuarioNavigation.nomeUsuario, equipe[1].idUsuarioNavigation.horasTrabalhadas],
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

    return (
        <Chart
            chartType="BarChart"
            width={"500px"}
            height={"250px"}
            diffdata={diffdata}
            options={options}
        />
    );

}