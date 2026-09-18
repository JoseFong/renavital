import { Specialty } from "@/app/generated/prisma/client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function UpdateSpecialty({ open, setOpen, reload,specialty }: { open: any, setOpen: any, reload: any,specialty:Specialty|null }) {
    const [name, setName] = useState("")

    const [loading,setLoading] = useState(false)

    function reset(){
        if(specialty){
            setName(specialty.name)
        }
    }

    useEffect(()=>{
        reset()
    },[open])

    async function fetchUpdate() {
        try {
            setLoading(true)

            if(name.trim()==="") throw new Error("Ingrese el nombre de la especialidad.")
            
            const data = {
                name: name.trim()
            }

            await axios.patch("/api/specialties/"+specialty?.id,data)

            toast.success("Especialidad actualizada exitosamente.")
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
                <h1 className="font-bold">Actualizar especialidad</h1>
                <label>Nombre de la especialidad</label>
                <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value.toUpperCase())} />
                <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer">Aceptar</button>
            </div>
        </Modal>
    )
}

export default UpdateSpecialty