"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import hamburger from "@/assets/icons8-hamburger-menu-50.png"
import SideBarMenu from "../SideBarMenu"
import { useState } from "react"

function CodesNavBar({ selected }: { selected: string }) {

  const router = useRouter()

  function goToPage(endpoint: string) {
    router.push("/admin/" + endpoint)
  }

  const [showing, setShowing] = useState(false)

  return (


    <div className="bg-blue-400 shadow-lg relative text-white flex flex-row items-center justify-center">
      <button onClick={()=>setShowing(true)} className="absolute left-0 hover:bg-blue-500 h-full py-2 px-4 cursor-pointer transition-all" >
        <Image src={hamburger} alt="Menú" className="w-7" />
      </button>
      <button onClick={() => goToPage("codigos")} className={`${selected === "codigos" && "bg-blue-600"} hover:bg-blue-500 p-4 transition-all cursor-pointer`}>Códigos de descuento</button>
      <SideBarMenu showing={showing} setShowing={setShowing} />
    </div>
  )
}

export default CodesNavBar