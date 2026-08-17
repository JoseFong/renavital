"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

function page() {
  const router = useRouter()
  
  useEffect(()=>{
    router.push("/admin/catalogo/productos")
  },[])

  return (
    <div className="flex w-screen h-screen items-center justify-center">Cargando...</div>
  )
}

export default page