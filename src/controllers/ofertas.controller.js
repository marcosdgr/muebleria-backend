import Oferta from "../models/Oferta.js";

// Obtener todas las ofertas

export const traerOfertas = async (req, res) => {
  try {
    const ofertas = await Oferta.find({ ofertaActivo: true });
    if (!ofertas) {
      return res.status(404).json({ message: "No se encontraron ofertas" });
    }
    res.status(200).json(ofertas);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener ofertas", error: error.message });
  }
};

// Crear una nueva oferta
export const crearOferta = async (req, res) => {
  try {
    const nuevaOferta = new Oferta(req.body);
    const ofertaGuardada = await nuevaOferta.save();
    res.status(201).json(ofertaGuardada);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear oferta", error: error.message });
  }
};

// Actualizar una oferta existente
export const actualizarOferta = async (req, res) => {
  try {
    const { id } = req.params;
    const ofertaActualizada = await Oferta.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!ofertaActualizada) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }
    res.status(200).json(ofertaActualizada);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar oferta", error: error.message });
  }
};

// funcion de manejo de estado

export const cambiarEstadoOferta = async (req, res) => {
  try {
    const { id } = req.params;
    const oferta = await Oferta.findById(id);
    if (!oferta) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }
    const ofertaDesactivada = await Oferta.findByIdAndUpdate(
      id,
      { ofertaActiva: !oferta.ofertaActiva },
      { new: true },
    );

    res.status(200).json({
      messagge: "Estado de oferta cambiado exitosamente",
      oferta: ofertaDesactivada,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al cambiar estado de oferta",
      error: error.message,
    });
  }
};

// Eliminar una oferta 
export const eliminarOferta = async (req, res) => {
  try {
    const { id } = req.params;
    const ofertaEliminada = await Oferta.findByIdAndDelete(id);
    if (!ofertaEliminada) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }   
    res.status(200).json({ message: "Oferta eliminada", oferta: ofertaEliminada });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar oferta", error: error.message });
  } 

}
