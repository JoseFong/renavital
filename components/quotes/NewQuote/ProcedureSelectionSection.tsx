"use client"
import { Anesthesia, Procedure, Stay } from "@/app/generated/prisma/client"
import { ConfigurationInfo, MedicalProcedureInfo } from "@/lib/types"
import { Fragment, useEffect, useState } from "react"

function ProcedureSelectionSection({
    loading,
    selectedMedicalProcedure,
    setSelectedMedicalProcedure,
    medicalProcedures,
    setIdentifiedConfiguration,
    resetItems
}: {
    loading: boolean,
    selectedMedicalProcedure: string,
    setSelectedMedicalProcedure: any,
    medicalProcedures: MedicalProcedureInfo[],
    setIdentifiedConfiguration: any
    resetItems: any
}) {
    const [selectedProcedure, setSelectedProcedure] = useState("")
    const [selectedAnesthesia, setSelectedAnesthesia] = useState("")
    const [selectedStay, setSelectedStay] = useState("")

    //CUANDO SE SELECCIONE UN PROCEDIMIENTO MÉDICO SE FILTRARÁN LOS SIGUIENTES DATOS:
    //TIPOS DE PROCEDIMIENTO - TIPOS DE ANESTESIA - TIPOS DE ESTANCIA
    //TODO ESTO DEPENDIENDO DE QUE COMBINACIONES ESTÉN ASOCIADAS AL PROCEDIMIENTO MEDICO ELEGIDO
    //ESTOS SON TODOS LOS POSIBLES TIPOS DE PROCEDIMIENTO, ANESTESIA Y ESTANCIA ELEGIBLES
    let availableProcedures: Procedure[] = []
    let availableAnesthesias: Anesthesia[] = []
    let availableStays: Stay[] = []
    let availableConfigurations: ConfigurationInfo[] = []
    if (selectedMedicalProcedure !== "") {
        const smp = medicalProcedures.find((mp) => mp.id === Number(selectedMedicalProcedure))
        if (!smp) return

        availableConfigurations = smp.medicalProcedureConfigurations.map((mpc) => mpc.configuration)

        smp.medicalProcedureConfigurations.forEach((mpc) => {
            if (!availableProcedures.some((ap) => ap.id === mpc.configuration.procedure.id)) {
                availableProcedures.push(mpc.configuration.procedure)
            }

            if (!availableAnesthesias.some((aa) => aa.id === mpc.configuration.anesthesia.id)) {
                availableAnesthesias.push(mpc.configuration.anesthesia)
            }

            if (!availableStays.some((as) => as.id === mpc.configuration.stay.id)) {
                availableStays.push(mpc.configuration.stay)
            }
        })
    }

    //SI A MEDIO PROCESO SE CAMBIA EL TIPO DE PROCEDIMIENTO, SE REINICIARÁN LAS DEMAS SELECCIONES
    //ESTO PARA EVITAR ERRORES O BUGS
    useEffect(() => {
        setSelectedAnesthesia("")
        setSelectedProcedure("")
        setSelectedStay("")
    }, [selectedMedicalProcedure])

    //FUNCIONES PARA SELECCIONAR TIPO DE PROCEDIMIENTO, ANESTESIA Y ESTANCIA
    //CUANDO SE HAGA CLICK EN UN BOTON SE EJECUTARAN ESTAS FUNCIONES Y EL BOTON
    //SE PONDRÁ VERDE
    function selectProcedure(id: number) {
        setSelectedProcedure((prev: string) => {
            const next = prev === id.toString() ? "" : id.toString()
            return next
        })

        setSelectedAnesthesia("")
        setSelectedStay("")
        setIdentifiedConfiguration(undefined)
    }

    function selectAnesthesia(id: number) {
        setSelectedAnesthesia((prev: string) => {
            const next = prev === id.toString() ? "" : id.toString()
            return next
        })

        setSelectedStay("")
        setIdentifiedConfiguration(undefined)
    }

    function selectStay(id: number) {
        setSelectedStay((prev: string) =>
            prev === id.toString() ? "" : id.toString()
        )

        setIdentifiedConfiguration(undefined)
    }

    //FUNCIONES PARA DESELECCIONAR EL SIGUIENTE PASO EN CASO DE HABER UN CAMBIO
    //POR EJEMPLO SI YA HABIA SELECCIONADO LAPARO Y ANESTESIA GENERAL Y CAMBIO A CIRUGIA MAYOR
    //SE VA A DESELECCIONAR ANESTESIA GENERAL
    useEffect(() => {
        setSelectedAnesthesia("")
    }, [selectedProcedure])

    useEffect(() => {
        setSelectedStay("")
    }, [selectedAnesthesia])

    //CUANDO SE SELECCIONA UN TIPO DE PROCEDIMIENTO SE FILTRARÁN LOS 
    //TIPOS DE ANESTESIA DEPENDIENDO DE LAS CONFIGURACIONES QUE LO PERMITAN
    let filteredConfigurationsForAnesthesia = [...availableConfigurations]
    if (selectedProcedure !== "") {
        filteredConfigurationsForAnesthesia = filteredConfigurationsForAnesthesia.filter((c) => c.procedureId === Number(selectedProcedure))
    }
    let filteredAnesthesias = availableAnesthesias.filter((aa) => filteredConfigurationsForAnesthesia.some((c) => c.anesthesiaId === aa.id))

    //CUANDO SE SELECCIONA UN TIPO DE ANESTESIA SE FILTRARÁN LOS 
    //TIPOS DE ESTANCIA DEPENDIENDO DE LAS CONFIGURACIONES QUE LO PERMITAN
    let filteredConfigurationsForStay = [...availableConfigurations]
    if (selectedAnesthesia !== "" && selectedProcedure !== "") {
        filteredConfigurationsForStay = filteredConfigurationsForStay.filter((c) => c.procedureId === Number(selectedProcedure) && c.anesthesiaId === Number(selectedAnesthesia))
    }
    let filteredStays = availableStays.filter((s) => filteredConfigurationsForStay.some((c) => c.stayId === s.id))

    //CUANDO SE SELECCIONE TIPO DE PAROCEDIMIENTO - TIPO DE ANESTESIA - TIPO DE ESTANCIA
    //SE FILTRARÁN LAS CONFIGURACIONES DISPONIBLES, ESTO HASTA QUE QUEDE SOLO UNA CONFIGURACIÓN DISPONIBLE
    let filteredConfigurations = [...availableConfigurations]
    if (selectedProcedure !== "") {
        filteredConfigurations = filteredConfigurations.filter((c) => c.procedureId === Number(selectedProcedure))
    }
    if (selectedAnesthesia !== "") {
        filteredConfigurations = filteredConfigurations.filter((c) => c.anesthesiaId === Number(selectedAnesthesia))
    }
    if (selectedStay !== "") {
        filteredConfigurations = filteredConfigurations.filter((c) => c.stayId === Number(selectedStay))
    }

    const identifiedId =
        filteredConfigurations.length === 1 &&
            selectedProcedure !== "" &&
            selectedAnesthesia !== "" &&
            selectedStay !== ""
            ? filteredConfigurations[0].id
            : null

    useEffect(() => {
        if (identifiedId !== null) {
            const config = availableConfigurations.find((c) => c.id === identifiedId)
            setIdentifiedConfiguration(config)
        } else {
            setIdentifiedConfiguration(undefined)
            resetItems()
        }
    }, [identifiedId])

    return (
        <>
            <label className="font-bold">Seleccionar procedimiento</label>
            <select disabled={loading} className="border disabled:cursor-not-allowed" value={selectedMedicalProcedure} onChange={(e) => setSelectedMedicalProcedure(e.target.value)}>
                <option value={""}>Seleccionar procedimiento</option>
                {medicalProcedures.map((mp) => (
                    <option key={mp.id} value={mp.id}>{mp.name}</option>
                ))}
            </select>

            {selectedMedicalProcedure !== "" &&
                <Fragment>
                    <label className="font-bold text-xl">Seleccionar configuración</label>

                    <label className="font-bold">Tipo de procedimiento</label>
                    {availableProcedures.map((ap) => (
                        <button disabled={loading} onClick={() => selectProcedure(ap.id)} className={`${Number(selectedProcedure) === ap.id && "bg-green-300"} disabled:cursor-not-allowed cursor-pointer border p-1`} key={ap.id}>{ap.shortForm}</button>
                    ))}

                    <label className="font-bold">Tipo de anestesia</label>
                    {filteredAnesthesias.map((aa) => (
                        <button disabled={loading || (selectedProcedure === "")} onClick={() => selectAnesthesia(aa.id)} className={`${Number(selectedAnesthesia) === aa.id && "bg-green-300"} disabled:cursor-not-allowed cursor-pointer border p-1`} key={aa.id}>{aa.shortForm}</button>
                    ))}

                    <label className="font-bold">Tipo de estancia</label>
                    {filteredStays.map((as) => (
                        <button disabled={loading || (selectedAnesthesia === "")} onClick={() => selectStay(as.id)} className={`${Number(selectedStay) === as.id && "bg-green-300"} disabled:cursor-not-allowed cursor-pointer border p-1`} key={as.id}>{as.shortForm}</button>
                    ))}
                </Fragment>
            }
        </>
    )
}

export default ProcedureSelectionSection