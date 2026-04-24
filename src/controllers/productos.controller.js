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
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};
//obtener productos sin paginacion
export const getAllProductos = async (req, res) => {
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
  console.log('Archivos recibidos:', {
    body: req.body,
    files: req.files && req.files.map((f) => f.originalname),
  });
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'La imagen es requerida' });
    }
    if (files.length > 3) {
      return res.status(400).json({ message: 'Máximo 3 imágenes permitidas' });
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const imagenSinFondo = await removeBackground(file.buffer);
        const url = await cloudinaryUpload(imagenSinFondo);
        if (!url) throw new Error('Error al subir imagen a Cloudinary');
        return url;
      })
    );

    const nuevoProducto = new productos({
      ...req.body,
      imagenProducto: uploadResults,
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

    // si hay imágenes nuevas, procesamos hasta 3
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ message: 'Máximo 3 imágenes permitidas' });
      }
      const uploadResults = await Promise.all(
        req.files.map(async (file) => {
          const imagenSinFondo = await removeBackground(file.buffer);
          const url = await cloudinaryUpload(imagenSinFondo);
          if (!url) throw new Error('Error al subir imagen a Cloudinary');
          return url;
        })
      );
      cambios.imagenProducto = uploadResults;
    }

    const productoActualizado = await productos.findByIdAndUpdate(id, cambios, { new: true });

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

// funcion para actualizar el descuento de TODOS los productos
export const bulkUpdateDiscount = async (req, res) => {
  try {
    const { porcentajeDescuento } = req.body;

    if (porcentajeDescuento === undefined || porcentajeDescuento === null) {
      return res.status(400).json({ message: 'El porcentaje de descuento es requerido' });
    }

    const pct = parseFloat(porcentajeDescuento);

    // Buscamos todos los productos
    const allProducts = await productos.find();

    // Preparamos las operaciones de actualización masiva
    const operations = allProducts.map((prod) => {
      // Calculamos el nuevo precio de oferta basado en el precio de lista y el nuevo descuento
      const precioOferta = Math.round(prod.precioLista * (1 - pct / 100));

      return {
        updateOne: {
          filter: { _id: prod._id },
          update: {
            $set: {
              porcentajeDescuento: pct,
              precioOferta: precioOferta,
            },
          },
        },
      };
    });

    if (operations.length > 0) {
      await productos.bulkWrite(operations);
    }

    res.status(200).json({
      message: `Se actualizaron ${operations.length} productos con un ${pct}% de descuento.`,
      updatedCount: operations.length,
    });
  } catch (error) {
    console.error('Error in bulkUpdateDiscount:', error);
    res
      .status(500)
      .json({ message: 'Error al actualizar productos masivamente', error: error.message });
  }
};

// funcion para actualizar la plantilla de TODOS los productos de una categoría
export const bulkUpdateTemplate = async (req, res) => {
  try {
    const { categoria, plantillaId } = req.body;

    if (!categoria) {
      return res.status(400).json({ message: 'La categoría es requerida' });
    }

    // Actualizar todos los productos que coincidan con la categoría
    const result = await productos.updateMany(
      { categoria: categoria },
      { $set: { plantillaId: plantillaId } }
    );

    res.status(200).json({
      message: `Se actualizaron ${result.modifiedCount} productos en la categoría ${categoria}.`,
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error in bulkUpdateTemplate:', error);
    res
      .status(500)
      .json({ message: 'Error al actualizar plantillas masivamente', error: error.message });
  }
};
