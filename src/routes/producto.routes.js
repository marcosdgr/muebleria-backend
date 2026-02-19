import Router from 'express';
import {
  createProducto,
  deleteProducto,
  getProductos,
  updateProducto,
  ManejarEstadoProducto,
} from '../controllers/productos.controller.js';

const router = Router();

router.get('/', getProductos);
router.post('/', createProducto);
router.put('/estado/:id', ManejarEstadoProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);


export default router;
