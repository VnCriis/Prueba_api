import jwt from 'jsonwebtoken'
import Administradores from '../models/Administradores.js'
import Veterinario from '../models/veterinario.js'
import Paciente from '../models/Paciente.js'

const verificarAutenticacion = async (req,res,next)=>{

if(!req.headers.authorization) return res.status(404).json({msg:"Lo sentimos, debes proprocionar un token"})    
    const {authorization} = req.headers
    try {
        const {id,rol} = jwt.verify(authorization.split(' ')[1],process.env.JWT_SECRET)
        if (rol==="veterinario"){
            req.veterinarioBDD = await Administradores.findById(id).lean().select("-password")
            next()
        } else {
            req.pacienteBDD = await Paciente.findById(id).lean().select("-password")
            next()
        }
    } catch (error) {
        const e = new Error("Formato del token no válido")
        return res.status(404).json({msg:e.message})
    }
}

export default verificarAutenticacion