import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  categoria: {
    type: String,
    enum: ["Cocina", "Living", "Dormitorio", "Jardin", "Varios"],
    required: true,
  },
  imagenProducto: { type: String, required: true },
  precioLista: { type: Number, required: true },
  precioOferta: { type: Number },
  productoActivo: { type: Boolean, required: true, default: true },
  porcentajeDescuento: { type: Number }, // fixed typo
  descripcion: { type: String },
});

export default mongoose.model("Producto", productoSchema);
