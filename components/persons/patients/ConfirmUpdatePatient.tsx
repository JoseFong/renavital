import Modal from "@/components/public/Modal"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

function ConfirmUpdatePatient({ open, setOpen, patientInfo }: { open: any, setOpen: any, patientInfo: any }) {
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    async function fetchCreate() {
        try {
            setLoading(true)

            const data = {
                ...patientInfo,
                secondLastName: patientInfo.secondLastName || null,
                curp: patientInfo.curp || null,
                email: patientInfo.email || null,
                secondaryPhone: patientInfo.secondaryPhone || null,
                address: patientInfo.address || null,
                bloodType: patientInfo.bloodType || null,
                profession: patientInfo.profession || null,
                language: patientInfo.language || null,
                civilState: patientInfo.civilState || null,
                observations: patientInfo.observations || null,
            }


            await axios.patch("/api/patients/"+patientInfo.id, data)
            toast.success("Información actualizada exitosamente.")
            router.push("/admin/personas/pacientes")
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
                <h1 className="font-bold">¿Seguro que desea actualizar la información del paciente '{patientInfo.firstName}{" "}{patientInfo.lastName}'?</h1>
                <button disabled={loading} onClick={fetchCreate} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default ConfirmUpdatePatient