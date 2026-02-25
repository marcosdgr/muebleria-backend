import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  categoria: {
    type: String,
    enum: ['Cocina', 'Living', 'Dormitorio', 'Jardin', 'Varios'],
    required: true,
  },
  // Agregamos el campo de imagen como un array de strings para almacenar múltiples URLs
  imagenProducto: { type: [String], required: true },
  precioLista: { type: Number, required: true },
  precioOferta: { type: Number },
  productoActivo: { type: Boolean, required: true, default: true },
  porcentajeDescuento: { type: Number }, // fixed typo
  descripcion: { type: String },
  plantillaId:{ type:String}
});

export default mongoose.model('Producto', productoSchema);
