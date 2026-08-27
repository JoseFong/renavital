"use client"

import { Category, Configuration, ProductCategory } from "@/app/generated/prisma/client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import { ConfigurationCategoryInfo, ConfigurationCompleteInfo, ConfigurationInfo, ProductCategoryInfo } from "@/lib/types"
import axios from "axios"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Fragment, useEffect, useState } from "react"
import toast from "react-hot-toast"

function page() {

    const params = useParams()
    const id = params.id

    const router = useRouter()

    const [configuration, setConfiguration] = useState<ConfigurationCompleteInfo | null>(null)

    async function fetchConfiguration() {
        try {
            const response = await axios.get("/api/configurations/configurationsFullInfo/" + id)
            setConfiguration(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    useEffect(() => {
        fetchConfiguration()
    }, [])

    const total = configuration?.configurationCategories.reduce(
        (sum, cc) =>
            sum +
            cc.category.productCategories.reduce(
                (categorySum, pc) =>
                    categorySum + Number(pc.product.price) * pc.quantity,
                0
            ),
        0
    ) ?? 0

    return (
        <>
            <NavBarCatalogue selected="Configuraciones" />
            <div className="flex flex-col gap-1 p-5">
                Información de configuración {configuration?.code}
                <label className="font-bold">Código</label>
                {configuration?.code}
                <label className="font-bold">Procedimiento</label>
                {configuration?.procedure.name}
                <label className="font-bold">Anestesia</label>
                {configuration?.anesthesia.name}
                <label className="font-bold">Estancia</label>
                {configuration?.stay.name}
                <label className="font-bold">Desglose de productos y precios</label>
                <table>
                    <thead>
                        <tr>
                            <th className="border p-1">Concepto</th>
                            <th className="border p-1">Producto</th>
                            <th className="border p-1">Precio unitario</th>
                            <th className="border p-1">Cantidad</th>
                            <th className="border p-1">Costo total</th>
                        </tr>
                    </thead>

                    <tbody>
                        {configuration?.configurationCategories.map(
                            (cc: ConfigurationCategoryInfo) => {
                                const subtotal = cc.category.productCategories.reduce(
                                    (sum, pc) =>
                                        sum +
                                        Number(pc.product.price) * pc.quantity,
                                    0
                                )

                                return (
                                    <Fragment key={cc.category.id}>
                                        {cc.category.productCategories.map(
                                            (pc: ProductCategoryInfo, index) => (
                                                <tr key={pc.id}>
                                                    {index === 0 && (
                                                        <td
                                                            className="border p-1"
                                                            rowSpan={
                                                                cc.category.productCategories.length + 1
                                                            }
                                                        >
                                                            {cc.category.name}
                                                        </td>
                                                    )}

                                                    <td className="border p-1">
                                                        {pc.product.name}
                                                    </td>

                                                    <td className="border p-1">
                                                        ${Number(pc.product.price).toFixed(2)}
                                                    </td>

                                                    <td className="border p-1">
                                                        {pc.quantity}
                                                    </td>

                                                    <td className="border p-1">
                                                        {(
                                                            Number(pc.product.price) *
                                                            pc.quantity
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                            )
                                        )}

                                        <tr>
                                            <td
                                                className="border p-1 font-bold"
                                                colSpan={2}
                                            >
                                                Subtotal
                                            </td>

                                            <td className="border p-1 font-bold">
                                                ${subtotal.toFixed(2)} USD
                                            </td>

                                            <td className="border p-1 font-bold">
                                                ${(subtotal * 25).toFixed(2)} MXN
                                            </td>
                                        </tr>
                                    </Fragment>
                                )
                            }
                        )}

                        <tr>
                            <td
                                className="border p-1 font-bold"
                                colSpan={3}
                            >
                                TOTAL
                            </td>

                            <td className="border p-1 font-bold">
                                ${total.toFixed(2)} USD
                            </td>

                            <td className="border p-1 font-bold">
                                ${(total * 25).toFixed(2)} MXN
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={() => router.push("/admin/catalogo/configuraciones")} className="underline cursor-pointer">Regresar</button>
            </div>
        </>
    )
}

export default page