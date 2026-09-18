"use client"

import NavBarPersons from "@/components/persons/PersonsNavBar"
import { SpecialtyInfo } from "@/lib/types"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import codes from "@/lib/countryCodes.json"
import toast from "react-hot-toast"
import ConfirmCreateDoctor from "@/components/persons/medicos/ConfirmCreateDoctor"

function page() {
    const router = useRouter()

    const loaded = useRef(false)

    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const [specialties, setSpecialties] = useState<SpecialtyInfo[]>([])

    const initialDoctor = {
        firstName: "",
        lastName: "",
        secondLastName: "",

        gender: "",
        curp: "",
        rfc: "",

        email: "",
        countryCode: "",
        phone: "",
        secondaryPhone: "",

        country: "MÉXICO",
        state: "BAJA CALIFORNIA NORTE",
        city: "MEXICALI",
        address: "",

        university: "",
        licenseNumber: "",

        observations: "",

        defaultExchangeRate: "20",

        specialtyIds: [] as number[]
    }

    const [doctorInfo, setDoctorInfo] = useState<{
        firstName: string,
        lastName: string,
        secondLastName: string,

        gender: string,
        curp: string,
        rfc: string,

        email: string,
        countryCode: string,
        phone: string,
        secondaryPhone: string,

        country: string,
        state: string,
        city: string,
        address: string,

        university: string,
        licenseNumber: string,

        observations: string,

        defaultExchangeRate: string,

        specialtyIds: number[]
    }>(initialDoctor)

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

    useEffect(() => {
        if (loaded.current) return

        setDoctorInfo(initialDoctor)
        fetchSpecialties()

        loaded.current = true
    }, [])

    function handleChange(e: any) {
        const { name, value } = e.target

        setDoctorInfo({
            ...doctorInfo,
            [name]: value.toUpperCase()
        })
    }

    function toggleSpecialty(id: number) {
        if (doctorInfo.specialtyIds.includes(id)) {
            setDoctorInfo({
                ...doctorInfo,
                specialtyIds: doctorInfo.specialtyIds.filter(
                    (specialtyId) => specialtyId !== id
                )
            })
        } else {
            setDoctorInfo({
                ...doctorInfo,
                specialtyIds: [...doctorInfo.specialtyIds, id]
            })
        }
    }

    function proceed() {
        try {
            if (doctorInfo.firstName.trim() === "")
                throw new Error("Ingrese el nombre del médico.")

            if (doctorInfo.lastName.trim() === "")
                throw new Error("Ingrese el apellido paterno del médico.")

            if (doctorInfo.gender.trim() === "")
                throw new Error("Ingrese el género del médico.")

            if (
                doctorInfo.countryCode.trim() === "" ||
                doctorInfo.phone.trim() === ""
            )
                throw new Error("Ingrese el número de teléfono completo del médico.")

            if (doctorInfo.country.trim() === "")
                throw new Error("Ingrese el país de origen del médico.")

            if (doctorInfo.state.trim() === "")
                throw new Error("Ingrese el estado de origen del médico.")

            if (doctorInfo.city.trim() === "")
                throw new Error("Ingrese la ciudad de origen del médico.")

            if (doctorInfo.university.trim() === "")
                throw new Error("Ingrese la universidad del médico.")

            if (doctorInfo.licenseNumber.trim() === "")
                throw new Error("Ingrese la cédula profesional del médico.")

            if (doctorInfo.defaultExchangeRate.trim() === "")
                throw new Error(
                    "Ingrese el tipo de cambio predeterminado del médico."
                )

            if (Number(doctorInfo.defaultExchangeRate) <= 0)
                throw new Error("El tipo de cambio debe ser mayor a 0.")

            if (doctorInfo.specialtyIds.length === 0)
                throw new Error(
                    "Seleccione al menos una especialidad para el médico."
                )

            setIsConfirmOpen(true)

        } catch (e: any) {
            toast.error(e.message)
        }
    }

    return (
        <>
            <NavBarPersons selected="medicos" />

            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-xl">Nuevo médico</h1>

                <div className="shadow-xl rounded-xl flex flex-col gap-2 p-5">
                    <h1 className="font-bold text-lg">
                        Información personal
                    </h1>

                    <div className="flex flex-row gap-5">

                        <div className="flex flex-col gap-2">

                            <div className="flex flex-row gap-1">
                                <label>
                                    Nombre(s)
                                    <span className="font-extrabold text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    name="firstName"
                                    value={doctorInfo.firstName}
                                    onChange={handleChange}
                                    placeholder="Nombre(s)"
                                />
                            </div>

                            <div className="flex flex-row gap-1">
                                <label>
                                    Apellido Paterno
                                    <span className="font-extrabold text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    name="lastName"
                                    value={doctorInfo.lastName}
                                    onChange={handleChange}
                                    placeholder="Apellido Paterno"
                                />
                            </div>

                            <div className="flex flex-row gap-1">
                                <label>Apellido Materno</label>

                                <input
                                    name="secondLastName"
                                    value={doctorInfo.secondLastName}
                                    onChange={handleChange}
                                    placeholder="Apellido Materno"
                                />
                            </div>

                        </div>

                        <div className="flex flex-col gap-2">

                            <div className="flex flex-row gap-1">
                                <label>
                                    Género
                                    <span className="font-extrabold text-red-500">
                                        *
                                    </span>
                                </label>

                                <select
                                    value={doctorInfo.gender}
                                    onChange={(e) =>
                                        setDoctorInfo({
                                            ...doctorInfo,
                                            gender: e.target.value
                                        })
                                    }
                                >
                                    <option value="">
                                        Seleccionar género
                                    </option>

                                    <option value="Femenino">
                                        Femenino
                                    </option>

                                    <option value="Masculino">
                                        Masculino
                                    </option>

                                    <option value="Otro">
                                        Otro
                                    </option>
                                </select>
                            </div>

                            <div className="flex flex-row gap-1">
                                <label>CURP</label>

                                <input
                                    name="curp"
                                    value={doctorInfo.curp}
                                    onChange={handleChange}
                                    placeholder="CURP"
                                />
                            </div>

                            <div className="flex flex-row gap-1">
                                <label>RFC</label>

                                <input
                                    name="rfc"
                                    value={doctorInfo.rfc}
                                    onChange={handleChange}
                                    placeholder="RFC"
                                />
                            </div>

                        </div>

                    </div>
                </div>

                <div className="shadow-xl rounded-xl flex flex-col gap-2 p-5">
                    <h1 className="font-bold text-lg">
                        Información de contacto
                    </h1>

                    <div className="flex flex-row gap-5">

                        <div className="flex flex-col gap-2">

                            <div className="flex flex-row gap-1">
                                <label>
                                    Código
                                    <span className="font-extrabold text-red-500">
                                        *
                                    </span>
                                </label>

                                <select
                                    value={doctorInfo.countryCode}
                                    onChange={(e) =>
                                        setDoctorInfo({
                                            ...doctorInfo,
                                            countryCode: e.target.value
                                        })
                                    }
                                >
                                    <option value="">
                                        Seleccionar código
                                    </option>

                                    {codes.map((c) => (
                                        <option
                                            key={c.code + c.name}
                                            value={c.code}
                                        >
                                            {c.emoji} {c.code}{" ("}
                                            {c.name}
                                            {")"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-row gap-1">
                                <label>
                                    Teléfono
                                    <span className="font-extrabold text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    name="phone"
                                    value={doctorInfo.phone}
                                    onChange={handleChange}
                                    placeholder="Teléfono"
                                />
                            </div>

                            <div className="flex flex-row gap-1">
                                <label>
                                    Teléfono Secundario
                                </label>

                                <input
                                    name="secondaryPhone"
                                    value={doctorInfo.secondaryPhone}
                                    onChange={handleChange}
                                    placeholder="Teléfono Secundario"
                                />
                            </div>

                            <div className="flex flex-row gap-1">
                                <label>
                                    Correo Electrónico
                                </label>

                                <input
                                    name="email"
                                    value={doctorInfo.email}
                                    onChange={handleChange}
                                    placeholder="Correo Electrónico"
                                />
                            </div>

                        </div>

                        <div className="flex flex-col gap-2">

                            <div className="flex flex-row gap-1">
                                <label>
                                    País
                                    <span className="font-extrabold text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    name="country"
                                    value={doctorInfo.country}
                                    onChange={handleChange}
                                    placeholder="País"
                                />
                            </div>

                            <div className="flex flex-row gap-1">
                                <label>
                                    Estado
                                    <span className="font-extrabold text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    name="state"
                                    value={doctorInfo.state}
                                    onChange={handleChange}
                                    placeholder="Estado"
                                />
                            </div>

                            <div className="flex flex-row gap-1">
                                <label>
                                    Ciudad
                                    <span className="font-extrabold text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    name="city"
                                    value={doctorInfo.city}
                                    onChange={handleChange}
                                    placeholder="Ciudad"
                                />
                            </div>

                            <div className="flex flex-row gap-1">
                                <label>
                                    Dirección
                                </label>

                                <input
                                    name="address"
                                    value={doctorInfo.address}
                                    onChange={handleChange}
                                    placeholder="Dirección"
                                />
                            </div>

                        </div>

                    </div>
                </div>

                <div className="shadow-xl rounded-xl flex flex-col gap-2 p-5">
                    <h1 className="font-bold text-lg">
                        Información profesional
                    </h1>

                    <div className="flex flex-col gap-2">

                        <div className="flex flex-row gap-1">
                            <label>
                                Universidad
                                <span className="font-extrabold text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                name="university"
                                value={doctorInfo.university}
                                onChange={handleChange}
                                placeholder="Universidad"
                            />
                        </div>

                        <div className="flex flex-row gap-1">
                            <label>
                                Cédula Profesional
                                <span className="font-extrabold text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                name="licenseNumber"
                                value={doctorInfo.licenseNumber}
                                onChange={handleChange}
                                placeholder="Cédula Profesional"
                            />
                        </div>

                        <div className="flex flex-row gap-1">
                            <label>
                                Tipo de cambio predeterminado
                                <span className="font-extrabold text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                name="defaultExchangeRate"
                                value={doctorInfo.defaultExchangeRate}
                                onChange={(e) =>
                                    setDoctorInfo({
                                        ...doctorInfo,
                                        defaultExchangeRate: e.target.value
                                    })
                                }
                                placeholder="Tipo de cambio"
                            />
                        </div>

                    </div>
                </div>

                <div className="shadow-xl rounded-xl flex flex-col gap-2 p-5">
                    <h1 className="font-bold text-lg">
                        Especialidades
                    </h1>

                    <div className="flex flex-col">

                        {specialties.map((specialty) => (
                            <label
                                key={specialty.id}
                                className="flex flex-row gap-2 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={doctorInfo.specialtyIds.includes(
                                        specialty.id
                                    )}
                                    onChange={() =>
                                        toggleSpecialty(specialty.id)
                                    }
                                />

                                <span>
                                    {specialty.name}
                                </span>
                            </label>
                        ))}

                    </div>
                </div>

                <div className="shadow-xl rounded-xl flex flex-col gap-2 p-5">
                    <h1 className="font-bold text-lg">
                        Observaciones
                    </h1>

                    <textarea
                        value={doctorInfo.observations}
                        onChange={(e) =>
                            setDoctorInfo({
                                ...doctorInfo,
                                observations: e.target.value.toUpperCase()
                            })
                        }
                        placeholder="Observaciones"
                    />
                </div>

                <button
                    onClick={proceed}
                    className="underline cursor-pointer"
                >
                    Registrar
                </button>

                <button
                    onClick={() =>
                        router.push("/admin/personas/medicos")
                    }
                    className="underline cursor-pointer"
                >
                    Regresar
                </button>
            </div>

            {doctorInfo && (
                <ConfirmCreateDoctor
                    open={isConfirmOpen}
                    setOpen={setIsConfirmOpen}
                    doctorInfo={doctorInfo}
                />
            )}
        </>
    )
}

export default page