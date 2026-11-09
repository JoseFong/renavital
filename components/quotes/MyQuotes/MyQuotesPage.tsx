"use client"
import { AuthenticatedUser, QuoteInfo } from "@/lib/types"
import QuoteNavBar from "../QuoteNavBar"
import toast from "react-hot-toast"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

function MyQuotesPage({ session }: { session: AuthenticatedUser }) {
    const loaded = useRef(false)
    
    const router = useRouter()

    const [quotes,setQuotes] = useState<QuoteInfo[]>([])

    async function fetchGetMyQuotes(){
        try{
            const response = await axios.get("/api/quotes/myquotes")
            setQuotes(response.data)
        }catch(e:any){
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    useEffect(()=>{
        if(loaded.current) return
        fetchGetMyQuotes()
        loaded.current = true
    },[])

    /**Folio	Paciente	Procedimiento	Configuración	Fecha programada	Total MXN	Estado	Modificada */
    
    return (
        <>
            <QuoteNavBar selected="mis_cotizaciones" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-lg">Cotizaciones del usuario {session.username}</h1>
                <table>
                    <thead>
                        <tr>
                            <th className="border p-1">Folio</th>
                            <th className="border p-1">Paciente</th>
                            <th className="border p-1">Procedimiento</th>
                            <th className="border p-1">Configuración</th>
                            <th className="border p-1">Fecha programada</th>
                            <th className="border p-1">Total MXN</th>
                            <th className="border p-1">Estado</th>
                            <th className="border p-1">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotes.map((q:QuoteInfo)=>(
                            <tr key={q.id}>
                                <td className="border p-1">{q.basefolio}{"-R"}{q.revision}</td>
                                <td className="border p-1">{q.patient.firstName}{" "}{q.patient.lastName}</td>
                                <td className="border p-1">{q.medicalProcedureName}</td>
                                <td className="border p-1">{q.configurationCode}</td>
                                <td className="border p-1">{q.scheduledDate}{" "}{q.scheduledTime}</td>
                                <td className="border p-1">${Number(q.subTotalMxn).toFixed(2)}</td>
                                <td className="border p-1">{q.status}</td>
                                <td className="border p-1">
                                    <button onClick={()=>router.push("/cotizaciones/mis_cotizaciones/"+q.id)} className="underline cursor-pointer">Ver más</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default MyQuotesPage