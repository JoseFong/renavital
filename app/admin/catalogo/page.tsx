"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Category, Product } from "../../generated/prisma/client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"

function page() {
    
    

    

    

    

  return (
    <div>
        <NavBarCatalogue selected="Productos"/>
        <div className="flex flex-col gap-5 p-5">
            Catalogo Page
           
            
        </div>
    </div>
  )
}

export default page