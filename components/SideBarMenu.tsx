"use client"
import Image from "next/image"
import chevron from "@/assets/icons8-chevron-right-50.png"
import box from "@/assets/icons8-box-50.png"
import cog from "@/assets/icons8-cog-50.png"
import medic from "@/assets/icons8-medical-doctor-50.png"
import insurance from "@/assets/icons8-insurance-50.png"
import user from "@/assets/icons8-user-48.png"
import money from "@/assets/icons8-dollar-bag-50.png"
import home from "@/assets/icons8-home-50.png"
import { Fragment, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

function SideBarMenu({ showing, setShowing }: { showing: any, setShowing: any }) {
    const router = useRouter()

    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setShowing(false)
            }
        }

        if (showing)
            document.addEventListener("keydown", handleEsc)

        return () => {
            document.removeEventListener("keydown", handleEsc)
        }
    }, [showing])

    const [shCurrent, setShCurrent] = useState("")

    function toggleShowing(target:string){
        if(shCurrent===target){
            setShCurrent("")
        }else{
            setShCurrent(target)
        }
    }

    function goToPage(destination:string){
        router.push(destination)
    }

    return (
        <div onClick={() => setShowing(false)} className={`${showing ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-all fixed top-0 left-0 bg-black/20 h-full w-full backdrop-blur-lg z-10`}>
            <div onClick={(e) => e.stopPropagation()} className={`${showing ? "shadow-xl" : "-translate-x-full"} transition-all fixed left-0 top-0 bg-blue-400 h-full flex flex-col gap-10 overflow-y-scroll w-md`}>
                <h1 className="text-xl font-bold">Menú</h1>
                <div className="flex flex-col text-lg gap-5">
                    <button onClick={()=>goToPage("/")} className="flex flex-row gap-2 items-center hover:bg-blue-500 transition-all cursor-pointer py-2 px-8">
                        <Image src={home} alt="Inicio" className="w-6" />
                        <p className="grow text-start">Inicio</p>
                    </button>
                    <div className="flex flex-col">
                        <button onClick={()=>toggleShowing("cotizador")} className="flex flex-row gap-2 items-center hover:bg-blue-500 transition-all cursor-pointer py-2 px-8">
                            <Image src={money} alt="Cotizador" className="w-6" />
                            <p className="grow text-start">Cotizador</p>
                            <Image src={chevron} alt="Ver más" className={`${shCurrent==="cotizador" && "rotate-90"} transition-all duration-400 w-5`} />
                        </button>
                        <div className={`${shCurrent==="cotizador" ? "max-h-250" : "max-h-0"} transition-all duration-400 overflow-hidden flex flex-col`}>
                            <button className="text-start pl-10 py-1 hover:bg-blue-500 transition-all cursor-pointer">Histórico</button>
                            <button onClick={()=>goToPage("/medicos/cotizacion")} className="text-start pl-10 py-1 hover:bg-blue-500 transition-all cursor-pointer">Nueva cotización</button>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <button onClick={()=>toggleShowing("catalogo")} className="flex flex-row gap-2 items-center hover:bg-blue-500 transition-all cursor-pointer py-2 px-8">
                            <Image src={box} alt="Catálogo" className="w-6" />
                            <p className="grow text-start">Catálogo</p>
                            <Image src={chevron} alt="Ver más" className={`${shCurrent==="catalogo" && "rotate-90"} transition-all duration-400 w-5`} />
                        </button>
                        <div className={`${shCurrent==="catalogo" ? "max-h-250" : "max-h-0"} transition-all duration-400 overflow-hidden flex flex-col`}>
                            <button onClick={()=>goToPage("/admin/catalogo/productos")} className="text-start pl-10 py-1 hover:bg-blue-500 transition-all cursor-pointer">Productos</button>
                            <button onClick={()=>goToPage("/admin/catalogo/clasificaciones")} className="text-start pl-10 py-1 hover:bg-blue-500 transition-all cursor-pointer">Clasificaciones</button>
                            <button onClick={()=>goToPage("/admin/catalogo/conceptos")} className="text-start pl-10 py-1 hover:bg-blue-500 transition-all cursor-pointer">Conceptos</button>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <button onClick={()=>toggleShowing("personas")} className="flex flex-row gap-2 items-center hover:bg-blue-500 transition-all cursor-pointer py-2 px-8">
                            <Image src={medic} alt="Personas" className="w-6" />
                            <p className="grow text-start">Personas</p>
                            <Image src={chevron} alt="Ver más" className={`${shCurrent==="personas" && "rotate-90"} transition-all duration-400 w-5`} />
                        </button>
                        <div className={`${shCurrent==="personas" ? "max-h-250" : "max-h-0"} transition-all duration-400 overflow-hidden flex flex-col`}>
                            <button className="text-start pl-10 py-1 hover:bg-blue-500 transition-all cursor-pointer">Médicos</button>
                            <button className="text-start pl-10 py-1 hover:bg-blue-500 transition-all cursor-pointer">Pacientes</button>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <button onClick={()=>toggleShowing("configuraciones")} className="flex flex-row gap-2 items-center hover:bg-blue-500 transition-all cursor-pointer py-2 px-8">
                            <Image src={cog} alt="Configuraciones" className="w-6" />
                            <p className="grow text-start">Configuraciones</p>
                            <Image src={chevron} alt="Ver más" className={`${shCurrent==="configuraciones" && "rotate-90"} transition-all duration-400 w-5`} />
                        </button>
                        <div className={`${shCurrent==="configuraciones" ? "max-h-250" : "max-h-0"} transition-all duration-400 overflow-hidden flex flex-col`}>
                            <button onClick={()=>goToPage("/admin/configuraciones/procedimientos")} className="text-start pl-10 py-1 hover:bg-blue-500 transition-all cursor-pointer">Procedimientos</button>
                            <button onClick={()=>goToPage("/admin/configuraciones/anestesia")} className="text-start pl-10 py-1 hover:bg-blue-500 transition-all cursor-pointer">Anestesias</button>
                            <button onClick={()=>goToPage("/admin/configuraciones/estancia")} className="text-start pl-10 py-1 hover:bg-blue-500 transition-all cursor-pointer">Estancias</button>
                            <button onClick={()=>goToPage("/admin/configuraciones/configuraciones")} className="text-start pl-10 py-1 hover:bg-blue-500 transition-all cursor-pointer">Configuraciones</button>
                            <button onClick={()=>goToPage("/admin/configuraciones/reglas")} className="text-start pl-10 py-1 hover:bg-blue-500 transition-all cursor-pointer">Reglas</button>
                        </div>
                    </div>
                    <button className="flex flex-row gap-2 items-center hover:bg-blue-500 transition-all cursor-pointer py-2 px-8">
                        <Image src={insurance} alt="Aseguradoras" className="w-6" />
                        <p className="grow text-start">Aseguradoras</p>
                    </button>
                    <button className="flex flex-row gap-2 items-center hover:bg-blue-500 transition-all cursor-pointer py-2 px-8">
                        <Image src={user} alt="Usuarios" className="w-6" />
                        <p className="grow text-start">Usuarios</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SideBarMenu