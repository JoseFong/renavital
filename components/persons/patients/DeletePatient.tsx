import Modal from "@/components/public/Modal"

function DeletePatient({open,setOpen,patient}:{open:any,setOpen:any,patient:any}) {
  return (
    <Modal open={open} setOpen={setOpen}>
        <div className="flex flex-col gap-1">
            <h1>¿Está seguro que desea eliminar ?</h1>
        </div>
    </Modal>
  )
}

export default DeletePatient