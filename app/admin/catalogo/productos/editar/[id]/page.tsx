"use client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import question from "@/assets/icons8-help-50.png"
import toast from "react-hot-toast"
import axios from "axios"
import { Category, ProductType } from "@/app/generated/prisma/client"
import { useParams, useRouter } from "next/navigation"
import { ProductWithType } from "@/lib/types"

function page() {
    const params = useParams()
    const id = params.id

    const loaded = useRef(false)

    const router = useRouter()

    const [product,setProduct] = useState<ProductWithType|null>(null)

    const [name, setName] = useState("")
    const [equipment, setEquipment] = useState(false)
    const [productTypeId, setProductTypeId] = useState("-1")
    const [price, setPrice] = useState("0")
    const [service, setService] = useState(false)

    const [productTypes, setProductTypes] = useState<ProductType[]>([])

    const [loadingProductTypes, setLoadingProductTypes] = useState(true)
    const [loading, setLoading] = useState(false)

    function modifyPrice(n: number) {
        let aux = Number(price) + n
        setPrice(aux.toString())
    }

    async function fetchProductTypes() {
        try {
            setLoadingProductTypes(true)
            const response = await axios.get("/api/productTypes")
            setProductTypes(response.data)
            setLoadingProductTypes(false)
        } catch (e: any) {
            setLoadingProductTypes(false)
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    async function fetchProduct() {
        try {
            const response = await axios.get("/api/products/"+id)
            setProduct(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    function reset(){
      if(product){
        setName(product.name)
        setPrice(product.price.toString())
        setProductTypeId(product.productTypeId.toString())
        setEquipment(product.equipment)
        setService(product.service)
      }
    }

    useEffect(()=>{
      if(product && productTypes){
        reset()
      }
    },[product,productTypes])

    async function fetchUpdate() {
        try {
            setLoading(true)

            if (name.trim() === "" || price.trim() === "")
                throw new Error("Complete todos los campos.")
            
            if(Number(price)<=0)
                throw new Error("Ingrese un precio válido para el producto.")
         
            if(equipment && !service) throw new Error("Un item marcado como 'Equipo' no puede ser considerado un producto.")

            const data = {
                name: name.trim(),
                equipment: equipment,
                service: service,
                price: Number(price),
                productTypeId: Number(productTypeId)
            }

            await axios.patch("/api/products/"+id,data)

            setLoading(false)
            toast.success("Producto editado exitosamente.")
            router.push("/admin/catalogo/productos")
        } catch (e: any) {
            setLoading(false)
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    useEffect(() => {
        if(loaded.current) return
        fetchProductTypes()
        fetchProduct()
        loaded.current = true
    }, [])

    function goBack() {
        router.push("/admin/catalogo/productos")
    }

    return (
        <>
            <NavBarCatalogue selected="Productos" />
            <div className="p-5 flex flex-col gap-1">
                <h1 className="font-bold">Actualizar información de producto</h1>
                <label>Nombre</label>
                <input placeholder="Ej. SERVICIO DE GESTION CLINICA INTEGRAL - NOM-004-SSA3" value={name} onChange={(e) => setName(e.target.value.toUpperCase())} />
                <label>Tipo de producto (opcional)</label>
                <select disabled={loadingProductTypes} value={productTypeId} onChange={(e) => setProductTypeId(e.target.value)}>
                    <option value={"-1"}>Seleccionar tipo de producto</option>
                    {productTypes.map((p:ProductType) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <label>Precio unitario (USD)</label>
                <div className="flex flex-row gap-1">
                    <button onClick={() => modifyPrice(1)} className="p-2 shadow-md rounded-sm cursor-pointer">+</button>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                    <button onClick={() => modifyPrice(-1)} className="p-2 shadow-md rounded-sm cursor-pointer">-</button>
                </div>
                <div className="flex flex-row gap-1">
                    <label>¿Este producto es considerado equipo?</label>
                    <input type="checkbox" checked={equipment} onChange={() => setEquipment(!equipment)} />
                    <Image src={question} alt="Información" />
                    <p>Al marcar esta opción el producto será considerado equipo medico y no consumible.</p>
                </div>
                <div className="flex flex-row gap-1">
                    <label>¿Este producto es considerado un servicio?</label>
                    <input type="checkbox" checked={service} onChange={() => setService(!service)} />
                    <Image src={question} alt="Información" />
                    <p>Al marcar esta opción será considerado servicio y no producto.</p>
                </div>
                <button onClick={fetchUpdate} disabled={loading} className="underline cursor-pointer">Aceptar</button>
                <button onClick={goBack} disabled={loading} className="underline cursor-pointer">Regresar</button>
            </div>
        </>
    )
}

export default page