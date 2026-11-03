import { DoctorInfo, MedicalProcedureInfo } from "@/lib/types"

function DoctorInfoSection({
    doctor,
    medicalProcedures,
    exchangeRate,
    specificExchangeRate
}: {
    doctor: DoctorInfo | null | undefined,
    medicalProcedures: MedicalProcedureInfo[],
    exchangeRate: string,
    specificExchangeRate: string
}) {
    return (
        <>
            <p><span className="font-bold">Médico: </span>{doctor?.firstName}{" "}{doctor?.lastName}{" "}{doctor?.secondLastName ?? ""}</p>

        </>
    )
}

/**
 <p><span className="font-bold">Especialidades: </span>{doctor?.doctorSpecialties.map((ds, index) => {
                if (index === doctor.doctorSpecialties.length - 1) {
                    return ds.specialty.name
                } else {
                    return ds.specialty.name + ", "
                }
            })}</p>


            <p><span className="font-bold">Procedimientos permitidos: </span>{medicalProcedures.map((mp, index) => {
                if (index === medicalProcedures.length - 1) {
                    return mp.name
                } else {
                    return mp.name + ", "
                }
            })}</p>

            <p><span className="font-bold">Tipo de cambio default: </span>${Number(exchangeRate).toFixed(2)}</p>

            <p><span className="font-bold">Tipo de cambio específico: </span>
                {specificExchangeRate==="-" ? "-" : "$"+Number(specificExchangeRate).toFixed(2)}
            </p>
 */

export default DoctorInfoSection