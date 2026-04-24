import Router from 'express';
import {
  traerOfertas,
  crearOferta,
  actualizarOferta,
  cambiarEstadoOferta,
  eliminarOferta,
} from '../controllers/ofertas.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { createOfertaSchema } from '../validators/ofertas.validator.js';

const router = Router();

router.get('/', traerOfertas);
router.post('/crear', validate(createOfertaSchema), crearOferta);
router.put('/:id', actualizarOferta);
router.put('/estado/:id', cambiarEstadoOferta);
router.delete('/:id', eliminarOferta);

export default router;
