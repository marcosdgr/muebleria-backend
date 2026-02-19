import Router from 'express';
import {
  createProducto,
  deleteProducto,
  getAllProductos,
  updateProducto,
  ManejarEstadoProducto,
} from '../controllers/producto.controller.js';

const router = Router();

router.get('/', getAllProductos);
router.post('/', createProducto);
router.put('/estado/:id', ManejarEstadoProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);
