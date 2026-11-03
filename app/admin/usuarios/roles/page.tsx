import UserRolePage from "@/components/users/roles/UserRolePage"
import { getUserSession } from "@/middleware/session"
import { redirect } from "next/navigation"

async function page() {
    const session = await getUserSession()
    if(!session || !session.role.permissions.includes("UserRole.Read")) redirect("/login?next=/admin/usuarios/roles")

    return (
        <UserRolePage />
    )
}

export default page