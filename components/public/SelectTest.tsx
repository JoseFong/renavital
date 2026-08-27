"use client"

import { useEffect, useRef, useState } from "react"

function SelectTest({ options, selected, setSelected }: { options: any, selected: any, setSelected: any }) {
    const [show, setShow] = useState(false)
    const [search,setSearch] = useState("")
    const [results,setResults] = useState<any[]>([])

    const ref = useRef<any>(null)

    useEffect(()=>{
        function handleClick(e:MouseEvent){
            if(ref.current && !ref.current.contains(e.target)){
                setShow(false)
            }
        }

        document.addEventListener("mousedown",handleClick)

        return()=>{
            document.removeEventListener("mousedown",handleClick)
        }
    },[])

    useEffect(()=>{
        if(options)
            setResults(options)
    },[options])

    useEffect(()=>{
        const searchTerm = search.trim().toUpperCase()
        if(searchTerm===""){
            setResults(options)
        }else{
            let aux = [...options]

            aux = aux.filter((a:any)=>a.name.includes(searchTerm))

            setResults(aux)
        }
    },[search])

    return (
        <div ref={ref}>
            <div onClick={() => setShow(!show)} className='relative bg-white p-2 shadow-sm rounded-md cursor-pointer'>
                {options.find((o:any)=>o.id===Number(selected))?.name ?? "Seleccionar categoría"}
            </div>
            {show &&
                <div className="bg-white shadow-sm rounded-md absolute mt-1 overflow-y-scroll max-h-80 w-80">
                    <input
                        autoFocus
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                        className="outline-none border-b w-full p-2 bg-zinc-100"
                        placeholder="Buscar"
                    />
                    {results.map((o:any)=>(
                        <div
                            className="px-2 py-1 hover:bg-zinc-200 cursor-pointer"
                            key={o.id}
                            onClick={()=>{
                                setSelected(o.id)
                                setShow(false)
                                setSearch("")
                            }}
                        >
                            {o.name}
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default SelectTest