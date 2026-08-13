import Modal from "@/components/public/Modal"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function CreateCategoryModal({ open, setOpen ,reload}: { open: any, setOpen: any,reload:()=>void }) {
    const [name, setName] = useState("")
    const [loading,setLoading] = useState(false)

    function reset() {
        setName("")
    }

    async function fetchCreateProduct() {
        try {
            setLoading(true)
            if(name.trim()==="") throw new Error("Complete todos los campos.")

            const data = {
                name: name.trim()
            }

            const response = await axios.post("/api/categories",data)
            setLoading(false)
            reset()
            setOpen(false)
            reload()
            toast.success("Categoría creada exitosamente.")
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
                <h1 className="font-bold">Registrar categoría</h1>
                <label>Nombre</label>
                <input value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="Ej. 1.0 BASE ALL" />
                <button
                    disabled={loading}
                    className="underline cursor-pointer"
                    onClick={fetchCreateProduct}
                >
                    Aceptar
                </button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default CreateCategoryModal