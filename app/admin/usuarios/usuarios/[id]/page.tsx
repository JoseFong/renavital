"use client"

import UserNavBar from "@/components/users/UserNavBar"
import { UserInfo } from "@/lib/types"
import axios from "axios"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useReducer, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const router = useRouter()
    
    const params = useParams()
    const id = params.id

    const loaded = useRef(false)

    const [user,setUser] = useState<UserInfo>()

    async function fetchUser(){
        try{
            const response = await axios.get("/api/users/"+id)
            setUser(response.data)
        }catch(e:any){
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    useEffect(()=>{
        if(loaded.current) return
        fetchUser()
        loaded.current = true 
    },[])

    if(!user) return null

    return (
        <>
            <UserNavBar selected="usuarios"/>
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-lg">Información del usuario '{user.username}'</h1>

                <button onClick={()=>router.push("/admin/usuarios/usuarios")} className="underline cursor-pointer">Regresar</button>

                <label className="font-bold">Nombre de usuario</label>
                {user.username}

                <label className="font-bold">Correo</label>
                {user.email}
                
                <label className="font-bold">Rol de usuario</label>
                {user.userRole.name}
                
                <label className="font-bold">Médico asociado</label>
                {user.doctor ? user.doctor.firstName+" "+user.doctor.lastName+" "+(user.doctor.secondLastName??"") : "-"}

                <div className="flex flex-row gap-1">
                    <label className="font-bold">¿Requiere de verificación por correo?</label>    
                    <input type="checkbox" checked={user.requireEmailCode} readOnly/>
                </div>
                <div className="flex flex-row gap-1">
                    <label className="font-bold">¿Tiene restricción de IP?</label>    
                    <input type="checkbox" checked={user.restrictByIp} readOnly/>
                </div>
                
                <label className="font-bold">Estado</label>    
                {user.pendingPasswordSetup ?  "Esperando activación por parte del usuario" : 
                    user.active ? "Activo" : "Inactivo"
                }    

                
                
            </div>
        </>
  )
}

export default page