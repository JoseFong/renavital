"use client"

import { ProductType } from "@/app/generated/prisma/client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import { ProductWithType } from "@/lib/types"
import axios from "axios"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const router = useRouter()

    const loaded = useRef(false)

    const params = useParams()
    const id = params.id
    const idNum = Number(id)

    const [loading,setLoading] = useState(false)

    const [productType, setProductType] = useState<ProductType | null>(null)
    const [products, setProducts] = useState<ProductWithType[]>([])

    async function fetchProducts() {
        try {
            const response = await axios.get("/api/productTypes/" + id + "/products")
            setProducts(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    async function fetchProductType() {
        try {
            const response = await axios.get("/api/productTypes/" + id)
            setProductType(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    useEffect(() => {
        if (loaded.current) return
        fetchProducts()
        fetchProductType()
        loaded.current = true
    }, [])

    const [productsToAdd, setProductsToAdd] = useState<number[]>([])
    const [productsToRemove, setProductsToRemove] = useState<number[]>([])

    function addProduct(id: number) {
        let aux = [...productsToAdd]
        if (aux.includes(id)) {
            aux = aux.filter((a: number) => a !== id)
        } else {
            aux.push(id)
        }
        setProductsToAdd([...aux])
    }

    function removeProduct(id: number) {
        let aux = [...productsToRemove]

        if (aux.includes(id)) {
            aux = aux.filter((a: number) => a !== id)
        } else {
            aux.push(id)
        }

        setProductsToRemove([...aux])
    }

    async function fetchAdd() {
        try {
            setLoading(true)
            const data = {
                productIds: productsToAdd
            }
            await axios.post("/api/productTypes/"+id+"/assignProducts",data)
            setLoading(false)
            setProductsToAdd([])
            fetchProducts()
        } catch (e: any) {
            setLoading(false)
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    async function fetchRemove() {
        try {
            setLoading(true)
            const data = {
                productIds: productsToRemove
            }
            await axios.post("/api/productTypes/"+id+"/unassignProducts",data)
            setLoading(false)
            setProductsToRemove([])
            fetchProducts()
        } catch (e: any) {
            setLoading(false)
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    return (
        <>
            <NavBarCatalogue selected={"Tipos"} />
            <div className="flex flex-col gap-1 p-5">
                Productos de tipo {productType?.name}
                <div className="flex flex-row gap-10">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold">Productos disponibles</h1>
                        <p>Seleccione productos para agregar al tipo de producto</p>
                        {products.filter((p: ProductWithType) => p.productTypeId === null).map((p: ProductWithType) => (
                            <div key={p.id} className="flex flex-row gap-2">
                                <input type="checkbox" checked={productsToAdd.includes(p.id)} onChange={() => addProduct(p.id)} />
                                <p>{p.name}</p>
                            </div>
                        ))}
                        <button disabled={productsToAdd.length === 0} onClick={fetchAdd} className="underline cursor-pointer">Agregar</button>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold">Productos en este tipo</h1>
                        <p>Seleccione productos para quitar del tipo de producto</p>
                        {products.filter((p: ProductWithType) => p.productTypeId === idNum).map((p: ProductWithType) => (
                            <div key={p.id} className="flex flex-row gap-2">
                                <input type="checkbox" checked={productsToRemove.includes(p.id)} onChange={() => removeProduct(p.id)} />
                                <p>{p.name}</p>
                            </div>
                        ))}
                        <button disabled={productsToRemove.length === 0} onClick={fetchRemove} className="underline cursor-pointer">Quitar</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page