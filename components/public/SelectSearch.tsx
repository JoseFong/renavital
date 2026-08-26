"use client"

import { useEffect, useRef, useState } from "react"

type Option = {
    id: number
    name: string
}

type SelectSearchProps = {
    options: Option[]
    selected: any
    onChange: any
    placeholder?: string
}

function SelectSearch({
    options,
    selected,
    onChange,
    placeholder = "Seleccionar..."
}: SelectSearchProps) {

    const [focused, setFocused] = useState(false)
    const [search, setSearch] = useState("")

    const selectorRef = useRef<HTMLDivElement>(null)

    /*
        Detectar cuando hacemos click fuera
        del componente.
    */
    useEffect(() => {

        function handleClickOutside(e: MouseEvent) {

            if (
                selectorRef.current &&
                !selectorRef.current.contains(e.target as Node)
            ) {
                setFocused(false)
                setSearch("")
            }

        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }

    }, [])


    /*
        Buscar el producto que actualmente
        está seleccionado.
    */
    const selectedOption = options.find(
        (o: Option) => o.id === selected
    )


    /*
        Filtrar las opciones según lo que
        escribió el usuario.
    */
    const results = options.filter(
        (o: Option) =>
            o.name
                .toUpperCase()
                .includes(search.trim().toUpperCase())
    )


    /*
        Cuando el usuario selecciona una opción.
    */
    function selectOption(id: number) {

        onChange(id)

        setFocused(false)

        setSearch("")
    }


    return (
        <div
            ref={selectorRef}
            className="relative w-80"
        >

            {/* SELECT PRINCIPAL */}

            <div
                onClick={() => setFocused(!focused)}
                className="border rounded-md p-2 bg-white cursor-pointer"
            >

                {selectedOption
                    ? selectedOption.name
                    : placeholder
                }

            </div>


            {/* DROPDOWN */}

            {focused && (

                <div
                    className="
                        absolute
                        z-50
                        mt-1
                        w-full
                        bg-white
                        border
                        rounded-md
                        shadow-lg
                    "
                >

                    {/* BUSCADOR */}

                    <input
                        autoFocus
                        type="text"
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
                            w-full
                            p-2
                            border-b
                            outline-none
                        "
                    />


                    {/* RESULTADOS */}

                    <div className="max-h-60 overflow-y-auto">

                        {results.length === 0 ? (

                            <div className="p-2 text-zinc-500">
                                No se encontraron resultados
                            </div>

                        ) : (

                            results.map((o: Option) => (

                                <div
                                    key={o.id}
                                    onClick={() => selectOption(o.id)}
                                    className="
                                        px-2
                                        py-2
                                        cursor-pointer
                                        hover:bg-zinc-200
                                    "
                                >
                                    {o.name}
                                </div>

                            ))

                        )}

                    </div>

                </div>

            )}

        </div>
    )
}

export default SelectSearch