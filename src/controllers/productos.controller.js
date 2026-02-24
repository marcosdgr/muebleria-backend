import { cloudinaryUpload } from '../helpers/cloduniaryHelpers.js';
import productos from '../models/productos.js';
import { removeBackground } from '../services/removeBg.services.js';

export const getProductos = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Obtener los productos paginados
    const data = await productos.find().skip(skip).limit(parseInt(limit));
    
    // Obtener el total de productos
    const total = await productos.countDocuments();
    
    // Calcular el total de páginas
    const totalPages = Math.ceil(total / limit);

    if (!data) {
      return res.status(404).json({ message: 'No se encontraron productos' });
    }

    // Devolver la estructura que el frontend espera
    res.status(200).json({
      productos: data,
      total: total,
      totalPages: totalPages,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};
//obtener productos sin paginacion
export const getAllProductos = async (req, res) => {
  try {
    const data = await productos.find({productoActivo: true});
    if (!data) {
      return res.status(404).json({ message: 'No se encontraron productos' });
    }
    res.status(200).json(data);
  }
    catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
}

export const createProducto = async (req, res) => {
  console.log('Archivo recibido:', req.body);
  try {
    const imagenProducto = req.file;

    // Validar que existe la imagen
    if (!imagenProducto) {
      return res.status(400).json({ message: 'La imagen es requerida' });
    }
    //aqui llamamos a la funcion para eliminar el fondo de la imagen antes de subirla a cloudinary
    const imagenSinFondo = await removeBackground(imagenProducto.buffer);

    // Subir imagen a Cloudinary
    const uploadResult = await cloudinaryUpload(imagenSinFondo);
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

// controllers/productos.controller.js
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // copiamos todo lo recibido en el body
    const cambios = { ...req.body };

    // si hay imagen nueva, aplicamos el mismo flujo que en create
    if (req.file) {
      const imagenSinFondo = await removeBackground(req.file.buffer);
      const uploadResult = await cloudinaryUpload(imagenSinFondo);
      if (!uploadResult) {
        return res
          .status(500)
          .json({ message: 'Error al subir imagen a Cloudinary' });
      }
      cambios.imagenProducto = uploadResult;
    }

    const productoActualizado = await productos.findByIdAndUpdate(
      id,
      cambios,
      { new: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json(productoActualizado);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al actualizar producto', error: error.message });
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
