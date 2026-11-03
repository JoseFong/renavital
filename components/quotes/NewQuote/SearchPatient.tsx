"use client"
import { Patient } from "@/app/generated/prisma/client"
import { normalizeText } from "@/lib/normalizeText"
import { use, useEffect, useRef, useState } from "react"

function SearchPatient({
    patients,
    setSelectedPatient,
    selectedPatient,
    loading
}: {
    patients: Patient[],
    setSelectedPatient: any
    selectedPatient: string,
    loading: boolean
}) {
    const [search, setSearch] = useState("")

    const ref = useRef<any | null>(null)
    const searchRef = useRef<any>(null)

    const [open, setOpen] = useState(false)

    function getPatientName(id: number) {
        const patient = patients.find((p) => p.id === id)
        if (!patient) return "-"
        return (patient.firstName + " " + patient.lastName + " " + (patient.secondLastName ?? "")).trim()
    }

    let results = [...patients]
    if (search.trim() !== "") {
        let s = normalizeText(search)
        results = results.filter((p) => {
            const name = normalizeText(p.firstName + " " + p.lastName + " " + (p.secondLastName ?? ""))
            return name.includes(s)
        })
    }

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }

        function handleKeyPress(e:KeyboardEvent){
            if(e.key==="Escape"){
                setOpen(false)
            }
        }

        document.addEventListener("click", handleClick)
        document.addEventListener("keydown",handleKeyPress)

        return () => {
            document.removeEventListener("click", handleClick)
            document.removeEventListener("keydown",handleKeyPress)
        }
    }, [])

    useEffect(()=>{
        if(open && searchRef.current){
            searchRef.current.focus()
        }
    },[open])

    return (
        <div ref={ref}  onClick={() => setOpen(true)} className="border p-1 cursor-pointer disabled:cursor-not-allowed text-start relative">
            {selectedPatient ? getPatientName(Number(selectedPatient)) : "Seleccionar paciente"}
            {open &&
                <div className="border bg-white flex flex-col absolute left-0 w-full top-full">
                    <input ref={searchRef} className="bg-zinc-100 p-1 border-b" placeholder="Buscar" value={search} onChange={(e) => setSearch(e.target.value.toUpperCase())} />

                    {results.map((p, index) => (
                        <button
                            disabled={loading}
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelectedPatient(p.id.toString())
                                setOpen(false)
                                setSearch("")
                            }}
                            key={p.id}
                            className={`${index !== patients.length - 1 && "border-b"} disabled:cursor-not-allowed text-start p-1 cursor-pointer hover:bg-zinc-100`}
                        >
                            {p.firstName}{" "}{p.lastName}{" "}{p.secondLastName ?? ""}
                        </button>
                    ))}
                </div>
            }
        </div>
    )
}

export default SearchPatient