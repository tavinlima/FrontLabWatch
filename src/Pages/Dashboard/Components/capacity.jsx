import React from "react";
import { useEffect } from "react";
import { Chart } from "react-google-charts";
import { parseIdEquipe, parseIdProjeto } from '../../../services/auth';
import api from '../../../services/api';
import ReactLoading from 'react-loading';
import { useState } from "react";
import moment from "moment";

export default function DiffCapacity() {
    const [equipe, setEquipe] = useState([]);
    const [capacity, setCapacity] = useState(0);
    const [listaProjetos, setListaProjetos] = useState([]);
    const [oldData, setOldData] = useState([]);
    const [newData, setNewData] = useState([]);
    const [loading, setLoading] = useState([]);
    const [buscouDias, setBuscouDias] = useState(false);
    const [tempoProjeto, setTempoProjeto] = useState([]);
    const [dataInicio, setDataInicio] = useState(new Date());
    const [dataConclusao, setDataConclusao] = useState(new Date());

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

            let oldList = [];
            oldList.push(["Consultor", "Capacity"]);
            users.map((item) => {
                oldList.push([item.idUsuarioNavigation.nomeUsuario, item.idUsuarioNavigation.horasTrabalhadas]);
            })

            let newList = [];
            newList.push(["Consultor", "Horas trabalhadas"]);
            users.map((item) => {
                newList.push([item.idUsuarioNavigation.nomeUsuario, item.idUsuarioNavigation.cargaHoraria]);
            })

            setOldData(oldList);
            setNewData(newList);
            setLoading(false);
        })
    }

    const diffdata = {
        old: oldData,
        new: newData,
    };

    const options = {
        legend: { position: "top" },
        title: "Quantidade Horas Trabalhadas",
    };

    useEffect(buscarEquipe, [])
    useEffect(buscarProjeto, [])

    return (
        <>
            {
                loading ?
                    <ReactLoading height={667} width={375} /> :
                    <Chart
                        chartType="BarChart"
                        width={"500px"}
                        height={"250px"}
                        diffdata={diffdata}
                        options={options}
                    />
            }
        </>
    );

}