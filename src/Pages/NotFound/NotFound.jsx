import { React } from "react"
import { Link } from "react-router-dom"

export default function NotFound() {
    return (
        <div>
            <h1>404 - Página Não encontrada</h1>
            <Link to='/ListaProjetos'>Voltar para a página inicial</Link>
        </div>
    )
}