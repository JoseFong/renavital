"use client"
import DeleteUserRole from "@/components/users/roles/DeleteUserRole"
import UpdateUserRole from "@/components/users/roles/UpdateUserRole"
import UserNavBar from "@/components/users/UserNavBar"
import { UserRoleInfo } from "@/lib/types"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function UserRolePage() {
    const loaded = useRef(false)

    const router = useRouter()

    const [userRoles, setUserRoles] = useState<UserRoleInfo[]>([])

    const [isUpdateOpen, setIsUpdateOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<any>()
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    async function fetchUserRoles() {
        try {
            const response = await axios.get("/api/userRoles")
            setUserRoles(response.data)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    useEffect(() => {
        if (loaded.current) return
        fetchUserRoles()
        loaded.current = true
    }, [])



    return (
        <>
            <UserNavBar selected="roles" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-lg">Roles de usuario</h1>
                <button onClick={() => router.push("/admin/usuarios/roles/nuevo")} className="underline cursor-pointer">Registrar rol de usuario</button>
                <table>
                    <thead>
                        <tr>
                            <th className="border p-1">Rol</th>
                            <th className="border p-1">Usuarios</th>
                            <th className="border p-1">Permisos</th>
                            <th className="border p-1">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userRoles.map((ur) => (
                            <tr key={ur.id}>
                                <td className="border p-1">{ur.name}</td>
                                <td className="border p-1">
                                    <button onClick={() => router.push("/admin/usuarios/roles/" + ur.id + "/usuarios")} className="underline cursor-pointer">Gestionar usuarios ({ur.users.length})</button>
                                </td>
                                <td className="border p-1">
                                    <button onClick={() => router.push("/admin/usuarios/roles/" + ur.id + "/permisos")} className="underline cursor-pointer">Gestionar permisos ({ur.permissions.length})</button>
                                </td>
                                <td className="border p-1">
                                    <button disabled={ur.id===4} onClick={() => { setSelectedRole(ur); setIsUpdateOpen(true) }} className="underline cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">Editar</button>
                                    {" "}
                                    <button disabled={ur.id===4} onClick={()=>{setSelectedRole(ur); setIsDeleteOpen(true)}} className="underline cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedRole &&
                <>
                    <UpdateUserRole open={isUpdateOpen} setOpen={setIsUpdateOpen} reload={fetchUserRoles} role={selectedRole} />
                    <DeleteUserRole open={isDeleteOpen} setOpen={setIsDeleteOpen} userRole={selectedRole} reload={fetchUserRoles} />
                </>
            }
        </>
    )
}

export default UserRolePage