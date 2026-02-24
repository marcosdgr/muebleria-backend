import Joi from 'joi';

export const createProductoSchema = Joi.object({
  titulo: Joi.string().trim().min(3).max(150).required().messages({
    'string.empty': 'El título es obligatorio',
    'string.min': 'El título debe tener al menos 3 caracteres',
    'any.required': 'El título es obligatorio',
  }),

  categoria: Joi.string()
    .valid('Cocina', 'Living', 'Dormitorio', 'Jardin', 'Varios')
    .required()
    .messages({
      'any.only': 'Categoría inválida',
      'any.required': 'La categoría es obligatoria',
    }),

  precioLista: Joi.number().positive().precision(2).required().messages({
    'number.base': 'El precio de lista debe ser un número',
    'number.positive': 'El precio debe ser mayor a 0',
    'any.required': 'El precio de lista es obligatorio',
  }),

  precioOferta: Joi.number().positive().precision(2).optional().allow(null),

  porcentajeDescuento: Joi.number().min(0).max(100).optional().allow(null).messages({
    'number.base': 'El porcentaje debe ser un número',
    'number.min': 'Debe ser mayor o igual a 0',
    'number.max': 'Debe ser menor o igual a 100',
  }),

  descripcion: Joi.string().max(500).optional().allow(''),

  productoActivo: Joi.boolean().required(),
});

export const updateProductoSchema = Joi.object({
  titulo: Joi.string().trim().min(3).max(150).messages({
    'string.empty': 'El título no puede estar vacío',
    'string.min': 'El título debe tener al menos 3 caracteres',
  }),
  categoria: Joi.string().valid('Cocina', 'Living', 'Dormitorio', 'Jardin', 'Varios').messages({
    'any.only': 'Categoría inválida',
  }),

  precioLista: Joi.number().positive().precision(2).messages({
    'number.base': 'El precio de lista debe ser un número',
    'number.positive': 'El precio debe ser mayor a 0',
  }),
  precioOferta: Joi.number().positive().precision(2).messages({
    'number.base': 'El precio de oferta debe ser un número',
    'number.positive': 'El precio debe ser mayor a 0',
  }),
  porcentajeDescuento: Joi.number().min(0).max(100).messages({
    'number.base': 'El porcentaje debe ser un número',
    'number.min': 'Debe ser mayor o igual a 0',
    'number.max': 'Debe ser menor o igual a 100',
  }),
  descripcion: Joi.string().max(500).messages({
    'string.max': 'Máximo 500 caracteres',
  }),
  productoActivo: Joi.boolean(),
})
  .min(1)
  .messages({
    'object.min': 'Al menos un campo debe ser actualizado',
  });
