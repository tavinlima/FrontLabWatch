import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import ReactLoading from 'react-loading';

const options = {
    title: "Quantidade de tasks concluídas"
};

const Pizza = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://labwatch-backend.azurewebsites.net/api/Charts/GetCountPercentageCatgoriesCompany')
            .then((result) => {
                return result.json()
            })
            .then((res) => {
                let list = [];
                list.push(["Categoria", "Porcentagem"]);
                res.map((item) => {
                    list.push([item.nome, item.porcentagem]);
                });
                setData(list);
                setLoading(false)
            })
            .catch((error) => {
                console.log(error);
            })

    }, [])

    return (
        <>
            {
                loading ?
                    <ReactLoading height={667} width={375} /> :
                    <Chart
                        chartType="PieChart"
                        width="500px"
                        height="400px"
                        data={data}
                        options={options}
                    />
            }
        </>
    )

}

export default Pizza;