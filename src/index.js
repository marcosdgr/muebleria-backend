import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";


dotenv.config();

connectDB();

app.listen(process.env.PORT, ()=>{
   console.log("Servidor corriendo");
});
