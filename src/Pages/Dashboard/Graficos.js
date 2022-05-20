import { React, useState, useEffect } from "react";
// import { parseJwt } from "../../services/auth";
import { motion } from "framer-motion"

import Header from '../../Components/header';
import SideBar from '../../Components/sidebar'
import { parseIdProjeto } from "../../services/auth";
import api from "../../services/api";
import "../../assets/css/graficos.css"

import BarChartChartUserRegisterbyMonth from "./Components/BarChartChartUserRegisterbyMonth.jsx";

import GraficoPizza from "./Components/pizza.jsx";

import GraficoColuna from "./Components/Coluna.jsx";
import GraficoLinhas from "./Components/Linhas.jsx";
import QntdTask from "./Components/qntdTask.jsx";
import Burndown from "./Components/burndown";
import DiffCapacity from "./Components/capacity";


function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div>
        <Header />
        <SideBar />
        <div className="box__listagemProjetos">
          <section className="section__listagemProjetos container">
            <div className="div__tituloInput">
              <h1>DashBoard</h1>
            </div>
            <Burndown />

            <QntdTask />
            {
              setTimeout(() => {
                <DiffCapacity />
              }, 2000)
            }
          </section>
        </div>
      </div>
    </motion.div >
  );
}



export default App;


