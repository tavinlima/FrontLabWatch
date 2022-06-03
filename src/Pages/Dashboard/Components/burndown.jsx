import moment from "moment";
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { parseIdEquipe, parseIdProjeto } from '../../../services/auth';
import api from "../../../services/api";

export default function Burndown() {
    const [tempoProjeto, setTempoProjeto] = useState(0);
    const [diasDeProjeto, setDiasDeProjeto] = useState(0);
    const data = [
        ["Data", "Previous", "Real"],
        ["01/05/2022", 150, 100],
        ["02/05/2022", 100, 90],
        ["03/05/2022", 50, 50],
        ["04/05/2022", 0, 0],
    ];

    const options = {
        isStacked: true,
        height: 300,
        legend: { position: "top", maxLines: 3 },
        vAxis: { minValue: 0 }
    };


    return (
        <Chart
        className="chart__burdown"
            chartType="AreaChart"
            data={data}
            options={options}
            width="800px"
            height="450px"
        />
    )
}