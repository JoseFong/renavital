"use client"
import ConfirmAssignRoles from "@/components/users/roles/ConfirmAssignRoles"
import UserNavBar from "@/components/users/UserNavBar"
import { normalizeText } from "@/lib/normalizeText"
import { UserInfo, UserRoleInfo } from "@/lib/types"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { setuid } from "process"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const params = useParams()
    const id = params.id

    const router = useRouter()

    const loaded = useRef(false)

    const [loading, setLoading] = useState(false)

    const [role, setRole] = useState<UserRoleInfo>()
    const [users, setUsers] = useState<UserInfo[]>([])

    const [selectedUsers, setSelectedUsers] = useState<number[]>([])
    const [search, setSearch] = useState("")

    const [isConfirmOpen,setIsConfirmOpen] = useState(false)

    const [usersWithNoRole,setUsersWithNoRole] = useState<UserInfo[]>([])

    async function fetchRole() {
        try {
            const response = await axios.get("/api/userRoles/" + id)
            setRole(response.data)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    async function fetchUsers() {
        try {
            const response = await axios.get("/api/users")
            setUsers(response.data)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    useEffect(() => {
        if (loaded.current) return
        fetchUsers()
        fetchRole()
        loaded.current = true
    }, [])

    useEffect(() => {
        if (role) {
            setSelectedUsers(role.users.map((u) => u.id))
        }
    }, [role])

    let userResults = [...users]
    if (search.trim() !== "") {
        let s = normalizeText(search)
        userResults = userResults.filter((ur) => normalizeText(ur.username + " " + ur.email).includes(s))
    }

    function toggleSelect(id: number) {
        let aux = [...selectedUsers]

        if (aux.includes(id)) {
            aux = aux.filter((a) => a !== id)
        } else {
            aux.push(id)
        }

        setSelectedUsers(aux)
    }

    if (!role) return null

    const initialUsers = role.users

    function selectAll() {
        let aux = [...selectedUsers]
        if (userResults.every((ur) => selectedUsers.includes(ur.id))) {
            aux = aux.filter((su) => !userResults.some((ur) => ur.id === su))
        } else {
            userResults.map((ur) => {
                if (!selectedUsers.includes(ur.id)) {
                    aux.push(ur.id)
                }
            })
        }
        setSelectedUsers(aux)
    }

    

    async function fetchUpdateUserRoles() {
        let aux = initialUsers.filter((iu) => !selectedUsers.includes(iu.id))
        setUsersWithNoRole(aux)
        setIsConfirmOpen(true)
    }

    return (
        <>
            <UserNavBar selected="roles" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-lg">Gestionar usuarios pertenecientes al rol '{role.name}'</h1>

                <button disabled={loading} onClick={() => router.push("/admin/usuarios/roles")} className="underline cursor-pointer disabled:cursor-not-allowed">Regresar</button>

                <button onClick={fetchUpdateUserRoles} disabled={loading} className="underline cursor-pointer disabled:cursor-not-allowed">Guardar cambios</button>

                <input placeholder="Buscar Usuarios" value={search} className="border" onChange={(e) => setSearch(e.target.value.toUpperCase())} />

                <button disabled={loading} onClick={selectAll} className="underline cursor-pointer disabled:cursor-not-allowed">
                    {userResults.every((ur)=>selectedUsers.includes(ur.id)) ? "Deseleccionar todos" : "Seleccionar todos"}
                </button>
                {userResults.map((ur) => (
                    <button disabled={loading} onClick={() => toggleSelect(ur.id)} key={ur.id} className="flex flex-row gap-1 disabled:cursor-not-allowed cursor-pointer">
                        <input type="checkbox" readOnly checked={selectedUsers.includes(ur.id)} />
                        <p>{ur.username}{" "}({ur.email})</p>
                    </button>
                ))}
            </div>
            <ConfirmAssignRoles open={isConfirmOpen} setOpen={setIsConfirmOpen} usersWithNoRole={usersWithNoRole} selectedUsers={selectedUsers} role={role}/>
        </>
    )
}

export default page