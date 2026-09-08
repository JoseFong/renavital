"use client"
import { ProductClassification } from "@/app/generated/prisma/client"
import ConfirmationAssignProducts from "@/components/catalogue/Classifications/ConfirmationAssignProducts"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import { ProductInfo } from "@/lib/types"
import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const params = useParams()
    const id = params.id

    const loaded = useRef(false)

    const [products, setProducts] = useState<ProductInfo[]>([])
    const [classification, setClassification] = useState<ProductClassification>()
    const [selectedProducts, setSelectedProducts] = useState<ProductInfo[]>([])
    const [availableProducts, setAvailableProducts] = useState<ProductInfo[]>([])

    const [availableProductSearch,setAvailableProductSearch] = useState("")
    const [selectedProductSearch,setSelectedProductSearch] = useState("")

    const [isConfirmationOpen,setIsConfirmationOpen] = useState(false)

    async function fetchProducts() {
        try {
            const response = await axios.get("/api/productClassifications/" + id + "/products")
            setProducts(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    async function fetchClassification() {
        try {
            const response = await axios.get("/api/productClassifications/" + id)
            setClassification(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    useEffect(() => {
        if (loaded.current) return
        fetchProducts()
        fetchClassification()
        loaded.current = true
    }, [])

    useEffect(() => {
        if (products) {
            setAvailableProducts(products.filter((p) => p.productClassificationId === null))
            setSelectedProducts(products.filter((p) => p.productClassificationId === Number(id)))
        }
    }, [products])

    ///BUSQUEDA DE PRODUCTOS DISPONIBLES
    let avProductsResults = []
    if(availableProductSearch.trim()===""){
        avProductsResults = [...availableProducts]
    }else{
        avProductsResults = availableProducts.filter((ap)=>ap.name.toUpperCase().includes(availableProductSearch.trim().toUpperCase()))
    }

    //BUSQUEDA DE PRODUCTOS SELECCIONADOS
    let selProductsResults = []
    if(selectedProductSearch.trim()===""){
        selProductsResults = [...selectedProducts]
    }else{
        selProductsResults = selectedProducts.filter((sp)=>sp.name.toUpperCase().includes(selectedProductSearch.trim().toUpperCase()))
    }

    //TOGGLE PRODUCT
    function toggleProduct(id:number){
        if(selectedProducts.some((sp)=>sp.id===id)){
            let aux = [...selectedProducts]
            aux = aux.filter((a)=>a.id!==id)
            setSelectedProducts(aux)

            aux = [...availableProducts]
            const product = products.find((p)=>p.id===id)
            if(product) aux.push(product)
            setAvailableProducts(aux)
        }else{
            let aux = [...availableProducts]
            aux = aux.filter((a)=>a.id!==id)
            setAvailableProducts(aux)

            aux = [...selectedProducts]
            const product = products.find((p)=>p.id===id)
            if(product) aux.push(product)
            setSelectedProducts(aux)
        }
    }

    return (
        <>
            <NavBarCatalogue selected={"Clasificaciones"} />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-xl">Gestionar productos de clasificación '{classification?.name}'</h1>
                <div className="flex flex-row gap-10">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold">Productos disponibles</h1>
                        <p>Haga click para agregar productos a la clasificación.</p>
                        <input placeholder="Buscar" value={availableProductSearch} onChange={(e)=>setAvailableProductSearch(e.target.value)}/>
                        <div className="flex flex-col">
                            {avProductsResults.map((ap,index) => (
                                <button
                                    onClick={()=>toggleProduct(ap.id)}
                                    className={`${index===0 && "rounded-t-lg"} ${index===avProductsResults.length-1 && "rounded-b-lg"} ${index%2===0 ? "bg-zinc-50" : "bg-zinc-100"} border p-2 text-start cursor-pointer hover:bg-zinc-200 transition-all`}
                                    key={ap.id}
                                >
                                    {ap.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold">Productos de la categoría</h1>
                        <p>Haga click para quitar productos a la clasificación.</p>
                        <input placeholder="Buscar" value={selectedProductSearch} onChange={(e)=>setSelectedProductSearch(e.target.value)}/>
                        <div className="flex flex-col">
                            {selProductsResults.map((sp,index) => (
                                <button
                                    onClick={()=>toggleProduct(sp.id)}
                                    className={`${index===0 && "rounded-t-lg"} ${index===selProductsResults.length-1 && "rounded-b-lg"} ${index%2===0 ? "bg-zinc-50" : "bg-zinc-100"} border p-2 text-start cursor-pointer hover:bg-zinc-200 transition-all`}
                                    key={sp.id}
                                >
                                    {sp.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <ConfirmationAssignProducts open={isConfirmationOpen} setOpen={setIsConfirmationOpen} classification={classification} selectedProducts={selectedProducts}/>
            </div>
            <button onClick={()=>setIsConfirmationOpen(true)} className="fixed left-1/2 bottom-5 bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-md shadow-md py-1 px-3 text-white text-lg -translate-x-1/2">Guardar cambios</button>
        </>
    )
}

export default page