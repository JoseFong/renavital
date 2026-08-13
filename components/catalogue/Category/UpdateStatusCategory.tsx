import { Category } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function UpdateStatusCategory({ open, setOpen, category, reload }: { open: any, setOpen: any, category: Category, reload: () => void }) {
    const [loading,setLoading] = useState(false)
    
    async function fetchUpdateStatus() {
        try {
            setLoading(true)
            await axios.put("/api/categories/"+category.id)
            setOpen(false)
            reload()
            toast.success("Categoría actualizada exitosamente.")
            setLoading(false)
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
                <h1>¿Cambiar estado de la categoría {category.name}?</h1>
                <button onClick={fetchUpdateStatus} disabled={loading} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default UpdateStatusCategory