import { React } from "react"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"
import { parseJwt } from '../../services/auth';
import '../../assets/css/notfound.css'
import { motion } from "framer-motion"
import api from "../../services/api";
import * as Yup from 'yup';
import { useFormik } from 'formik';

export default function Senha() {
    const token = localStorage.getItem('usuario-login')
    const [senha, setSenha] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confNovaSenha, setConfNovaSenha] = useState('');


    function AlterarSenha(usuario) {
        api.patch("/Usuarios/AlterarSenha" + usuario + novaSenha
        ).then(resposta=>{
            console.log(resposta.data)
            if(novaSenha===confNovaSenha){
                console.log("Deu Certo!")
            }
            console.log(resposta);
        }).catch(erro => console.log(erro))

    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="container_not">
                <section className="section_not">
                    <div className="box_titleNot">
                        <div className="title_not">
                            <h1>Change your Password</h1>
                        </div>
                            <div className="form_alter">
                                <form onSubmit={AlterarSenha} className='form-cad'>
                                    <input className="input-cad"
                                        autoComplete="off"
                                        placeholder="Current Password"
                                        defaultValue={senha}
                                        onChange={(campo) => setSenha(campo.target.value)}
                                        name="password"
                                        type="text" />

                                    <input className="input-cad"
                                        autoComplete="off"
                                        placeholder="New Password"
                                        defaultValue={novaSenha}
                                        onChange={(campo) => setNovaSenha(campo.target.value)}
                                        name="password"
                                        type="text" />

                                    <input className="input-cad"
                                        autoComplete="off"
                                        placeholder="Confirm New Password"
                                        defaultValue={confNovaSenha}
                                        onChange={(campo) => setConfNovaSenha(campo.target.value)}
                                        name="password"
                                        type="text" />

                                    <div className="box_btn_alter">
                                        <button type="submit" className="btn_alter" id="btn_cad">
                                            Change Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                    </div>
                </section>

                <section className="section_azul">
                    <div className="box_azul1">
                    </div>
                </section>


            </div>
        </motion.div >

    )
}