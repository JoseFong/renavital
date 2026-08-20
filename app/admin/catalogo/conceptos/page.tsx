"use client"
import { Category } from "@/app/generated/prisma/client"
import CreateCategoryModal from "@/components/catalogue/Category/CreateCategoryModal"
import DeleteCategoryModal from "@/components/catalogue/Category/DeleteCategoryModal"
import UpdateCategoryModal from "@/components/catalogue/Category/UpdateCategoryModal"
import UpdateStatusCategory from "@/components/catalogue/Category/UpdateStatusCategory"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
  const hasFetched = useRef(false)

  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false)
  const [isUpdateModalOpen,setIsUpdateModalOpen] = useState(false)

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

    fetchCategories()
    hasFetched.current = true
  }, [])

  return (
    <div>
      <NavBarCatalogue selected="Conceptos" />
      <div className="p-5">
        <p className="font-bold">Conceptos de productos</p>
        {categories.length} resultados
        <button className="underline cursor-pointer" onClick={() => setIsCreateModalOpen(true)}>Registrar</button>
        <table>
          <thead>
            <tr>
              <th className="border-2 p-1">Id</th>
              <th className="border-2 p-1">Nombre</th>
              <th className="border-2 p-1">Acciones</th>
              <th className="border-2 p-1">Estado</th>
              <th className="border-2 p-1">Productos</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c: Category) => (
              <tr key={c.id}>
                <td className="border-2 p-1">{c.id}</td>
                <td className="border-2 p-1">{c.name}</td>
                <td className="border-2 p-1">
                  <button onClick={()=>{setSelectedCategory(c); setIsUpdateModalOpen(true)}} className="underline cursor-pointer">Editar</button>
                  <button onClick={() => { setSelectedCategory(c); setIsDeleteModalOpen(true) }} className="underline cursor-pointer">Eliminar</button>
                </td>
                <td className="border-2 p-1">
                  <div onClick={()=>{setSelectedCategory(c); setIsUpdateStatusOpen(true)}} className={`${c.active ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"} transition-all cursor-pointer text-white text-center p-1 rounded-sm`}>{c.active ? "Activo" : "Inactivo"}</div>
                </td>
                <td className="border-2 p-1">
                  <button onClick={()=>{router.push("/admin/catalogo/conceptos/"+c.id+"/productos")}} className="underline cursor-pointer">Gestionar productos</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CreateCategoryModal open={isCreateModalOpen} setOpen={setIsCreateModalOpen} reload={fetchCategories} />
      {selectedCategory &&
        <>
          <DeleteCategoryModal open={isDeleteModalOpen} setOpen={setIsDeleteModalOpen} category={selectedCategory} reload={fetchCategories} />
          <UpdateStatusCategory open={isUpdateStatusOpen} setOpen={setIsUpdateStatusOpen} category={selectedCategory} reload={fetchCategories} />
          <UpdateCategoryModal open={isUpdateModalOpen} setOpen={setIsUpdateModalOpen} reload={fetchCategories} category={selectedCategory}/>
        </>
      }
    </div>
  )
}

export default page