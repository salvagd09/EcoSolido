import { useState } from "react"

export default function RestablecerContra() {
    const [telOCel,setTelOCel]=useState("")
    return(<>
    <h1>Área de restablecer contraseña</h1>
    <form>
        <label>Ingresa tu teléfono o celular</label>
        <input type="text" value={telOCel} onChange={(e)=>setTelOCel(e.target.value)}/>
    </form></>)
}