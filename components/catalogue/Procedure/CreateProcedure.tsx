"use client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function CreateProcedure({ open, setOpen, reload }: { open: any, setOpen: any, reload: () => void }) {
    const [code, setCode] = useState("")
    const [name, setName] = useState("")

    const [loading, setLoading] = useState(false)

    function reset(){
        setCode("")
        setName("")
    }

    async function fetchCreate() {
        try {
            setLoading(true)

            if(code.trim()==="" || name.trim()==="") throw new Error("Complete todos los campos.")
            
            const data = {
                code: code.trim(),
                name: name.trim()
            }

            await axios.post("/api/procedures",data)
            toast.success("Tipo de procedimiento creado exitosamente.")
            reload()
            setLoading(false)
            reset()
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
                <h1 className="font-bold">Crear tipo de procedimiento</h1>
                <label>Código</label>
                <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Ej. CMA" />
                <label>Nombre</label>
                <input value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="Ej. CIRUGIA MAYOR"/>
                <button disabled={loading} onClick={fetchCreate} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default CreateProcedure