"use client"
import Modal from "@/components/public/Modal"
import { RuleInfo } from "@/lib/types"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function DeleteRuleModal({ open, setOpen, rule, reload }: { open: any, setOpen: any, rule: RuleInfo, reload: any }) {
    const [loading, setLoading] = useState(false)

    async function fetchDelete() {
        try {
            setLoading(true)
            await axios.delete("/api/rules/"+rule.id)
            toast.success("Regla eliminada exitosamente.")
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
                <h1 className="font-bold">¿Está seguro que desea eliminar esta regla?</h1>
                <p>Esta acción es permanente.</p>
                <button disabled={loading} onClick={fetchDelete} className="underline cursor-pointer">Eliminar</button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default DeleteRuleModal