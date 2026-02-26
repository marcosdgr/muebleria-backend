import Router from 'express';
import { traerOfertas, crearOferta , actualizarOferta , cambiarEstadoOferta , eliminarOferta} from '../controllers/ofertas.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { createOfertaSchema } from '../validators/ofertas.validator.js';

const router = Router();

// Rutas públicas (GET)
router.get('/', traerOfertas);

// Rutas protegidas (POST, PUT, DELETE) - requieren autenticación
router.post('/crear', verifyToken, validate(createOfertaSchema), crearOferta);
router.put('/:id', verifyToken, actualizarOferta);
router.put('/estado/:id', verifyToken, cambiarEstadoOferta);
router.delete('/:id', verifyToken, eliminarOferta);

export default router;