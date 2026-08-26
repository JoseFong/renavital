import prisma from "@/lib/prisma"

type Target = {
    productId: number,
    quantity: number
}

export async function createRule(data: any) {
    let triggerType = data.triggerType
    let type = data.type
    let productSourceId = data.productSourceId
    let categorySourceId = data.categorySourceId
    let targets: Target[] = data.targets

    if (triggerType === "PRODUCT") categorySourceId = null
    if (triggerType === "CATEGORY") productSourceId = null

    if (type === "SOME") productSourceId = null

    const rule = await prisma.rule.create({
        data: {
            triggerType: triggerType,
            type: type,
            productSourceId: productSourceId,
            categorySourceId: categorySourceId
        }
    })

    await prisma.ruleTarget.createMany({
        data: targets.map((t: Target) => ({
            ruleId: rule.id,
            productId: t.productId,
            quantity: t.quantity
        }))
    })
}

export async function getAllRules() {
    return await prisma.rule.findMany({
        include: {
            ruleTargets: {
                include:{
                    product: true
                }
            },
            productSource: true,
            categorySource: true
        }
    })
}

export async function deleteRule(id: number) {
    await prisma.rule.delete({
        where: {
            id: id
        }
    })
}

export async function getRuleFromId(id: number) {
    const rule = await prisma.rule.findFirst({
        where: {
            id: id
        },
        include: {
            ruleTargets: {
                include: {
                    product: true
                }
            },
            productSource: true,
            categorySource: true
        }
    })
    if (!rule) throw new Error("No se encontró la regla.")

    return rule
}