"use client"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import x from "@/assets/icons8-close-50.png"

function Modal({ children, open, setOpen }: { children: any, open: any, setOpen: any }) {
    const [root, setRoot] = useState<HTMLElement | null>(null)

    useEffect(() => {
        setRoot(document.getElementById("root"))
    }, [])

    useEffect(() => {
        function close(e:KeyboardEvent) {
            if(e.key==="Escape")
                setOpen(false)
        }

        if (open) document.addEventListener("keydown", close)

        return () => document.removeEventListener("keydown", close)
    }, [open])

    if (!root) return null

    return createPortal(
        <div onClick={() => setOpen(false)} className={`${open ? "opacity-100" : "opacity-0 pointer-events-none"} bg-black/40 left-0 top-0 w-screen h-screen fixed flex items-center justify-center backdrop-blur-sm transition-all`}>
            <div onClick={(e) => e.stopPropagation()} className={`${open ? "scale-100" : "scale-90"} bg-white py-7 px-10 rounded-xl shadow-xl transition-all relative`}>
                <Image onClick={()=>setOpen(false)} className="opacity-70 hover:opacity-100 transition-all cursor-pointer absolute top-3 right-3 w-4" src={x} alt="Cerrar"/>
                {children}
            </div>
        </div>,
        root
    )
}

export default Modal