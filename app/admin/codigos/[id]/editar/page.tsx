"use client"
import CodesNavBar from "@/components/codes/CodesNavBar"
import { CodeInfo } from "@/lib/types"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const params = useParams()
    const id = params.id

    const [code, setCode] = useState<CodeInfo>()

    const router = useRouter()

    const loaded = useRef(false)

    const [loading, setLoading] = useState(false)

    const [maxUses, setMaxUses] = useState("1")
    const [discountType, setDiscountType] = useState("PERCENT")
    const [discount, setDiscount] = useState("0")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [appliesTo, setAppliesTo] = useState("TOTAL")

    async function fetchCode() {
        try {
            const response = await axios.get("/api/codes/" + id)
            setCode(response.data)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message, { id: "1" })
        }
    }

    useEffect(() => {
        if (loaded.current) return
        fetchCode()
        loaded.current = true
    }, [])


    useEffect(() => {
        if (code) {
            setMaxUses(code.maxUses.toString())
            setDiscountType(code.discountType)
            setDiscount(code.discount.toString())
            setStartDate(code.startDate)
            setEndDate(code.endDate)
            if(code.appliesToTotal){
                setAppliesTo("TOTAL")
            }else{
                setAppliesTo("SUBTOTAL")
            }
        }
    }, [code])

    async function fetchUpdate() {
        try {
            toast.loading("Cargando...", { id: "1" })
            setLoading(true)

            if (discountType !== "FIXED" && discountType !== "PERCENT") throw new Error("Ingrese un tipo de descuento válido.")
            if (discountType === "FIXED" && Number(discount) <= 0) throw new Error("Ingrese un valor de descuento válido.")
            if (discountType === "PERCENT" && (Number(discount) <= 0 || Number(discount) > 100)) throw new Error("Ingrese un porcentaje de descuento válido.")
            if (appliesTo !== "TOTAL" && appliesTo !== "SUBTOTAL") throw new Error("Seleccione una opción sobre la cual aplica este descuento.")
            if (endDate === "") throw new Error("Ingrese una fecha límite válida.")
            
            const now = new Date()
            const endDateDate = new Date(endDate)

            if (now > endDateDate) throw new Error("La fecha de fin del código no puede ser menor a la fecha actual.")

            if (startDate !== "") {

                const startDateDate = new Date(startDate)

                if (startDateDate > endDateDate) throw new Error("La fecha de inicio del código no puede ser mayor a la fecha final.")
            }

            let appliesToTotal = true
            if (appliesTo === "SUBTOTAL") appliesToTotal = false

            let maxUsesData = Number(maxUses)

            let startDateData = now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, "0") + "-" + now.getDate().toString().padStart(2, "0")
            if (startDate !== "") {
                startDateData = startDate
            }


            const data = {
                appliesToTotal: appliesToTotal,
                discount: Number(discount),
                discountType: discountType.trim(),
                endDate: endDate,
                maxUses: Number(maxUsesData),
                startDate: startDateData
            }

            await axios.patch("/api/codes/"+id, data)

            toast.success("Código actualizado exitosamente.", { id: "1" })
            setLoading(false)
            router.push("/admin/codigos")
        } catch (e: any) {
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message, { id: "1" })
        }
    }

    return (
        <>
            <CodesNavBar selected="codigos" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-xl">Editar detalles del código '{code?.code}'</h1>

                <label className="font-bold">Tipo de descuento<span className="text-red-500 font-bold">*</span></label>
                <select value={discountType} onChange={(e) => {setDiscountType(e.target.value); setDiscount("0")}}>
                    <option value="PERCENT">Porcentaje</option>
                    <option value="FIXED">Cantidad</option>
                </select>

                {discountType === "FIXED" &&
                    <Fragment>
                        <label className="font-bold">Cantidad de descuento (USD)<span className="text-red-500 font-bold">*</span></label>
                        <input type="number" placeholder="Cantidad de descuento" value={discount} onChange={(e) => setDiscount(e.target.value)} min={0} />
                    </Fragment>
                }

                {discountType === "PERCENT" &&
                    <Fragment>
                        <label className="font-bold">Porcentaje de descuento (%)<span className="text-red-500 font-bold">*</span></label>
                        <input type="number" placeholder="Porcentaje de descuento" value={discount} onChange={(e) => setDiscount(e.target.value)} min={0} step={0.1} />
                    </Fragment>
                }

                <label className="font-bold">Este descuento aplica sobre:<span className="text-red-500 font-bold">*</span></label>
                <select value={appliesTo} onChange={(e) => setAppliesTo(e.target.value)}>
                    <option value="TOTAL">Total</option>
                    <option value="SUBTOTAL">Subtotal</option>
                </select>

                {!code?.singleUse &&
                    <Fragment>
                        <label className="font-bold">Máximos usos por persona<span className="text-red-500 font-bold">*</span></label>
                        <input type="number" placeholder="Usos máximos" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} min={1} />
                    </Fragment>
                }

                <label className="font-bold">Rango de fechas</label>
                <div className="flex flex-row gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Fecha de inicio</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">Fecha final<span className="text-red-500 font-bold">*</span></label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
                <button disabled={loading} onClick={fetchUpdate} className="disabled:cursor-not-allowed underline cursor-pointer">Editar código</button>
                <button disabled={loading} onClick={() => router.push("/admin/codigos")} className="underline cursor-pointer disabled:cursor-not-allowed">Regresar</button>
            </div>
        </>
    )
}

export default page