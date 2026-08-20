import { ProductCategory, ProductType } from "@/app/generated/prisma/client"
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