"use client"

import Modal from "@/components/public/Modal"
import { UserInfo } from "@/lib/types"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function UpdateUserStatus({ open, setOpen, user, reload }: { open: any, setOpen: any, user: UserInfo, reload: any }) {
    const [loading,setLoading] = useState(false)
    
    async function fetchUpdate(){
        try{
            setLoading(true)
            toast.loading("Cargando...",{id:"1"})

            await axios.put("/api/users/"+user.id)

            setLoading(false)
            toast.success("Estado de usuario actualizado exitosamente.",{id:"1"})
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
                <h1 className="font-bold">
                    ¿{user.active ? "Desactivar" : "Activar"} al usuario '{user.username}'?
                </h1>
                <p>
                    {user.active ? "El usuario ya no tendrá acceso al sistema de ninguna forma." : "El usuario volverá a tener acceso al sistema dependiendo de su rol de usuario."}
                </p>
                <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer disabled:cursor-not-allowed">Aceptar</button>
                <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer disabled:cursor-not-allowed">Cancelar</button>
            </div>
        </Modal>
    )
}

export default UpdateUserStatus