import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        messagge: "error de usuario o contraseña",
      });
    }
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(404).json({
        messagge: "error de usuario o contraseña",
      });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({ messagge: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

