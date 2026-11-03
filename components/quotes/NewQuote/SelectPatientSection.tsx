"use client"
import { useState } from "react"
import CreateQuickPatient from "./CreateQuickPatient"
import SearchPatient from "./SearchPatient"
import { Patient } from "@/app/generated/prisma/client"

function SelectPatientSection({
    loading,
    patients,
    setSelectedPatient,
    selectedPatient,
    fetchPatients
}:{
    loading:boolean,
    patients:Patient[],
    setSelectedPatient:any,
    selectedPatient:string,
    fetchPatients:any
}) {
    const [isNewPatientOpen,setIsNewPatientOpen] = useState(false)

    return (
        <>
            <div className="flex flex-row gap-1">
                <label className="font-bold">Seleccionar paciente</label>
                <button disabled={loading} onClick={() => setIsNewPatientOpen(true)} className="underline cursor-pointer disabled:cursor-not-allowed">¿No se encuentra el paciente?</button>
            </div>
            <SearchPatient patients={patients} setSelectedPatient={setSelectedPatient} selectedPatient={selectedPatient} loading={loading} />
            <CreateQuickPatient open={isNewPatientOpen} setOpen={setIsNewPatientOpen} setSelectedPatient={setSelectedPatient} reload={fetchPatients} />
        </>
    )
}

export default SelectPatientSection