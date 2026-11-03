"use client"

import Modal from "@/components/public/Modal"
import { UserInfo, UserRoleInfo } from "@/lib/types"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { Fragment } from "react/jsx-runtime"

function ConfirmAssignRoles({ open, setOpen, usersWithNoRole, selectedUsers, role }: { open: any, setOpen: any, usersWithNoRole: UserInfo[], selectedUsers: number[], role: UserRoleInfo }) {
    const [loading,setLoading] = useState(false)

    async function fetchPost(){
        try{
            toast.loading("Cargando...",{id:"1"})
            setLoading(true)

            const data = {
                userIds: selectedUsers
            }

            await axios.post("/api/userRoles/"+role.id+"/users",data)

            setOpen(false)
            setLoading(false)
            toast.success("Usuarios asignados exitosamente.",{id:"1"})
        }catch(e:any){
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message, {id:"1"})
        }
    }
    
    return (
        <Modal open={open} setOpen={setOpen}>
            <div className="flex flex-col gap-1">
                <h1 className="font-bold">¿Está seguro que quiere actualizar los usuarios de este rol?</h1>
                {usersWithNoRole.length > 0 &&
                    <Fragment>
                        <p className="font-bold">¡Los siguientes usuarios se quedarán sin rol y no podrán acceder hasta que se les asigne otro!</p>
                        {usersWithNoRole.map((u) => (
                            <p key={u.id}>{u.username}{" "}({u.email})</p>
                        ))}
                    </Fragment>
                }
                <button disabled={loading} onClick={fetchPost} className="underline cursor-pointer disabled:cursor-not-allowed">Aceptar</button>
                <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer disabled:cursor-not-allowed">Cancelar</button>
            </div>
        </Modal>
    )
}

export default ConfirmAssignRoles