import { ProductType } from "@/app/generated/prisma/client"
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