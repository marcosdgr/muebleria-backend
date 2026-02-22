import Joi from "joi";

export const createOfertaSchema = Joi.object({
  titulo: Joi.string().trim().min(3).max(150).required().messages({
    "string.empty": "El título es obligatorio",
    "string.min": "El título debe tener al menos 3 caracteres",
    "any.required": "El título es obligatorio",
  }),
  subtitulo: Joi.string().trim().min(3).max(150).required().messages({
    "string.empty": "El subtítulo es obligatorio",
    "string.min": "El subtítulo debe tener al menos 3 caracteres",
    "any.required": "El subtítulo es obligatorio",
  }),

  descripcion: Joi.string().trim().min(10).max(500).required().messages({
    "string.empty": "La descripción es obligatoria",
    "string.min": "La descripción debe tener al menos 10 caracteres",
    "string.max": "La descripción no puede exceder los 500 caracteres",
    "any.required": "La descripción es obligatoria",
  }),
});

export const updateOfertaSchema = Joi.object({
  titulo: Joi.string().trim().min(3).max(150).messages({
    "string.empty": "El título no puede estar vacío",
    "string.min": "El título debe tener al menos 3 caracteres",
  }),
  subtitulo: Joi.string().trim().min(3).max(150).messages({
    "string.empty": "El subtítulo no puede estar vacío",
    "string.min": "El subtítulo debe tener al menos 3 caracteres",
  }),
  descripcion: Joi.string().trim().min(10).max(500).messages({
    "string.empty": "La descripción no puede estar vacía",
    "string.min": "La descripción debe tener al menos 10 caracteres",
    "string.max": "La descripción no puede exceder los 500 caracteres",
  }),
})
  .min(1)
  .messages({
    "object.min":
      "Al menos un campo debe ser proporcionado para actualizar la oferta",
  });
