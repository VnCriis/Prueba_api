import Administradores from "../models/Administradores.js";
import {sendMailToUser, sendMailToRecoveryPassword} from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";


async function login(req, res) {
    const { email, password } = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })
    const AdministradorBDD = await Administradores.findOne({ email }).select("-status -__v -token -updatedAt -createdAt")
    if (AdministradorBDD?.confirmEmail === false) return res.status(403).json({ msg: "Lo sentimos, debe verificar su cuenta" })
    if (!AdministradorBDD) return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" })
    const verificarPassword = await AdministradorBDD.matchPassword(password)
    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, el password no es el correcto" })    
    const token = generarJWT(AdministradorBDD._id,"Administrador")
    const {nombre,apellido,direccion,telefono,_id} = AdministradorBDD
    res.status(200).json({
        token,
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
        email: AdministradorBDD.email
    })
}
const perfil =(req,res)=>{
    delete req.AdministradorBDD.token
    delete req.AdministradorBDD.confirmEmail
    delete req.AdministradorBDD.createdAt
    delete req.AdministradorBDD.updatedAt
    delete req.AdministradorBDD.__v
    res.status(200).json(req.AdministradorBDD)
}
const registro = async (req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await Administradores.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    const nuevoAdministrador = new Administradores(req.body)
    nuevoAdministrador.password = await nuevoAdministrador.encrypPassword(password)

    const token = nuevoAdministrador.crearToken()
    sendMailToUser(email,token)
    await nuevoAdministrador.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}
const confirmEmail = async (req,res)=>{
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const AdministradorBDD = await Administradores.findOne({token:req.params.token})
    if(!AdministradorBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    AdministradorBDD.token = null
    AdministradorBDD.confirmEmail=true
    await AdministradorBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
}
const listarAdministradores = (req,res)=>{
    res.status(200).json({res:'lista de veterinarios registrados'})
}
const detalleAdministradores = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    const AdministradorBDD = await Administradores.findById(id).select("-password")
    if(!AdministradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    res.status(200).json({msg:AdministradorBDD})
}
const actualizarPerfil = async (req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const AdministradorBDD = await Administradores.findById(id)
    if(!AdministradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    if (AdministradorBDD.email !=  req.body.email)
    {
        const AdministradorBDDMail = await Administradores.findOne({email:req.body.email})
        if (AdministradorBDDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el existe ya se encuentra registrado`})  
        }
    }
		AdministradorBDD.nombre = req.body.nombre || AdministradorBDD?.nombre
    AdministradorBDD.apellido = req.body.apellido  || AdministradorBDD?.apellido
    AdministradorBDD.direccion = req.body.direccion ||  AdministradorBDD?.direccion
    AdministradorBDD.telefono = req.body.telefono || AdministradorBDD?.telefono
    AdministradorBDD.email = req.body.email || AdministradorBDD?.email
    await AdministradorBDD.save()
    res.status(200).json({msg:"Perfil actualizado correctamente"})
}
const actualizarPassword = async (req,res)=>{
    const AdministradorBDD = await Administradores.findById(req.AdministradorBDD._id)
    if(!AdministradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    const verificarPassword = await AdministradorBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
    AdministradorBDD.password = await AdministradorBDD.encrypPassword(req.body.passwordnuevo)
    await AdministradorBDD.save()
    res.status(200).json({msg:"Password actualizado correctamente"})
}
const recuperarPassword = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const AdministradorBDD = await Administradores.findOne({email})
    if(!AdministradorBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const token = await AdministradorBDD.crearToken()
    AdministradorBDD.token=token
    await sendMailToRecoveryPassword(email,token)
    await AdministradorBDD.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}


const comprobarTokenPasword = async (req,res)=>{
    if(!(req.params.token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const AdministradorBDD = await Administradores.findOne({token:req.params.token})
    if(AdministradorBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    await AdministradorBDD.save()
  
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}


const nuevoPassword = async (req,res)=>{
    const{password,confirmpassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})
    const AdministradorBDD = await veterinario.findOne({token:req.params.token})
    if(AdministradorBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    AdministradorBDD.token = null
    AdministradorBDD.password = await AdministradorBDD.encrypPassword(password)
    await AdministradorBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 
}
export {
    login,
    perfil,
    registro,
    confirmEmail,
    listarAdministradores,
    detalleAdministradores,
    actualizarPerfil,
    actualizarPassword,
	recuperarPassword,
    comprobarTokenPasword,
	nuevoPassword
}