import prisma from "@/lib/prisma";
import { ItemSelection } from "@/lib/types";


export async function createQuote(data: any) {
    //CREACION DE NUMERO DE FOLIO
    const now = new Date()

    const quotes = await prisma.quote.findMany()
    
    const todayQuotes = quotes.filter((q) => {
        const quoteDate = q.createdAt
        if (
            quoteDate.getFullYear() === now.getFullYear() &&
            quoteDate.getMonth() === now.getMonth() &&
            quoteDate.getDate() === now.getDate()
        ) {
            return q
        }
    })

    let number = todayQuotes.length + 1

    let folio =
        "COT-" +
        now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, "0") +
        now.getDate().toString().padStart(2, "0") +
        "-" +
        number.toString().padStart(3, "0")

    //VALIDACION DE PACIENTE
    let exists

    exists = await prisma.patient.findUnique({
        where: {
            id: data.patientId
        }
    })
    if (!exists) throw new Error("No se encontró al paciente.")

    //VALIDACION DE MEDICO
    exists = await prisma.doctor.findUnique({
        where: {
            id: data.doctorId
        }
    })
    if (!exists) throw new Error("No se encontró al médico.")

    let discountType = null
    let discountAppliesTo = null
    let discountValue = null

    //validacion de codigo
    if (data.codeId) {
        let code = await prisma.code.findFirst({
            where: {
                id: data.codeId
            }
        })
        if (!code) throw new Error("No se encontró el código de descuento.")

        discountType = code.discountType
        if(code.appliesToTotal){
            discountAppliesTo = "TOTAL"
        }else{
            discountAppliesTo = "SUBTOTAL"
        }
        discountValue = code.discount
    }

    //VALIDACION DE CONFIGURACION
    const configuration = await prisma.configuration.findUnique({
        where: {
            id: data.configurationId
        },
        include: {
            procedure: true,
            anesthesia: true,
            stay: true
        }
    })
    if (!configuration) throw new Error("No se encontró la configuración.")

    let subTotalMxn = data.subTotalUsd*Number(data.exchangeRate)

    await prisma.$transaction(async (tx) => {
        const createdQuote = await tx.quote.create({
            data: {
                basefolio: folio,
                revision: 1,
                status: data.status,
                scheduledDate: data.scheduledDate,
                scheduledTime: data.scheduledTime,

                doctorId: data.doctorId,
                patientId: data.patientId,
                codeId: data.codeId,
                configurationId: data.configurationId,

                medicalProcedureName: data.medicalProcedureName,
                configurationCode: configuration.code,
                procedureType: configuration.procedure.shortForm,
                anesthesiaType: configuration.anesthesia.shortForm,
                stayType: configuration.stay.shortForm,

                subTotalUsd: data.subTotalUsd,
                subTotalMxn: subTotalMxn,

                discountType: discountType,
                discountValue: discountValue,
                discountAppliesTo: discountAppliesTo,
                exchangeRate: data.exchangeRate,
                
                extraDiscountType: data.extraDiscountType,
                extraDiscountValue: data.extraDiscountValue,
                extraDiscountAppliesTo: data.extraDiscountAppliesTo,

                createdAt: now,
                lastModified: now
            }
        })

        await tx.quoteItems.createMany({
            data: data.selectedItems.map((si: ItemSelection) => ({
                quoteId: createdQuote.id,
                productId: si.productId,
                categoryId: si.categoryId,
                productName: si.productName,
                productPrice: si.productPrice,
                productQuantity: si.quantity
            }))
        })
    })
}

export async function getCurrentQuotesFromDoctor(doctorId: number) {
    let exists = await prisma.doctor.findFirst({
        where: {
            id: doctorId
        }
    })
    if (!exists) throw new Error("No se encontró el médico.")

    const quotes = await prisma.quote.findMany({
        where: {
            doctorId: doctorId
        },
        include: {
            quoteItems: true,
            patient: true
        }
        //,
        /*include: {
            quoteItems: true
        }*/
    })

    return quotes
}

export async function getQuoteFromId(quoteId:number){
    return await prisma.quote.findFirst({
        where: {
            id: quoteId
        }
    })
}