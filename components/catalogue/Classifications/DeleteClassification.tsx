import { ProductClassification } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function DeleteClassification({ open, setOpen, classification, reload }: { open: any, setOpen: any, classification: ProductClassification, reload: () => void }) {
    const [loading, setLoading] = useState(false)

    async function fetchDelete() {
        try {
            setLoading(true)
            await axios.delete("/api/productClassifications/"+classification.id)
            toast.success("Clasificación eliminada exitosamente.")
            reload()
            setLoading(false)
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
                <h1 className="font-bold">¿Está seguro que desea eliminar la clasificación '{classification.name}'?</h1>
                <p>¡Esta acción es permanente, se eliminarán sus subclasificaciónes!</p>
                <button disabled={loading} onClick={fetchDelete} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default DeleteClassification