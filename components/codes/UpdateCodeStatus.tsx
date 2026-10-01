"use client"
import { Code } from "@/app/generated/prisma/client"
import Modal from "../public/Modal"
import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import { formatDate } from "@/lib/formatDate"

function UpdateCodeStatus({ open, setOpen, code, reload }: { open: any, setOpen: any, code: Code, reload: () => void }) {
    const now = new Date()
    const endDate = new Date(code.endDate + "")

    let valid = true
    if (now > endDate) valid = false

    const [loading,setLoading] = useState(false)

    async function fetchUpdate(){
        try{
            toast.loading("Cargando...",{id:"1"})
            setLoading(true)

            await axios.put("/api/codes/"+code.id)

            setLoading(false)
            toast.success("Código actualizado exitosamente.",{id:"1"})
            reload()
            setOpen(false)
        }catch(e:any){
            setLoading(true)
            toast.error(e.response?.data?.message ?? e.message,{id:"1"})
        }
    }

    return (
        <Modal open={open} setOpen={setOpen}>
            {valid ?
                <div className="flex flex-col gap-1">
                    <h1 className="font-bold">¿Cambiar estado del código '{code.code}'?</h1>
                    <p>
                        {code.valid ? "Este código ya no podrá ser utilizado por los pacientes o médicos." : "Esté código podrá ser utilizado nuevamente por médicos y pacientes."}
                    </p>
                    <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer disabled:cursor-not-allowed">Aceptar</button>
                    <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer disabled:cursor-not-allowed">Cerrar</button>
                </div>
                :
                <div className="flex flex-col gap-1">
                    <h1 className="font-bold">La fecha límite de vigencia del codigo '{code.code}' ({formatDate(code.endDate+"")}) ya pasó y no puede ser activado.</h1>
                    <p>Para poder activar este código modifique su fecha de vigencia.</p>
                    <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer disabled:cursor-not-allowed">Cerrar</button>
                </div>
            }

        </Modal>
    )
}

export default UpdateCodeStatus