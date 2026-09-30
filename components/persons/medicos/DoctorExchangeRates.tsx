"use client"
import { DoctorInfo, ExchangeRateInfo } from "@/lib/types"
import { useState } from "react"
import { Fragment } from "react/jsx-runtime"
import CreateExchangeRate from "./CreateExchangeRate"
import UpdateExchangeRate from "./UpdateExchangeRate"
import DeleteExchangeRate from "./DeleteExchangeRate"

function DoctorExchangeRates({ doctor, exchangeRates, reload }: { doctor: any, exchangeRates: ExchangeRateInfo[], reload: any }) {

  const [selectedExchangeRate, setSelectedExchangeRate] = useState<ExchangeRateInfo | null>(null)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isDeleteOpen,setIsDeleteOpen] = useState(false)

  return (
    <Fragment>
      {exchangeRates.length === 0 ? <div>No hay tipos de cambio especificos</div> :
        <table>
          <thead>
            <tr>
              <th className="border p-1">Procedimiento</th>
              <th className="border p-1">Tipo de cambio</th>
              <th className="border p-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {exchangeRates.map((eri) => (
              <tr key={eri.id}>
                <td className="border p-1">{eri.configuration.procedure.shortForm}{" - "}{eri.configuration.anesthesia.shortForm}{" - "}{eri.configuration.stay.shortForm}</td>
                <td className="border p-1">{eri.exchangeRate}</td>
                <td className="border p-1">
                  <button onClick={()=>{setSelectedExchangeRate(eri); setIsUpdateOpen(true)}} className="underline cursor-pointer">Editar</button>{" "}
                  <button onClick={()=>{setSelectedExchangeRate(eri); setIsDeleteOpen(true)}} className="underline cursor-pointer">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
      {selectedExchangeRate && <>
        <UpdateExchangeRate open={isUpdateOpen} setOpen={setIsUpdateOpen} doctor={doctor} exchangeRate={selectedExchangeRate as ExchangeRateInfo} reload={reload} />
        <DeleteExchangeRate open={isDeleteOpen} setOpen={setIsDeleteOpen} exchangeRate={selectedExchangeRate} reload={reload} doctor={doctor}/>
      </>}
    </Fragment>
  )
}

export default DoctorExchangeRates