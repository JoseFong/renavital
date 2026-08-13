import { Category } from "@/app/generated/prisma/client"
import { Decimal } from "@prisma/client/runtime/client"

export type ProductWithCategory = {
    id: number,
    name: string,
    equipment: boolean,
    categoryId: number,
    flux: string,
    quantity: number,
    price: Decimal,
    active: Boolean,
    category: Category
}