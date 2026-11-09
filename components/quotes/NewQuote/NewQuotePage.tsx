"use client"

import { AuthenticatedUser, ConfigurationCompleteInfo, ConfigurationInfo, DoctorInfo, MedicalProcedureInfo } from "@/lib/types"
import QuoteNavBar from "../QuoteNavBar"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import { Code, Patient } from "@/app/generated/prisma/client"
import DoctorInfoSection from "./DoctorInfoSection"
import ProcedureSelectionSection from "./ProcedureSelectionSection"
import SelectPatientSection from "./SelectPatientSection"
import ProductSelectionSection from "./ProductSelectionSection"
import Loading from "@/components/public/Loading"
import QuoteDetails from "./QuoteDetails"
import DiscountCodePersonSection from "./DiscountCodePersonSection"
import DateSelectorSection from "./DateSelectorSection"
import { useRouter } from "next/navigation"
import { ItemSelection } from "@/lib/types"

function NewQuotePageDoctor({ session }: { session: AuthenticatedUser|null }) {
    const loaded = useRef(false)

    const router = useRouter()

    const [loadingConfiguration, setLoadingConfiguration] = useState(false)

    const [loading, setLoading] = useState(false)

    const [doctor, setDoctor] = useState<DoctorInfo|null|undefined>()
    const [medicalProcedures, setMedicalProcedures] = useState<MedicalProcedureInfo[]>([])
    const [exchangeRate, setExchangeRate] = useState("")
    const [selectedMedicalProcedure, setSelectedMedicalProcedure] = useState("")
    const [identifiedConfiguration, setIdentifiedConfiguration] = useState<ConfigurationInfo>()
    const [patients, setPatients] = useState<Patient[]>([])
    const [selectedPatient, setSelectedPatient] = useState("")
    const [specificExchangeRate, setSpecificExhangeRate] = useState("-")
    const [discountCode,setDiscountCode] = useState<Code|undefined>()

    const [date,setDate] = useState("")
    const [time,setTime] = useState("")

    const [configuration, setConfiguration] = useState<ConfigurationCompleteInfo | null>(null)

    const [selectedItems, setSelectedItems] = useState<ItemSelection[]>([])

    //OBTENER INFORMACIÓN PREELIMINAR - INFORMACIÓN DEL MEDICO - PROCEDIMIENTOS QUE PEUDE REALIZAR DEPENDIENDO DE SU ESPECIALIDAD
    async function fetchInformationDoctor() {
        try {
            const response = await axios.get("/api/quoter/initialInfo/" + session?.doctorId)
            setDoctor(response.data.doctor)
            setMedicalProcedures(response.data.medicalProcedures)
            setPatients(response.data.patients)
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
        if (session?.doctorId) {
            fetchInformationDoctor()
        }
        loaded.current = true
    }, [])

    useEffect(() => {
        if (doctor) {
            setExchangeRate(doctor.defaultExchangeRate.toString())
        }
    }, [doctor])


    //OBTENER INFORMACIÓN COMPLETA DE LA CONFIGURACIÓN UNA VEZ SE HAYA IDENTIFICADO UNA
    useEffect(() => {
        if (identifiedConfiguration) {
            fetchConfiguration()
            const exRt = doctor?.exchangeRates.find((er) => er.configurationId === identifiedConfiguration.id)
            if (exRt) {
                setSpecificExhangeRate(exRt.exchangeRate.toString())
            } else {
                setSpecificExhangeRate("-")
            }
        } else {
            setSpecificExhangeRate("-")
            setConfiguration(null)
        }
    }, [identifiedConfiguration])

    async function fetchConfiguration() {
        try {
            setLoadingConfiguration(true)
            const response = await axios.get("/api/quoter/configuration/" + identifiedConfiguration?.id)
            setConfiguration(response.data.configuration)
            setLoadingConfiguration(false)
        } catch (e: any) {
            setLoadingConfiguration(false)
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    function resetItems(){
        setSelectedItems([])
    }

    function getTotal() {
        return selectedItems.reduce((sum, si) => {
            return sum + (si.quantity * si.productPrice)
        }, 0)
    }

    function getMedicalProcedureName(){
        const medicalProcedure = medicalProcedures.find((mp)=>mp.id===Number(selectedMedicalProcedure))
        if(!medicalProcedure) return "-"
        return medicalProcedure.name
    }

    async function fetchSaveQuoteDraft(status:string){
        try{
            setLoading(true)
            toast.loading("Cargando...")

            if(selectedPatient==="") throw new Error("Seleccione o registre un paciente.")
            if(selectedMedicalProcedure==="") throw new Error("Seleccione un procedimiento médico.")
            if(!configuration) throw new Error("Seleccione una configuración para el procedimiento.")
            if(date==="") throw new Error("Seleccione una fecha aproximada para el procedimiento.")
            if(time==="") throw new Error("Seleccione una hora aproximada para el procedimiento.")
 
            const data = {
                status: status,
                patientId: Number(selectedPatient),
                doctorId: doctor?.id,
                codeId: discountCode ? discountCode.id : null,
                configurationId: configuration.id,
                subTotalUsd: getTotal(),
                exchangeRate: specificExchangeRate!=="-" ? Number(specificExchangeRate) : Number(exchangeRate),
                scheduledDate: date,
                scheduledTime: time,
                medicalProcedureName: getMedicalProcedureName(),
                extraDiscountType: null,
                extraDiscountValue: null,
                extraDiscountAppliesTo: null,

                selectedItems
            }

            await axios.post("/api/quotes",data)

            toast.dismissAll()
            toast.success("Cotización creada exitosamente.")
            setLoading(false)
            router.push("/cotizaciones/mis_cotizaciones")
        }catch(e:any){
            setLoading(false)
            toast.dismissAll()
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    if(!doctor) return null

    return (
        <>
            <QuoteNavBar selected="nueva" />
            <div className="flex flex-row gap-5 p-5 w-screen">
                <div className="flex flex-col gap-1 w-2/3">
                    <h1 className="font-bold text-lg">Nueva cotización</h1>

                    <DoctorInfoSection doctor={doctor} medicalProcedures={medicalProcedures} exchangeRate={exchangeRate} specificExchangeRate={specificExchangeRate} />
                    <SelectPatientSection loading={loading} patients={patients} setSelectedPatient={setSelectedPatient} selectedPatient={selectedPatient} fetchPatients={fetchPatients} />
                    <ProcedureSelectionSection
                        loading={loading}
                        selectedMedicalProcedure={selectedMedicalProcedure}
                        setSelectedMedicalProcedure={setSelectedMedicalProcedure}
                        medicalProcedures={medicalProcedures}
                        setIdentifiedConfiguration={setIdentifiedConfiguration}
                        resetItems={resetItems}
                    />
                    <DiscountCodePersonSection doctor={doctor} patient={null} loading={loading} setDiscountCode={setDiscountCode} discountCode={discountCode}/>

                    <DateSelectorSection date={date} setDate={setDate} time={time} setTime={setTime}/>

                    {configuration &&
                        <ProductSelectionSection configuration={configuration} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
                    }

                    <button onClick={()=>fetchSaveQuoteDraft("DRAFT")} disabled={loading} className="underline cursor-pointer disabled:cursor-not-allowed">Guardar como borrador</button>
                    <button onClick={()=>fetchSaveQuoteDraft("PENDING_ADMIN")} disabled={loading} className="underline cursor-pointer disabled:cursor-not-allowed">Guardar</button>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-xl w-1/4 fixed right-10 h-[80vh] overflow-y-scroll">
                    <QuoteDetails
                        doctor={doctor}
                        patients={patients}
                        selectedPatient={selectedPatient}
                        medicalProcedures={medicalProcedures}
                        selectedMedicalProcedure={selectedMedicalProcedure}
                        configuration={configuration} exchangeRate={exchangeRate}
                        specificExchangeRate={specificExchangeRate} 
                        selectedItems={selectedItems} 
                        discountCode={discountCode}
                        date={date}
                        time={time}
                    />
                </div>
            </div>

            <Loading open={loadingConfiguration} />
        </>
    )
}

export default NewQuotePageDoctor