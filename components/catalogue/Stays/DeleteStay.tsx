"use client"
import { Stay } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import { ProductWithCategory } from "@/lib/types"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function DeleteStay({ open, setOpen, stay, reload }: { open: any, setOpen: any, stay:Stay, reload: () => void }) {
    const [loading,setLoading] = useState(false)

    async function fetchDelete() {
        try {
            setLoading(true)
            await axios.delete("/api/stays/"+stay.id)
            setLoading(false)
            setOpen(false)
            toast.success("Tipo de estancia eliminada exitosamente.")
            reload()
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
                <h1 className="font-bold">¿Seguro que desea eliminar el tipo de estancia '{stay.name}'?</h1>
                <p>¡Esta acción es permanente! Recuerde que puede marcar este tipo de estancia como "Inactivo".</p>
                <button disabled={loading} onClick={fetchDelete} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default DeleteStay