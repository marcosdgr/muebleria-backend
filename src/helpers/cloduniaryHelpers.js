import cloudinary from '../config/cloudinary.js';

export const cloudinaryUpload = async (fileBuffer) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'muebleria/productos',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error('Error al subir a Cloudinary:', error);
    throw error;
  }
};
