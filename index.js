const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configurar el motor de plantillas EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Aquí defines tus rutas de API (como /proyectos, /fases, etc.)
const proyectosRoutes = require("./routes/proyectos");
const fasesRoutes = require("./routes/fases");
const actividadesRoutes = require("./routes/actividades");
const tareasRoutes = require("./routes/tareas");
const responsablesRoutes = require("./routes/responsables");

app.use("/proyectos", proyectosRoutes);
app.use("/fases", fasesRoutes);
app.use("/actividades", actividadesRoutes);
app.use("/tareas", tareasRoutes);
app.use("/responsables", responsablesRoutes);

// Ruta principal para renderizar la interfaz web
app.get("/", (req, res) => {
    res.render("index");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
