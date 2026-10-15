"use client"

import Modal from "@/components/public/Modal"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function UpdateUserRole({open,setOpen,reload,role}:{open:any,setOpen:any,reload:any,role:any}) {
    const [name,setName] = useState("")

    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        if(role){
            setName(role.name)
        }
    },[open,role])

    async function fetchPost(){
        try{
            toast.loading("Cargando...",{id:"1"})
            setLoading(true)

            if(name.trim()==="") throw new Error("Ingrese un nombre para el rol de usuario.")

            const data = {
                name: name.trim()
            }

            await axios.patch("/api/userRoles/"+role.id,data)

            setLoading(false)
            toast.success("Rol de usuario actualizado exitosamente",{id:"1"})
            reload()
            setOpen(false)
        }catch(e:any){
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message,{id:"1"})
        }
    }

    return (
        <Modal open={open} setOpen={setOpen}>
            <div className="flex flex-col gap-1">
                <h1 className="font-bold text-lg">Editar información de rol de usuario</h1>
                <label className="font-bold">Nombre</label>
                <input placeholder="Nombre" value={name} onChange={(e)=>setName(e.target.value.toUpperCase())}/>
                <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer disabled:cursor-not-allowed">Cancelar</button>
                <button disabled={loading} onClick={fetchPost} className="underline cursor-pointer disabled:cursor-not-allowed">Aceptar</button>
            </div>
        </Modal>
    )
}

export default UpdateUserRole