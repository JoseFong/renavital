"use client"
import { Doctor } from "@/app/generated/prisma/client"
import NavBarPersons from "@/components/persons/PersonsNavBar"
import { normalizeText } from "@/lib/normalizeText"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
  const loaded = useRef(false)

  const router = useRouter()

  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [search, setSearch] = useState("")

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
    loaded.current = true
  }, [])

  let doctorResults = doctors

  if (search.trim() === "") {
    doctorResults = [...doctors]
  } else {
    let s = normalizeText(search.trim())

    doctorResults = doctors.filter((d) => {
      const fullName = normalizeText(
        d.firstName +
        " " +
        d.lastName +
        " " +
        (d.secondLastName ?? "")
      )

      return (
        fullName.includes(s) ||
        normalizeText(d.licenseNumber).includes(s) ||
        normalizeText(d.rfc ?? "").includes(s) ||
        d.phone.includes(search.trim())
      )
    })
  }

  function goToDoctorPage(id: number) {
    router.push("/admin/personas/medicos/" + id)
  }

  return (
    <>
      <NavBarPersons selected="medicos" />

      <div className="flex flex-col gap-1 p-5">
        <h1 className="font-bold text-xl">Médicos</h1>

        <button
          onClick={() => router.push("/admin/personas/medicos/nuevo")}
          className="underline cursor-pointer"
        >
          Registrar nuevo
        </button>

        <input
          placeholder="Buscar por nombre, cédula, RFC o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-5 bg-zinc-100 border rounded-md p-2 text-lg">
          <h2 className="font-bold">Nombre</h2>
          <h2 className="font-bold">Teléfono</h2>
          <h2 className="font-bold">Cédula profesional</h2>
          <h2 className="font-bold">RFC</h2>
          <h2 className="font-bold">Acciones</h2>
        </div>

        <div className="flex flex-col text-lg">
          {doctorResults.sort((a,b)=>a.firstName.localeCompare(b.firstName)).map((d, index) => (
            <div
              key={d.id}
              className={`${index === 0 && "rounded-t-lg"} ${
                index === doctorResults.length - 1 && "rounded-b-lg"
              } ${
                index % 2 === 0 && "bg-zinc-100"
              } hover:bg-zinc-200 cursor-pointer border grid grid-cols-5 p-2`}
              onClick={() => goToDoctorPage(d.id)}
            >
              <p>
                {d.firstName}{" "}
                {d.lastName}{" "}
                {d.secondLastName ?? ""}
              </p>

              <p>
                {d.countryCode}{" "}
                {d.phone}
              </p>

              <p>{d.licenseNumber}</p>

              <p>{d.rfc ?? "-"}</p>

              <button className="underline cursor-pointer text-start">
                Ver más
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default page