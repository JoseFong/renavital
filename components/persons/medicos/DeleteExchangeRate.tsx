import Modal from "@/components/public/Modal"
import { DoctorInfo, ExchangeRateInfo } from "@/lib/types"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

function DeleteExchangeRate({ open, setOpen, exchangeRate, reload, doctor }: { open: any, setOpen: any, exchangeRate: ExchangeRateInfo, reload: any, doctor: DoctorInfo }) {
    const [loading,setLoading] = useState(false)

    async function fetchDelete(){
        try{
            setLoading(true)
            toast.loading("Cargando...",{id:"1"})

            await axios.delete("/api/exchangeRates/"+exchangeRate.id)

            toast.success("Tipo de cambio eliminado exitosamente.",{id:"1"})
            reload()
            setOpen(false)
            setLoading(false)
        }catch(e:any){
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message,{id:"1"})
        }
    }

    return (
        <Modal open={open} setOpen={setOpen}>
            <div className="flex flex-col gap-1">
                <h1 className="font-bold">¿Seguro que desea eliminar el tipo de cambio para médico '{doctor.firstName}{" "}{doctor.lastName}' para el procedimiento {exchangeRate.configuration.procedure.shortForm}{" - "}{exchangeRate.configuration.anesthesia.shortForm}{" - "}{exchangeRate.configuration.stay.shortForm}</h1>
                <p>¡Esta acción es permanente!</p>
                <button disabled={loading} onClick={fetchDelete} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default DeleteExchangeRate