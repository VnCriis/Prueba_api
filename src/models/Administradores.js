import {Schema, model} from 'mongoose'
import bcrypt from "bcryptjs"

const AdministradoresSchema = new Schema({
    nombre: {
        type: String,
        require: true, 
        trim: true
    },
    apellido: {
        type: String, 
        require: true, 
        trim: true   
    },
    direccion: {
        type: String, 
        trim: true,
        default: null
    },
    telefono: {
        type: Number, 
        trim: true,
        default: null
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String, 
        require: true
    },
    status: {
        type: Boolean,
        default: true
    },
    token: {
        type: String, 
        default: null
    },
    confirmEmail:{
        type: Boolean,
        default: false
    }
},{timestamps:true})

//Metodo de cifrado de las contraseñas de los veterinarios 

AdministradoresSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}

//Metodo para verificar si el password ingresado es el mismo de la bdd

AdministradoresSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password, this.password)
    return response
}

//Metodo para crear un token 

AdministradoresSchema.methods.crearToken = function(){
    const TokenGenerado = this.token = Math.random().toString(36).slice(2)
    return TokenGenerado
}

export default model('Administradores', AdministradoresSchema)
