import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

export default function Burndown() {
    const data = [
        ["Days", "Previous", "Real"],
        ["2013", 1000, 400],
        ["2014", 1170, 460],
        ["2015", 660, 1120],
        ["2016", 1030, 540],
    ];

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