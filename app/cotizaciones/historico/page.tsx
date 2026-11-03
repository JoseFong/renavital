import QuoteNavBar from "@/components/quotes/QuoteNavBar"
import { getUserSession } from "@/middleware/session"
import { redirect } from "next/navigation"

async function page() {
    const session = await getUserSession()
    if(!session) redirect("/login?next=/cotizaciones/historico")
    if(!session.role.permissions.includes("Quote.ReadAll")) redirect("/login")

    return (
        <>
            <QuoteNavBar selected="historico" />
            <div className="flex flex-col gap-1 p-5">Hola</div>
        </>
    )
}

export default page