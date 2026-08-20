"use client"

import { useRouter } from "next/navigation"

function NavBarCatalogue({selected}:{selected:string}) {

    const router = useRouter()

    function goToPage(endpoint: string){
        router.push("/admin/catalogo/"+endpoint)
    }

  return (
    <div className="bg-blue-400 shadow-lg text-white flex flex-row items-center justify-center">
        <button onClick={()=>goToPage("productos")} className={`${selected==="Productos" && "bg-blue-600"} hover:bg-blue-500 p-4 transition-all cursor-pointer`}>Productos</button>
        <button onClick={()=>goToPage("tipos_de_producto")} className={`${selected==="Tipos" && "bg-blue-600"} hover:bg-blue-500 p-4 transition-all cursor-pointer`}>Tipos</button>
        <button onClick={()=>goToPage("conceptos")} className={`${selected==="Conceptos" && "bg-blue-600"} hover:bg-blue-500 p-4 transition-all cursor-pointer`}>Conceptos</button>
        <button onClick={()=>goToPage("procedimientos")} className={`${selected==="Procedimientos" && "bg-blue-600"} hover:bg-blue-500 p-4 transition-all cursor-pointer`}>Procedimientos</button>
        <button onClick={()=>goToPage("anestesia")} className={`${selected==="Anestesia" && "bg-blue-600"} hover:bg-blue-500 p-4 transition-all cursor-pointer`}>Anestesia</button>
        <button onClick={()=>goToPage("estancia")} className={`${selected==="Estancia" && "bg-blue-600"} hover:bg-blue-500 p-4 transition-all cursor-pointer`}>Estancia</button>
        <button onClick={()=>goToPage("configuraciones")} className={`${selected==="Configuraciones" && "bg-blue-600"} hover:bg-blue-500 p-4 transition-all cursor-pointer`}>Configuraciones</button>
    </div>
  )
}

export default NavBarCatalogue