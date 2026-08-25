"use client"
import { Category, ProductCategory } from "@/app/generated/prisma/client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import DeleteManyModal from "@/components/catalogue/Products/DeleteManyModal"
import DeleteProductModal from "@/components/catalogue/Products/DeleteProductModal"
import UpdateProductStatus from "@/components/catalogue/Products/UpdateProductStatus"
import { ProductWithType, ProductWithTypeAndCategories } from "@/lib/types"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
  const hasFetched = useRef(false)

  const router = useRouter()

  const [products, setProducts] = useState<ProductWithTypeAndCategories[]>([])
  const [categories,setCategories] = useState<Category[]>([])

  const [selectedProduct, setSelectedProduct] = useState<ProductWithType | null>(null)
  const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false)
  const [isUpdateProductStatusOpen, setIsUpdateProductStatusOpen] = useState(false)
  const [isDeleteManyOpen,setIsDeleteManyOpen] = useState(false)

  const [search, setSearch] = useState("")

  const [results, setResults] = useState<ProductWithTypeAndCategories[]>([])

  const [selectedIds, setSelectedIds] = useState<number[]>([])

  function toggleSelection(id: number) {
    let aux = [...selectedIds]

    if (aux.includes(id)) {
      aux = aux.filter((a: number) => a !== id)
    } else {
      aux.push(id)
    }

    setSelectedIds(aux)
  }

  function selectAll() {
    if (selectedIds.length !== results.length) {
      const aux = results.map((r: ProductWithType) => {
        return r.id
      })
      setSelectedIds(aux)
    } else {
      setSelectedIds([])
    }
  }

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
    if (hasFetched.current) return

    fetchProducts()
    fetchCategories()
    hasFetched.current = true
  }, [])

  function goToNew() {
    router.push("/admin/catalogo/productos/nuevo")
  }

  useEffect(() => {
    if (products)
      setResults([...products])
  }, [products])

  useEffect(() => {
    if (search.trim() === "") {
      setResults([...products])
      return
    }

    const searchTerm = search.toLowerCase().trim()

    const aux = products.filter((a: ProductWithType) => {
      return (
        a.name.toLowerCase().includes(searchTerm) ||
        a.productType?.name.toLowerCase().includes(searchTerm)
      )
    })

    setResults(aux)
  }, [search, products])

  function getCategoryName(id:number){
    const category = categories.find((c:Category)=>c.id===id)
    if(category) return category.name
    return "Desconocido"
  }

  return (
    <div>
      <NavBarCatalogue selected="Productos" />
      <div className="p-5 flex flex-col gap-1">
        <h1 className="font-bold">Productos</h1>
        <button onClick={goToNew} className="underline cursor-pointer">Registrar nuevo</button>
        <input placeholder="Búsqueda" value={search} onChange={(e) => setSearch(e.target.value.toUpperCase())} />
        <p>{results.length} resultados</p>
        <button onClick={()=>setIsDeleteManyOpen(true)} disabled={selectedIds.length === 0} className="disabled:opacity-60 underline cursor-pointer">Eliminar seleccionados</button>
        <table>
          <thead>
            <tr>
              <th className="border-2 p-1">
                <input type="checkbox" checked={selectedIds.length === results.length} onChange={selectAll} />
              </th>
              <th className="border-2 p-1">Id</th>
              <th className="border-2 p-1">Tipo</th>
              <th className="border-2 p-1">Nombre</th>
              <th className="border-2 p-1">Equipo</th>
              <th className="border-2 p-1">Producto/Servicio</th>
              <th className="border-2 p-1">Precio Unitario</th>
              <th className="border-2 p-1">Conceptos</th>
              <th className="border-2 p-1">Acciones</th>
              <th className="border-2 p-1">Estado</th>
            </tr>
          </thead>
          <tbody>
            {results.map((p: ProductWithTypeAndCategories) => (
              <tr key={p.id}>
                <td className="border-2 p-1">
                  <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelection(p.id)} />
                </td>
                <td className="border-2 p-1">{p.id}</td>
                <td className="border-2 p-1">
                  {p.productType !== null ? p.productType.name : "SIN TIPO"}
                </td>
                <td className="border-2 p-1">{p.name}</td>
                <td className="border-2 p-1">{p.equipment ? "Si" : "No"}</td>
                <td className="border-2 p-1">{p.service ? "Servicio" : "Producto"}</td>
                <td className="border-2 p-1">${Number(p.price).toFixed(2)} USD</td>
                <td className="border-2 p-1">
                  {p.productCategories.map((pc:ProductCategory)=>(
                    <p key={pc.id}>{getCategoryName(pc.categoryId)}</p>
                  ))}
                </td>
                <td className="border-2 p-1">
                  <button className="underline cursor-pointer" onClick={() => router.push("/admin/catalogo/productos/editar/" + p.id)}>Editar</button>
                  <button onClick={() => { setSelectedProduct(p); setIsDeleteProductOpen(true) }} className="underline cursor-pointer">Eliminar</button>
                </td>
                <td className="border-2 p-1">
                  <button onClick={() => { setSelectedProduct(p); setIsUpdateProductStatusOpen(true) }} className="underline cursor-pointer">
                    {p.active ? "Activo" : "No activo"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedProduct &&
        <>
          <UpdateProductStatus open={isUpdateProductStatusOpen} setOpen={setIsUpdateProductStatusOpen} product={selectedProduct} refresh={fetchProducts} />
          <DeleteProductModal open={isDeleteProductOpen} setOpen={setIsDeleteProductOpen} product={selectedProduct} reload={fetchProducts} />
        </>
      }
      {selectedIds.length>0 &&
        <DeleteManyModal open={isDeleteManyOpen} setOpen={setIsDeleteManyOpen} selectedIds={selectedIds} reload={fetchProducts}/>
      }
    </div>
  )
}

export default page