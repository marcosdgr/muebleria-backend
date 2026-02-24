// services/removeBg.service.js
import axios from 'axios';
import FormData from 'form-data';

export const removeBackground = async (imageBuffer) => {
  try {
    const formData = new FormData();
    formData.append('image_file', imageBuffer, { filename: 'image.jpg' });
    formData.append('size', 'auto');

    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': '5pqSwQqU2gTaCtz2KtpfhqsW',
      },
      responseType: 'arraybuffer',
    });

    return response.data; // devuelve buffer
  } catch (error) {
    console.error('RemoveBG Error:', error.response?.data || error.message);
    throw new Error('Error removing background');
  }
};
