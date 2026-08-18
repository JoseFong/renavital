"use client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import { useParams } from "next/navigation"

function page() {
    const params = useParams()
    const id = params.id
  
    

    return (
    <>
        <NavBarCatalogue selected={"Categorias"}/>
        <div className="p-5 flex flex-col gap-1">
            Products from category page {id}
        </div>
    </>
  )
}

export default page