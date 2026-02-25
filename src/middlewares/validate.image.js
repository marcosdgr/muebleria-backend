// Middleware para validar que las imágenes estén presentes y sean hasta 3
export const validateImage = (req, res, next) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({
      message: 'No se enviaron archivos. Asegúrate de enviar FormData con key "imagenProducto"',
      recibido: { body: req.body, files: req.files },
    });
  }
  if (files.length > 3) {
    return res.status(400).json({ message: 'Máximo 3 imágenes permitidas' });
  }
  next();
};
