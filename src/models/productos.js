import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  imagenProducto: { type: String, required: true },
  precioActual: { type: Number, required: true },
  precioAnterior: { type: Number, required: true },
  productoActivo: { type: Boolean, required: true, default: true },

});


export default mongoose.model("Producto", productoSchema);
