import Modal from "@/components/public/Modal"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function UpdateStatus({ open, setOpen, reload, medicalProcedure }: { open: any, setOpen: any, reload: any, medicalProcedure: any }) {
    const [loading,setLoading] = useState(false)

    async function fetchUpdate(){
        try{
            setLoading(true)
            toast.loading("Cargando...",{id:"1"})

            await axios.put("/api/medicalProcedures/"+medicalProcedure.id)

            toast.success("Estado actualizado exitosamente.",{id:"1"})
            reload()
            setOpen(false)
            setLoading(false)
        }catch(e:any){
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message,{id:"1"})
        }
    }

    return (
        <Modal open={open} setOpen={setOpen}>
            <div className="flex flex-col gap-1">
                <h1 className="font-bold">¿Seguro que desea {medicalProcedure.active ? "desactivar" : "activar"} el procedimiento '{medicalProcedure.name}'?</h1>
                {medicalProcedure.active ? "Los usuarios no podrán seleccionar este procedimiento." : "Los usuarios podrán volver a seleccionar este procedimiento."}
            
                <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer disabled:cursor-not-allowed">Aceptar</button>
                <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer disabled:cursor-not-allowed">Cancelar</button>
            </div>
        </Modal>
    )
}

export default UpdateStatus