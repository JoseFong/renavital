"use client"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

function Loading({open}:{open:any}) {
    const [root,setRoot] = useState<HTMLElement|null>(null)

    useEffect(()=>{
        setRoot(document.getElementById("root"))
    },[])

    if(!root) return

    return createPortal(
        <div className={`${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} flex items-center justify-center transition-all w-screen h-screen fixed top-0 left-0 backdrop-blur-2xl`}>
            <div className="bg-white py-8 px-16 rounded-xl shadow-xl text-lg">Cargando...</div>
        </div>
        ,root
    )
}

export default Loading