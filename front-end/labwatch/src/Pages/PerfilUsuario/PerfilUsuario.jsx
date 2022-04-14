// import { React, useState, useEffect } from "react";
// import axios from "axios";
// // import { parseJwt } from "../../services/auth";

// import Header from '../../Components/header';
// import SideBar from '../../Components/sidebar'
// import { parseJwt } from "../../services/auth";

// export default function PerfilUsuario() {
//     const [listaPerfil, setListaPerfil] = useState([]);

//     function buscarPerfil() {
//         axios('https://labwatch-backend.azurewebsites.net/api/Usuarios/')
//             .then(response => {
//                 response.data.map((usuario) => {
//                     console.log(usuario.idUsuario)
//                     // console.log(parseJwt().jti)
//                     console.log(usuario.idUsuario == parseJwt().jti)
//                     if (usuario.idUsuario == parseJwt().jti) {
//                         console.log(usuario)
//                         setListaPerfil(usuario)
//                         console.log(listaPerfil)
//                     }
//                 })
//             })
//             .catch(erro => console.log(erro));
//     }

//     useEffect(buscarPerfil, []);

//     return (
//         <div>
//             {/* <Header />
//             <SideBar /> */}

//             <section className='container'>
//                 <h1>Profile</h1>
//                 {
//                     listaPerfil.map((perfil) => {
//                         return (
//                             <div key={perfil.idUsuario}>
//                                 <p>{perfil.nomeUsuario}</p>
//                             </div>
//                         )
//                     })
//                 }

//             </section>
//         </div>
//     )
// }