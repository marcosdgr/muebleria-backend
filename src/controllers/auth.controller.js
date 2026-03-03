import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️ Validar datos enviados
    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son obligatorios",
      });
    }

    // 2️ Buscar usuario h
    const admin = await Admin.findOne({ email });

    // 3️ Validar credenciales
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    // 4️ Generar token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // 5️ Respuesta exitosa
    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: admin._id,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};