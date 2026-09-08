"use client"
import { Stay } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function UpdateStay({ open, setOpen, stay, reload }: { open: any, setOpen: any, stay: Stay, reload: () => void }) {
    const [name, setName] = useState("")
    const [code, setCode] = useState("")

    const [loading, setLoading] = useState(false)

    function reset() {
        if (stay) {
            setName(stay.name)
            setCode(stay.code)
        }
    }

    useEffect(() => {
        if(stay){
            reset()
        }
    }, [open])

    async function fetchUpdate() {
        try {
            setLoading(true)

            if (code.trim() === "" || name.trim() === "") throw new Error("Complete todos los campos.")

            const data = {
                code: code.trim(),
                name: name.trim()
            }

            await axios.patch("/api/stays/" + stay.id, data)

            reload()
            toast.success("Estancia actualizada exitosamente.")
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
                <h1 className="font-bold">Modificar tipo de estancia</h1>
                <label>Código</label>
                <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Ej. H12" />
                <label>Nombre</label>
                <input value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="Hospitalización, Alta al día siguiente antes de 12:00 pm" />
                <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer">Eliminar</button>
            </div>
        </Modal>
    )
}

export default UpdateStay