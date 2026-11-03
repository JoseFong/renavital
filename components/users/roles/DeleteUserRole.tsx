import { User, UserRole } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { Fragment, useEffect, useState } from "react"
import toast from "react-hot-toast"

function DeleteUserRole({ open, setOpen, userRole, reload }: { open: any, setOpen: any, userRole: UserRole, reload: any }) {
    const [loading,setLoading] = useState(false)
    
    const [users,setUsers] = useState<User[]>([])
    
    async function fetchUsersFromThisRole(){
        try{
            const response = await axios.get("/api/userRoles/"+userRole.id+"/users")
            setUsers(response.data)
        }catch(e:any){
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    useEffect(()=>{
        setUsers([])
        if(open && userRole){
            fetchUsersFromThisRole()
        }
    },[open])

    async function fetchDeleteUserRole(){
        try{
            toast.loading("Cargando...")
            setLoading(true)

            await axios.delete("/api/userRoles/"+userRole.id)

            toast.dismissAll()
            toast.success("Rol de usuario eliminado exitosamente.")
            setLoading(false)
            reload()
            setOpen(false)
        }catch(e:any){
            setLoading(false)
            toast.dismissAll()
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    return (
        <Modal open={open} setOpen={setOpen}>
            <div className="flex flex-col gap-1">
                <h1 className="font-bold">¿Está seguro que quiere eliminar el rol de usuario '{userRole.name}'?</h1>
                <p>¡Esta acción es permanente!</p>
                {users.length>0 && 
                    <Fragment>
                        <p className="font-bold">Los siguientes usuarios se quedarán sin rol de usuario:</p>
                        {users.map((u)=>(
                            <p key={u.id}>{u.username}</p>
                        ))}
                    </Fragment>
                }
                <button onClick={fetchDeleteUserRole} disabled={loading} className="underline cursor-pointer disabled:cursor-not-allowed">Aceptar</button>
                <button onClick={()=>setOpen(false)} disabled={loading} className="underline cursor-pointer disabled:cursor-not-allowed">Cancelar</button>
            </div>
        </Modal>
    )
}

export default DeleteUserRole