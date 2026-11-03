import { getUserSession } from "@/middleware/session"
import { redirect } from "next/navigation"

async function page() {
  const session = await getUserSession()
  if(!session) redirect("/login")
  if(!session.role.permissions.includes("Product.Read")) redirect("/not_authorized")

  return (
    <div>Pagina de productos</div>
  )
}

export default page