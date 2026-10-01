"use client"
import { Code } from "@/app/generated/prisma/client"
import CodesNavBar from "@/components/codes/CodesNavBar"
import UpdateCodeStatus from "@/components/codes/UpdateCodeStatus"
import { formatDate } from "@/lib/formatDate"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const loaded = useRef(false)

    const router = useRouter()

    const [codes,setCodes] = useState<Code[]>([])

    const [selectedCode,setSelectedCode] = useState<Code>()
    const [isUpdateStatusOpen,setIsUpdateStatusOpen] = useState(false)

    async function fetchCodes(){
        try{
            const response = await axios.get("/api/codes")
            setCodes(response.data)
        }catch(e:any){
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    useEffect(()=>{
        if(loaded.current) return
        fetchCodes()
        loaded.current = true
    },[])

    return (
        <>
            <CodesNavBar selected="codigos" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-xl">Códigos de descuento</h1>
                <button className="underline cursor-pointer" onClick={()=>router.push("/admin/codigos/nuevo")}>Registrar nuevo código</button>
                <table>
                    <thead>
                        <tr>
                            <th className="border p-1">Código</th>
                            <th className="border p-1">Descuento</th>
                            <th className="border p-1">Aplica sobre</th>
                            <th className="border p-1">Uso</th>
                            <th className="border p-1">Vigencia</th>
                            <th className="border p-1">Estado</th>
                            <th className="border p-1">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {codes.sort((a,b)=>a.code.localeCompare(b.code)).map((c)=>(
                            <tr key={c.id}>
                                <td className="border p-1">{c.code}</td>
                                <td className="border p-1">
                                    {c.discountType==="FIXED" ? "$"+Number(c.discount).toFixed(2) : Number(c.discount)+"%"}
                                </td>
                                <td className="border p-1">
                                    {c.appliesToTotal ? "Total" : "Subtotal"}
                                </td>
                                <td className="border p-1">
                                    Max. {c.maxUses} uso(s)/persona
                                </td>
                                <td className="border p-1">
                                    {formatDate(c.startDate+"")}{" - "}{formatDate(c.endDate+"")}
                                </td>
                                <td className="border p-1">
                                    <button onClick={()=>{setSelectedCode(c); setIsUpdateStatusOpen(true)}} className="underline cursor-pointer">
                                        {c.valid ? "🟢 Activo" : "🔴 Inactivo"}
                                    </button>
                                </td>
                                <td className="border p-1">
                                    <button onClick={()=>router.push("/admin/codigos/"+c.id)} className="underline cursor-pointer">Ver</button>
                                    {" · "}
                                    <button onClick={()=>router.push("/admin/codigos/"+c.id+"/editar")} className="underline cursor-pointer">Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedCode &&
                <UpdateCodeStatus open={isUpdateStatusOpen} setOpen={setIsUpdateStatusOpen} code={selectedCode} reload={fetchCodes}/>
            }
        </>
    )
}

export default page