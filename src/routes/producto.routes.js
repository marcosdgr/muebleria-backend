import Router from 'express';
import upload from '../config/multer.js';
import {
  createProducto,
  deleteProducto,
  getAllProductos,
  getProductos,
  ManejarEstadoProducto,
  updateProducto,
  searchProductos
} from '../controllers/productos.controller.js';
import { validateImage } from '../middlewares/validate.image.js';
import validate from '../middlewares/validate.middleware.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { createProductoSchema, updateProductoSchema } from '../validators/producto.validator.js';

const router = Router();

// Rutas públicas (GET)
router.get('/all', getAllProductos)
router.get('/', getProductos);
router.get('/search', searchProductos);

// Rutas protegidas (POST, PUT, DELETE) - requieren autenticación
router.post(
  '/',
  verifyToken,
  upload.array('imagenProducto'),
  validateImage,
  validate(createProductoSchema),
  createProducto
);
router.put('/estado/:id', verifyToken, ManejarEstadoProducto);
router.put(
  '/:id',
  verifyToken,
  upload.array('imagenProducto'),
  validate(updateProductoSchema),
  updateProducto
);
router.delete('/:id', verifyToken, deleteProducto);

export default router;
