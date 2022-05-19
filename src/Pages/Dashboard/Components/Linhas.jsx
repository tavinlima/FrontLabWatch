import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import ReactLoading from 'react-loading';

const options = {
    chart: {
        title: "Previsão para o projeto",
        subtitle: "Previsão do gasto de horas para a realização do projeto",
    },
};

const Linhas = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://labwatch-backend.azurewebsites.net/api/Charts/GetChartUserRegisterbyMonth')
            .then((result) => {
                return result.json()
            })
            .then((res) => {
                let list = [];
                list.push(["Mês", "Dev. planejado", "Dev. Real", "Tasks concluídas"]);
                res.map((item) => {
                    list.push([item.mes, item.total, item.biker, item.empresa]);
                });
                setData(list);
                setLoading(false)
            })
            .catch((error) => {
                console.log(error);
            })

    },[])

    return (
        <>
            {
                loading ? 
                    <ReactLoading height={667} width={375} /> :
                    <Chart
                        chartType="Line"
                        width="500px"
                        height="400px"
                        data={data}
                        options={options}
                    />
            }
        </>
    )

}

export default Linhas;