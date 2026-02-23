import Router from 'express';
import {
  createProducto,
  deleteProducto,
  getProductos,
  updateProducto,
  ManejarEstadoProducto,
} from '../controllers/productos.controller.js';
import upload from '../config/multer.js';
import validate from '../middlewares/validate.middleware.js';
import { createProductoSchema } from '../validators/producto.validator.js';

const router = Router();

router.get('/', getProductos);
router.post('/', upload.single('imagenProducto'), validate(createProductoSchema), createProducto);
router.put('/estado/:id', ManejarEstadoProducto);
router.put('/:id', upload.single('imagenProducto'), updateProducto);
router.delete('/:id', deleteProducto);


export default router;
