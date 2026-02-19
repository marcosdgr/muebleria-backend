import mongoose from "mongoose";


const ofertaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  subtitulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  ofertaActiva: { type: Boolean, required: true, default: true },
  // fechaDeLaOferta: { type: Date, required: true },

})

export default mongoose.model("Oferta", ofertaSchema);
