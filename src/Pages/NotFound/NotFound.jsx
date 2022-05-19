import { React } from "react"
import { Link } from "react-router-dom"
import { parseJwt } from '../../services/auth';
import '../../assets/css/notfound.css'

export default function NotFound() {
    return (
        <div className="container_not">
            <section className="section_not">
                <div className="box_titleNot">
                    <div className="title_not">
                        <h1>404 - Página Não encontrada</h1>
                        <h2>Ops... Parece Que Essa Página Não Existe</h2>
                    </div>
                </div>
                {/* <Link to='/'>Voltar para a página inicial</Link> */}
                <div className="link_retorno">
                    {
                        parseJwt().role === '1' ? <Link to='/ListaProjetosConsultor'>Voltar para a página Inicial</Link> : ''
                    }
                    {
                        parseJwt().role === '2' ? <Link to='/ListaProjetosGestor'>Voltar para a página Inicial</Link> : ''
                    }
                    {
                        parseJwt().role === '3' ? <Link to='/ListaProjetosOwner'>Voltar para a página Inicial</Link> : ''
                    }
                </div>
            </section>

            <section className="section_azul">
                <div className="box_azul1">
                </div>
            </section>


        </div>

    )
}