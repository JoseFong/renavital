import { Category } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function UpdateCategoryModal({ open, setOpen ,reload,category}: { open: any, setOpen: any,reload:()=>void ,category:Category}) {
    const [name, setName] = useState("")
    const [loading,setLoading] = useState(false)

    function reset() {
        setName(category.name)
    }

    useEffect(()=>{
        reset()
    },[])

    async function fetchUpdate() {
        try {
            setLoading(true)
            if(name.trim()==="") throw new Error("Complete todos los campos.")

            const data = {
                name: name.trim()
            }

            const response = await axios.patch("/api/categories/"+category.id,data)
            setLoading(false)
            setOpen(false)
            reload()
            toast.success("Categoría actualizada exitosamente.")
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
                <h1 className="font-bold">Editar categoría</h1>
                <label>Nombre</label>
                <input value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="Ej. 1.0 BASE ALL" />
                <button
                    disabled={loading}
                    className="underline cursor-pointer"
                    onClick={fetchUpdate}
                >
                    Aceptar
                </button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default UpdateCategoryModal