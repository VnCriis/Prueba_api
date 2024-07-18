import {check,validationResult} from "express-validator";
export const validacionPacientes =[
    check(['salida'])
    .exists()
    .withMessage('El campo "fecha" es obligatorio')
    .notEmpty()
    .withMessage('El campo "fecha" no puede estar vacío')
    .isDate({ format: 'DD-MM-YYYY' })
    .withMessage('Debe ser una fecha válida en formato DD-MM-YYYY'),
    (req,res,next)=>{
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
]
