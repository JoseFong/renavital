"use client"
import { Doctor, Patient } from "@/app/generated/prisma/client"
import CodesNavBar from "@/components/codes/CodesNavBar"
import { normalizeText } from "@/lib/normalizeText"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import toast, { useToaster } from "react-hot-toast"

function page() {
    const router = useRouter()

    const loaded = useRef(false)

    const [loading, setLoading] = useState(false)

    const [patients, setPatients] = useState<Patient[]>([])
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [selectedPatients, setSelectedPatients] = useState<Patient[]>([])
    const [selectedDoctors, setSelectedDoctors] = useState<Doctor[]>([])

    const [code, setCode] = useState("")
    const [singleUse, setSingleUse] = useState(false)
    const [maxUses, setMaxUses] = useState("1")
    const [discountType, setDiscountType] = useState("PERCENT")
    const [discount, setDiscount] = useState("0")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [appliesTo, setAppliesTo] = useState("TOTAL")

    const [patientSearch, setPatientSearch] = useState("")
    const [doctorSearch, setDoctorSearch] = useState("")

    const [showPatients, setShowPatients] = useState(false)
    const [showDoctors, setShowDoctors] = useState(false)

    async function fetchDoctors() {
        try {
            const response = await axios.get("/api/doctors")
            setDoctors(response.data)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    async function fetchPatients() {
        try {
            const response = await axios.get("/api/patients")
            setPatients(response.data)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    useEffect(() => {
        if (loaded.current) return
        fetchDoctors()
        fetchPatients()
        loaded.current = true
    }, [])

    useEffect(() => {
        setDiscount("0")
    }, [discountType])

    let availableDoctors = doctors.filter((d) => !selectedDoctors.some((sd) => sd.id === d.id))
    let availablePatients = patients.filter((p) => !selectedPatients.some((sp) => sp.id === p.id))

    let patientResults = [...availablePatients]
    if (patientSearch.trim() !== "") {
        let search = normalizeText(patientSearch.trim())

        patientResults = availablePatients.filter((p) => {
            let fullName = normalizeText(p.firstName + " " + p.lastName + " " + p.secondLastName)
            return fullName.includes(search)
        })
    }

    let doctorResults = [...availableDoctors]
    if (doctorSearch.trim() !== "") {
        let search = normalizeText(doctorSearch.trim())

        doctorResults = availableDoctors.filter((d) => {
            let fullName = normalizeText(d.firstName + " " + d.lastName + " " + d.secondLastName)
            return fullName.includes(search)
        })
    }

    function toggleDoctor(id: number) {
        if (selectedDoctors.some((d) => d.id === id)) {
            let aux = selectedDoctors.filter((sd) => sd.id !== id)
            setSelectedDoctors(aux)
            let doctor = doctors.find((d) => d.id === id)
            if (!doctor) return
            availableDoctors.push(doctor)
        } else {
            availableDoctors = availableDoctors.filter((d) => d.id !== id)
            let doctor = doctors.find((d) => d.id === id)
            if (!doctor) return
            let aux = [...selectedDoctors]
            aux.push(doctor)
            setSelectedDoctors(aux)
        }
    }

    function togglePatient(id: number) {
        if (selectedPatients.some((p) => p.id === id)) {
            let aux = selectedPatients.filter((sp) => sp.id !== id)
            setSelectedPatients(aux)
            let patient = patients.find((p) => p.id === id)
            if (!patient) return
            availablePatients.push(patient)
        } else {
            availablePatients = availablePatients.filter((p) => p.id !== id)
            let patient = patients.find((p) => p.id === id)
            if (!patient) return
            let aux = [...selectedPatients]
            aux.push(patient)
            setSelectedPatients(aux)
        }
    }

    async function fetchCreate() {
        try {
            toast.loading("Cargando...", { id: "1" })
            setLoading(true)

            if(code.trim()==="") throw new Error("Ingrese un nombre para este código.")
            if(discountType!=="FIXED" && discountType!=="PERCENT") throw new Error("Ingrese un tipo de descuento válido.")
            if(discountType==="FIXED" && Number(discount)<=0) throw new Error("Ingrese un valor de descuento válido.")
            if(discountType==="PERCENT" && (Number(discount)<=0 || Number(discount)>100)) throw new Error("Ingrese un porcentaje de descuento válido.")
            if(appliesTo!=="TOTAL" && appliesTo!=="SUBTOTAL") throw new Error("Seleccione una opción sobre la cual aplica este descuento.")
            if(endDate==="") throw new Error("Ingrese una fecha límite válida.")
            if(!singleUse && (Number(maxUses)<=0 || Number(maxUses)%1!==0)) throw new Error("El número maximo de usos debe de ser un entero mayor a 0.")

            const now = new Date()
            const endDateDate = new Date(endDate)

            if(now>endDateDate) throw new Error("La fecha de fin del código no puede ser menor a la fecha actual.")

            if(startDate!==""){
                
                const startDateDate = new Date(startDate)

                if(startDateDate>endDateDate) throw new Error("La fecha de inicio del código no puede ser mayor a la fecha final.")
            }
            
            let appliesToTotal = true
            if(appliesTo==="SUBTOTAL") appliesToTotal=false

            let maxUsesData = Number(maxUses)
            if(singleUse) maxUsesData = 1

            let startDateData = now.getFullYear()+"-"+(now.getMonth()+1).toString().padStart(2,"0")+"-"+now.getDate().toString().padStart(2,"0")
            if(startDate!==""){
                startDateData = startDate
            }

            let doctorIds:number[] = selectedDoctors.map((d)=>d.id)
            let patientIds:number[] = selectedPatients.map((p)=>p.id)
            

            const data = {
                appliesToTotal: appliesToTotal,
                code: code.trim(),
                discount: Number(discount),
                discountType: discountType.trim(),
                endDate: endDate,
                maxUses: Number(maxUsesData),
                singleUse: singleUse,
                startDate: startDateData,
                patientIds,
                doctorIds
            }

            await axios.post("/api/codes",data)

            toast.success("Código creado exitosamente.", { id: "1" })
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
                <h1 className="font-bold text-xl">Registrar nuevo código de descuento</h1>
                <label className="font-bold">Código<span className="text-red-500 font-bold">*</span></label>
                <input placeholder="Código" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />

                <label className="font-bold">Tipo de descuento<span className="text-red-500 font-bold">*</span></label>
                <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
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

                <div className="flex flex-row gap-1">
                    <label className="font-bold">¿Este código es de un solo uso?<span className="text-red-500 font-bold">*</span></label>
                    <input type="checkbox" onChange={() => setSingleUse(!singleUse)} checked={singleUse} />
                </div>

                {!singleUse &&
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
                <label className="font-bold mt-5">¿Para quien aplica este código?</label>
                <div className="flex flex-row gap-10">
                    <div className="flex flex-col gap-2 border rounded-md p-5">
                        <h1 className="font-bold">Pacientes</h1>
                        <label>Pacientes Seleccionados</label>
                        {selectedPatients.length === 0 ? "No hay pacientes seleccionados." :
                            <div className="flex flex-col">
                                {selectedPatients.map((p, index) => (
                                    <div onClick={() => togglePatient(p.id)} key={p.id} className={`${index === 0 && "rounded-t-md"} ${index === selectedPatients.length - 1 && "rounded-b-md"} ${index % 2 === 0 && "bg-zinc-100"} hover:bg-zinc-200 cursor-pointer border p-2`}>{p.firstName}{" "}{p.lastName}{" "}{p.secondLastName ?? ""}</div>
                                ))}
                            </div>
                        }
                        <label>Pacientes diponibles</label>
                        <button onClick={()=>setShowPatients(!showPatients)} className="underline cursor-pointer">
                            {showPatients ? "Ocultar" : "Ver pacientes disponibles"}
                        </button>
                        {showPatients &&
                            <Fragment>
                                <input placeholder="Buscar pacientes" value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} />
                                <div className="flex flex-col">
                                    {patientResults.map((p, index) => (
                                        <div onClick={() => togglePatient(p.id)} key={p.id} className={`${index === 0 && "rounded-t-md"} ${index === patientResults.length - 1 && "rounded-b-md"} ${index % 2 === 0 && "bg-zinc-100"} hover:bg-zinc-200 cursor-pointer border p-2`}>{p.firstName}{" "}{p.lastName}{" "}{p.secondLastName ?? ""}</div>
                                    ))}
                                </div>
                            </Fragment>
                        }
                    </div>
                    <div className="flex flex-col gap-2 border rounded-md p-5">
                        <h1 className="font-bold">Médicos</h1>
                        <label>Médicos Seleccionados</label>
                        {selectedDoctors.length === 0 ? "No hay médicos seleccionados" :
                            <div className="flex flex-col">
                                {selectedDoctors.map((d, index) => (
                                    <div onClick={() => toggleDoctor(d.id)} key={d.id} className={`${index === 0 && "rounded-t-md"} ${index === selectedDoctors.length - 1 && "rounded-b-md"} ${index % 2 === 0 && "bg-zinc-100"} hover:bg-zinc-200 cursor-pointer border p-2`}>{d.firstName}{" "}{d.lastName}{" "}{d.secondLastName ?? ""}</div>
                                ))}
                            </div>
                        }
                        <label>Médicos disponibles</label>
                        <button onClick={() => setShowDoctors(!showDoctors)} className="underline cursor-pointer">
                            {showDoctors ? "Ocultar" : "Mostrar medicos disponibles"}
                        </button>
                        {showDoctors &&
                            <Fragment>
                                <input placeholder="Buscar pacientes" value={doctorSearch} onChange={(e) => setDoctorSearch(e.target.value)} />
                                <div className="flex flex-col">
                                    {doctorResults.map((d, index) => (
                                        <div onClick={() => toggleDoctor(d.id)} key={d.id} className={`${index === 0 && "rounded-t-md"} ${index === doctorResults.length - 1 && "rounded-b-md"} ${index % 2 === 0 && "bg-zinc-100"} hover:bg-zinc-200 cursor-pointer border p-2`}>{d.firstName}{" "}{d.lastName}{" "}{d.secondLastName ?? ""}</div>
                                    ))}
                                </div>
                            </Fragment>
                        }
                    </div>
                </div>
                <button disabled={loading} onClick={fetchCreate} className="disabled:cursor-not-allowed underline cursor-pointer">Crear código</button>
                <button disabled={loading} onClick={()=>router.push("/admin/codigos")} className="underline cursor-pointer disabled:cursor-not-allowed">Regresar</button>
            </div>
        </>
    )
}

export default page