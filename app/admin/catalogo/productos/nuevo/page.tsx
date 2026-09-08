"use client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import question from "@/assets/icons8-help-50.png"
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
import { ProductClassification } from "@/app/generated/prisma/client"
import SelectClassification from "@/components/catalogue/Products/SelectClassification"

function page() {
    const loaded = useRef(false)

    const router = useRouter()

    const [name, setName] = useState("")
    const [equipment, setEquipment] = useState(false)
    const [price, setPrice] = useState("0")
    const [service, setService] = useState(false)
    const [selectedClassification,setSelectedClassification] = useState<ProductClassification|null>(null)

    const [classifications,setClassifications] = useState<ProductClassification[]>([])

    const [isSelectClassificationOpen,setIsSelectClassificationOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    function modifyPrice(n: number) {
        let aux = Number(price) + n
        setPrice(aux.toString())
    }

    async function fetchClassifications() {
        try {
            const response = await axios.get("/api/productClassifications")
            setClassifications(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    async function fetchCreate() {
        try {
            setLoading(true)

            if (name.trim() === "" || price.trim() === "")
                throw new Error("Complete todos los campos.")
            
            if(Number(price)<=0)
                throw new Error("Ingrese un precio válido para el producto.")
         
            if(equipment && !service) throw new Error("Un item marcado como 'Equipo' no puede ser considerado un producto.")

            let productClassificationId = null
            if(selectedClassification) productClassificationId = selectedClassification.id

            const data = {
                name: name.trim(),
                equipment: equipment,
                service: service,
                price: Number(price),
                productClassificationId
            }

            await axios.post("/api/products",data)

            setLoading(false)
            toast.success("Producto registrado exitosamente.")
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

    function goBack() {
        router.push("/admin/catalogo/productos")
    }

    useEffect(()=>{
        if(loaded.current) return
        fetchClassifications()
        loaded.current=true
    },[])

    return (
        <>
            <NavBarCatalogue selected="Productos" />
            <div className="p-5 flex flex-col gap-1">
                <h1 className="font-bold">Registrar nuevo producto</h1>
                <label>Nombre</label>
                <input placeholder="Ej. SERVICIO DE GESTION CLINICA INTEGRAL - NOM-004-SSA3" value={name} onChange={(e) => setName(e.target.value.toUpperCase())} />
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
                <label>Clasificación (opcional)</label>
                <button disabled={loading} onClick={()=>setIsSelectClassificationOpen(true)} className="underline cursor-pointer">
                    {selectedClassification ? selectedClassification.name : "PRESIONE PARA SELECCIONAR"}
                </button>
                <button onClick={fetchCreate} disabled={loading} className="underline cursor-pointer">Aceptar</button>
                <button onClick={goBack} disabled={loading} className="underline cursor-pointer">Regresar</button>
            </div>
            <SelectClassification open={isSelectClassificationOpen} setOpen={setIsSelectClassificationOpen} classifications={classifications} setSelectedClassification={setSelectedClassification}/>
        </>
    )
}

export default page