import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

export default function Burndown() {
    const data = [
        ["Year", "Sales", "Expenses"],
        ["2013", 1000, 400],
        ["2014", 1170, 460],
        ["2015", 660, 1120],
        ["2016", 1030, 540],
    ];

    const options = {
        isStacked: "relative",
        height: 300,
        legend: { position: "top", maxLines: 3 },
        vAxis: {
            minValue: 0,
            ticks: [0, 0.3, 0.6, 0.9, 1],
        },
    };


    return (
        <Chart
            chartType="AreaChart"
            width="100%"
            height="400px"
            data={data}
            options={options}
        />
    )
}