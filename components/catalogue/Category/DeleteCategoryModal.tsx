import { Category } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function DeleteCategoryModal({ open, setOpen, category ,reload}: { open: any, setOpen: any, category: Category,reload:()=>void }) {
    const [loading,setLoading] = useState(false)
    
    async function fetchDelete() {
        try {
            setLoading(true)
            await axios.delete("/api/categories/"+category.id)
            setLoading(false)
            setOpen(false)
            reload()
            toast.success("Concepto eliminado exitosamente.")
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
                <h1 className="font-bold">¿Seguro que desea eliminar el concepto {category.name}?</h1>
                <p>¡Esta acción es permanente, recuerde que puede simplemente marcarla como "inactiva"!</p>
                <button onClick={fetchDelete} disabled={loading} className="underline cursor-pointer">Aceptar</button>
                <button onClick={()=>setOpen(false)} disabled={loading} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default DeleteCategoryModal