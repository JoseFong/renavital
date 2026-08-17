"use client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import question from "@/assets/icons8-help-50.png"
import toast from "react-hot-toast"
import axios from "axios"
import { Category, Product } from "@/app/generated/prisma/client"
import { useParams, useRouter } from "next/navigation"

function page() {
  const params = useParams()
  const id = params.id

  const loaded = useRef(false)

  const router = useRouter()

  const [name, setName] = useState("")
  const [flux, setFlux] = useState("")
  const [equipment, setEquipment] = useState(false)
  const [categoryId, setCategoryId] = useState("-1")
  const [quantity, setQuantity] = useState("0")
  const [price, setPrice] = useState("0")
  const [service, setService] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])
  const [product, setProduct] = useState<Product>()

  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingStart, setLoadingStart] = useState(true)
  const [loading, setLoading] = useState(false)

  function modifyPrice(n: number) {
    let aux = Number(price) + n
    setPrice(aux.toString())
  }

  function modifyQuantity(n: number) {
    let aux = Number(quantity) + n
    setQuantity(aux.toString())
  }

  async function fetchCategories() {
    try {
      setLoadingCategories(true)
      const response = await axios.get("/api/categories")
      setCategories(response.data)
      setLoadingCategories(false)
    } catch (e: any) {
      setLoadingCategories(false)
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message)
      } else {
        toast.error(e.message)
      }
    }
  }

  async function fetchProduct() {
    try {
      setLoadingStart(true)

      const response = await axios.get("/api/products/" + id)
      setProduct(response.data)

      setLoadingStart(false)
    } catch (e: any) {
      setLoadingStart(false)
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message)
      } else {
        toast.error(e.message)
      }
    }
  }

  async function fetchUpdate() {
    try {
      setLoading(true)

      if (name.trim() === "" || flux.trim() === "" || price.trim() === "" || quantity.trim() === "")
        throw new Error("Complete todos los campos.")

      if (Number(price) <= 0)
        throw new Error("Ingrese un precio válido para el producto.")

      if (Number(quantity) < 0)
        throw new Error("Ingrese una cantidad válida para el producto.")

      const data = {
        name: name.trim(),
        flux: flux.trim(),
        equipment: equipment,
        service: service,
        quantity: Number(quantity),
        price: Number(price),
        categoryId: Number(categoryId)
      }

      await axios.patch("/api/products/"+id, data)

      setLoading(false)
      toast.success("Producto actualizado exitosamente.")
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
    if (loaded.current) return
    fetchCategories()
    fetchProduct()
    loaded.current = true
  }, [])

  function goBack() {
    router.push("/admin/catalogo/productos")
  }

  function reset() {
    if (product) {
      setName(product.name)
      setFlux(product.flux)
      setService(product.service)
      setEquipment(product.equipment)
      setPrice(product.price.toString())
      setQuantity(product.quantity.toString())

      if(product.categoryId){
        setCategoryId(product.categoryId.toString())
      }else{
        setCategoryId("-1")
      }
    }
  }

  useEffect(()=>{
    if(product){
      reset()
    }
  },[product])

  return (
    <>
      <NavBarCatalogue selected="Productos" />
      <div className="p-5 flex flex-col gap-1">
        <h1 className="font-bold">Editar Información de producto</h1>
        <label>Nombre</label>
        <input placeholder="Ej. SERVICIO DE GESTION CLINICA INTEGRAL - NOM-004-SSA3" value={name} onChange={(e) => setName(e.target.value.toUpperCase())} />
        <label>Flujo Detallado</label>
        <input placeholder="000-ADMISIÓN" value={flux} onChange={(e) => setFlux(e.target.value.toUpperCase())} />
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
        <label>Cantidad</label>
        <div className="flex flex-row gap-1">
          <button onClick={() => modifyQuantity(1)} className="p-2 shadow-md rounded-sm cursor-pointer">+</button>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <button onClick={() => modifyQuantity(-1)} className="p-2 shadow-md rounded-sm cursor-pointer">-</button>
          <Image src={question} alt="Información" />
          <p>Indica cuántas unidades de este producto se utilizan en el procedimiento normalmente, este número puede ser 0.</p>
        </div>
        <label>Categoría (opcional)</label>
        <select value={categoryId} disabled={loadingCategories} onChange={(e) => setCategoryId(e.target.value)}>
          <option value={"-1"}>Seleccionar categoría</option>
          {categories.map((c: Category) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button onClick={fetchUpdate} disabled={loading} className="underline cursor-pointer">Aceptar</button>
        <button onClick={goBack} disabled={loading} className="underline cursor-pointer">Regresar</button>
      </div>
    </>
  )
}

export default page