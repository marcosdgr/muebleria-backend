import { cloudinaryUpload } from "../helpers/cloduniaryHelpers.js";
import productos from "../models/productos.js";
import { removeBackground } from "../services/removeBg.services.js";

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
      return res.status(404).json({ message: "No se encontraron productos" });
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
    res
      .status(500)
      .json({ message: "Error al obtener productos", error: error.message });
  }
};
//obtener productos sin paginacion
export const getAllProductos = async (req, res) => {
  try {
    const data = await productos.find({ productoActivo: true });
    if (!data) {
      return res.status(404).json({ message: "No se encontraron productos" });
    }
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener productos", error: error.message });
  }
};

export const createProducto = async (req, res) => {
  console.log("Archivos recibidos:", {
    body: req.body,
    files: req.files && req.files.map((f) => f.originalname),
  });

  try {
    const files = req.files;

    // Validaciones básicas
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "La imagen es requerida" });
    }

    if (files.length > 3) {
      return res.status(400).json({ message: "Máximo 3 imágenes permitidas" });
    }

    // Subir imágenes directamente a Cloudinary
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const url = await cloudinaryUpload(file.buffer);

        if (!url) {
          throw new Error(
            `Error al subir imagen ${file.originalname} a Cloudinary`,
          );
        }

        return url;
      }),
    );

    const nuevoProducto = new productos({
      ...req.body,
      imagenProducto: uploadResults,
    });

    const productoGuardado = await nuevoProducto.save();

    res.status(201).json(productoGuardado);
  } catch (error) {
    console.error("ERROR CREATE PRODUCT:", error);

    res.status(500).json({
      message: "Error al crear producto",
      detail: error.message,
    });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = { ...req.body };

    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res
          .status(400)
          .json({ message: "Máximo 3 imágenes permitidas" });
      }

      const uploadResults = await Promise.all(
        req.files.map(async (file) => {
          const url = await cloudinaryUpload(file.buffer);
          if (!url) throw new Error("Error al subir imagen a Cloudinary");
          return url;
        }),
      );

      cambios.imagenProducto = uploadResults;
    }

    const productoActualizado = await productos.findByIdAndUpdate(id, cambios, {
      new: true,
    });

    if (!productoActualizado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json(productoActualizado);
  } catch (error) {
    console.error("ERROR UPDATE PRODUCT:", error);

    res.status(500).json({
      message: "Error al actualizar producto",
      detail: error.message,
    });
  }
};


// buscar producto por nombre o coincidencia
export const searchProductos = async (req, res) => {
  try {
    const { query } = req.query;
    const productosEncontrados = await productos.find({
      titulo: { $regex: query, $options: "i" },
      productoActivo: true,
    });
    res.status(200).json(productosEncontrados);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar productos", error: error.message });
  }
};
//funcion para descativar un producto sin eliminarlo de la base de datos
export const ManejarEstadoProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productos.findById(id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    const productoDesactivado = await productos.findByIdAndUpdate(
      id,
      { productoActivo: !producto.productoActivo },
      { new: true },
    );
    res
      .status(200)
      .json({
        message: "Estado del producto actualizado",
        producto: productoDesactivado,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al desactivar producto", error: error.message });
  }
};

//funcion para eliminar un producto
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productoEliminado = await productos.findByIdAndDelete(id);
    if (!productoEliminado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res
      .status(200)
      .json({ message: "Producto eliminado", producto: productoEliminado });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar producto", error: error.message });
  }
};

//funcion para buscar productos por categoria
export const getProductosByCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    const productosEncontrados = await productos.find({
      categoria: categoria,
      productoActivo: true,
    });
    res.status(200).json(productosEncontrados);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar", error: error.message });
  }
};
