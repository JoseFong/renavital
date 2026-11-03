"use client"
import Image from "next/image"
import error404 from "@/assets/404.png"
import { useRouter } from "next/navigation"

function page() {
    const router = useRouter()

    return (
        <div className="w-screen h-screen flex items-center justify-center flex-col gap-2">
            <Image src={error404} alt="Error" className="w-32" />
            <p className="text-xl">Página no encontrada.</p>
            <button onClick={()=>router.back()} className="underline cursor-pointer">Regresar</button>
    </div>
    )
}

export default page