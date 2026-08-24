"use client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function DeleteManyModal({ open, setOpen, selectedIds, reload }: { open: any, setOpen: any, selectedIds: number[], reload: () => void }) {

    const [loading,setLoading] = useState(false)

    async function deleteSelected() {
        try {
            setLoading(true)
            const data = {
                selectedIds: selectedIds
            }
            await axios.post("/api/products/deleteMany", data)
            reload()
            setLoading(false)
            setOpen(false)
            toast.success("Productos eliminados exitosamente.")
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
                <h1 className="font-bold">¿Seguro que desea eliminar los productos?</h1>
                <p>¡Esta acción es permanente, recuerde que puede marcar los prodcutos como "Inactivo"!</p>
                <button disabled={loading} onClick={deleteSelected} className="underline cursor-pointer">Eliminar</button>
                <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default DeleteManyModal