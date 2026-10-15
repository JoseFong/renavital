"use client"
import UserNavBar from "@/components/users/UserNavBar"
import { useState } from "react"
import permissions from "@/lib/permissions.json"
import { normalizeText } from "@/lib/normalizeText"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import axios from "axios"

function page() {
    const [loading,setLoading] = useState(false)

    const router = useRouter()

    const [name,setName] = useState("")
    const [selectedPermissions,setSelectedPermissions] = useState<string[]>([])

    const [search,setSearch] = useState("")

    function toggleSelect(p:string){
        let aux = [...selectedPermissions]
        if(aux.includes(p)){
            aux = aux.filter((a)=>a!==p)
        }else{
            aux.push(p)
        }
        setSelectedPermissions(aux)
    }

    let permissionResults = [...permissions]
    if(search.trim()!==""){
        let s = normalizeText(search)
        permissionResults = permissionResults.filter((pr)=>normalizeText(pr).includes(s))
    }

    function selectAll(){
        if(permissionResults.every((pr)=>selectedPermissions.includes(pr))){
            setSelectedPermissions([])
        }else{
            setSelectedPermissions(permissionResults)
        }
    }

    async function fetchPost(){
        try{
            toast.loading("Cargando...",{id:"1"})
            setLoading(true)

            if(name.trim()==="") throw new Error("Ingrese un nombre para el rol de usuario.")
            if(selectedPermissions.length===0) throw new Error("Seleccione por lo menos 1 permiso.")

            const data = {
                name: name.trim(),
                permissions: selectedPermissions
            }

            await axios.post("/api/userRoles",data)

            setLoading(false)
            toast.success("Rol de usuario creado exitosamente",{id:"1"})
            router.push("/admin/usuarios/roles")
        }catch(e:any){
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message,{id:"1"})
        }
    }

    return (
        <>
            <UserNavBar selected="roles" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-lg">Nuevo rol de usuario</h1>

                <button disabled={loading} onClick={()=>router.push("/admin/usuarios/roles")} className="underline cursor-pointer disabled:cursor-not-allowed">Regresar</button>

                <button disabled={loading} onClick={fetchPost} className="underline cursor-pointer disabled:cursor-not-allowed">Crear</button>

                <label className="font-bold">Nombre del rol</label>
                <input placeholder="Nombre" value={name} onChange={(e)=>setName(e.target.value.toUpperCase())}/>
                

                <label className="font-bold">Permisos</label>
                <label>({selectedPermissions.length}) {selectedPermissions.length===1 ? "permiso seleccionado." : "permisos seleccionados."}</label>
                
                <input placeholder="Buscar permisos" className="border p-1" value={search} onChange={(e)=>setSearch(e.target.value)}/>
                
                <button disabled={loading} onClick={selectAll} className="underline cursor-pointer disabled:cursor-not-allowed">
                    {permissionResults.every((pr)=>selectedPermissions.includes(pr)) ? "Deseleccionar todos" : "Seleccionar todos"}
                </button>
                
                {permissionResults.map((p)=>(
                    <button key={p} onClick={()=>toggleSelect(p)} disabled={loading} className="cursor-pointer flex flex-row gap-1 disabled:cursor-not-allowed">
                        <input type="checkbox" className="cursor-pointer" readOnly checked={selectedPermissions.includes(p)}/>
                        {p}
                    </button>
                ))}

            </div>
        </>
    )
}

export default page