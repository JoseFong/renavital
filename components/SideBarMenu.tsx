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

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"


const menu = [
    {
        name: "Inicio",
        icon: home,
        path: "/"
    },
    {
        name: "Cotizador",
        icon: money,
        children: [
            {
                name: "Histórico",
                path: "/cotizaciones"
            },
            {
                name: "Nueva cotización",
                path: "/medicos/cotizacion"
            }
        ]
    },
    {
        name: "Catálogo",
        icon: box,
        children: [
            {
                name: "Productos",
                path: "/admin/catalogo/productos"
            },
            {
                name: "Clasificaciones",
                path: "/admin/catalogo/clasificaciones"
            },
            {
                name: "Conceptos",
                path: "/admin/catalogo/conceptos"
            }
        ]
    },
    {
        name: "Personas",
        icon: medic,
        children: [
            {
                name: "Médicos",
                path: "/admin/personas/medicos"
            },
            {
                name: "Pacientes",
                path: "/admin/personas/pacientes"
            }
        ]
    },
    {
        name: "Configuraciones",
        icon: cog,
        children: [
            {
                name: "Procedimientos",
                path: "/admin/configuraciones/procedimientos"
            },
            {
                name: "Anestesias",
                path: "/admin/configuraciones/anestesia"
            },
            {
                name: "Estancias",
                path: "/admin/configuraciones/estancia"
            },
            {
                name: "Configuraciones",
                path: "/admin/configuraciones/configuraciones"
            },
            {
                name: "Reglas",
                path: "/admin/configuraciones/reglas"
            }
        ]
    },
    {
        name: "Aseguradoras",
        icon: insurance,
        path: "/admin/aseguradoras"
    },
    {
        name: "Usuarios",
        icon: user,
        path: "/admin/usuarios"
    }
]


function SideBarMenu({
    showing,
    setShowing
}: {
    showing: any,
    setShowing: any
}) {

    const router = useRouter()

    const [shCurrent, setShCurrent] = useState("")


    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setShowing(false)
            }
        }

        if (showing) {
            document.addEventListener("keydown", handleEsc)
        }

        return () => {
            document.removeEventListener("keydown", handleEsc)
        }
    }, [showing])


    function toggleShowing(target: string) {
        if (shCurrent === target) {
            setShCurrent("")
        } else {
            setShCurrent(target)
        }
    }


    function goToPage(destination: string) {
        router.push(destination)
        setShowing(false)
    }


    return (
        <div
            onClick={() => setShowing(false)}
            className={`${showing ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-all fixed top-0 left-0 bg-black/20 h-full w-full backdrop-blur-lg z-10`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`${showing ? "shadow-xl" : "-translate-x-full"} transition-all fixed left-0 top-0 bg-blue-400 h-full flex flex-col gap-10 overflow-y-scroll w-md sidebar-scroll`}
            >
                <h1 className="text-xl font-bold">
                    Menú
                </h1>
                <div className="flex flex-col text-lg gap-5">
                    {menu.map((item) => (
                        <div key={item.name} className="flex flex-col">
                            <button
                                onClick={() => item.children ? toggleShowing(item.name.toLowerCase()) : item.path && goToPage(item.path)}
                                className="flex flex-row gap-2 items-center hover:bg-blue-500 transition-all cursor-pointer py-2 px-8"
                            >
                                <Image
                                    src={item.icon}
                                    alt={item.name}
                                    className="w-6"
                                />
                                <p className="grow text-start">
                                    {item.name}
                                </p>
                                {item.children && (
                                    <Image
                                        src={chevron}
                                        alt="Ver más"
                                        className={`${shCurrent === item.name.toLowerCase() && "rotate-90"} transition-all duration-400 w-5`}
                                    />
                                )}
                            </button>
                            {item.children && (
                                <div className={`${shCurrent === item.name.toLowerCase() ? "max-h-250" : "max-h-0"} transition-all duration-400 overflow-hidden flex flex-col`}>
                                    {item.children.map((child) => (
                                        <button
                                            key={child.name}
                                            onClick={() => goToPage(child.path)}
                                            className="text-start pl-10 py-1 hover:bg-blue-500 transition-all cursor-pointer"
                                        >
                                            {child.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default SideBarMenu