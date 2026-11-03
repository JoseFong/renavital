"use client"

import axios from "axios"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

function page() {
    const params = useSearchParams()
    const nextPage = params.get("next")

    const router = useRouter()

    const [loading,setLoading] = useState(false)

    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")

    const [showPassword,setShowPassword] = useState(false)

    async function fetchLogin(){
        try{
            if(username.trim()==="" || password.trim()==="") throw new Error("Ingrese su usuario/correo y contraseña.")

            setLoading(true)
            toast.loading("Iniciando sesión...",{id:"1"})

            const data = {
                username: username.trim(),
                password: password.trim()
            }

            await axios.post("/api/login",data)

            setLoading(false)
            toast.success("Inicio de sesión exitoso",{id:"1"})
            if(nextPage){
                router.push(nextPage)
            }
        }catch(e:any){
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message,{id:"1"})
        }
    }

    return (
        <div className="flex flex-col gap-1 p-5">
            <h1 className="font-bold text-lg">Iniciar sesión</h1>
        
            <label className="font-bold">Nombre de usuario / Correo</label>
            <input placeholder="Nombre de usuario" value={username} onChange={(e)=>setUsername(e.target.value)}/>
        
            <label className="font-bold">Contraseña</label>
            <input placeholder="Contraseña" type={!showPassword ? "password" : "text"} value={password} onChange={(e)=>setPassword(e.target.value)}/>
        
            <button onClick={()=>setShowPassword(!showPassword)} className="underline cursor-pointer">
                {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            </button>


            <button disabled={loading} onClick={fetchLogin} className="underline cursor-pointer disabled:cursor-not-allowed">Iniciar sesión</button>
        </div>
    )
}

export default page