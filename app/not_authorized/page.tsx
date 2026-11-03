"use client"

import { useRouter } from "next/navigation"

function page() {
    const router = useRouter()

    return (
        <div className="inset-0 flex items-center justify-center w-full h-screen flex-col">
            <p>No tiene permisos para entrar a esta página.</p>
            <button className="underline cursor-pointer" onClick={()=>router.push("/")}>Regresar a inicio.</button>
        </div>
    )
}

export default page