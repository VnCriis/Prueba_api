import routerAdministrador from './routers/administradores_routes.js'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

//Inicializacion 
const app= express()
dotenv.config()

//Configuracion 

app.set('port', process.env.port||3000)
app.use(cors())

//Middlewares

app.use(express.json())

//Variables globales 

//Rutas 
app.get('/', (req, res)=>{
    res.send("Server On")
})
app.use('/api', routerAdministrador)

//Exportar la instancia de express
export default app

//Rutas 

//Ruta no encontrada
app.use((req, res)=>res.status(404).send("Endpoint no encontrado - 404"))
