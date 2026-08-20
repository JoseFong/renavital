"use client"
import { ProductType } from "@/app/generated/prisma/client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import CreateProductType from "@/components/catalogue/ProductTypes/CreateProductType"
import DeleteProductType from "@/components/catalogue/ProductTypes/DeleteProductType"
import UpdateProductType from "@/components/catalogue/ProductTypes/UpdateProductType"
import UpdateProductTypeStatus from "@/components/catalogue/ProductTypes/UpdateProductTypeStatus"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import toast, { useToaster } from "react-hot-toast"

function page() {
  const loaded = useRef(false)

  const [loading, setLoading] = useState(false)
  const [productTypes, setProductTypes] = useState<ProductType[]>([])

  const [selectedProductType,setSelectedProductType] =  useState<ProductType|null>(null)
  const [isCreateProductType,setIsCreateProductType] = useState(false)
  const [isUpdateProductTypeOpen,setIsUpdateProductTypeOpen] = useState(false)
  const [isUpdateStatusOpen,setIsUpdateStatusOpen] = useState(false)
  const [isDeleteOpen,setIsDeleteOpen] = useState(false)

  async function fetchProductTypes() {
    try {
      setLoading(true)
      const response = await axios.get("/api/productTypes")
      setProductTypes(response.data)
      setLoading(false)
    } catch (e: any) {
      setLoading(false)
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message)
      } else {
        toast.error(e.message)
      }
    }
  }

  useEffect(()=>{
    if(loaded.current===false)
      fetchProductTypes()
    loaded.current=true
  },[])

  return (
    <>
      <NavBarCatalogue selected={"Tipos"} />
      <div className="flex flex-col gap-1 p-5">
        <h1 className="font-bold">Tipos de producto</h1>
        <button onClick={()=>setIsCreateProductType(true)} className="underline cursor-pointer">Registrar</button>
        <table>
          <thead>
            <tr>
              <th className="border-2 p-1">Id</th>
              <th className="border-2 p-1">Nombre</th>
              <th className="border-2 p-1">Activo</th>
              <th className="border-2 p-1">Productos</th>
              <th className="border-2 p-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
              {productTypes.map((p:ProductType)=>(
                <tr key={p.id}>
                  <td className="border-2 p-1">{p.id}</td>
                  <td className="border-2 p-1">{p.name}</td>
                  <td className="border-2 p-1">
                    <button onClick={()=>{setSelectedProductType(p); setIsUpdateStatusOpen(true)}} className="underline cursor-pointer">
                      {p.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="border-2 p-1">
                    <button className="underline cursor-pointer">Gestionar productos</button>
                  </td>
                  <td className="border-2 p-1">
                    <button onClick={()=>{setSelectedProductType(p); setIsUpdateProductTypeOpen(true)}} className="underline cursor-pointer">Editar</button>
                    <button onClick={()=>{setSelectedProductType(p); setIsDeleteOpen(true)}} className="underline cursor-pointer">Eliminar</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <CreateProductType open={isCreateProductType} setOpen={setIsCreateProductType} reload={fetchProductTypes}/>
        {selectedProductType && <>
          <UpdateProductType open={isUpdateProductTypeOpen} setOpen={setIsUpdateProductTypeOpen} productType={selectedProductType} reload={fetchProductTypes}/>
          <UpdateProductTypeStatus open={isUpdateStatusOpen} setOpen={setIsUpdateStatusOpen} productType={selectedProductType} reload={fetchProductTypes } />
          <DeleteProductType open={isDeleteOpen} setOpen={setIsDeleteOpen} productType={selectedProductType} reload={fetchProductTypes}/>
        </>}
      </div>
    </>
  )
}

export default page