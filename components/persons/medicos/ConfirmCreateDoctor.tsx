import Modal from "@/components/public/Modal"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

function ConfirmCreateDoctor({
    open,
    setOpen,
    doctorInfo
}: {
    open: any
    setOpen: any
    doctorInfo: any
}) {
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    async function fetchCreate() {
        try {
            setLoading(true)

            const data = {
                ...doctorInfo,
                secondLastName: doctorInfo.secondLastName || null,
                curp: doctorInfo.curp || null,
                rfc: doctorInfo.rfc || null,
                email: doctorInfo.email || null,
                secondaryPhone: doctorInfo.secondaryPhone || null,
                country: doctorInfo.country || null,
                state: doctorInfo.state || null,
                city: doctorInfo.city || null,
                address: doctorInfo.address || null,
                observations: doctorInfo.observations || null,
            }

            await axios.post("/api/doctors", data)

            toast.success("Médico registrado exitosamente.")
            router.push("/admin/personas/medicos")
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
                <h1 className="font-bold">
                    ¿Seguro que desea registrar al médico '
                    {doctorInfo.firstName}{" "}
                    {doctorInfo.lastName}'
                    ?
                </h1>

                <button
                    disabled={loading}
                    onClick={fetchCreate}
                    className="underline cursor-pointer"
                >
                    Aceptar
                </button>

                <button
                    disabled={loading}
                    onClick={() => setOpen(false)}
                    className="underline cursor-pointer"
                >
                    Cancelar
                </button>
            </div>
        </Modal>
    )
}

export default ConfirmCreateDoctor