import { cloudinaryUpload } from '../helpers/cloduniaryHelpers.js';
import productos from '../models/productos.js';

export const getProductos = async (req, res) => {
  try {
    const data = await productos.find({ productoActivo: true });
    if (!data) {
      return res.status(404).json({ message: 'No se encontraron productos' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

export const createProducto = async (req, res) => {
  try {
    const imagenProducto = req.file;

    // Validar que existe la imagen
    if (!imagenProducto) {
      return res.status(400).json({ message: 'La imagen es requerida' });
    }

    // Subir imagen a Cloudinary
    const uploadResult = await cloudinaryUpload(imagenProducto.buffer);
    if (!uploadResult) {
      return res.status(500).json({ message: 'Error al subir imagen a Cloudinary' });
    }
    // Crear producto con la URL de Cloudinary
    const nuevoProducto = new productos({
      ...req.body,
      imagenProducto: uploadResult,
    });
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const imagenProducto = req.file;
    let datosActualizacion = req.body;

    // Si hay nueva imagen, subirla a Cloudinary
    if (imagenProducto) {
      const uploadResult = await cloudinaryUpload(imagenProducto.buffer);
      datosActualizacion.imagenProducto = uploadResult;
    }

    const productoActualizado = await productos.findByIdAndUpdate(id, datosActualizacion, {
      new: true,
    });
    if (!productoActualizado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(productoActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

//funcion para descativar un producto sin eliminarlo de la base de datos
export const ManejarEstadoProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productos.findById(id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    const productoDesactivado = await productos.findByIdAndUpdate(
      id,
      { productoActivo: !producto.productoActivo },
      { new: true }
    );
    res
      .status(200)
      .json({ message: 'Estado del producto actualizado', producto: productoDesactivado });
  } catch (error) {
    res.status(500).json({ message: 'Error al desactivar producto', error: error.message });
  }
};

//funcion para eliminar un producto
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productoEliminado = await productos.findByIdAndDelete(id);
    if (!productoEliminado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado', producto: productoEliminado });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};
