"use client"
import { Patient } from "@/app/generated/prisma/client"
import NavBarPersons from "@/components/persons/PersonsNavBar"
import { formatDate } from "@/lib/formatDate"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const params = useParams()
    const id = params.id

    const loaded = useRef(false)

    const router = useRouter()

    const [patient, setPatient] = useState<Patient>()

    async function fetchPatient() {
        try {
            const response = await axios.get("/api/patients/"+id)
            setPatient(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    useEffect(()=>{
        if(loaded.current) return
        fetchPatient()
        loaded.current = true
    },[])

    return (
        <>
            <NavBarPersons selected={"pacientes"} />
            <div className="flex flex-col gap-1 p-5">
                <button onClick={() => router.push("/admin/personas/pacientes")} className="underline cursor-pointer">Regresar</button>
                <div className="flex flex-row w-full">
                    <p className="grow">{patient?.firstName}{" "}{patient?.lastName}{" "}{patient?.secondLastName??""}</p>
                    <button onClick={()=>router.push("/admin/personas/pacientes/"+patient?.id+"/editar")} className="underline cursor-pointer">Editar información</button>
                </div>
                <p>Paciente #{patient?.id}</p>
                <p>Registrado el {formatDate(patient?.registeredAt??"")}</p>
                <div className="border rounded-md flex flex-col gap-1 p-3">
                    <h2 className="font-bold">Información Personal</h2>
                    <div className="grid grid-cols-2">
                        <p className="font-bold">Nombre(s)</p>
                        <p>{patient?.firstName}</p>
                        <p className="font-bold">Apellido Paterno</p>
                        <p>{patient?.lastName??"-"}</p>
                        <p className="font-bold">Apellido Materno</p>
                        <p>{patient?.secondLastName??"-"}</p>
                        <p className="font-bold">Género</p>
                        <p>{patient?.gender??"-"}</p>
                        <p className="font-bold">Fecha de Nacimiento</p>
                        <p>{formatDate((patient?.birthday??""))}</p>
                        <p className="font-bold">CURP</p>
                        <p>{patient?.curp??"-"}</p>
                    </div>
                </div>
                <div className="border rounded-md flex flex-col gap-1 p-3">
                    <h2 className="font-bold">Información de Contacto</h2>
                    <div className="grid grid-cols-2">
                        <p className="font-bold">Teléfono</p>
                        <p>{patient?.countryCode}{" "}{patient?.phone}</p>
                        <p className="font-bold">Teléfono Secundario</p>
                        <p>{patient?.secondaryPhone ? patient.countryCode+" "+patient.secondaryPhone : "-"}</p>
                        <p className="font-bold">Correo Electrónico</p>
                        <p>{patient?.email??"-"}</p>
                        <p className="font-bold">País</p>
                        <p>{patient?.country??"-"}</p>
                        <p className="font-bold">Estado</p>
                        <p>{patient?.state??"-"}</p>
                        <p className="font-bold">Ciudad</p>
                        <p>{patient?.city??"-"}</p>
                        <p className="font-bold">Dirección</p>
                        <p>{patient?.address??"-"}</p>
                    </div>
                </div>
                <div className="border rounded-md flex flex-col gap-1 p-3">
                    <h2 className="font-bold">Otros datos</h2>
                    <div className="grid grid-cols-2">
                        <p className="font-bold">Tipo de Sangre</p>
                        <p>{patient?.bloodType??"-"}</p>
                        <p className="font-bold">Estado Civil</p>
                        <p>{patient?.civilState??"-"}</p>
                        <p className="font-bold">Profesión</p>
                        <p>{patient?.profession??"-"}</p>
                        <p className="font-bold">Idioma Hablado</p>
                        <p>{patient?.language??"-"}</p>
                    </div>
                </div>
                <div className="border rounded-md flex flex-col gap-1 p-3">
                    <h2 className="font-bold">Observaciones</h2>
                    <p>{patient?.observations ? patient.observations : "Sin observaciones"}</p>
                </div>
            </div>
        </>
    )
}

export default page