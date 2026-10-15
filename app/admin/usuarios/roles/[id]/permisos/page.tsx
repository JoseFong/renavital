"use client"
import UserNavBar from "@/components/users/UserNavBar"
import { useEffect, useRef, useState } from "react"
import permissions from "@/lib/permissions.json"
import { normalizeText } from "@/lib/normalizeText"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { UserRoleInfo } from "@/lib/types"

function page() {
    const params = useParams()
    const id = params.id

    const loaded = useRef(false)

    const [userRole,setUserRole] = useState<UserRoleInfo>()

    const [loading,setLoading] = useState(false)

    const router = useRouter()

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

    async function fetchUserRole(){
        try{
            const response = await axios.get("/api/userRoles/"+id)
            setUserRole(response.data)
        }catch(e:any){
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message,{id:"1"})
        }
    }

    useEffect(()=>{
        if(loaded.current) return
        fetchUserRole()
        loaded.current=true
    },[])

    useEffect(()=>{
        if(userRole){
            setSelectedPermissions(userRole.permissions)
        }
    },[userRole])

    async function fetchPost(){
        try{
            toast.loading("Cargando...",{id:"1"})
            setLoading(true)

            if(selectedPermissions.length===0) throw new Error("Seleccione por lo menos 1 permiso.")

            const data = {
                permissions: selectedPermissions
            }

            await axios.post("/api/userRoles/"+id+"/permissions",data)

            setLoading(false)
            toast.success("Permisos de rol de usuario actualizados exitosamente",{id:"1"})
            router.push("/admin/usuarios/roles")
        }catch(e:any){
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message,{id:"1"})
        }
    }

    if(!userRole) return null

    return (
        <>
            <UserNavBar selected="roles" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-lg">Permisos del rol de usuario '{userRole.name}'</h1>

                <button disabled={loading} onClick={()=>router.push("/admin/usuarios/roles")} className="underline cursor-pointer disabled:cursor-not-allowed">Regresar</button>

                <button disabled={loading} onClick={fetchPost} className="underline cursor-pointer disabled:cursor-not-allowed">Guardar cambios</button>

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