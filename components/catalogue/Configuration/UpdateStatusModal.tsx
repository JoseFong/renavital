"use client"
import Modal from "@/components/public/Modal"
import { ConfigurationInfo } from "@/lib/types"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function UpdateStatusModal({ open, setOpen, reload, configuration }: { open: any, setOpen: any, reload: () => void, configuration: any }) {
    const [loading, setLoading] = useState(false)

    async function fetchUpdate() {
        try {
            setLoading(true)
            await axios.put("/api/configurations/"+configuration.id)
            toast.success("Configuración actualizada exitosamente.")
            reload()
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
                <h1 className="font-bold">¿Seguro que desea cambiar el estado de la configuración '{configuration.code}'?</h1>
                <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default UpdateStatusModal