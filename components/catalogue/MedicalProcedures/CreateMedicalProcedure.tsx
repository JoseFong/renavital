"use client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

function CreateMedicalProcedure({ open, setOpen, name, code, selectedConfigurations }: { open: any, setOpen: any, name: string, code: string, selectedConfigurations: number[] }) {
    const router = useRouter()

    const [loading, setLoading] = useState(false)

    async function fetchCreate() {
        try {
            setLoading(true)
            toast.loading("Cargando...", { id: "1" })

            if (code.trim() === "" || name.trim() === "") throw new Error("Complete todos los datos obligatorios.")

            const data = {
                code: code.trim(),
                name: name.trim(),
                configurationIds: selectedConfigurations
            }

            await axios.post("/api/medicalProcedures", data)

            toast.success("Procedimiento médico registrado exitosamente.", { id: "1" })
            setLoading(false)
            router.push("/admin/catalogo/procedimientos")
        } catch (e: any) {
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message, { id: "1" })
        }
    }

    return (
        <Modal open={open} setOpen={setOpen}>
            <div className="flex flex-col gap-1">
                <h1 className="font-bold">¿Seguro que desea registrar el procedimiento médico '{name} ({code})'?</h1>
                <button disabled={loading} onClick={fetchCreate} className="underline cursor-pointer disabled:cursor-not-allowed">Aceptar</button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer disabled:cursor-not-allowed">Cancelar</button>
            </div>
        </Modal>
    )
}

export default CreateMedicalProcedure