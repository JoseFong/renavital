"use client"
import { Category, Product, ProductCategory } from "@/app/generated/prisma/client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import { IdQuantity, ProductWithCategories } from "@/lib/types"
import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {

  const params = useParams()
  const id = params.id
  const idNum = Number(id)

  const loaded = useRef(false)

  const [loading, setLoading] = useState(false)

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<ProductWithCategories[]>([])

  const [assignedProducts, setAssignedProducts] = useState<ProductWithCategories[]>([])
  const [availableProducts, setAvailableProducts] = useState<ProductWithCategories[]>([])

  const [productsToAdd, setProductsToAdd] = useState<number[]>([])
  const [productsToRemove, setProductsToRemove] = useState<number[]>([])

  async function fetchProducts() {
    try {
      const response = await axios.get("/api/productsWithCategories")
      setProducts(response.data)
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message)
      } else {
        toast.error(e.message)
      }
    }
  }

  async function fetchCategory() {
    try {
      const response = await axios.get("/api/categories/" + id)
      setCategory(response.data)
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
    fetchCategory()
    fetchProducts()
    loaded.current = true
  }, [])

  useEffect(() => {
    if (products) {
      const assigned = products.filter((p: ProductWithCategories) => {
        return p.productCategories.some((pc: ProductCategory) => pc.categoryId === idNum)
      })
      setAssignedProducts(assigned)
      const available = products.filter((p: ProductWithCategories) => {
        return !assigned.includes(p)
      })
      setAvailableProducts(available)
    }
  }, [products])

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

    setProductsToRemove(aux)
  }

  async function fetchAdd() {
    try {
      setLoading(true)
      toast.loading("Cargando...", { id: "1" })

      const data = {
        productIds: productsToAdd
      }
      await axios.post("/api/categories/" + id + "/assignProducts", data)
      fetchProducts()
      setProductsToAdd([])
      setLoading(false)
      toast.success("Productos asignados exitosamente.", { id: "1" })
    } catch (e: any) {
      setLoading(false)
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message, { id: "1" })
      } else {
        toast.error(e.message, { id: "1" })
      }
    }
  }

  async function fetchRemove() {
    try {
      setLoading(true)
      toast.loading("Cargando...", { id: "1" })

      const data = {
        productIds: productsToRemove
      }
      await axios.post("/api/categories/" + id + "/unassignProducts", data)
      fetchProducts()
      setProductsToRemove([])
      setLoading(false)
      toast.success("Productos desasignados exitosamente.", { id: "1" })
    } catch (e: any) {
      setLoading(false)
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message, { id: "1" })
      } else {
        toast.error(e.message, { id: "1" })
      }
    }
  }

  function changeQuantity(id: number, quantity: number) {
    if (quantity < 0) return

    let aux = [...assignedProducts]

    const product = aux.find((p: ProductWithCategories) => p.id === id)
    if (!product) return
    const productCategory = product.productCategories.find((pc: ProductCategory) => pc.categoryId === idNum)
    if (!productCategory) return
    productCategory.quantity = quantity

    setAssignedProducts(aux)
  }

  async function fetchUpdateQuantities() {
    try {
      toast.loading("Cargando...",{id:"1"})
      const idQuantities = assignedProducts.map((ap: ProductWithCategories) => {
        const productCategory = ap.productCategories.find((pc: ProductCategory) => pc.categoryId === idNum)
        if (!productCategory) return
        return { id: ap.id, quantity: productCategory.quantity }
      })

      const data = {
        idQuantities: idQuantities
      }

      await axios.post("/api/categories/"+id+"/updateProductQuantity",data)
      toast.success("Información actualizada exitosamente.",{id:"1"})
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message,{id:"1"})
      } else {
        toast.error(e.message,{id:"1"})
      }
    }
  }

  return (
    <>
      <NavBarCatalogue selected="Conceptos" />
      <div className="flex flex-col gap-1 p-5">
        Productos del concepto '{category?.name}'
        <div className="flex flex-row gap-10">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Productos disponibles</h1>
            <p>Seleccione productos para agregar al concepto</p>
            {availableProducts.map((p: ProductWithCategories) => (
              <div key={p.id} className="flex flex-row gap-1">
                <input type="checkbox" checked={productsToAdd.includes(p.id)} onChange={() => addProduct(p.id)} />
                {p.name}
              </div>
            ))}
            <button disabled={productsToAdd.length === 0} onClick={fetchAdd} className="underline cursor-pointer">Agregar</button>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Productos de esta categoría</h1>
            {assignedProducts.map((p: ProductWithCategories) => (
              <div key={p.id} className="flex flex-row gap-1 justify-start">
                <input type="checkbox" checked={productsToRemove.includes(p.id)} onChange={() => removeProduct(p.id)} />
                {p.name}
                |
                <button
                  onClick={() => {
                    const pc = p.productCategories.find((pc: ProductCategory) => pc.categoryId === idNum)
                    if (pc) changeQuantity(p.id, pc.quantity - 1)
                  }}
                  className="shadow-sm rounded-md p-2 cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  value={p.productCategories.find((pc: ProductCategory) => pc.categoryId === idNum)?.quantity}
                  onChange={(e) => changeQuantity(p.id, Number(e.target.value))}
                />
                <button
                  onClick={() => {
                    const pc = p.productCategories.find((pc: ProductCategory) => pc.categoryId === idNum)
                    if (pc) changeQuantity(p.id, pc.quantity + 1)
                  }}
                  className="shadow-sm rounded-md p-2 cursor-pointer"
                >
                  +
                </button>
              </div>
            ))}
            <button disabled={productsToRemove.length === 0} onClick={fetchRemove} className="disabled:cursor-not-allowed underline cursor-pointer">Desasignar seleccionados</button>
            <button onClick={fetchUpdateQuantities} className="disabled:cursor-not-allowed underline cursor-pointer">Guardar cambios</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default page