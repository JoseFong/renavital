import Modal from "@/components/public/Modal"
import { ExchangeRateInfo } from "@/lib/types"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function UpdateExchangeRate({ open, setOpen, doctor, exchangeRate,reload }: { open: any, setOpen: any, doctor: any, exchangeRate: ExchangeRateInfo,reload:any }) {
    const [loading,setLoading] = useState(false)

    const [exchangeRateNumber,setExchangeRateNumber] = useState("20")

    function reset(){
        if(exchangeRate){
            setExchangeRateNumber(exchangeRate.exchangeRate.toString())
        }
    }

    useEffect(()=>{
        reset()
    },[open])

    async function fetchUpdate(){
        try{
            setLoading(true)
            toast.loading("Cargando...",{id:"1"})

            if(exchangeRateNumber==="") throw new Error("Ingrese un tipo de cambio.")
            if(Number(exchangeRateNumber)<18 || Number(exchangeRateNumber)>25) throw new Error("Ingrese un tipo de cambio válido.")

            const data = {
                doctorId: exchangeRate.doctorId,
                configurationId: exchangeRate.configurationId,
                exchangeRate: Number(exchangeRateNumber)
            }

            await axios.patch("/api/exchangeRates/"+exchangeRate.id,data)

            toast.success("Tipo de cambio actualizado exitosamente.",{id:"1"})
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
                <h1 className="font-bold">Editar tipo de cambio específico para el médico '{doctor.firstName}{" "}{doctor.lastName}'</h1>
                <label className="font-bold">Procedimiento</label>
                <p>{exchangeRate.configuration.procedure.shortForm}{" - "}{exchangeRate.configuration.anesthesia.shortForm}{" "}{exchangeRate.configuration.stay.shortForm}</p>
                <label className="font-bold">Tipo de cambio</label>
                <input type="number" value={exchangeRateNumber} onChange={(e)=>setExchangeRateNumber(e.target.value)} min={18} max={25} step={0.01}/>
                <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer">Aceptar</button>
                <button disabled={loading} onClick={()=>setOpen(false)} className="underline cursor-pointer">Cancelar</button>
            </div>
        </Modal>
    )
}

export default UpdateExchangeRate