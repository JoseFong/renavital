"use client"
import Modal from "@/components/public/Modal"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function UpdateMedicalProcedure({ open, setOpen, reload, medicalProcedure }: { open: any, setOpen: any, reload: any, medicalProcedure: any }) {
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState("")
  const [code, setCode] = useState("")

  function reset() {
    if (medicalProcedure) {
      setName(medicalProcedure.name)
      setCode(medicalProcedure.code)
    }
  }

  useEffect(() => {
    if (medicalProcedure) {
      reset()
    }
  }, [open])

  async function fetchUpdate() {
    try {
      setLoading(true)
      toast.loading("Cargando...", { id: "1" })

      if (name.trim() === "" || code.trim() === "") throw new Error("Complete todos los campos obligatorios.")

      const data = {
        name: name.trim(),
        code: code.trim()
      }

      await axios.patch("/api/medicalProcedures/"+medicalProcedure.id,data)

      toast.success("Procedimiento médico específico actualizado exitosamente.", { id: "1" })
      setLoading(false)
      reload()
      setOpen(false)
    } catch (e: any) {
      setLoading(false)
      toast.error(e.response?.data?.message ?? e.message, { id: "1" })
    }
  }

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-lg">Editar información de procedimiento médico '{name}'</h1>

        <label className="font-bold">Código<span className="text-red-500 font-bold">*</span></label>
        <input placeholder="Código" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />

        <label className="font-bold">Nombre<span className="text-red-500 font-bold">*</span></label>
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value.toUpperCase())} />

        <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer disabled:cursor-not-allowed">Aceptar</button>
        <button disabled={loading} onClick={() => setOpen(false)} className="underline cursor-pointer disabled:cursor-not-allowed">Cancelar</button>
      </div>
    </Modal>
  )
}

export default UpdateMedicalProcedure