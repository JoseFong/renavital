import Modal from "@/components/public/Modal"
import SelectClassificationItem from "./SelectClassificationItem"

function SelectClassification({
    open,
    setOpen,
    classifications,
    setSelectedClassification
}:{
    open:any,
    setOpen:any,
    classifications:any,
    setSelectedClassification:any
}) {
  return (
    <Modal open={open} setOpen={setOpen}>
        <div className="flex flex-col gap-1">
            <h1>Seleccionar clasificación para el producto</h1>
            <SelectClassificationItem classifications={classifications} level={0} parentId={null} setSelectedClassification={setSelectedClassification} setOpen={setOpen}/>
        </div>
    </Modal>
  )
}

export default SelectClassification