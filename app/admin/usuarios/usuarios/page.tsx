import UserPage from "@/components/users/users/UserPage"
import { getUserSession } from "@/middleware/session"
import { redirect } from "next/navigation"

async function page() {
  const session = await getUserSession()
  if(!session || !session.role.permissions.includes("User.Read")) redirect("/login?next=/admin/usuarios/usuarios")

  return (
    <UserPage />
  )
}

export default page