"use client"

import { Category } from "@/app/generated/prisma/client"
import SelectTest from "@/components/public/SelectTest"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function page() {
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])

  const [selectedCategory,setSelectedCategory] = useState("-1")

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
    fetchCategories()
  }, [])

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-zinc-200 flex-col">
      <SelectTest options={categories} selected={selectedCategory} setSelected={setSelectedCategory}/>
      hola
      <button
        disabled={selectedCategory==="-1"}
        className="disabled:cursor-not-allowed underline cursor-pointer"
        onClick={()=>{
          setSelectedCategory("-1")
        }}
      >
        Aceptar
      </button>
    </div>
  )
}

export default page