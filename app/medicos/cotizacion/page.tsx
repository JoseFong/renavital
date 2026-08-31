"use client"

import {
  Anesthesia,
  Configuration,
  Procedure,
  Stay
} from "@/app/generated/prisma/client"

import NavBarMedicos from "@/components/medicos/NavBarMedicos"
import Loading from "@/components/public/Loading"
import {
  ConfigurationCategoryInfo,
  ConfigurationCompleteInfo,
  ProductCategoryInfo
} from "@/lib/types"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {

  const loaded = useRef(false)

  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [anesthesias, setAnesthesias] = useState<Anesthesia[]>([])
  const [stays, setStays] = useState<Stay[]>([])
  const [configurations, setConfigurations] = useState<Configuration[]>([])

  const [configuration, setConfiguration] =
    useState<ConfigurationCompleteInfo | null>(null)

  const [selectedProcedure, setSelectedProcedure] = useState("-1")
  const [selectedAnesthesia, setSelectedAnesthesia] = useState("-1")
  const [selectedStay, setSelectedStay] = useState("-1")

  const [isLoadingOpen, setIsLoadingOpen] = useState(false)

  ////////////
  // OBTENCION DE INFORMACION
  ////////////

  async function fetchProcedures() {
    try {
      const response = await axios.get("/api/procedures")
      setProcedures(response.data)
    } catch (e: any) {
      toast.error(
        e.response?.data?.message ?? e.message
      )
    }
  }

  async function fetchAnesthesias() {
    try {
      const response = await axios.get("/api/anesthesias")
      setAnesthesias(response.data)
    } catch (e: any) {
      toast.error(
        e.response?.data?.message ?? e.message
      )
    }
  }

  async function fetchStays() {
    try {
      const response = await axios.get("/api/stays")
      setStays(response.data)
    } catch (e: any) {
      toast.error(
        e.response?.data?.message ?? e.message
      )
    }
  }

  async function fetchConfigurations() {
    try {
      const response = await axios.get("/api/configurations")
      setConfigurations(response.data)
    } catch (e: any) {
      toast.error(
        e.response?.data?.message ?? e.message
      )
    }
  }

  /////////////
  // INFORMACION INICIAL
  /////////////

  useEffect(() => {
    if (loaded.current) return

    fetchProcedures()
    fetchAnesthesias()
    fetchStays()
    fetchConfigurations()

    loaded.current = true
  }, [])

  //////////
  // TOGGLE DE OPCIONES
  //////////

  function toggle(type: string, id: number) {

    if (type === "procedure") {

      if (Number(selectedProcedure) === id) {
        setSelectedProcedure("-1")
      } else {
        setSelectedProcedure(id.toString())
      }

    }

    if (type === "anesthesia") {

      if (Number(selectedAnesthesia) === id) {
        setSelectedAnesthesia("-1")
      } else {
        setSelectedAnesthesia(id.toString())
      }

    }

    if (type === "stay") {

      if (Number(selectedStay) === id) {
        setSelectedStay("-1")
      } else {
        setSelectedStay(id.toString())
      }

    }

  }

  /////////////
  // RESETEAR OPCIONES DEPENDIENTES
  /////////////

  useEffect(() => {

    if (selectedProcedure === "-1") {
      setSelectedAnesthesia("-1")
      setSelectedStay("-1")
    }

  }, [selectedProcedure])

  useEffect(() => {

    if (selectedAnesthesia === "-1") {
      setSelectedStay("-1")
    }

  }, [selectedAnesthesia])

  /////////////
  // FILTRAR CONFIGURACIONES
  /////////////

  let filteredConfigurations = [...configurations]

  if (selectedProcedure !== "-1") {

    filteredConfigurations =
      filteredConfigurations.filter(
        c =>
          c.procedureId === Number(selectedProcedure)
      )

  }

  if (selectedAnesthesia !== "-1") {

    filteredConfigurations =
      filteredConfigurations.filter(
        c =>
          c.anesthesiaId === Number(selectedAnesthesia)
      )

  }

  if (selectedStay !== "-1") {

    filteredConfigurations =
      filteredConfigurations.filter(
        c =>
          c.stayId === Number(selectedStay)
      )

  }

  /////////////
  // FILTRAR ANESTESIAS
  /////////////

  let configurationsForAnesthesia =
    [...configurations]

  if (selectedProcedure !== "-1") {

    configurationsForAnesthesia =
      configurationsForAnesthesia.filter(
        c =>
          c.procedureId === Number(selectedProcedure)
      )

  }

  const filteredAnesthesias =
    anesthesias.filter(
      a =>
        configurationsForAnesthesia.some(
          c =>
            c.anesthesiaId === a.id
        )
    )

  /////////////
  // FILTRAR ESTANCIAS
  /////////////

  let configurationsForStay =
    [...configurations]

  if (selectedProcedure !== "-1") {

    configurationsForStay =
      configurationsForStay.filter(
        c =>
          c.procedureId === Number(selectedProcedure)
      )

  }

  if (selectedAnesthesia !== "-1") {

    configurationsForStay =
      configurationsForStay.filter(
        c =>
          c.anesthesiaId === Number(selectedAnesthesia)
      )

  }

  const filteredStays =
    stays.filter(
      s =>
        configurationsForStay.some(
          c =>
            c.stayId === s.id
        )
    )

  /////////////
  // OBTENER CONFIGURACION COMPLETA
  /////////////

  useEffect(() => {

    if (
      selectedProcedure === "-1" ||
      selectedAnesthesia === "-1" ||
      selectedStay === "-1"
    ) {

      setConfiguration(null)
      return

    }

    if (filteredConfigurations.length !== 1) {

      setConfiguration(null)
      return

    }

    fetchConfiguration(
      filteredConfigurations[0].id
    )

  }, [
    selectedProcedure,
    selectedAnesthesia,
    selectedStay
  ])

  async function fetchConfiguration(id: number) {

    try {

      setIsLoadingOpen(true)

      const response =
        await axios.get(
          "/api/configurations/configurationsFullInfo/" + id
        )

      setConfiguration(response.data)

      setIsLoadingOpen(false)

    } catch (e: any) {

      setIsLoadingOpen(false)

      toast.error(
        e.response?.data?.message ?? e.message
      )

    }

  }

  /////////////
  // PRODUCTOS DE LA COTIZACION
  /////////////

  const [selectedProducts, setSelectedProducts] =
    useState<
      {
        id: number
        categoryId: number
        quantity: number
      }[]
    >([])

  /////////////
  // INICIALIZAR PRODUCTOS
  /////////////

  useEffect(() => {

    if (!configuration) return

    let aux: {
      id: number
      categoryId: number
      quantity: number
    }[] = []

    configuration.configurationCategories.map(
      (cc: ConfigurationCategoryInfo) => {

        cc.category.productCategories.map(
          (pc: ProductCategoryInfo) => {

            aux.push({
              id: pc.productId,
              categoryId: cc.category.id,
              quantity: pc.quantity
            })

          }
        )

      }
    )

    setSelectedProducts(aux)

  }, [configuration])

  /////////////
  // AUMENTAR PRODUCTO
  /////////////

  function increaseProduct(
    productId: number,
    categoryId: number
  ) {

    setSelectedProducts(prev =>
      prev.map(p =>
        p.id === productId &&
        p.categoryId === categoryId
          ? {
              ...p,
              quantity: p.quantity + 1
            }
          : p
      )
    )

  }

  /////////////
  // DISMINUIR PRODUCTO
  /////////////

  function decreaseProduct(
    productId: number,
    categoryId: number
  ) {

    setSelectedProducts(prev =>
      prev.map(p =>
        p.id === productId &&
        p.categoryId === categoryId &&
        p.quantity > 0
          ? {
              ...p,
              quantity: p.quantity - 1
            }
          : p
      )
    )

  }

  /////////////
  // CATEGORIAS ABIERTAS
  /////////////

  const [showing, setShowing] =
    useState<number[]>([])

  function toggleShow(id: number) {

    if (showing.includes(id)) {

      const aux =
        showing.filter(
          i =>
            i !== id
        )

      setShowing(aux)

    } else {

      const aux = [
        ...showing,
        id
      ]

      setShowing(aux)

    }

  }

  /////////////
  // TOTAL FINAL
  /////////////

  let finalTotal = 0

  if (configuration) {

    configuration.configurationCategories.map(
      (cc: ConfigurationCategoryInfo) => {

        cc.category.productCategories.map(
          (pc: ProductCategoryInfo) => {

            const quantity =
              selectedProducts.find(
                sp =>
                  sp.id === pc.productId &&
                  sp.categoryId === cc.category.id
              )?.quantity ?? 0

            finalTotal =
              finalTotal +
              (
                Number(pc.product.price) *
                quantity
              )

          }
        )

      }
    )

  }

  /////////////
  // RETURN
  /////////////

  return (
    <>
      <NavBarMedicos selected="cotizacion" />

      <div className="p-5 flex flex-col gap-1">

        <h1 className="font-bold">
          Nueva cotización
        </h1>

        {/* PROCEDIMIENTO */}

        <label className="font-bold">
          Tipo de procedimiento
        </label>

        <div className="flex flex-row gap-3">

          {procedures.map(
            (p: Procedure) => (

              <button
                key={p.id}
                onClick={() =>
                  toggle(
                    "procedure",
                    p.id
                  )
                }
                className={`
                  ${
                    Number(selectedProcedure) === p.id
                      ? "bg-green-100 border-green-300 hover:bg-green-200 hover:border-green-400"
                      : "border-zinc-200 bg-zinc-100 hover:bg-zinc-200 hover:border-zinc-300"
                  }

                  disabled:pointer-events-none
                  border-4
                  rounded-xl
                  p-5
                  cursor-pointer
                  transition-all
                `}
              >
                {p.name}
              </button>

            )
          )}

        </div>

        {/* ANESTESIA */}

        <label className="font-bold">
          Tipo de anestesia
        </label>

        <div
          className={`
            ${
              selectedProcedure === "-1"
                ? "opacity-60"
                : ""
            }

            transition-all
            flex
            flex-row
            gap-3
          `}
        >

          {filteredAnesthesias.map(
            (a: Anesthesia) => (

              <button
                key={a.id}
                disabled={
                  selectedProcedure === "-1"
                }
                onClick={() =>
                  toggle(
                    "anesthesia",
                    a.id
                  )
                }
                className={`
                  ${
                    Number(selectedAnesthesia) === a.id
                      ? "bg-green-100 border-green-300 hover:bg-green-200 hover:border-green-400"
                      : "border-zinc-200 bg-zinc-100 hover:bg-zinc-200 hover:border-zinc-300"
                  }

                  disabled:pointer-events-none
                  border-4
                  rounded-xl
                  p-5
                  cursor-pointer
                  transition-all
                `}
              >
                {a.name}
              </button>

            )
          )}

        </div>

        {/* ESTANCIA */}

        <label className="font-bold">
          Tipo de estancia
        </label>

        <div
          className={`
            ${
              selectedAnesthesia === "-1"
                ? "opacity-60"
                : ""
            }

            transition-all
            flex
            flex-row
            gap-3
          `}
        >

          {filteredStays.map(
            (s: Stay) => (

              <button
                key={s.id}
                disabled={
                  selectedAnesthesia === "-1"
                }
                onClick={() =>
                  toggle(
                    "stay",
                    s.id
                  )
                }
                className={`
                  ${
                    Number(selectedStay) === s.id
                      ? "bg-green-100 border-green-300 hover:bg-green-200 hover:border-green-400"
                      : "border-zinc-200 bg-zinc-100 hover:bg-zinc-200 hover:border-zinc-300"
                  }

                  disabled:pointer-events-none
                  border-4
                  rounded-xl
                  p-5
                  cursor-pointer
                  transition-all
                `}
              >
                {s.name}
              </button>

            )
          )}

        </div>

        {/* PRODUCTOS */}

        {configuration && (

          <div className="flex flex-col gap-1">

            {configuration.configurationCategories.map(
              (cc: ConfigurationCategoryInfo) => {

                const total =
                  cc.category.productCategories.reduce(
                    (
                      sum,
                      pc: ProductCategoryInfo
                    ) => {

                      const quantity =
                        selectedProducts.find(
                          sp =>
                            sp.id === pc.productId &&
                            sp.categoryId === cc.category.id
                        )?.quantity ?? 0

                      return (
                        sum +
                        Number(pc.product.price) *
                        quantity
                      )

                    },
                    0
                  )

                return (

                  <div
                    key={cc.id}
                    className="flex flex-col gap-1"
                  >

                    <div className="flex flex-row gap-2">

                      <h1 className="font-bold">
                        {cc.category.name}
                      </h1>

                      <button
                        onClick={() =>
                          toggleShow(
                            cc.category.id
                          )
                        }
                        className="underline cursor-pointer"
                      >
                        {
                          showing.includes(
                            cc.category.id
                          )
                            ? "Ocultar detalles"
                            : "Mostrar detalles"
                        }
                      </button>

                    </div>

                    {showing.includes(
                      cc.category.id
                    ) && (

                      <div className="grid grid-cols-5 gap-3">

                        {cc.category.productCategories.map(
                          (pc: ProductCategoryInfo) => {

                            const productQuantity =
                              selectedProducts.find(
                                sp =>
                                  sp.id === pc.productId &&
                                  sp.categoryId === cc.category.id
                              )?.quantity ?? 0

                            return (

                              <div
                                key={pc.id}
                                className={`
                                  ${
                                    productQuantity > 0
                                      ? "bg-green-100 border-green-300"
                                      : "bg-zinc-100 border-zinc-200"
                                  }

                                  border-4
                                  rounded-xl
                                  p-3
                                  transition-all
                                `}
                              >

                                <div className="flex flex-col gap-3">

                                  <div className="text-center">
                                    {pc.product.name}
                                  </div>

                                  <div className="flex items-center justify-center gap-3">

                                    <button
                                      onClick={() =>
                                        decreaseProduct(
                                          pc.productId,
                                          cc.category.id
                                        )
                                      }
                                      disabled={
                                        productQuantity === 0
                                      }
                                      className="
                                        border
                                        rounded-lg
                                        px-3
                                        py-1
                                        cursor-pointer
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                      "
                                    >
                                      -
                                    </button>

                                    <span className="min-w-8 text-center font-bold">
                                      {productQuantity}
                                    </span>

                                    <button
                                      onClick={() =>
                                        increaseProduct(
                                          pc.productId,
                                          cc.category.id
                                        )
                                      }
                                      className="
                                        border
                                        rounded-lg
                                        px-3
                                        py-1
                                        cursor-pointer
                                      "
                                    >
                                      +
                                    </button>

                                  </div>

                                </div>

                              </div>

                            )

                          }
                        )}

                      </div>

                    )}

                    Subtotal: $
                    {total.toFixed(2)}
                    USD
                    {"   /   "}
                    ${(total * 25).toFixed(2)}
                    MXN

                  </div>

                )

              }
            )}

            {/* TOTAL */}

            <p className="font-bold text-lg">
              TOTAL: $
              {finalTotal.toFixed(2)}
              USD
              {" | "}
              ${(finalTotal * 25).toFixed(2)}
              MXN
            </p>

          </div>

        )}

      </div>

      <Loading open={isLoadingOpen} />

    </>
  )
}

export default page