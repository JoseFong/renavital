import { ProductClassification } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function UpdateClassification({ open, setOpen, classification, reload }: { open: any, setOpen: any, classification: ProductClassification, reload: () => void }) {
    const [name, setName] = useState("")

    const [loading, setLoading] = useState(false)

    function reset(){
        setName(classification.name)
    }

    useEffect(()=>{
        reset()
    },[open])

    async function fetchUpdate() {
        try {
            if(name.trim()===""){
                toast.error("Complete todos los campos.")
                return
            }

            const data = {
                name: name.trim()
            }

            setLoading(true)
            await axios.patch("/api/productClassifications/"+classification.id,data)
            setLoading(false)
            toast.success("Clasificación actualizada exitosamente.")
            reload()
            reset()
            setOpen(false)
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
                <h1 className="font-bold">
                    Editar información de '{classification.name}'
                </h1>
                <label>Nombre</label>
                <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default UpdateClassification