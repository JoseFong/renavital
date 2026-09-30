import { Anesthesia, Category, Configuration, ConfigurationCategories, Doctor, Procedure, Product, ProductCategory, ProductClassification, RuleTarget, Specialty, Stay } from "@/app/generated/prisma/client"
import { Decimal } from "@prisma/client/runtime/client"

export type ProductInfo = {
    id: number,
    name: string,
    equipment: boolean,
    service: boolean,
    price: Decimal,
    active: boolean,
    productClassificationId: number

    productCategories: ProductCategoryInfo[]
    productClassification: ProductClassification
}

export type IdQuantity = {
    id: number,
    quantity: number
}

export type ConfigurationInfo = {
    id: number,
    code: string,
    procedureId: number,
    anesthesiaId: number,
    stayId: number,
    active: boolean,
    procedure: Procedure,
    anesthesia: Anesthesia,
    stay: Stay
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
    productSourceId: number | null,
    categorySourceId: number | null,
    ruleTargets: RuleTargetInfo[],
    productSource: Product | null,
    categorySource: Category | null
}


//////////TYPES PARA CONFIGURACIONES, USADO EN EL COTIZADOR///////////
//ESTOS SIGUIENTES TIPOS SE USAN PARA CREAR UN SOLO TIPO DE DATO GIGANTE QUE TIENE TODA LA INFORMACÍÓN
//DE UNA CONFIGURACIÓN

export type ConfigurationCompleteInfo = {
    id: number,
    active: boolean,
    anesthesiaId: number,
    anesthesia: Anesthesia,
    code: string,
    procedureId: number,
    procedure: Procedure,
    stayId: number,
    stay: Stay,
    configurationCategories: ConfigurationCategoryInfo[]
}

export type ConfigurationCategoryInfo = {
    id: number,
    active: boolean,
    categoryId: number,
    category: CategoryInfo
}

export type CategoryInfo = {
    id: number,
    active: boolean,
    name: string,
    productCategories: ProductCategoryInfo[]
}

export type ProductCategoryInfo = {
    id: number,
    productId: number,
    product: Product,
    quantity: number,
    category: Category,
    categoryId: number
}

//TIPOS PARA DOCTOR Y ESPECIALIDAD

export type DoctorSpecialtyInfo = {
    id: number,
    doctorId: number,
    specialtyId: number,
    doctor: Doctor,
    specialty: Specialty
}

export type SpecialtyInfo = {
    id: number,
    name: string,
    doctorSpecialties: DoctorSpecialtyInfo[]
}

export type DoctorInfo = {
    id: number,

    firstName: string,
    lastName: string,
    secondLastName: string | null,

    curp: string | null,
    rfc: string | null,
    gender: string,

    email: string | null,
    countryCode: string,
    phone: string,
    secondaryPhone: string | null,

    country: string,
    state: string,
    city: string,
    address: string | null,

    university: string,
    licenseNumber: string,

    observations: string | null,

    defaultExchangeRate: number,

    registeredAt: string,

    doctorSpecialties: DoctorSpecialtyInfo[]
    exchangeRates: ExchangeRateInfo[]
}

export type ExchangeRateInfo = {
    id: number,
    exchangeRate: number,
    doctorId: number,
    configurationId: number,
    configuration: ConfigurationInfo
}