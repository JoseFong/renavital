"use client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function UpdateProductStatus({ open, setOpen, product, refresh }: { open: any, setOpen: any, product: any, refresh: () => void }) {
    const [loading, setLoading] = useState(false)

    async function fetchUpdate() {
        try {
            setLoading(true)

            await axios.put("/api/products/"+product.id)

            setLoading(false)
            toast.success("Producto actualizado exitosamente.")
            refresh()
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
                <h1 className="font-bold">Actualizar estado de '{product.name}'</h1>
                <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default UpdateProductStatus