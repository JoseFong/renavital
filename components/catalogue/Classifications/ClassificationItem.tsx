"use client"
import { ProductClassification } from "@/app/generated/prisma/client"
import { Fragment } from "react/jsx-runtime"
import Image from "next/image"
import right from "@/assets/icons8-sort-right-48.png"
import CreateClassification from "./CreateClassification"
import { useState } from "react"
import UpdateClassification from "./UpdateClassification"
import DeleteClassification from "./DeleteClassification"
import { useRouter } from "next/navigation"

function ClassificationItem({
    classifications,
    parentId,
    level,
    showing,
    setShowing,
    reload
}: { 
    classifications: ProductClassification[],
    parentId:number|null,
    level:number,
    showing:number[],
    setShowing:any,
    reload:()=>void
}) {
    const paddingLeft = level*20
    const nextLevel = level+1

    const router = useRouter()

    const [isCreateOpen,setIsCreateOpen] = useState(false)
    const [isUpdateOpen,setIsUpdateOpen] = useState(false)
    const [isDeleteOpen,setIsDeleteOpen] = useState(false)
    const [selectedClassification,setSelectedClassification] = useState<ProductClassification|null>(null)
    
    function toggleShow(id:number){
        let aux = [...showing]
        if(showing.includes(id)){
            aux = aux.filter((a)=>a!==id)
        }else{  
            aux.push(id)
        }
        setShowing(aux)
    }

    function goToPage(id:number){
        router.push("/admin/catalogo/clasificaciones/"+id+"/productos")
    }

    return (
        <div className="flex flex-col">
            {classifications.filter((c)=>c.parentId===parentId).map((c)=>(
                <Fragment key={c.id}>
                    <div style={{paddingLeft:paddingLeft+"px"}} className="border p-2 flex flex-row gap-1 items-center">
                        <Image src={right} alt="Ver más" className={`w-6 ${showing.includes(c.id) && "rotate-90"} transition-all duration-500`}/>
                        <div className="grow cursor-pointer" onClick={()=>toggleShow(c.id)}>
                            {c.name}
                        </div>
                        <button onClick={()=>goToPage(c.id)} className="underline cursor-pointer border rounded-sm p-1">Gestionar productos</button>
                        <button onClick={()=>{setSelectedClassification(c); setIsCreateOpen(true)}} className="underline cursor-pointer border rounded-sm p-1">Agregar subcategoría</button>
                        <button onClick={()=>{setSelectedClassification(c); setIsUpdateOpen(true)}} className="underline cursor-pointer border rounded-sm p-1">Editar</button>
                        <button onClick={()=>{setSelectedClassification(c); setIsDeleteOpen(true)}} className="underline cursor-pointer border rounded-sm p-1">Eliminar</button>
                    </div>
                    {(classifications.filter((cs)=>cs.parentId===c.id).length>0) && 
                        <div className={`${showing.includes(c.id)? "max-h-250" : "max-h-0"} overflow-hidden transition-all duration-500`}>
                            <ClassificationItem classifications={classifications} parentId={c.id} level={nextLevel} showing={showing} setShowing={setShowing} reload={reload}/>
                        </div>
                    } 
                </Fragment>
            ))}
            {selectedClassification && <>
                <DeleteClassification open={isDeleteOpen} setOpen={setIsDeleteOpen} classification={selectedClassification} reload={reload}/>
                <UpdateClassification open={isUpdateOpen} setOpen={setIsUpdateOpen} classification={selectedClassification} reload={reload}/>
            </>}
            <CreateClassification open={isCreateOpen} setOpen={setIsCreateOpen} parentClassification={selectedClassification} reload={reload}/>
        </div>
    )
}

export default ClassificationItem