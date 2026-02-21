import joi from "joi";

export const loginAdminSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "El correo electrónico debe ser válido",
    "any.required": "El correo electrónico es obligatorio",
  }),
  password: joi.string().min(6).required().messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "any.required": "La contraseña es obligatoria",
  }),
});
