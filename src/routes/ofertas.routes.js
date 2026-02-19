import Router from 'express';
import { traerOfertas, crearOferta , actualizarOferta , cambiarEstadoOferta , eliminarOferta} from '../controllers/ofertas.controller.js';

const router = Router();

router.get('/', traerOfertas);
router.post('/crear', crearOferta);
router.put('/:id', actualizarOferta);
router.put('/estado/:id', cambiarEstadoOferta);
router.delete('/:id', eliminarOferta);

export default router;