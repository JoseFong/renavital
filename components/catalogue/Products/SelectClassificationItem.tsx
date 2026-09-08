import { ProductClassification } from "@/app/generated/prisma/client"
import Image from "next/image"
import right from "@/assets/icons8-sort-right-48.png"
import down from "@/assets/icons8-sort-down-48.png"
import { Fragment } from "react/jsx-runtime"
import { useState } from "react"

function SelectClassificationItem({
    classifications,
    level,
    parentId,
    setSelectedClassification,
    setOpen
}: {
    classifications: ProductClassification[]
    level: number,
    parentId: number | null,
    setSelectedClassification: any,
    setOpen: any
}) {
    const newLevel = level + 1

    const [showing, setShowing] = useState<number[]>([])

    function toggleShowing(id: number) {
        let aux = [...showing]
        if (aux.includes(id)) {
            aux = aux.filter((a) => a !== id)
        } else {
            aux.push(id)
        }
        setShowing(aux)
    }

    return (
        <div>
            {classifications.filter((c) => c.parentId === parentId).map((c) => (
                <div key={c.id}>
                    <div className="border flex flex-row gap-1 items-center p-1" style={{ paddingLeft: level * 25 + "px" }}>
                        <Image src={right} alt="Ver Más" className={`${showing.includes(c.id) && "rotate-90"} w-6 transition-all duration-500`} />
                        <p onClick={() => toggleShowing(c.id)} className="grow cursor-pointer">{c.name}</p>
                        <button onClick={() => { setSelectedClassification(c); setOpen(false) }} className="underline cursor-pointer p-1 rounded-md border">Seleccionar</button>
                    </div>
                    {classifications.filter((cs) => cs.parentId === c.id).length > 0 && (
                        <div
                            className={`overflow-hidden transition-all duration-500 ${showing.includes(c.id)
                                ? "max-h-250"
                                : "max-h-0"
                                }`}
                        >
                            <SelectClassificationItem classifications={classifications}
                                level={newLevel}
                                parentId={c.id}
                                setSelectedClassification={setSelectedClassification}
                                setOpen={setOpen}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default SelectClassificationItem