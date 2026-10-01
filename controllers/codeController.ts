import prisma from "@/lib/prisma";

export async function getAllCodes(){
    await checkCodes()
    return await prisma.code.findMany()
}

export async function createCode(data:any){
    let exists = await prisma.code.findFirst({
        where: {
            code: data.code
        }
    })
    if(exists) throw new Error("Ya existe otro código con este nombre.")

    const createdCode = await prisma.code.create({
        data: {
            appliesToTotal: data.appliesToTotal,
            code: data.code,
            discount: data.discount,
            discountType: data.discountType,
            endDate: data.endDate,
            maxUses: data.maxUses,
            singleUse: data.singleUse,
            startDate: data.startDate,
            valid: true
        }
    })

    if(data.doctorIds.length>0){
        await prisma.codeUsage.createMany({
            data: data.doctorIds.map((i:number)=>({
                codeId: createdCode.id,
                doctorId: i,
                valid: true,
                numberOfUses: 0
            }))
        })
    }

    if(data.patientIds.length>0){
        await prisma.codeUsage.createMany({
            data: data.patientIds.map((i:number)=>({
                codeId: createdCode.id,
                patientId: i,
                valid: true,
                numberOfUses: 0
            }))
        })
    }

    await checkCodes()
}

async function checkCodes(){
    const now = new Date()

    const codes = await prisma.code.findMany()

    let codesToUpdate:number[] = []
    for(let i=0;i<codes.length;i++){
        let c = codes[i]

        if(c.endDate){
            let endDateDate = new Date(c.endDate)

            if(now>endDateDate && c.valid){
                codesToUpdate.push(c.id)
            }
        }
    }

    await prisma.code.updateMany({
        where: {
            id: {
                in: codesToUpdate
            }
        },
        data: {
            valid: false
        }
    })

    const codeUsage = await prisma.codeUsage.findMany({
        include: {
            code: true
        }
    })

    let codeUsagesToUpdate:number[] = []
    for(let i=0;i<codeUsage.length;i++){
        let cu = codeUsage[i]

        if(cu.numberOfUses>=cu.code.maxUses && cu.valid){
            codeUsagesToUpdate.push(cu.id)
        }
    }

    await prisma.codeUsage.updateMany({
        where: {
            id: {
                in: codeUsagesToUpdate
            }
        },
        data: {
            valid: false
        }
    })
}

export async function changeCodeStatus(id:number){
    let exists = await prisma.code.findFirst({
        where:{
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró el código de descuento.")

    await prisma.code.update({
        where: {
            id: id
        },
        data: {
            valid: !exists.valid
        }
    })
    
    await checkCodes()
}

export async function getCodeFromId(id:number){
    let exists = await prisma.code.findFirst({
        where:{
            id: id
        },
        include: {
            codeUsages: {
                include: {
                    patient: true,
                    doctor: true
                }
            }
        }
    })
    if(!exists) throw new Error("No se encontró el código.")

    return exists
}

export async function updateCode(id:number,data:any){
    let exists = await prisma.code.findFirst({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró el código.")

    await prisma.code.update({
        where: {
            id: id
        },
        data: {
            appliesToTotal: data.appliesToTotal,
            discount: data.discount,
            discountType: data.discountType,
            endDate: data.endDate,
            maxUses: data.maxUses,
            startDate: data.startDate
        }
    })

    await checkCodes()
}