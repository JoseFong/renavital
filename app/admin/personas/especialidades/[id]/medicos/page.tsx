"use client"
import { Doctor } from "@/app/generated/prisma/client"
import NavBarPersons from "@/components/persons/PersonsNavBar"
import { normalizeText } from "@/lib/normalizeText"
import { DoctorInfo, SpecialtyInfo } from "@/lib/types"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const params = useParams()
    const id = params.id
    const idNum = Number(id)

    const loaded = useRef(false)

    const router = useRouter()

    const [loading,setLoading] = useState(false)

    const [specialty, setSpecialty] = useState<SpecialtyInfo>()
    const [doctors, setDoctors] = useState<DoctorInfo[]>([])

    const [availableDoctors, setAvailableDoctors] = useState<DoctorInfo[]>([])
    const [selectedDoctors, setSelectedDoctors] = useState<DoctorInfo[]>([])

    const [availableDoctorsSearch, setAvailableDoctorsSearch] = useState("")
    const [selectedDoctorsSearch, setSelectedDoctorsSearch] = useState("")

    async function fetchSpecialty() {
        try {
            const response = await axios.get("/api/specialties/" + id)
            setSpecialty(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    async function fetchDoctors() {
        try {
            const response = await axios.get("/api/doctors")
            setDoctors(response.data)
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
        fetchDoctors()
        fetchSpecialty()
        loaded.current = true
    }, [])

    useEffect(() => {
        let aux
        aux = doctors.filter((d) => d.doctorSpecialties.some((ds) => ds.specialtyId === idNum))
        setSelectedDoctors(aux)
        aux = doctors.filter((d) => !d.doctorSpecialties.some((ds) => ds.specialtyId === idNum))
        setAvailableDoctors(aux)
    }, [doctors])

    function toggleDoctor(d: DoctorInfo) {
        let aux
        if (selectedDoctors.includes(d)) {
            aux = selectedDoctors.filter((sd) => sd !== d)
            setSelectedDoctors(aux)

            aux = [...availableDoctors]
            aux.push(d)
            setAvailableDoctors(aux)
        } else {
            aux = availableDoctors.filter((sd) => sd !== d)
            setAvailableDoctors(aux)

            aux = [...selectedDoctors]
            aux.push(d)
            setSelectedDoctors(aux)
        }
    }

    let adResults = availableDoctors
    let sdResults = selectedDoctors

    if (availableDoctorsSearch.trim() === "") {
        adResults = availableDoctors
    } else {
        let search = normalizeText(availableDoctorsSearch.trim().toUpperCase())
        adResults = availableDoctors.filter((ad) => {
            let n = normalizeText(ad.firstName.toUpperCase() + " " + ad.lastName.toUpperCase() + " " + (ad.secondLastName ?? ""))
            return n.includes(search)
        })
    }

    if (selectedDoctorsSearch.trim() === "") {
        sdResults = selectedDoctors
    } else {
        let search = normalizeText(selectedDoctorsSearch.trim().toUpperCase())
        sdResults = selectedDoctors.filter((ad) => {
            let n = normalizeText(ad.firstName.toUpperCase() + " " + ad.lastName.toUpperCase() + " " + (ad.secondLastName ?? ""))
            return n.includes(search)
        })
    }

    async function fetchUpdate() {
        try {
            setLoading(true)
            toast.loading("Actualizando...",{id:"a"})
            const ids:number[] = selectedDoctors.map((sd)=>sd.id)

            const data = {
                doctorIds: ids
            }

            await axios.put("/api/specialties/"+id+"/doctors",data)
            setLoading(false)
            toast.success("Médicos asignados exitosamente.",{id:"a"})
            router.push("/admin/personas/especialidades")
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
        <>
            <NavBarPersons selected={"especialidades"} />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold">Médicos de la especialidad '{specialty?.name}'</h1>
                <button onClick={() => router.push("/admin/personas/especialidades")} className="underline cursor-pointer">Regresar</button>
                <div className="flex flex-row gap-10">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold">Médicos disponibles</h1>
                        <input placeholder="Buscar" value={availableDoctorsSearch} onChange={(e) => setAvailableDoctorsSearch(e.target.value)} />
                        <div className="flex flex-col">
                            {adResults.map((d, index) => (
                                <div onClick={() => toggleDoctor(d)} className={`${index === 0 && "rounded-t-lg"} ${index === adResults.length - 1 && "rounded-b-lg"} ${index % 2 === 0 && "bg-zinc-100"} border py-1 px-3 hover:bg-zinc-200 cursor-pointer`} key={d.id}>{d.firstName}{" "}{d.lastName}{" "}{d.secondLastName ?? ""}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold">Médicos en esta especialidad</h1>
                        <input placeholder="Buscar" value={selectedDoctorsSearch} onChange={(e) => setSelectedDoctorsSearch(e.target.value)} />
                        <div className="flex flex-col">
                            {sdResults.map((d, index) => (
                                <div onClick={() => toggleDoctor(d)} className={`${index === 0 && "rounded-t-lg"} ${index === sdResults.length - 1 && "rounded-b-lg"} ${index % 2 === 0 && "bg-zinc-100"} border py-1 px-3 hover:bg-zinc-200 cursor-pointer`} key={d.id}>{d.firstName}{" "}{d.lastName}{" "}{d.secondLastName ?? ""}</div>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={fetchUpdate} className="underline cursor-pointer">Guardar cambios</button>
            </div>
        </>
    )
}

export default page