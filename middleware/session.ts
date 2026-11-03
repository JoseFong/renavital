import { deactivateSession, getSessionByToken } from "@/controllers/sessionController";
import { AuthenticatedUser } from "@/lib/types";
import { cookies } from "next/headers";

export async function getUserSession() {
    const cookieStore = await cookies()
    const cookie = cookieStore.get("sessionTokenRV")
    if (!cookie) return null

    const session = await getSessionByToken(cookie.value)
    if (!session) return null
    if (!session.user.userRole) return null
    if (!session.user.active) return null
    if (session.user.pendingPasswordSetup) return null

    const now = new Date()

    if(now>=session.expiresAt){
        await deactivateSession(session.id)
        return null
    }

    const authenticatedUser: AuthenticatedUser = {
        id: session.user.id,
        username: session.user.username,
        doctorId: session.user.doctorId,
        email: session.user.email,
        role: {
            name: session.user.userRole.name,
            permissions: session.user.userRole.permissions
        }
    }

    return authenticatedUser
}