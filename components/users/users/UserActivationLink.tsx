import Modal from "@/components/public/Modal"
import { UserInfo } from "@/lib/types"
import toast from "react-hot-toast"

function UserActivationLink({ open, setOpen, user }: { open: any, setOpen: any, user: UserInfo }) {
    async function copyToClipboard(){
        try{
            await navigator.clipboard.writeText("http://localhost:3000/account/activate/"+user.code)
            toast.success("Link copiado al portapapeles.")
        }catch(e:any){
            toast.error("Hubo un error al copiar el código.")
        }
    }

    return (
        <Modal open={open} setOpen={setOpen}>
            <div className="flex flex-col gap-1">
                <h1 className="font-bold">Link de activación para usuario '{user.username}'</h1>
                <button onClick={copyToClipboard} className="text-lg underline cursor-pointer">
                    http://localhost:3000/account/activate/{user.code}
                </button>
                <p className="text-sm">Presione el link para copiarlo al portapapeles</p>
                <button onClick={()=>setOpen(false)} className="underline cursor-pointer">Cerrar</button>
            </div>
        </Modal>
    )
}

export default UserActivationLink