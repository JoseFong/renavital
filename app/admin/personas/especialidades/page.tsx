"use client"
import { Specialty } from "@/app/generated/prisma/client"
import NavBarPersons from "@/components/persons/PersonsNavBar"
import CreateSpecialty from "@/components/persons/specialties/CreateSpecialty"
import DeleteSpecialty from "@/components/persons/specialties/DeleteSpecialty"
import UpdateSpecialty from "@/components/persons/specialties/UpdateSpecialty"
import { SpecialtyInfo } from "@/lib/types"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const loaded = useRef(false)

    const router = useRouter()
    
    const [specialties, setSpecialties] = useState<SpecialtyInfo[]>([])

    const [selectedSpecialty,setSelectedSpecialty] = useState<SpecialtyInfo|null>(null)
    const [isCreateOpen,setIsCreateOpen] = useState(false)
    const [isUpdateOpen,setIsUpdateOpen] = useState(false)
    const [isDeleteOpen,setIsDeleteOpen] = useState(false)

    async function fetchSpecialties() {
        try {
            const response = await axios.get("/api/specialties")
            setSpecialties(response.data)
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
        fetchSpecialties()
        loaded.current=true
    },[])

    return (
        <>
            <NavBarPersons selected="especialidades" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold">Especialidades</h1>
                <button onClick={()=>setIsCreateOpen(true)} className="underline cursor-pointer">Registrar</button>
                <table>
                    <thead>
                        <tr>
                            <th className="border p-1">Especialidad</th>
                            <th className="border p-1">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {specialties.map((s)=>(
                            <tr key={s.id}>
                                <td className="border p-1">{s.name}</td>
                                <td className="border p-1 gap-1">
                                    <button onClick={()=>router.push("/admin/personas/especialidades/"+s.id+"/medicos")} className="underline cursor-pointer">Ver médicos</button>{" "}
                                    <button onClick={()=>{setSelectedSpecialty(s); setIsUpdateOpen(true)}} className="underline cursor-pointer">Editar</button>{" "}
                                    <button onClick={()=>{setSelectedSpecialty(s); setIsDeleteOpen(true)}} className="underline cursor-pointer">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <CreateSpecialty open={isCreateOpen} setOpen={setIsCreateOpen} reload={fetchSpecialties}/>
            {selectedSpecialty && <>
                <DeleteSpecialty open={isDeleteOpen} setOpen={setIsDeleteOpen} specialty={selectedSpecialty} reload={fetchSpecialties}/>
                <UpdateSpecialty open={isUpdateOpen} setOpen={setIsUpdateOpen} reload={fetchSpecialties} specialty={selectedSpecialty}/>
            </>}
        </>
    )
}

export default page