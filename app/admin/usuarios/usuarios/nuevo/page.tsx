"use client"

import { Doctor, UserRole } from "@/app/generated/prisma/client"
import UserNavBar from "@/components/users/UserNavBar"
import { isValidEmail } from "@/lib/validations"
import axios from "axios"
import { useRouter } from "next/navigation"
import { use, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const router = useRouter()

    const loaded = useRef(false)

    const [loading,setLoading] = useState(false)

    const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [userRoleId,setUserRoleId] = useState("")
    const [doctorId,setDoctorId] = useState("")

    const [requireEmailCode,setRequireEmailCode] = useState(false)
    const [restrictByIp,setRestrictByIp] = useState(false)
    
    const [doctors,setDoctors] = useState<Doctor[]>([])
    const [userRoles,setUserRoles] = useState<UserRole[]>([])

    async function fetchUserRoles(){
        try{
            const response = await axios.get("/api/userRoles")
            setUserRoles(response.data)
        }catch(e:any){
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    async function fetchDoctors(){
        try{
            const response = await axios.get("/api/doctors")
            setDoctors(response.data)
        }catch(e:any){
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    useEffect(()=>{
        if(loaded.current) return
        fetchDoctors()
        fetchUserRoles()
        loaded.current = true
    },[])

    async function fetchCreateUser(){
        try{
            setLoading(true)
            toast.loading("Cargando...",{id:"1"})

            if(username.trim()==="") throw new Error("Ingrese un nombre de usuario")
            if(username.trim().includes(" ")) throw new Error("El nombre de usuario no permite espacios.")
            
            if(email.trim()==="") throw new Error("Ingrese un correo electrónico")
            if(!isValidEmail(email.trim())) throw new Error("Ingrese un correo electrónico con un formato válido.")

            if(userRoleId==="") throw new Error("Seleccione un rol de usuario.")

            let doctorIdData = null
            if(doctorId!=="") doctorIdData = Number(doctorId)

            const data = {
                username: username.trim(),
                email: email.trim(),
                userRoleId: Number(userRoleId),
                doctorId: doctorIdData,
                restrictByIp: restrictByIp,
                requireEmailCode: requireEmailCode
            }

            await axios.post("/api/users",data)

            setLoading(false) 
            toast.success("Usuario registrado exitosamente",{id:"1"})
            router.push("/admin/usuarios/usuarios")
        }catch(e:any){
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message,{id:"1"})
        }
    }

    return (
        <>
            <UserNavBar selected="usuarios" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-lg">Crear nuevo usuario</h1>
                <label className="font-bold">Nombre de usuario<span className="font-bold text-red-500">*</span></label>
                <input placeholder="Nombre de usuario" value={username} onChange={(e)=>setUsername(e.target.value)}/>

                <label className="font-bold">Correo electrónico<span className="font-bold text-red-500">*</span></label>
                <input placeholder="Correo electrónico" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            
                <label className="font-bold">Rol de usuario<span className="font-bold text-red-500">*</span></label>
                <select value={userRoleId} onChange={(e)=>setUserRoleId(e.target.value)}>
                    <option value={""}>Seleccione un rol de usuario</option>
                    {userRoles.map((ur)=>(
                        <option key={ur.id} value={ur.id}>{ur.name}</option>
                    ))}
                </select>

                <label className="font-bold">Médico asociado a esta cuenta</label>
                <select value={doctorId} onChange={(e)=>setDoctorId(e.target.value)}>
                    <option value={""}>Seleccione una opción (opcional)</option>
                    {doctors.map((d)=>(
                        <option key={d.id} value={d.id}>{d.firstName}{" "}{d.lastName}{" "}{d.secondLastName??""}</option>
                    ))}
                </select>

                <div className="flex flex-row gap-1">
                    <label className="font-bold">¿Pedir código de confirmación por correo cada que inicie sesión?</label>
                    <input type="checkbox" checked={requireEmailCode} onChange={()=>setRequireEmailCode(!requireEmailCode)}/>
                </div>

                <div className="flex flex-row gap-1">
                    <label className="font-bold">¿Limitar la IP de inicio de sesión solo a las IPs permitidas?</label>
                    <input type="checkbox" checked={restrictByIp} onChange={()=>setRestrictByIp(!restrictByIp)}/>
                </div>

                <button disabled={loading} onClick={fetchCreateUser} className="underline cursor-pointer disabled:cursor-not-allowed">Aceptar</button>
                <button disabled={loading} onClick={()=>router.push("/admin/usuarios/usuarios")} className="underline cursor-pointer disabled:cursor-not-allowed">Regresar</button>
            </div>
        </>
    )
}

export default page