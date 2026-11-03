"use client"
import { Patient } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function TogglePatientCanQuote({ open, setOpen, patient, reload }: { open: boolean, setOpen: any, patient: Patient, reload: any }) {
    const [loading,setLoading] = useState(false)
    
    async function fetchUpdate(){
        try{
            setLoading(true)
            toast.loading("Cargando...",{id:"1"})

            await axios.put("/api/patients/"+patient.id)

            toast.success("Paciente actualizado exitosamente.",{id:"1"})
            setLoading(false)
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
                    {patient.canQuote ? "Quitar permiso de cotizar al paciente " + patient.firstName + " " + patient.lastName + "?" : "¿Permitir al paciente " + patient.firstName + " " + patient.lastName + " cotizar?"}
                </h1>
                {!patient.canQuote &&
                    <p>Para poder cotizar, debera enviarle al paciente su link para cotizar y deberá identificarse con su número telefónico.</p>
                }
                <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer disabled:cursor-not-allowed">Aceptar</button>
                <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer disabled:cursor-not-allowed">Cancelar</button>
            </div>
        </Modal>
    )
}

export default TogglePatientCanQuote