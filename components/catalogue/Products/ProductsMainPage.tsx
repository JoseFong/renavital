"use client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import DeleteManyModal from "@/components/catalogue/Products/DeleteManyModal"
import DeleteProductModal from "@/components/catalogue/Products/DeleteProductModal"
import UpdateProductStatus from "@/components/catalogue/Products/UpdateProductStatus"
import { normalizeText } from "@/lib/normalizeText"
import { ProductCategoryInfo, ProductInfo } from "@/lib/types"
import axios from "axios"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function ProductsMainPage() {
  const hasFetched = useRef(false)

  const router = useRouter()

  const [products, setProducts] = useState<ProductInfo[]>([])

  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null)
  const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false)
  const [isUpdateProductStatusOpen, setIsUpdateProductStatusOpen] = useState(false)
  const [isDeleteManyOpen, setIsDeleteManyOpen] = useState(false)

  const [sortBy, setSortBy] = useState("")

  const [search, setSearch] = useState("")

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
      const aux = results.map((r: ProductInfo) => {
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


  useEffect(() => {
    if (hasFetched.current) return

    fetchProducts()
    hasFetched.current = true
  }, [])

  function goToNew() {
    router.push("/admin/catalogo/productos/nuevo")
  }

  let results = [...products]
  if (search.trim() !== "") {
    let s = normalizeText(search)
    results = results.filter((p) => {
      if (
        normalizeText(p.name).includes(search) ||
        p.productCategories.some((pc) => normalizeText(pc.category.name).includes(s))
      ) {
        return p
      }
    })
  }

  if(sortBy!==""){
    if(sortBy.includes("name")){
      if(sortBy.includes("Up")){
        results = results.sort((a,b)=>b.name.localeCompare(a.name))
      }else{
        results = results.sort((a,b)=>a.name.localeCompare(b.name))
      }
    }

    if(sortBy.includes("classification")){
      if(sortBy.includes("Up")){
        results = results.sort((a,b)=>(b.productClassification?.name ?? "").localeCompare((a.productClassification?.name ?? "")))
      }else{
        results = results.sort((a,b)=>(a.productClassification?.name ?? "").localeCompare((b.productClassification?.name ?? "")))
      }
    }

    if(sortBy.includes("price")){
      if(sortBy.includes("Up")){
        results = results.sort((a,b)=>Number(b.price)-Number(a.price))
      }else{
        results = results.sort((a,b)=>Number(a.price)-Number(b.price))
      }
    }

    if(sortBy.includes("tax")){
      if(sortBy.includes("Up")){
        results = results.sort((a,b)=>a.taxRate-b.taxRate)
      }else{
        results = results.sort((b,a)=>a.taxRate-b.taxRate)
      }
    }
  }

  //Cambia el estado de sortBy
  function sort(param: string) {
    if (param === "name") {
      if (sortBy === "nameDown") {
        setSortBy("nameUp")
      } else if (sortBy === "nameUp") {
        setSortBy("")
      } else {
        setSortBy("nameDown")
      }
    }

    if (param === "classification") {
      if (sortBy === "classificationDown") {
        setSortBy("classificationUp")
      } else if (sortBy === "classificationUp") {
        setSortBy("")
      } else {
        setSortBy("classificationDown")
      }
    }

    if (param === "price") {
      if (sortBy === "priceDown") {
        setSortBy("priceUp")
      } else if (sortBy === "priceUp") {
        setSortBy("")
      } else {
        setSortBy("priceDown")
      }
    }

    if (param === "tax") {
      if (sortBy === "taxDown") {
        setSortBy("taxUp")
      } else if (sortBy === "taxUp") {
        setSortBy("")
      }else {
        setSortBy("taxDown")
      }
    }
  }

  return (
    <div>
      <NavBarCatalogue selected="Productos" />
      <div className="p-5 flex flex-col gap-1">
        <h1 className="font-bold">Productos</h1>
        <button onClick={goToNew} className="underline cursor-pointer">Registrar nuevo</button>
        <input placeholder="Búsqueda" value={search} onChange={(e) => setSearch(e.target.value.toUpperCase())} />
        <p>{results.length} resultados</p>
        <button onClick={() => setIsDeleteManyOpen(true)} disabled={selectedIds.length === 0} className="disabled:opacity-60 underline cursor-pointer">Eliminar seleccionados</button>
        <table>
          <thead>
            <tr>
              <th className="border-2 p-1">
                <input type="checkbox" checked={selectedIds.length === results.length} onChange={selectAll} />
              </th>
              <th className="border-2 p-1">Id</th>
              <th className="border-2 p-1">
                <button onClick={() => sort("name")} className="hover:underline cursor-pointer flex flex-row justify-center">
                  Nombre
                  {sortBy === "nameDown" && <ChevronDown />}
                  {sortBy === "nameUp" && <ChevronUp />}
                </button>
              </th>
              <th className="border-2 p-1">
                <button onClick={() => sort("classification")} className="hover:underline cursor-pointer flex flex-row justify-center">
                  Clasificación
                  {sortBy === "classificationDown" && <ChevronDown />}
                  {sortBy === "classificationUp" && <ChevronUp />}
                </button>
              </th>
              <th className="border-2 p-1">Equipo</th>
              <th className="border-2 p-1">Producto/Servicio</th>
              <th className="border-2 p-1">
                <button onClick={() => sort("price")} className="hover:underline cursor-pointer flex flex-row justify-center">
                  Precio Unitario
                  {sortBy === "priceDown" && <ChevronDown />}
                  {sortBy === "priceUp" && <ChevronUp />}
                </button>
              </th>
              <th className="border-2 p-1">
                <button onClick={() => sort("tax")} className="hover:underline cursor-pointer flex flex-row justify-center">
                  Impuesto
                  {sortBy === "taxDown" && <ChevronDown />}
                  {sortBy === "taxUp" && <ChevronUp />}
                </button>
              </th>
              <th className="border-2 p-1">Conceptos</th>
              <th className="border-2 p-1">Acciones</th>
              <th className="border-2 p-1">Estado</th>
            </tr>
          </thead>
          <tbody>
            {results.map((p: ProductInfo) => (
              <tr key={p.id}>
                <td className="border-2 p-1">
                  <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelection(p.id)} />
                </td>
                <td className="border-2 p-1">{p.id}</td>
                <td className="border-2 p-1">{p.name}</td>
                <td className="border-2 p-1">
                  {p.productClassification ? p.productClassification.name : "SIN CLASIFICACIÓN"}
                </td>
                <td className="border-2 p-1">{p.equipment ? "Si" : "No"}</td>
                <td className="border-2 p-1">{p.service ? "Servicio" : "Producto"}</td>
                <td className="border-2 p-1">${Number(p.price).toFixed(2)} USD</td>
                <td className="border-2 p-1">
                  {p.taxRate === -1 ? "Excento de impuestos" : p.taxRate * 100 + "%"}
                </td>
                <td className="border-2 p-1">
                  {p.productCategories.sort((a, b) => a.category.name.localeCompare(b.category.name)).map((pc: ProductCategoryInfo) => (
                    <p key={pc.id}>{pc.category.name}</p>
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
      {selectedIds.length > 0 &&
        <DeleteManyModal open={isDeleteManyOpen} setOpen={setIsDeleteManyOpen} selectedIds={selectedIds} reload={fetchProducts} />
      }
    </div>
  )
}

export default ProductsMainPage