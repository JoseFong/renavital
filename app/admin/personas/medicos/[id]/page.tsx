"use client"
import { DoctorInfo } from "@/lib/types"
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

    const [doctor, setDoctor] = useState<DoctorInfo>()

    async function fetchDoctor() {
        try {
            const response = await axios.get("/api/doctors/" + id)
            setDoctor(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    useEffect(() => {
        if (loaded.current) return
        fetchDoctor()
        loaded.current = true
    }, [])

    return (
        <>
            <NavBarPersons selected={"medicos"} />

            <div className="flex flex-col gap-1 p-5">

                <button
                    onClick={() => router.push("/admin/personas/medicos")}
                    className="underline cursor-pointer"
                >
                    Regresar
                </button>

                <div className="flex flex-row w-full">
                    <p className="grow">
                        {doctor?.firstName}{" "}
                        {doctor?.lastName}{" "}
                        {doctor?.secondLastName ?? ""}
                    </p>

                    <button
                        onClick={() => router.push("/admin/personas/medicos/" + doctor?.id + "/editar")}
                        className="underline cursor-pointer"
                    >
                        Editar información
                    </button>
                </div>

                <p>Médico #{doctor?.id}</p>

                <p>
                    Registrado el {formatDate(doctor?.registeredAt ?? "")}
                </p>

                <div className="border rounded-md flex flex-col gap-1 p-3">
                    <h2 className="font-bold">Información Personal</h2>

                    <div className="grid grid-cols-2">
                        <p className="font-bold">Nombre(s)</p>
                        <p>{doctor?.firstName}</p>

                        <p className="font-bold">Apellido Paterno</p>
                        <p>{doctor?.lastName ?? "-"}</p>

                        <p className="font-bold">Apellido Materno</p>
                        <p>{doctor?.secondLastName ?? "-"}</p>

                        <p className="font-bold">Género</p>
                        <p>{doctor?.gender ?? "-"}</p>

                        <p className="font-bold">CURP</p>
                        <p>{doctor?.curp ?? "-"}</p>

                        <p className="font-bold">RFC</p>
                        <p>{doctor?.rfc ?? "-"}</p>
                    </div>
                </div>

                <div className="border rounded-md flex flex-col gap-1 p-3">
                    <h2 className="font-bold">Información de Contacto</h2>

                    <div className="grid grid-cols-2">
                        <p className="font-bold">Teléfono</p>
                        <p>
                            {doctor?.countryCode}{" "}
                            {doctor?.phone}
                        </p>

                        <p className="font-bold">Teléfono Secundario</p>
                        <p>
                            {doctor?.secondaryPhone
                                ? doctor.countryCode + " " + doctor.secondaryPhone
                                : "-"}
                        </p>

                        <p className="font-bold">Correo Electrónico</p>
                        <p>{doctor?.email ?? "-"}</p>

                        <p className="font-bold">País</p>
                        <p>{doctor?.country ?? "-"}</p>

                        <p className="font-bold">Estado</p>
                        <p>{doctor?.state ?? "-"}</p>

                        <p className="font-bold">Ciudad</p>
                        <p>{doctor?.city ?? "-"}</p>

                        <p className="font-bold">Dirección</p>
                        <p>{doctor?.address ?? "-"}</p>
                    </div>
                </div>

                <div className="border rounded-md flex flex-col gap-1 p-3">
                    <h2 className="font-bold">Información Profesional</h2>

                    <div className="grid grid-cols-2">
                        <p className="font-bold">Universidad</p>
                        <p>{doctor?.university ?? "-"}</p>

                        <p className="font-bold">Cédula Profesional</p>
                        <p>{doctor?.licenseNumber ?? "-"}</p>
                    </div>
                </div>

                <div className="border rounded-md flex flex-col gap-1 p-3">
                    <h2 className="font-bold">Tipo de cambio</h2>
                    <div className="grid grid-cols-2">
                        <p className="font-bold">Tipo de cambio predeterminado</p>
                        <p>{doctor?.defaultExchangeRate}</p>
                    </div>
                    <p className="font-bold">Tipos de cambio especificos</p>
                    {doctor?.exchangeRates.length===0 ? <div>No hay tipos de cambio especificos.</div> : 
                        <table>
                            <thead>
                                <tr>
                                    <th className="p-1 border">Procedimiento</th>
                                    <th className="p-1 border">Tipo de cambio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctor?.exchangeRates.map((er)=>(
                                    <tr key={er.id}>
                                        <td className="border p-1">{er.configuration.procedure.shortForm}{" - "}{er.configuration.anesthesia.shortForm}{" - "}{er.configuration.stay.shortForm}</td>
                                        <td className="border p-1">{er.exchangeRate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>

                <div className="border rounded-md flex flex-col gap-1 p-3">
                    <h2 className="font-bold">Especialidades</h2>

                    <div className="flex flex-col">
                        {doctor?.doctorSpecialties?.length
                            ? doctor.doctorSpecialties.map((ds) => (
                                <p key={ds.id}>
                                    {ds.specialty.name}
                                </p>
                            ))
                            : <p>Sin especialidades registradas</p>
                        }
                    </div>
                </div>

                <div className="border rounded-md flex flex-col gap-1 p-3">
                    <h2 className="font-bold">Observaciones</h2>

                    <p>
                        {doctor?.observations
                            ? doctor.observations
                            : "Sin observaciones"}
                    </p>
                </div>

            </div>
        </>
    )
}

export default page