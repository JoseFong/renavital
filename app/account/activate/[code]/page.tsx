"use client"

import { User } from "@/app/generated/prisma/client"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
  const loaded = useRef(false)

  const [loading,setLoading] = useState(false)

  const router = useRouter()

  const params = useParams()
  const code = params.code

  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")

  const [showPassword,setShowPassword] = useState(false)

  async function fetchDoesUserExists() {
    try {
      const data = {
        code
      }

      await axios.post("/api/activateAccount/check",data)
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? e.message)
      router.push("/login")
    }
  }

  useEffect(()=>{
    if(loaded.current) return
    fetchDoesUserExists()
    loaded.current=true
  },[])

  async function fetchPost() {
    try {
      setLoading(true)
      toast.loading("Cargando...",{id:"1"})

      if(password.trim()==="" || confirmPassword.trim()==="") throw new Error("Complete todos los campos.")

      if(password.trim().length<12) throw new Error("La contraseña debe de contener al menos 12 caracteres.")
      
      if(password.trim()!==confirmPassword.trim()) throw new Error("Las contraseñas no coinciden.")

      const data = {
        password: password,
        code: code
      }

      axios.post("/api/activateAccount",data)

      setLoading(false)
      toast.success("Cuenta activada exitosamente.",{id:"1"})
      router.push("/login")
    } catch (e: any) {
      setLoading(false)
      toast.error(e.response?.data?.message ?? e.message,{id:"1"})
    }
  }

  return (
    <div className="flex flex-col gap-1 p-5">
      <h1 className="font-bold text-lg">Activar nuevo usuario</h1>
      <label className="font-bold">Para activar su cuenta, cree una contraseña</label>
      <p>(La contraseña debe contener al menos 12 caracteres)</p>
      <label className="font-bold">Contraseña</label>
      <input type={showPassword ? "text" : "password"} placeholder="Contraseña" value={password} onChange={(e)=>setPassword(e.target.value)}/>
      <label className="font-bold">Confirmar Contraseña</label>
      <input type={showPassword ? "text" : "password"} placeholder="Contraseña" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
      <button disabled={loading} onClick={()=>setShowPassword(!showPassword)} className="underline cursor-pointer disabled:cursor-not-allowed">
        {showPassword ? "Ocultar Contraseña" : "Mostrar Contraseña"}
      </button>
      <button onClick={fetchPost} disabled={loading} className="underline cursor-pointer disabled:cursor-not-allowed">Aceptar</button>
    </div>
  )
}

export default page