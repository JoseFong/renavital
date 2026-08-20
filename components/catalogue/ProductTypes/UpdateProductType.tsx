"use client"
import {  ProductType } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function UpdateProductType({ open, setOpen,productType, reload }: { open: any, setOpen: any,productType:ProductType, reload: any }) {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")

    function reset(){
        if(productType)
            setName(productType.name)
    }

    useEffect(()=>{
        if(productType)
            reset()
    },[open])

    async function fetchUpdate() {
        try {
            setLoading(true)
            if(name.trim()==="") throw new Error("Complete todos los campos.")
                
            const data = { 
                name: name.trim()
            }

            await axios.patch("/api/productTypes/"+productType.id,data)
            toast.success("Tipo de producto actualizado exitosamente.")
            reload()
            setOpen(false)
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
                <h1 className="font-bold">Actualizar tipo de producto</h1>
                <label>Nombre</label>
                <input value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="Ej. LABORATORIOS" />
                <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default UpdateProductType