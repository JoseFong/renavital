"use client"
import { ProductType } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function DeleteProductType({ open, setOpen, productType, reload }: { open: any, setOpen: any, productType:ProductType, reload: () => void }) {
    const [loading,setLoading] = useState(false)

    async function fetchDelete() {
        try {
            setLoading(true)
            await axios.delete("/api/productTypes/"+productType.id)
            setLoading(false)
            setOpen(false)
            toast.success("Tipo de producto eliminado exitosamente.")
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
                <h1 className="font-bold">¿Seguro que desea eliminar el tipo de producto '{productType.name}'?</h1>
                <p>¡Esta acción es permanente! Recuerde que puede marcar este tipo de procedimiento como "Inactivo"</p>
                <button disabled={loading} onClick={fetchDelete} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default DeleteProductType