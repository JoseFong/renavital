import { ProductClassification } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import { ProductInfo } from "@/lib/types"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

function ConfirmationAssignProducts({
  open,
  setOpen,
  classification,
  selectedProducts
}: {
  open: any,
  setOpen: any
  classification: any,
  selectedProducts: ProductInfo[]
}) {
  const [loading,setLoading] = useState(false)
  const router = useRouter()

  async function fetchUpdate() {
    try {
      setLoading(true)
      let productIds:number[] = selectedProducts.map((sp)=>{
        return sp.id
      })

      const data = {
        productIds: productIds
      }

      await axios.put("/api/productClassifications/"+classification?.id+"/products",data)
      toast.success("Productos asignados exitosamente.")
      setOpen(false)
      router.push("/admin/catalogo/clasificaciones")
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

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="flex flex-col gap-1">
        <h1 className="font-bold">¿Seguro que desea modificar los productos de la clasificación '{classification?.name}'?</h1>
        <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer">Aceptar</button>
        <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer">Cancelar</button>
      </div>
    </Modal>
  )
}

export default ConfirmationAssignProducts