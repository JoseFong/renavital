"use client"
import NavBarPersons from "@/components/persons/PersonsNavBar"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import codes from "@/lib/countryCodes.json"
import toast from "react-hot-toast"
import ConfirmCreatePatient from "@/components/persons/patients/ConfirmCreatePatient"

function page() {
    const router = useRouter()

    const loaded = useRef(false)

    const [isConfirmOpen,setIsConfirmOpen] = useState(false)

    const bloodTypes = [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-"
    ]

    const civilStates = [
        "Soltero(a)",
        "Casado(a)",
        "Divorciado(a)",
        "Viudo(a)",
        "Separado(a)",
        "Unión libre"
    ]

    const initialPatient = {
        firstName: "",
        lastName: "",
        secondLastName: "",

        gender: "",
        birthday: "",
        curp: "",

        email: "",
        countryCode: "",
        phone: "",
        secondaryPhone: "",

        country: "MÉXICO",
        state: "BAJA CALIFORNIA NORTE",
        city: "MEXICALI",
        address: "",

        bloodType: "",
        civilState: "",
        profession: "",
        language: "",

        observations: ""
    }

    const [patientInfo, setPatientInfo] = useState<{
        firstName: string,
        lastName: string,
        secondLastName: string,

        gender: string,
        curp: string,
        birthday: string,

        email: string,
        countryCode: string,
        phone: string,
        secondaryPhone: string,

        country: string,
        state: string,
        city: string,
        address: string,

        bloodType: string,
        profession: string,
        language: string,
        civilState: string,

        observations: string,
    }>(initialPatient)

    useEffect(() => {
        if (loaded.current) return
        setPatientInfo(initialPatient)
        loaded.current = true
    }, [])

    function handleChange(e: any) {
        const { name, value } = e.target
        setPatientInfo({ ...patientInfo, [name]: value.toUpperCase() })
    }
    
    function proceed(){
        try{
            if(patientInfo.firstName.trim()==="") throw new Error("Ingrese el nombre del paciente.")
            if(patientInfo.lastName.trim()==="") throw new Error("Ingrese el apellido paterno del paciente.")
            if(patientInfo.gender.trim()==="") throw new Error("Ingrese el género del paciente.")
            if(patientInfo.birthday.trim()==="") throw new Error("Ingrese la fecha de nacimiento del paciente.")
            if(patientInfo.countryCode.trim()==="" || patientInfo.phone.trim()==="") throw new Error("Ingrese el número de telefono completo del paciente.")
            if(patientInfo.country.trim()==="") throw new Error("Ingrese el país de origen del paciente.")
            if(patientInfo.state.trim()==="") throw new Error("Ingrese el estado de origen del paciente.")
            if(patientInfo.city.trim()==="") throw new Error("Ingrese la ciudad de origen del paciente.")
            
            setIsConfirmOpen(true)
        }catch(e:any){
            toast.error(e.message)
        }
    }

    return (
        <>
            <NavBarPersons selected="pacientes" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-xl">Nuevo paciente</h1>
                <div className="shadow-xl rounded-xl flex flex-col gap-2 p-5">
                    <h1 className="font-bold text-lg">Información personal</h1>
                    <div className="flex flex-row gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-1">
                                <label>Nombre(s)<span className="font-extrabold text-red-500">*</span></label>
                                <input name="firstName" value={patientInfo.firstName} onChange={handleChange} placeholder="Nombre(s)" />
                            </div>
                            <div className="flex flex-row gap-1">
                                <label>Apellido Paterno<span className="font-extrabold text-red-500">*</span></label>
                                <input name="lastName" value={patientInfo.lastName} onChange={handleChange} placeholder="Apellido Paterno" />
                            </div>
                            <div className="flex flex-row gap-1">
                                <label>Apellido Materno</label>
                                <input name="secondLastName" value={patientInfo.secondLastName} onChange={handleChange} placeholder="Apellido Materno" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-1">
                                <label>Género<span className="font-extrabold text-red-500">*</span></label>
                                <select value={patientInfo.gender} onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}>
                                    <option value={""}>Seleccionar género</option>
                                    <option value={"Femenino"}>Femenino</option>
                                    <option value={"Masculino"}>Masculino</option>
                                    <option value={"Otro"}>Otro</option>
                                </select>
                            </div>
                            <div className="flex flex-row gap-1">
                                <label>Fecha de nacimiento<span className="font-extrabold text-red-500">*</span></label>
                                <input type="date" value={patientInfo.birthday} onChange={(e) => setPatientInfo({ ...patientInfo, birthday: e.target.value })} />
                            </div>
                            <div className="flex flex-row gap-1">
                                <label>CURP</label>
                                <input name="curp" value={patientInfo.curp} onChange={handleChange} placeholder="CURP" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="shadow-xl rounded-xl flex flex-col gap-2 p-5">
                    <h1 className="font-bold text-lg">Información de contacto</h1>
                    <div className="flex flex-row gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-1">
                                <label>Código<span className="font-extrabold text-red-500">*</span></label>
                                <select value={patientInfo.countryCode} onChange={(e) => setPatientInfo({ ...patientInfo, countryCode: e.target.value })}>
                                    <option key="" value={""}>Seleccionar código</option>
                                    {codes.map((c) => (
                                        <option key={c.code + c.name} value={c.code}>
                                            {c.emoji}{" "}{c.code}{" ("}{c.name}{")"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-row gap-1">
                                <label>Teléfono<span className="font-extrabold text-red-500">*</span></label>
                                <input name="phone" value={patientInfo.phone} onChange={handleChange} placeholder="Teléfono" />
                            </div>
                            <div className="flex flex-row gap-1">
                                <label>Teléfono Secundario</label>
                                <input name="secondaryPhone" value={patientInfo.secondaryPhone} onChange={handleChange} placeholder="Teléfono Secundario" />
                            </div>
                            <div className="flex flex-row gap-1">
                                <label>Correo Electrónico</label>
                                <input name="email" value={patientInfo.email} onChange={handleChange} placeholder="Correo Electrónico" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-1">
                                <label>País<span className="font-extrabold text-red-500">*</span></label>
                                <input name="country" value={patientInfo.country} onChange={handleChange} placeholder="País" />
                            </div>
                            <div className="flex flex-row gap-1">
                                <label>Estado<span className="font-extrabold text-red-500">*</span></label>
                                <input name="state" value={patientInfo.state} onChange={handleChange} placeholder="Estado" />
                            </div>
                            <div className="flex flex-row gap-1">
                                <label>Ciudad<span className="font-extrabold text-red-500">*</span></label>
                                <input name="city" value={patientInfo.city} onChange={handleChange} placeholder="Ciudad" />
                            </div>
                            <div className="flex flex-row gap-1">
                                <label>Dirección</label>
                                <input name="address" value={patientInfo.address} onChange={handleChange} placeholder="Dirección" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="shadow-xl rounded-xl flex flex-col gap-2 p-5">
                    <h1 className="font-bold text-lg">Otros datos</h1>
                    <div className="flex flex-row gap-1">
                        <label>Tipo de sangre</label>
                        <select value={patientInfo.bloodType} onChange={(e) => setPatientInfo({ ...patientInfo, bloodType: e.target.value })}>
                            <option value={""}>Seleccionar tipo de sangre</option>
                            {bloodTypes.map((bt) => (
                                <option key={bt} value={bt}>{bt}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-row gap-1">
                        <label>Estado civil</label>
                        <select value={patientInfo.civilState} onChange={(e) => setPatientInfo({ ...patientInfo, civilState: e.target.value })}>
                            <option value={""}>Seleccionar estado civil</option>
                            {civilStates.map((cs) => (
                                <option key={cs} value={cs}>{cs}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-row gap-1">
                        <label>Idioma hablado</label>
                        <input name="language" value={patientInfo.language} onChange={handleChange} placeholder="Idioma hablado" />
                    </div>
                    <div className="flex flex-row gap-1">
                        <label>Profesión</label>
                        <input name="profession" value={patientInfo.profession} onChange={handleChange} placeholder="Profesión" />
                    </div>
                </div>
                <div className="shadow-xl rounded-xl flex flex-col gap-2 p-5">
                    <h1 className="font-bold text-lg">Observaciones</h1>
                    <textarea value={patientInfo.observations} onChange={(e) => setPatientInfo({ ...patientInfo, observations: e.target.value.toUpperCase() })} placeholder="Observaciones" />
                </div>
                <button onClick={proceed} className="underline cursor-pointer">Registrar</button>
                <button onClick={() => router.push("/admin/personas/pacientes")} className="underline cursor-pointer">Regresar</button>
            </div>
            {patientInfo &&
                <ConfirmCreatePatient open={isConfirmOpen} setOpen={setIsConfirmOpen} patientInfo={patientInfo}/>
            }
        </>
    )
}

export default page