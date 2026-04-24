import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./src/models/admin.js"
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const hash = await bcrypt.hash("muebleria0703", 10);

await Admin.create({
email: "admin1@mail.com",
password: hash
});

console.log("Admin creado exitosamente");

process.exit();