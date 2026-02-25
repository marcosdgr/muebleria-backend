import express from "express";

export default function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert:true, // Permite convertir tipos automáticamente (ej. "true" a true, "123" a 123)
    });

    if (error) {
      const errors = error.details.map((d) => d.message);
      return res.status(400).json({ errors });
    }

    req.body = value;
    next();
  };
}
