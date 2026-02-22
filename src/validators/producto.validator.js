import Joi from "joi";

export const createProductoSchema = Joi.object({
  titulo: Joi.string().trim().min(3).max(150).required().messages({
    "string.empty": "El título es obligatorio",
    "string.min": "El título debe tener al menos 3 caracteres",
    "any.required": "El título es obligatorio",
  }),

  categoria: Joi.string()
    .valid("Cocina", "Living", "Dormitorio", "Jardin", "Varios")
    .required()
    .messages({
      "any.only": "Categoría inválida",
      "any.required": "La categoría es obligatoria",
    }),

  precioActual: Joi.number().positive().precision(2).required().messages({
    "number.base": "El precio actual debe ser un número",
    "number.positive": "El precio debe ser mayor a 0",
    "any.required": "El precio actual es obligatorio",
  }),

  precioAnterior: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .allow(null)
    .messages({
      "number.base": "El precio anterior debe ser un número",
      "number.positive": "El precio anterior debe ser mayor a 0",
    }),
});

export const updateProductoSchema = Joi.object({
  titulo: Joi.string().trim().min(3).max(150).messages({
    "string.empty": "El título no puede estar vacío",
    "string.min": "El título debe tener al menos 3 caracteres",
  }),
  categoria: Joi.string()
    .valid("Cocina", "Living", "Dormitorio", "Jardin", "Varios")
    .messages({
      "any.only": "Categoría inválida",
    }),

  precioActual: Joi.number().positive().precision(2).messages({
    "number.base": "El precio actual debe ser un número",
    "number.positive": "El precio debe ser mayor a 0",
  }),
  precioAnterior: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .allow(null)
    .messages({
      "number.base": "El precio anterior debe ser un número",
      "number.positive": "El precio anterior debe ser mayor a 0",
    }),
})

  //// Este bloque se puede usar para validar la lógica entre precioActual y precioAnterior, pero lo dejo comentado por el momento
  //   .custom((value, helpers) => {
  //     // Si mandan precioAnterior pero no precioActual
  //     if (value.precioAnterior && !value.precioActual) {
  //       return helpers.message(
  //         "Si hay precio anterior, debes enviar precio actual",
  //       );
  //     }

  //     // Si hay ambos, validar lógica
  //     if (
  //       value.precioAnterior &&
  //       value.precioActual &&
  //       value.precioAnterior <= value.precioActual
  //     ) {
  //       return helpers.message(
  //         "El precio anterior debe ser mayor que el precio actual",
  //       );
  //     }

  //     return value;
  //   })
  .min(1)
  .messages({
    "object.min": "Al menos un campo debe ser actualizado",
  });
