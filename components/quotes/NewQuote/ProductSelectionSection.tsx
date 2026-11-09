"use client"
import { CategoryInfo, ConfigurationCompleteInfo } from "@/lib/types"
import { useEffect, useState } from "react"
import { ItemSelection } from "@/lib/types"


function ProductSelectionSection({
    configuration,
    selectedItems,
    setSelectedItems
}: {
    configuration: ConfigurationCompleteInfo,
    selectedItems: ItemSelection[],
    setSelectedItems: any
}) {
    const [showing, setShowing] = useState<number[]>([])

    useEffect(() => {
        if (configuration) {
            let aux: ItemSelection[] = []

            configuration.configurationCategories.map((cc) => {
                cc.category.productCategories.map((pc) => {
                    aux.push({ productId: pc.productId, quantity: pc.quantity, categoryId: pc.categoryId, productName: pc.product.name, productPrice: Number(pc.product.price) })
                })
            })

            setSelectedItems(aux)
        }
    }, [configuration])

    function toggleShow(id: number) {
        let aux = [...showing]

        if (aux.includes(id)) {
            aux = aux.filter((a) => a !== id)
        } else {
            aux.push(id)
        }

        setShowing(aux)
    }

    function changeProductQuantity(
        productId: number,
        categoryId: number,
        amount: number
    ) {
        setSelectedItems((prev: ItemSelection[]) =>
            prev.map((item) => {
                if (
                    item.productId !== productId ||
                    item.categoryId !== categoryId
                ) {
                    return item
                }

                const quantity = item.quantity + amount

                return {
                    ...item,
                    quantity: Math.max(0, quantity)
                }
            })
        )
    }

    

    return (
        <>
            {configuration &&
                <>
                    <h1 className="font-bold">Configuración: {configuration.code}</h1>
                    {configuration.configurationCategories.sort((a, b) => a.category.name.localeCompare(b.category.name)).map((cc) => (
                        <div key={cc.id} className="flex flex-col gap-1">
                            <div className="flex flex-row gap-1">
                                <h1 className="font-bold">{cc.category.name}</h1>
                                <button onClick={() => toggleShow(cc.categoryId)} className="underline cursor-pointer">
                                    {showing.includes(cc.categoryId) ? "Ocultar detalles" : "Mostrar detalles"}
                                </button>
                            </div>

                            {showing.includes(cc.category.id) &&
                                <div className="flex flex-col gap-1">
                                    {selectedItems.filter((si) => si.categoryId === cc.categoryId)
                                        .sort((a, b) => a.productName.localeCompare(b.productName))
                                        .map((si, index) => (
                                            <div key={si.productId} className="flex flex-row gap-2">
                                                <div className="flex flex-row gap-1">
                                                    <button onClick={() => changeProductQuantity(si.productId, si.categoryId, 1)} className="border p-1 cursor-pointer">+</button>
                                                    <p>[{si.quantity}]</p>
                                                    <button onClick={() => changeProductQuantity(si.productId, si.categoryId, -1)} className="border p-1 cursor-pointer">-</button>
                                                </div>
                                                <p>[{si.productName}]</p>
                                            </div>
                                        ))}
                                </div>
                            }

                        </div>
                    ))}
                </>
            }
        </>
    )
}

export default ProductSelectionSection