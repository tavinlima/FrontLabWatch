import React from 'react'
import 'react-loader-spinner'
import { BallTriangle } from 'react-loader-spinner'
import './../assets/css/components.css'

const Loading = () => {
    return (
        <div className='div_loading' align='center'>
            <section className='section_loading'>
                <BallTriangle className='TailSpin'
                    color="#0D4373"
                    height={150}
                    width={900}
                    timeout={1000} />
                <div className='text'>
                    <span>Loading....</span>
                </div>
            </section >
        </div>
    )
}

export default Loading