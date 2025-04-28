import express from "express";
import cors from "cors";
import dontenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dontenv.config();
const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api", userRoutes);
app.use("/api", taskRoutes);

//Teste Basico
app.get("/", (req, res) => {
  res.send("API TO-DO-LIST FUNCIONANDO");
})

//Subir servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});