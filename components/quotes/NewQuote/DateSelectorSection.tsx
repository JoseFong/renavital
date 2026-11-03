import { useState } from "react"
import { Fragment } from "react/jsx-runtime"

function DateSelectorSection({
    date,
    setDate,
    time,
    setTime
}:{
    date:string,
    setDate:any,
    time:string,
    setTime:any
}) {

    return (
        <Fragment>
            <h1 className="font-bold">Fecha estimada del procedimiento</h1>
            <input placeholder="Fecha" type="date" value={date} onChange={(e)=>setDate(e.target.value)}/>
            <h1 className="font-bold">Hora estimada del procedimiento</h1>
            <input placeholder="Hora" type="time" value={time} onChange={(e)=>setTime(e.target.value)}/>
        </Fragment>
    )
}

export default DateSelectorSection