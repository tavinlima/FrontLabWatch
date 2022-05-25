import React from 'react'
import 'react-loader-spinner'
import { BallTriangle } from 'react-loader-spinner'
import './../assets/css/components.css'
import { useTranslation } from 'react-i18next';


const Loading = () => {
    const { t } = useTranslation();
    return (
        <div className='div_loading' align='center'>
            <section className='section_loading'>
                <BallTriangle className='TailSpin'
                    color="#0D4373"
                    height={150}
                    width={900}
                    timeout={1000} />
                <div className='text'>
                    <span>{t('Loading')}</span>
                </div>
            </section >
        </div>
    )
}

export default Loading