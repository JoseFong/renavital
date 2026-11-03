import { Code, Patient } from "@/app/generated/prisma/client"
import { DoctorInfo } from "@/lib/types"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { Fragment } from "react/jsx-runtime"

function DiscountCodePersonSection({
    doctor,
    patient,
    loading,
    setDiscountCode,
    discountCode
}: {
    doctor: DoctorInfo | null | undefined,
    patient: Patient | null,
    loading: boolean,
    setDiscountCode: any,
    discountCode: Code | undefined
}) {
    const [loadingCode, setLoadingCode] = useState(false)

    const [code, setCode] = useState("")

    async function fetchValidateCode() {
        try {
            setLoadingCode(true)
            toast.loading("Validando código...", { id: "1" })

            if (code.trim() === "") throw new Error("Ingrese un código de descuento.")

            let type = ""
            let personId

            if (!doctor && !patient) return

            if (doctor) {
                type = "DOCTOR"
                personId = doctor.id
            }

            if (patient) {
                type = "PATIENT"
                personId = patient.id
            }

            const data = {
                code: code.trim(),
                type,
                personId
            }

            const response = await axios.post("/api/quoter/validateDiscountCode", data)
            setDiscountCode(response.data)

            toast.success("Código Válido", { id: "1" })
            setDiscountCode(response.data)
            setLoadingCode(false)
        } catch (e: any) {
            setLoadingCode(false)
            toast.dismissAll()
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    return (
        <Fragment>
            <h1 className="font-bold">Código de descuento</h1>
            <input placeholder="Ingresar código de descuento" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
            <button onClick={fetchValidateCode} disabled={loading || loadingCode} className="underline cursor-pointer disabled:cursor-not-allowed">Validar código</button>
            {discountCode &&
                <button onClick={() => { setDiscountCode(); setCode("") }} disabled={loading || loadingCode} className="underline cursor-pointer disabled:cursor-not-allowed">Borrar Código</button>
            }
        </Fragment>
    )
}

export default DiscountCodePersonSection