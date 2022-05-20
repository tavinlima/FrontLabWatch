import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import ReactLoading from 'react-loading';

const options = {
    chart: {
        title: "Quantidade Horas Trabalhadas",
        subtitle: "Total de Horas trabalhadas no projeto",
    },
};

const BarChartChartUserRegisterbyMonth = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://labwatch-backend.azurewebsites.net/api/Charts/GetChartUserRegisterbyMonth')
            .then((result) => {
                return result.json()
            })
            .then((res) => {
                let list = [];
                list.push(["Mês", "Total de Horas", "Consultor 1", "Consultor 2"]);
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
                        chartType="Bar"
                        width="500px"
                        height="400px"
                        data={data}
                        options={options}
                    />
            }
        </>
    )
}

export default BarChartChartUserRegisterbyMonth;