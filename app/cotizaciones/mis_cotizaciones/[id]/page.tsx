import { getUserSession } from '@/middleware/session'
import { redirect } from 'next/navigation'
import React from 'react'

async function page() {
    const session = await getUserSession()
    if(!session || !session.role.permissions.includes("Quote.ReadOwn")) redirect("/login")
 
    return (
        <div>Si puede ver la info</div>
    )
}

export default page