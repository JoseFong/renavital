"use client"
import { Category, Product, ProductCategory } from "@/app/generated/prisma/client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import { ProductWithCategories } from "@/lib/types"
import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {

  const params = useParams()
  const id = params.id
  const idNum = Number(id)

  const loaded = useRef(false)

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<ProductWithCategories[]>([])

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
      const response = await axios.get("/api/categories/"+id)
      setCategory(response.data)
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message)
      } else {
        toast.error(e.message)
      }
    }
  }

  useEffect(()=>{
    if(loaded.current) return
    fetchCategory()
    fetchProducts()
    loaded.current=true
  },[])

  

  return (
    <>
      <NavBarCatalogue selected="Conceptos" />
      <div className="flex flex-col gap-1 p-5">
        Productos del concepto `{category?.name}`
        <div className="flex flex-row gap-10">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold">Productos disponibles</h1>
            {products.filter((p:ProductWithCategories)=>p.productCategories.some((pc:ProductCategory)=>pc.categoryId===idNum)).map((p:ProductWithCategories)=>(
              <div className="flex flex-row gap-1">
                <input checked={}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default page