import prisma from "@/lib/prisma";

export async function getAllRuleTargets(){
    return await prisma.ruleTarget.findMany()
}