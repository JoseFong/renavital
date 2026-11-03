import NewQuotePage from "@/components/quotes/NewQuote/NewQuotePage"
import { getUserSession} from "@/middleware/session"
import { redirect } from "next/navigation"

async function page() {
    const session = await getUserSession()
    if(!session) redirect("/login?next=/cotizaciones/nueva")
    if(!session.role.permissions.includes("Quote.Create")) redirect("/not_authorized")

    if(session.role.name==="ADMIN" || session.role.name==="SUPERADMIN"){
        return <div>Falta hacer la version del admin asja</div>
    }else{
        return <NewQuotePage session={session}/>
    }
    
}

export default page