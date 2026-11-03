"use client"
import UserNavBar from "@/components/users/UserNavBar"
import UpdateUserStatus from "@/components/users/users/UpdateUserStatus"
import UserActivationLink from "@/components/users/users/UserActivationLink"
import { UserInfo } from "@/lib/types"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useReducer, useRef, useState } from "react"
import toast from "react-hot-toast"

function UserPage() {
  const router = useRouter()

  const loaded = useRef(false)

  const [users, setUsers] = useState<UserInfo[]>([])

  const [selectedUser, setSelectedUser] = useState<UserInfo>()
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isActivationLinkOpen, setIsActivationLinkOpen] = useState(false)

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
    loaded.current = true
  }, [])

  return (
    <>
      <UserNavBar selected="usuarios" />
      <div className="flex flex-col gap-1 p-5">
        <h1 className="font-bold text-lg">Usuarios</h1>
        <button onClick={() => router.push("/admin/usuarios/usuarios/nuevo")} className="underline cursor-pointer">Registrar nuevo usuario</button>
        <table>
          <thead>
            <tr>
              <th className="border p-1">Nombre de usuario</th>
              <th className="border p-1">Correo</th>
              <th className="border p-1">Rol de usuario</th>
              <th className="border p-1">Médico asociado</th>
              <th className="border p-1">Estado</th>
              <th className="border p-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border p-1">{u.username}</td>
                <td className="border p-1">{u.email}</td>
                <td className="border p-1">{u.userRole?.name ?? "-"}</td>
                <td className="border p-1">
                  {u.doctor ? u.doctor.firstName + " " + u.doctor.lastName + " " + (u.doctor.secondLastName ?? "") : "-"}
                </td>
                <td className="border p-1">
                  {u.pendingPasswordSetup ?
                    <div className="flex flex-col gap-1">
                      <p>"Esperando activación del usuario"</p>
                      <button onClick={() => { setSelectedUser(u); setIsActivationLinkOpen(true) }} className="underline cursor-pointer text-start">Copiar link de activación.</button>
                    </div>
                    :
                    <button onClick={() => { setSelectedUser(u); setIsStatusOpen(true) }} disabled={u.userRoleId === 4} className="underline cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                      {u.active ? "Activo" : "Inactivo"}
                    </button>
                  }
                </td>
                <td className="border p-1">
                  <button onClick={() => router.push("/admin/usuarios/usuarios/" + u.id)} className="underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Ver</button>
                  {" · "}
                  <button disabled={u.pendingPasswordSetup} onClick={() => router.push("/admin/usuarios/usuarios/" + u.id + "/editar")} className="underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedUser &&
        <>
          <UpdateUserStatus open={isStatusOpen} setOpen={setIsStatusOpen} user={selectedUser} reload={fetchUsers} />
          <UserActivationLink open={isActivationLinkOpen} setOpen={setIsActivationLinkOpen} user={selectedUser}/>
        </>
      }
    </>
  )
}

export default UserPage