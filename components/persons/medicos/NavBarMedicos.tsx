"use client"

import { useRouter } from "next/navigation"

function NavBarMedicos({selected}:{selected:string}) {

    const router = useRouter()

    function goToPage(endpoint: string){
        router.push("/medicos/"+endpoint)
    }

  return (
    <div className="bg-blue-400 shadow-lg text-white flex flex-row items-center justify-center">
        <button onClick={()=>goToPage("cotizacion")} className={`${selected==="cotizacion" && "bg-blue-600"} hover:bg-blue-500 p-4 transition-all cursor-pointer`}>Cotización</button>
    </div>
  )
}

export default NavBarMedicos