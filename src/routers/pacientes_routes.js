import {Router} from "express";
import {
    actualizarPacientes,
    detallePacientes,
    eliminarPacientes,
    listarPacientess,
    registrarPacientes,
    loginPacientes,
    perfilPacientes
} from "../controllers/pacientes_controller.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";
import {validacionPacientes} from "../middlewares/validacionPacientes.js";

const router = Router()

// router.post('/paciente/login',(req,res)=>res.send("Login del paciente"))
// router.get('/paciente/perfil',(req,res)=>res.send("Perfil del paciente"))
// router.get('/pacientes',(req,res)=>res.send("Listar pacientes"))
// router.get('/paciente/:id',(req,res)=>res.send("Detalle del paciente"))
// router.post('/paciente/registro',(req,res)=>res.send("Registrar paciente"))
// router.put('/paciente/actualizar/:id',(req,res)=>res.send("Actualizar paciente"))
// router.delete('/pacientes/eliminar/:id',(req,res)=>res.send("Eliminar paciente"))

router.post('/pacientes/login',loginPacientes)
router.get('/pacientes/perfil',verificarAutenticacion,perfilPacientes)
router.get("/pacientes",verificarAutenticacion,listarPacientess);
router.get("/pacientes/:id",verificarAutenticacion, detallePacientes);
router.post("/pacientes/registro", verificarAutenticacion,registrarPacientes);
router.put("/pacientes/actualizar/:id", verificarAutenticacion,actualizarPacientes);
router.delete("/pacientes/eliminar/:id", verificarAutenticacion,validacionPacientes,eliminarPacientes);

export default router