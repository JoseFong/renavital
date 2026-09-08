"use client"
import { Anesthesia } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function UpdateAnesthesia({ open, setOpen, reload, an }: { open: any, an: Anesthesia, setOpen: any, reload: () => void }) {
    const [code, setCode] = useState("")
    const [name, setName] = useState("")

    const [loading, setLoading] = useState(false)

    function reset() {
        if (an) {
            setCode(an.code)
            setName(an.name)
        }
    }

    useEffect(()=>{
        if(an){
            reset()
        }
    },[open])

    async function fetchUpdate() {
        try {
            setLoading(true)

            if (code.trim() === "" || name.trim() === "") throw new Error("Complete todos los campos.")

            const data = {
                code: code.trim(),
                name: name.trim()
            }

            await axios.patch("/api/anesthesias/"+an.id, data)
            toast.success("Tipo de anestesia actualizado exitosamente.")
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
                <h1 className="font-bold">Actualizar tipo de anestesia</h1>
                <label>Código</label>
                <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Ej. AG" />
                <label>Nombre</label>
                <input value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="Ej. Anestesia General" />
                <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default UpdateAnesthesia