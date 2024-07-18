import {Router} from 'express'
import { validacionAdministrador } from '../middlewares/validacionAdministradores.js';

const router = Router()

import {
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
    nuevoPassword,
} from "../controllers/administradores_controller.js";

router.post("/login", login);
router.post("/registro",validacionAdministrador,registro);
router.get("/confirmar/:token", confirmEmail);
router.get("/Administradores", listarAdministradores);
router.get("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPasword);
router.post("/nuevo-password/:token", nuevoPassword);

router.get('/perfil',perfil)
router.put('/veterinario/actualizarpassword',actualizarPassword)
router.get('/veterinario/:id',detalleAdministradores)
router.put('/veterinario/:id',actualizarPerfil)

export default router