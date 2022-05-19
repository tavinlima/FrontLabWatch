import { React, useState, useEffect } from "react";
import axios from "axios";
// import { parseJwt } from "../../services/auth";
import { motion } from "framer-motion"

import Header from '../../Components/header';
import SideBar from '../../Components/sidebar'
import { parseJwt } from "../../services/auth";
import api from "../../services/api";
import "../../assets/css/graficos.css"

import BarChartChartUserRegisterbyMonth from "./Components/BarChartChartUserRegisterbyMonth.jsx";

import GraficoPizza from "./Components/pizza.jsx";

import GraficoColuna from "./Components/Coluna.jsx";
import GraficoLinhas from "./Components/Linhas.jsx";
import QntdTask from "./Components/qntdTask.jsx";



function App() {


  return (
    <div>
      <Header />
      <SideBar />
      <div>
        <div className="App">
          <div className="container">
            <h1 className='Title'>DashBoard</h1>
            {/* <div class="row">
              <div className="boxGraphs1">
                <BarChartChartUserRegisterbyMonth />
              </div>
              <div className="boxGraphs2">
                <GraficoLinhas />
              </div>
            </div>
            <div class="row">
              <div className="boxGraphs3">
                <GraficoPizza />
              </div>
              <div className="boxGraphs4">
                <GraficoColuna /> */}
            {/* </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
      <div className="boxGraphs1">
        <QntdTask />
      </div>
    </div>
  );
}



export default App;


