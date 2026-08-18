"use client"
import { Anesthesia, Procedure, Stay } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function UpdateStayStatus({ open, setOpen, stay, reload }: { open: any, setOpen: any, stay:Stay, reload: () => void }) {
    const [loading, setLoading] = useState(false)

    async function fetchUpdate() {
        try {
            setLoading(true)
            await axios.put("/api/stays/"+stay.id)
            setLoading(false)
            reload()
            toast.success("Estado actualizado exitosamente.")
            setOpen(false)
        } catch (e: any) {
            setLoading(false)
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    return (
        <Modal open={open} setOpen={setOpen}>
            <div className="flex flex-col gap-1">
                <h1>Cambiar estado del tipo de estancia '{stay.name}'</h1>
                <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default UpdateStayStatus