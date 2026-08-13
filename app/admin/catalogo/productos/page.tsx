"use client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import { ProductWithCategory } from "@/lib/types"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
  const hasFetched = useRef(false)

  const [products, setProducts] = useState<ProductWithCategory[]>([])

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

  return (
    <div>
      <NavBarCatalogue selected="Productos" />
      <div className="p-5">
        <h1 className="font-bold">Productos</h1>
        <table>
          <thead>
            <tr>
              <th className="border-2 p-1">Id</th>
              <th className="border-2 p-1">Nombre</th>
              <th className="border-2 p-1">Flujo</th>
              <th className="border-2 p-1">Categoria</th>
              <th className="border-2 p-1">Equipo</th>
              <th className="border-2 p-1">Cantidad</th>
              <th className="border-2 p-1">Precio Unitario</th>
              <th className="border-2 p-1">Acciones</th>
              <th className="border-2 p-1">Estado</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: ProductWithCategory) => (
              <tr key={p.id}>
                <td className="border-2 p-1">{p.id}</td>
                <td className="border-2 p-1">{p.name}</td>
                <td className="border-2 p-1">{p.flux}</td>
                <td className="border-2 p-1">{p.category.name}</td>
                <td className="border-2 p-1">{p.equipment ? "Si" : "No"}</td>
                <td className="border-2 p-1">{p.quantity}</td>
                <td className="border-2 p-1">${Number(p.price).toFixed(2)} USD</td>
                <td className="border-2 p-1">
                  <button>Editar</button>
                  <button>Eliminar</button>
                </td>
                <td className="border-2 p-1">{p.active ? "Activo" : "No activo"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default page