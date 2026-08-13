"use client"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

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
        <div onClick={() => setOpen(false)} className={`${open ? "opacity-100" : "opacity-0 pointer-events-none"} bg-black/40 left-0 top-0 w-screen h-screen absolute flex items-center justify-center backdrop-blur-sm transition-all`}>
            <div onClick={(e) => e.stopPropagation()} className={`${open ? "scale-100" : "scale-90"} bg-white p-5 rounded-xl shadow-xl transition-all`}>{children}</div>
        </div>,
        root
    )
}

export default Modal