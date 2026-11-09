import { Code, MedicalProcedure, Patient } from '@/app/generated/prisma/client'
import { formatDate } from '@/lib/formatDate'
import { ConfigurationCompleteInfo, ConfigurationInfo, DoctorInfo, MedicalProcedureInfo } from '@/lib/types'
import React, { Fragment, useState } from 'react'
import { ItemSelection } from '@/lib/types'

function QuoteDetails({
    doctor,
    patients,
    selectedPatient,
    medicalProcedures,
    selectedMedicalProcedure,
    configuration,
    exchangeRate,
    specificExchangeRate,
    selectedItems,
    discountCode,
    date,
    time
}: {
    doctor: DoctorInfo | undefined | null,
    patients: Patient[],
    selectedPatient: string,
    medicalProcedures: MedicalProcedureInfo[],
    selectedMedicalProcedure: string,
    configuration: ConfigurationCompleteInfo | null,
    exchangeRate: string,
    specificExchangeRate: string,
    selectedItems: ItemSelection[],
    discountCode: Code | undefined,
    date:string,
    time:string
}) {
    const [showDetails, setShowDetails] = useState(false)

    function getPatientFullName() {
        if (selectedPatient !== "") {
            const patient = patients.find((p) => p.id === Number(selectedPatient))
            if (!patient) return "-"
            return patient.firstName + " " + patient.lastName + " " + (patient.secondLastName ?? "")
        } else {
            return "-"
        }
    }

    function getCategorySubtotal(categoryId: number) {
        return selectedItems.filter((si) => si.categoryId === categoryId).reduce((sum, si) => {
            return sum + (si.quantity * si.productPrice)
        }, 0)
    }

    function getTotal() {
        return selectedItems.reduce((sum, si) => {
            return sum + (si.quantity * si.productPrice)
        }, 0)
    }

    function getTotalWithDiscount(){
        const total = getTotal()

        if(!discountCode || !discountCode.discount) return 0

        if(discountCode?.discountType==="FIXED"){
            return total-discountCode.discount
        }else{
            return total-(total*(discountCode.discount)/100)
        }
    }

    return (
        <div className='w-full p-3 flex flex-col gap-1'>
            <h1 className='font-bold text-lg'>
                Detalles de la cotización
            </h1>
            <p><span className='font-bold'>Médico: </span>{doctor?.firstName}{" "}{doctor?.lastName}{" "}{doctor?.secondLastName ?? ""}</p>
            <p><span className='font-bold'>Paciente: </span>{getPatientFullName()}</p>
            <p><span className='font-bold'>Procedimiento Médico: </span>{medicalProcedures.find((mp) => mp.id === Number(selectedMedicalProcedure))?.name ?? "-"}</p>
            <p><span className='font-bold'>Código de Procedimiento: </span>{configuration?.code ?? "-"}</p>
            <p><span className='font-bold'>Tipo de cambio: </span>
                {specificExchangeRate !== "-" ? "$" + Number(specificExchangeRate).toFixed(2) : "$" + Number(exchangeRate).toFixed(2)}
            </p>

            <p><span className='font-bold'>Fecha estimada: </span>{formatDate(date)}</p>
            <p><span className='font-bold'>Hora estimada: </span>{time!=="" ? time : "-"}</p>
            

            <div className='flex flex-row gap-1'>
                <p className='font-bold'>
                    Subtotales:
                </p>
                <button onClick={() => setShowDetails(!showDetails)} className='underline text-sm'>
                    {showDetails ? "Ocultar" : "Ver"}
                </button>
            </div>

            {(configuration && showDetails) &&
                <div className='grid grid-cols-2 gap-x-5 gap-y-1'>
                    {configuration.configurationCategories.map((cc) => (
                        <Fragment key={cc.id}>
                            <p className='font-bold text-sm'>{cc.category.name}</p>
                            <p className='text-sm'>${(getCategorySubtotal(cc.categoryId)).toFixed(2)}</p>
                        </Fragment>
                    ))}
                </div>
            }

            <p className='font-bold'>Total {discountCode && "antes de descuento"}:</p>
            <p>${(getTotal().toFixed(2))} USD |{" "}
                {specificExchangeRate !== "-" ?
                    "$" + (getTotal() * Number(specificExchangeRate)).toFixed(2) + " MXN"
                    :
                    "$" + (getTotal() * Number(exchangeRate)).toFixed(2) + " MXN"
                }
            </p>

            {discountCode &&
                <Fragment>
                    <p><span className='font-bold'>Código de descuento: </span>{discountCode ? discountCode.code : "-"}</p>
                    <p>
                        <span className='font-bold'>Descuento: </span>
                        {discountCode.discountType==="FIXED" ? "$"+discountCode.discount.toFixed(2)+" USD" : discountCode.discount+"%"}
                        <span className='text-sm'> (aplicado al {discountCode.appliesToTotal ? "total" : "subtotal"}.)</span>
                    </p>
                </Fragment>
            }

            {discountCode && selectedItems.length>0 &&
                <p>
                    <span className='font-bold'>Total después del descuento: </span>
                    ${getTotalWithDiscount()?.toFixed(2)}
                    {" USD | "}
                    {specificExchangeRate!=="-"
                    ?
                        "$"+(getTotalWithDiscount()*Number(specificExchangeRate)).toFixed(2)+' MXN'
                    :
                        "$"+(getTotalWithDiscount()*Number(exchangeRate)).toFixed(2)+' MXN'
                    }
                </p>
            }  

        </div>
    )
}

export default QuoteDetails