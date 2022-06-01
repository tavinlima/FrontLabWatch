import { React } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion"

import Header from '../../Components/header';
import SideBar from '../../Components/sidebar'

import "../../assets/css/global.css"
import "../../assets/css/settings.css"


//Tradução
import { useTranslation } from 'react-i18next';
import { changeLanguage } from 'i18next';
import { LanguageSwitcher } from '../../Components/LanguageSwitcher';

export default function Setting() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            exit={{ opacity: 0 }}
        >
            <div>
                <Header />
                <section>
                    <SideBar />
                </section>
                <div className="box__listagemProjetos">
                    <section className="section__listagemProjetos container">
                        <h1 className='titulo__Settings'>{t('welcomeSettings')}</h1>
                        <div className='div__Idioma'>
                            <span className='titulo__Settings'></span>

                            <section>
                                <LanguageSwitcher />
                            </section>
                        </div>
                    </section>

                    <div className='div__Notidicacao'>
                        <h2 className='titulo__Notificacao'>{t('Notifications')}
                            <select name="" id="" className='Box__Options'>
                                <option value="">{t('All Notifications')}</option>
                                <option value="">{t('Notifications of the day')}</option>
                                <option value="">{t('Last Week')}</option>

                            </select>
                        </h2>


                    </div>



                    <section>
                        <button type='button' className='btn__Link'><a href="/PerfilUsuario" className='link__PerfilUsuario'>{t('Profile')}</a></button>
                    </section>
                </div >
            </div >
        </motion.div>
    )
}
