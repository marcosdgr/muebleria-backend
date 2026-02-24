import Router from 'express';
import upload from '../config/multer.js';
import {
  createProducto,
  deleteProducto,
  getAllProductos,
  getProductos,
  ManejarEstadoProducto,
  updateProducto,
} from '../controllers/productos.controller.js';
import { validateImage } from '../middlewares/validate.image.js';
import validate from '../middlewares/validate.middleware.js';
import { createProductoSchema, updateProductoSchema } from '../validators/producto.validator.js';

const router = Router();

router.get('/all', getAllProductos)
router.get('/', getProductos);

router.post(
  '/',
  upload.single('imagenProducto'),
  validateImage,
  validate(createProductoSchema),
  createProducto
);
router.put('/estado/:id', ManejarEstadoProducto);
router.put(
  '/:id',
  upload.single('imagenProducto'),
  validate(updateProductoSchema),
  updateProducto
);
router.delete('/:id', deleteProducto);

export default router;
