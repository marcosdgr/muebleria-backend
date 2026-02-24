// Middleware para validar que la imagen está presente
export const validateImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'No se envió archivo. Asegúrate de enviar FormData con key "imagenProducto"',
      recibido: { body: req.body, file: req.file },
    });
  }
  next();
};
