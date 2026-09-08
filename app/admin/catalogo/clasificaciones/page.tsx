"use client"
import { ProductClassification } from "@/app/generated/prisma/client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import axios from "axios"
import { Fragment, useEffect, useRef, useState } from "react"
import toast, { useToaster } from "react-hot-toast"
import ClassificationItem from "@/components/catalogue/Classifications/ClassificationItem"
import CreateClassification from "@/components/catalogue/Classifications/CreateClassification"

function page() {
    const loaded = useRef(false)

    const [loading, setLoading] = useState(false)
    const [classifications, setClassifications] = useState<ProductClassification[]>([])

    const [showing,setShowing] = useState<number[]>([])

    const [isCreateOpen,setIsCreateOpen] = useState(false)

    async function fetchClassifications() {
        try {
            setLoading(true)
            const response = await axios.get("/api/productClassifications")
            setClassifications(response.data)
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

    useEffect(() => {
        if (loaded.current) return
        fetchClassifications()
        loaded.current = true
    }, [])

    

    return (
        <>
            <NavBarCatalogue selected={"Clasificaciones"} />
            <div className="p-5 flex flex-col gap-1">
                <h1 className="font-bold">Clasificaciones de productos</h1>
                <button onClick={()=>setIsCreateOpen(true)} className="underline cursor-pointer">Nueva clasificación</button>
                <ClassificationItem classifications={classifications} parentId={null} level={1} showing={showing} setShowing={setShowing} reload={fetchClassifications}/>
                <CreateClassification open={isCreateOpen} setOpen={setIsCreateOpen} parentClassification={null} reload={fetchClassifications}/>
            </div>
        </>
    )
}

export default page