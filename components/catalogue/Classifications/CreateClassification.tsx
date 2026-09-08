import { ProductClassification } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function CreateClassification({ open, setOpen, parentClassification, reload }: { open: any, setOpen: any, parentClassification: ProductClassification | null, reload: () => void }) {
    const [name, setName] = useState("")

    const [loading, setLoading] = useState(false)

    function reset(){
        setName("")
    }

    async function fetchCreate() {
        try {
            if(name.trim()===""){
                toast.error("Complete todos los campos.")
                return
            }

            let parentId = null
            if(parentClassification){
                parentId = parentClassification.id
            }

            const data = {
                name: name.trim(),
                parentId
            }

            setLoading(true)
            await axios.post("/api/productClassifications",data)
            setLoading(false)
            toast.success("Clasificación creada exitosamente.")
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
                    {parentClassification ? "Registrar subclasificación para la clasificación " + parentClassification.name : "Registrar nueva clasificación"}
                </h1>
                <label>Nombre</label>
                <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                <button disabled={loading} onClick={fetchCreate} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default CreateClassification