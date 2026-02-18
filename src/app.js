import express from "express" ;
import cors from "cors" ;
import authRoutes from "../src/routes/auth.routes.js"

const app = express ()


app.use(cors());
app.use(express.json());

// rutas
app.use("/api/auth", authRoutes)



export default app;