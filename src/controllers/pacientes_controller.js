import Pacientes from "../models/Pacientes.js";
import {sendMailToPaciente} from "../config/nodemailer.js"
import mongoose from "mongoose";
import generarJWT from "../helpers/crearJWT.js";


const loginPacientes = async(req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const pacientesBDD = await Paciente.findOne({email})
    if(!pacientesBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const verificarPassword = await pacientesBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    const token = generarJWT(pacientesBDD._id,"paciente")
		const {nombre,propietario,email:emailP,celular,convencional,_id} = pacientesBDD
    res.status(200).json({
        token,
        nombre,
        propietario,
        emailP,
        celular,
        convencional,
        _id
    })
}   
const perfilPacientes =(req,res)=>{
    console.log(req.pacientesBdd);
    res.status(200).json(req.pacientesBDD)
}
const listarPacientes = async (req,res)=>{
    const pacientes = await Paciente.find({estado:true}).where('administrador').equals(req.administradorBDD).select("-salida -createdAt -updatedAt -__v").populate('administrador','_id nombre apellido')
    res.status(200).json(pacientes)
}
const detallePacientes = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el administrador ${id}`});
    const pacientes = await Pacientes.findById(id).select("-createdAt -updatedAt -__v").populate('administrador','_id nombre apellido')
    
    res.status(200).json({
        pacientes,
        tratamientos
    })
}
const registrarPacientes = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await Pacientes.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    const nuevoPaciente = new Pacientes(req.body)
    const password = Math.random().toString(36).slice(2)
    nuevoPaciente.password = await nuevoPaciente.encrypPassword("adm"+password)
    await sendMailToPaciente(email,"adm"+password)
    nuevoPaciente.adminsitrador=req.administradorBDD._id
    await nuevoPaciente.save()
    res.status(200).json({msg:"Registro exitoso del paciente y correo enviado"})
}
const actualizarPacientes = async(req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`});
    await Pacientes.findByIdAndUpdate(req.params.id,req.body)
    res.status(200).json({msg:"Actualización exitosa del paciente"})
}

const eliminarPacientes = async (req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    const {salida} = req.body
    await Pacientes.findByIdAndUpdate(req.params.id,{salida:Date.parse(salida),estado:false})
    res.status(200).json({msg:"Fecha de salida del paciente registrado exitosamente"})
}   

export {
		loginPacientes,
		perfilPacientes,
    listarPacientes,
    detallePacientes,
    registrarPacientes,
    actualizarPacientes,
    eliminarPacientes
}