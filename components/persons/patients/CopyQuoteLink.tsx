"use client"
import Modal from "@/components/public/Modal"
import toast from "react-hot-toast"

function CopyQuoteLink({ open, setOpen, code }: { open: any, setOpen: any, code: string }) {
    async function copyToClipboard(){
        try{
            await navigator.clipboard.writeText("http://localhost:3000/cotizaciones/nueva/"+code)
            toast.success("Enlace copiado al portapapeles.")
        }catch(e:any){
            toast.error("Hubo un error al copiar el contenido.")
        }
    }
    
    return (
        <Modal open={open} setOpen={setOpen}>
            <div className="flex flex-col gap-1">
                <button onClick={copyToClipboard} className="underline text-lg">http://localhost:3000/cotizaciones/nueva/{code}</button>
                <p className="text-sm">Haga click para copiar al portapapeles.</p>
                <button onClick={()=>setOpen(false)} className="underline cursor-pointer">Cerrar</button>
            </div>
        </Modal>
    )
}

export default CopyQuoteLink