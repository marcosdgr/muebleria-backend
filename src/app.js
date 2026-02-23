import express from "express" ;
import cors from "cors" ;
import authRoutes from "./routes/auth.routes.js"
import productoRoutes from "./routes/producto.routes.js";
import ofertaRoutes from "./routes/ofertas.routes.js";

const app = express ()


app.use(cors());
app.use(express.json());

// rutas
app.use("/api/auth", authRoutes)
app.use("/api/productos", productoRoutes)
app.use("/api/ofertas", ofertaRoutes)


export default app;
