"use client"
import { Doctor } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import { SpecialtyInfo } from "@/lib/types"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function DeleteSpecialty({ open, setOpen, specialty, reload }: { open: any, setOpen: any, specialty: SpecialtyInfo, reload: any }) {
    const [loading, setLoading] = useState(false)

    async function fetchDelete() {
        try {
            setLoading(true)

            await axios.delete("/api/specialties/"+specialty.id)
            toast.success("Especialidad eliminada exitosamente.")
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
                <h1 className="font-bold">¿Está seguro que desea eliminar esta especialidad?</h1>
                <p>¡Esta acción es permanente!</p>
                {specialty.doctorSpecialties.length > 0 &&
                    <div className="flex flex-col gap-1">
                        <p className="font-bold">Los siguientes médicos serán desasignados de esta especialidad:</p>
                        {specialty.doctorSpecialties.map((ds, index) => (
                            <p key={ds.id}>{index + 1}{". "}{ds.doctor.firstName}{" "}{ds.doctor.lastName}{" "}{ds.doctor.secondLastName ?? ""}</p>
                        ))}
                    </div>
                }
                <button disabled={loading} onClick={fetchDelete} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default DeleteSpecialty