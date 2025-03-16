const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));

// Importar rutas
const proyectosRoutes = require("./routes/proyectos");
const fasesRoutes = require("./routes/fases");
const actividadesRoutes = require("./routes/actividades");
const tareasRoutes = require("./routes/tareas");
const responsablesRoutes = require("./routes/responsables");

// Usar rutas
app.use("/proyectos", proyectosRoutes);
app.use("/fases", fasesRoutes);
app.use("/actividades", actividadesRoutes);
app.use("/tareas", tareasRoutes);
app.use("/responsables", responsablesRoutes);

app.get("/", (req, res) => {
    res.send("¡Servidor funcionando!");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
