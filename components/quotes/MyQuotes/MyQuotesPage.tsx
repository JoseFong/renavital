"use client"
import { AuthenticatedUser } from "@/lib/types"
import QuoteNavBar from "../QuoteNavBar"
import toast from "react-hot-toast"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Quote } from "@/app/generated/prisma/client"

function MyQuotesPage({ session }: { session: AuthenticatedUser }) {
    const loaded = useRef(false)
    
    const [quotes,setQuotes] = useState<Quote[]>([])

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
    
    return (
        <>
            <QuoteNavBar selected="mis_cotizaciones" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-lg">Cotizaciones del usuario {session.username}</h1>
                {JSON.stringify(quotes)}
            </div>
        </>
    )
}

export default MyQuotesPage