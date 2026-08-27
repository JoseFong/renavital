"use client"
import { Category, Product } from "@/app/generated/prisma/client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import SelectSearch from "@/components/public/SelectSearch"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const router = useRouter()

    const loaded = useRef(false)

    const [triggerType, setTriggerType] = useState("")
    const [categorySourceId, setCategorySourceId] = useState("-1")
    const [productSourceId, setProductSourceId] = useState("-1")
    const [type, setType] = useState("-1")

    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    const [targets, setTargets] = useState<{ productId: number, quantity: number }[]>([])
    const [selectedProduct, setSelectedProduct] = useState("-1")
    const [quantity, setQuantity] = useState(1)

    async function fetchProducts() {
        try {
            const response = await axios.get("/api/products")
            setProducts(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    async function fetchCategories() {
        try {
            const response = await axios.get("/api/categories")
            setCategories(response.data)
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
        fetchCategories()

        loaded.current = true
    }, [])

    async function fetchCreate() {
        try {
            // Tipo de disparador
            if (triggerType === "-1" || triggerType === "") {
                toast.error("Seleccione un tipo de disparador.")
                return
            }

            // Tipo de regla
            if (type === "-1") {
                toast.error("Seleccione un tipo de regla.")
                return
            }

            // Fuente de categoría
            if (triggerType === "CATEGORY" && categorySourceId === "-1") {
                toast.error("Seleccione la categoría que disparará la regla.")
                return
            }

            // Fuente de producto
            if (triggerType === "PRODUCT" && productSourceId === "-1") {
                toast.error("Seleccione el producto que disparará la regla.")
                return
            }

            // Targets
            if (targets.length === 0) {
                toast.error("Debe agregar al menos un producto afectado.")
                return
            }

            // Cantidades
            const invalidQuantity = targets.some(
                (target) => target.quantity < 1 || !Number.isInteger(target.quantity)
            )

            if (invalidQuantity) {
                toast.error("Las cantidades deben ser números enteros mayores a 0.")
                return
            }

            const data = {
                triggerType: triggerType,
                type: type,
                categorySourceId: Number(categorySourceId),
                productSourceId: Number(productSourceId),
                targets: targets
            }

            await axios.post("/api/rules", data)
            toast.success("Regla registrad exitosamente.")
            router.push("/admin/catalogo/reglas")
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    return (
        <>
            <NavBarCatalogue selected={"reglas"} />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold">Agregar nueva regla</h1>
                <label>Tipo de disparador</label>
                <select value={triggerType} onChange={(e) => setTriggerType(e.target.value)}>
                    <option value="-1">Seleccionar tipo de disparador</option>
                    <option value="CATEGORY">CATEGORY</option>
                    <option value="PRODUCT">PRODUCT</option>
                </select>
                ----------------------------------------------------------------------------------------------------
                <label>Seleccione el tipo de regla</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="-1">Seleccionar tipo de regla</option>

                    <option value="INCLUDES">INCLUDES</option>
                    <option value="EXCLUDE">EXCLUDE</option>
                    <option value="SOME">SOME</option>
                </select>
                ----------------------------------------------------------------------------------------------------
                {(triggerType === "CATEGORY") && <label>Seleccione la categoría que disparará la regla</label>}
                {(triggerType === "CATEGORY") &&
                    <select value={categorySourceId} onChange={(e) => setCategorySourceId(e.target.value)}>
                        <option value="-1">Seleccionar categoría</option>
                        {categories.map((c: Category) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                }
                {(triggerType === "PRODUCT") && <label>Seleccione el producto que disparará la regla</label>}
                {(triggerType === "PRODUCT") &&
                    <SelectSearch options={products} selected={productSourceId} onChange={setProductSourceId} />
                }
                ----------------------------------------------------------------------------------------------------
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold">Productos afectados</h2>
                    <div className="flex flex-row gap-1">
                        <SelectSearch options={products.filter((p: Product) => !targets.some((t: any) => t.productId === p.id))} selected={selectedProduct} onChange={setSelectedProduct} />
                        <input min={1} className="w-8 border rounded-md outline-none" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                        <button
                            className="underline cursor-pointer disabled:cursor-not-allowed"
                            disabled={selectedProduct === "-1"}
                            onClick={() => {
                                setTargets([
                                    ...targets,
                                    {
                                        productId: Number(selectedProduct),
                                        quantity: quantity
                                    }
                                ])

                                setSelectedProduct("-1")
                                setQuantity(1)
                            }}
                        >
                            Agregar
                        </button>
                    </div>
                    {targets.length > 0 &&
                        <div className="flex flex-col gap-1">
                            {targets.map((t: any) => (
                                <div key={t.productId}>
                                    ({t.quantity}){" "}
                                    {products.find((p: Product) => p.id === t.productId)?.name ?? "Desconocido"}
                                </div>
                            ))}
                        </div>
                    }
                </div>
                <button onClick={fetchCreate} className="underline cursor-pointer">Registrar regla</button>
                <button onClick={()=>router.push("/admin/catalogo/reglas")} className="underline cursor-pointer">Regresar</button>
            </div>
        </>
    )
}

export default page