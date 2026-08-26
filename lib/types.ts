import { Anesthesia, Category, Procedure, Product, ProductCategory, ProductType, RuleTarget, Stay } from "@/app/generated/prisma/client"
import { Decimal } from "@prisma/client/runtime/client"

export type ProductWithType = {
    id: number,
    name: string,
    equipment: boolean,
    productTypeId: number,
    price: Decimal,
    active: boolean,
    service: boolean,
    productType: ProductType
}

export type IdQuantity = {
    id: number,
    quantity: number
}

export type ProductWithCategories = {
    id: number,
    active: boolean,
    equipment: boolean,
    service: boolean,
    productTypeId: number,
    name: string,
    price: Decimal,
    productCategories: ProductCategory[]
}

export type ConfigurationInfo = {
    id:number,
    code:string,
    procedureId:number,
    anesthesiaId:number,
    stayId:number,
    active: boolean,
    procedure: Procedure,
    anesthesia: Anesthesia,
    stay: Stay
}

export type ProductWithTypeAndCategories = {
    id: number,
    name: string,
    equipment: boolean,
    productTypeId: number,
    price: Decimal,
    active: boolean,
    service: boolean,
    productType: ProductType,
    productCategories: ProductCategory[]
}

export type RuleTargetInfo = {
    id: number
    productId: number
    quantity: number
    ruleId: number
    product: Product
}

export type RuleInfo = {
    id: number,
    triggerType: string,
    type: string,
    productSourceId: number|null,
    categorySourceId: number|null,
    ruleTargets: RuleTargetInfo[],
    productSource: Product|null,
    categorySource: Category|null
}