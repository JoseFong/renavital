"use client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import { useParams } from "next/navigation"

function page() {

    const params = useParams()
    const id = params.id

  return (
    <>
        <NavBarCatalogue selected="Conceptos"/>
        <div className="flex flex-col gap-1 p-5">
            Productos del concepto con id {id}
        </div>
    </>
  )
}

export default page