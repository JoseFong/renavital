import Modal from "@/components/public/Modal"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function CreateSpecialty({ open, setOpen, reload }: { open: any, setOpen: any, reload: any }) {
    const [name, setName] = useState("")

    const [loading,setLoading] = useState(false)

    async function fetchCreate() {
        try {
            setLoading(true)

            if(name.trim()==="") throw new Error("Ingrese el nombre de la especialidad.")
            
            const data = {
                name: name.trim()
            }

            await axios.post("/api/specialties",data)

            toast.success("Especialidad registrada exitosamente.")
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
                <h1 className="font-bold">Registrar especialidad</h1>
                <label>Nombre de la especialidad</label>
                <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value.toUpperCase())} />
                <button disabled={loading} onClick={fetchCreate} className="underline cursor-pointer">Aceptar</button>
            </div>
        </Modal>
    )
}

export default CreateSpecialty