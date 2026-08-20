"use client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function CreateProductType({ open, setOpen, reload }: { open: any, setOpen: any, reload: any }) {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")

    function reset(){
        setName("")
    }

    async function fetchCreate() {
        try {
            setLoading(true)
            if(name.trim()==="") throw new Error("Complete todos los campos.")
                
            const data = { 
                name: name.trim()
            }

            await axios.post("/api/productTypes",data)
            toast.success("Tipo de producto creado exitosamente.")
            reload()
            reset()
            setOpen(false)
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
                <h1 className="font-bold">Crear tipo de producto</h1>
                <label>Nombre</label>
                <input value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="Ej. LABORATORIOS" />
                <button disabled={loading} onClick={fetchCreate} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default CreateProductType