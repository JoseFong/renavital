import MyQuotesPage from "@/components/quotes/MyQuotes/MyQuotesPage"
import { getUserSession } from "@/middleware/session"
import { redirect } from "next/navigation"

async function page() {
  const session = await getUserSession()
  if(!session) redirect("/login?next=/cotizaciones/mis_cotizaciones")
  if(!session.role.permissions.includes("Quote.ReadOwn")) redirect("/login?next=/cotizaciones/mis_cotizaciones")
  if(!session.doctorId) redirect("/login?next=/cotizaciones/mis_cotizaciones")

  return (
    <MyQuotesPage session={session}/>
  )
}

export default page