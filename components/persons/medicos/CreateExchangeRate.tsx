"use client"
import { Anesthesia, Configuration, Procedure, Stay } from '@/app/generated/prisma/client'
import Modal from '@/components/public/Modal'
import { ConfigurationInfo, DoctorInfo } from '@/lib/types'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

function CreateExchangeRate({ open, setOpen, doctor, reload }: { open: any, setOpen: any, doctor: any, reload: any }) {
    const loaded = useRef(false)

    const [loading, setLoading] = useState(false)

    const [configurations, setConfigurations] = useState<ConfigurationInfo[]>([])
    const [procedures, setProcedures] = useState<Procedure[]>([])
    const [anesthesias, setAnesthesias] = useState<Anesthesia[]>([])
    const [stays, setStays] = useState<Stay[]>([])

    const [repeated, setRepeated] = useState("-1")

    const [exchangeRate, setExchangeRate] = useState("20")
    const [selectedAnesthesia, setSelectedAnesthesia] = useState("-1")
    const [selectedProcedure, setselectedProcedure] = useState("-1")
    const [selectedStay, setSelectedStay] = useState("-1")
    const [detectedConfiguration, setDetectedConfiguration] = useState<ConfigurationInfo | null>(null)

    async function fetchInfo() {
        try {
            const response = await axios.get("/api/exchangeRates/info")
            setConfigurations(response.data.configurations)
            setProcedures(response.data.procedures)
            setAnesthesias(response.data.anesthesias)
            setStays(response.data.stays)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    async function fetchCreate() {
        try {
            setLoading(true)
            toast.loading("Cargando...", { id: "1" })

            if (selectedProcedure === "-1") throw new Error("Seleccione un procedimiento.")
            if (selectedAnesthesia === "-1") throw new Error("Seleccione un tipo de anestesia.")
            if (selectedStay === "-1") throw new Error("Seleccione un tipo de estancia.")
            if (!detectedConfiguration) throw new Error("No se encontró la configuración.")

            if (exchangeRate === "") throw new Error("Ingrese un tipo de cambio.")
            if (Number(exchangeRate) < 18 || Number(exchangeRate) > 25) throw new Error("Ingrese un tipo de cambio válido.")

            const data = {
                configurationId: detectedConfiguration.id,
                doctorId: doctor.id,
                exchangeRate: Number(exchangeRate)
            }

            await axios.post("/api/exchangeRates", data)

            reload()
            reset()
            setLoading(false)
            toast.success("Tipo de cambio registrado exitosamente.", { id: "1" })
            setOpen(false)
        } catch (e: any) {
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message, { id: "1" })
        }
    }

    async function fetchUpdate() {
        try {
            setLoading(true)
            toast.loading("Cargando...", { id: "1" })

            if (selectedProcedure === "-1") throw new Error("Seleccione un procedimiento.")
            if (selectedAnesthesia === "-1") throw new Error("Seleccione un tipo de anestesia.")
            if (selectedStay === "-1") throw new Error("Seleccione un tipo de estancia.")
            if (!detectedConfiguration) throw new Error("No se encontró la configuración.")

            if (exchangeRate === "") throw new Error("Ingrese un tipo de cambio.")
            if (Number(exchangeRate) < 18 || Number(exchangeRate) > 25) throw new Error("Ingrese un tipo de cambio válido.")

            const data = {
                configurationId: detectedConfiguration.id,
                doctorId: doctor.id,
                exchangeRate: Number(exchangeRate)
            }

            await axios.patch("/api/exchangeRates/" + repeated, data)

            reload()
            reset()
            setLoading(false)
            toast.success("Tipo de cambio registrado exitosamente.", { id: "1" })
            setOpen(false)
        } catch (e: any) {
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message, { id: "1" })
        }
    }

    useEffect(() => {
        if (loaded.current) return
        fetchInfo()
        loaded.current = true
    }, [])

    //activar/desactivar opciones dependiendo de cambios anteriores
    useEffect(() => {
        setSelectedAnesthesia("-1")
    }, [selectedProcedure])

    useEffect(() => {
        setSelectedStay("-1")
    }, [selectedAnesthesia])

    //filtrar anestesias dependiendo de cambios en el procedimiento
    let configurationsForAnesthesia = [...configurations]
    let filteredAnesthesias = [...anesthesias]
    if (selectedProcedure !== "-1") {
        configurationsForAnesthesia = configurations.filter((c) => c.procedureId === Number(selectedProcedure))
        filteredAnesthesias = anesthesias.filter((a) => configurationsForAnesthesia.some((c) => c.anesthesiaId === a.id))
    }

    //filtrar estancias dependiendo de la anestesia
    let configurationsForStay = [...configurations]
    let filteredStays = [...stays]
    if (selectedAnesthesia !== "-1") {
        configurationsForStay = configurations.filter((c) => c.anesthesiaId === Number(selectedAnesthesia) && c.procedureId === Number(selectedProcedure))
        filteredStays = stays.filter((s) => configurationsForStay.some((c) => c.stayId === s.id))
    }

    useEffect(() => {
        if (selectedProcedure !== "-1" && selectedAnesthesia !== "-1" && selectedStay !== "-1") {
            const configuration = configurations.find((c) => c.procedureId === Number(selectedProcedure) && c.anesthesiaId === Number(selectedAnesthesia) && c.stayId === Number(selectedStay))
            if (!configuration) return
            setDetectedConfiguration(configuration)
            if (doctor.exchangeRates.some((er:any) => er.configurationId === configuration.id)) {
                const exchangeRate = doctor.exchangeRates.find((er:any) => er.configurationId === configuration.id)
                if (!exchangeRate) return
                setRepeated(exchangeRate.id.toString())
                setExchangeRate(exchangeRate.exchangeRate.toString())
            } else {
                setRepeated("-1")
            }
        } else {
            setRepeated("-1")
            setDetectedConfiguration(null)
        }
    }, [selectedProcedure, selectedAnesthesia, selectedStay])

    function reset() {
        setselectedProcedure("-1")
        setSelectedAnesthesia("-1")
        setSelectedStay("-1")
        setRepeated("-1")
        setDetectedConfiguration(null)
    }

    return (
        <Modal open={open} setOpen={setOpen}>
            <div className='flex flex-col gap-1'>
                <h1 className='font-bold'>Asignar nuevo tipo de cambio especifico al médico '{doctor.firstName}{" "}{doctor.lastName}'</h1>
                <label className='font-bold'>Procedimiento</label>
                <select value={selectedProcedure} onChange={(e) => setselectedProcedure(e.target.value)}>
                    <option value={"-1"}>Seleccionar procedimiento</option>
                    {procedures.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <label className='font-bold'>Anestesia</label>
                <select disabled={selectedProcedure === "-1"} className='disabled:cursor-not-allowed' value={selectedAnesthesia} onChange={(e) => setSelectedAnesthesia(e.target.value)}>
                    <option value={"-1"}>Seleccionar anestesia</option>
                    {filteredAnesthesias.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                </select>
                <label className='font-bold'>Estancia</label>
                <select disabled={selectedAnesthesia === "-1"} className='disabled:cursor-not-allowed' value={selectedStay} onChange={(e) => setSelectedStay(e.target.value)}>
                    <option value={"-1"}>Seleccionar estancia</option>
                    {filteredStays.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
                {repeated !== "-1" &&
                    <div className='p-2 border rounded-md'>
                        <p className='font-bold'>⚠️ Este médico ya tiene un tipo de cambio específico para esta combinación.</p>
                        <p>
                            <span className='font-bold'>Tipo de cambio actual: </span>
                            ${(doctor.exchangeRates.find((er:any) => er.id === Number(repeated))?.exchangeRate ?? 0).toFixed(2)}
                        </p>
                    </div>
                }
                {detectedConfiguration ?
                    <p><span className='font-bold'>Configuración: </span>{detectedConfiguration.procedure.shortForm}{" - "}{detectedConfiguration.anesthesia.shortForm}{" - "}{detectedConfiguration.stay.shortForm}</p>
                    :
                    <p><span className='font-bold'>Configuración: </span>No encontrada</p>
                }
                <label className='font-bold'>Tipo de cambio</label>
                <input type="number" value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)} min={18} max={25} step={0.01} />
                {repeated !== "-1" ?
                    <button onClick={fetchUpdate} disabled={loading} className='underline cursor-pointer disabled:cursor-not-allowed'>Editar</button> :
                    <button onClick={fetchCreate} disabled={loading} className='underline cursor-pointer disabled:cursor-not-allowed'>Aceptar</button>
                }
                <button disabled={loading} onClick={() => setOpen(false)} className='underline cursor-pointer disabled:cursor-not-allowed'>Cancelar</button>
            </div>
        </Modal>
    )
}

export default CreateExchangeRate