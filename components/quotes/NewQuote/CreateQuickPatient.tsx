"use client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function CreateQuickPatient({
    open,
    setOpen,
    setSelectedPatient,
    reload,
}: {
    open: any,
    setOpen: any,
    setSelectedPatient: any,
    reload: any
}) {
    const [loading, setLoading] = useState(false)

    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [gender, setGender] = useState("")
    const [phone, setPhone] = useState("")
    const [birthday, setBirthDay] = useState("")

    function reset() {
        setLastName("")
        setFirstName("")
        setGender("")
        setPhone("")
        setBirthDay("")
    }

    async function fetchCreate() {
        try {
            setLoading(true)
            toast.loading("Cargando...", { id: "1" })

            if (lastName.trim() === "") throw new Error("Ingrese un apellido.")
            if (phone.trim() === "") throw new Error("Ingrese un número de teléfono.")
            if (firstName.trim() === "") throw new Error("Ingrese un nombre.")
            if (gender.trim() === "") throw new Error("Ingrese un género.")
            if (birthday.trim() === "") throw new Error("Ingrese una fecha de nacimiento.")

            const data = {
                birthday: birthday.trim(),
                city: "Mexicali",
                country: "México",
                countryCode: "+52",
                firstName: firstName.trim(),
                gender: gender.trim(),
                lastName: lastName.trim(),
                phone: phone.trim(),
                state: "Baja California"
            }

            const response = await axios.post("/api/patients",data)
            setSelectedPatient(response.data.id)


            reload()            
            setLoading(false)
            toast.success("Paciente registrado exitosamente.", { id: "1" })
            reset()
            setOpen(false)
        } catch (e: any) {
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message, { id: "1" })
        }
    }

    return (
        <Modal open={open} setOpen={setOpen}>
            <div className="flex flex-col gap-1">
                <h1 className="font-bold text-lg">Registrar a paciente de forma rápida.</h1>

                <label className="font-bold">Nombre(s)</label>
                <input placeholder="Nombre(s)" value={firstName} onChange={(e) => setFirstName(e.target.value.toUpperCase())} />

                <label className="font-bold">Apellido Paterno</label>
                <input placeholder="Apellido Paterno" value={lastName} onChange={(e) => setLastName(e.target.value.toUpperCase())} />

                <label className="font-bold">Género</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value={""}>Seleccione un género</option>
                    <option value={"Femenino"}>Femenino</option>
                    <option value={"Masculino"}>Masculino</option>
                    <option value={"Otro"}>Otro</option>
                </select>

                <label className="font-bold">Fecha de nacimiento</label>
                <input type="date" value={birthday} onChange={(e) => setBirthDay(e.target.value.toUpperCase())} />

                <label className="font-bold">Número de teléfono</label>
                <input placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value.toUpperCase())} />

                <button disabled={loading} onClick={fetchCreate} className="underline cursor-pointer disabled:cursor-not-allowed">Aceptar</button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer disabled:cursor-not-allowed">Cancelar</button>
            </div>
        </Modal>
    )
}

export default CreateQuickPatient