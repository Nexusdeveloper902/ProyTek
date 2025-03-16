const express = require("express");
const router = express.Router();
const db = require("../models/database");

// GET /actividades/:fase_id: Obtener actividades de una fase
router.get("/:fase_id", (req, res) => {
    const { fase_id } = req.params;
    console.log(`Ruta GET /actividades/${fase_id} activada`);
    db.all("SELECT * FROM actividades WHERE fase_id = ?", [fase_id], (err, rows) => {
        if (err) {
            console.error("Error al obtener actividades:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            console.log("Actividades obtenidas:", rows);
            res.json(rows);
        }
    });
});

// POST /actividades: Crear una nueva actividad
router.post("/", (req, res) => {
    console.log("Ruta POST /actividades activada, body:", req.body);
    const { fase_id, nombre, descripcion } = req.body;
    if (!fase_id || !nombre) {
        return res.status(400).json({ error: "El ID de fase y el nombre de la actividad son obligatorios" });
    }
    db.run(
        "INSERT INTO actividades (fase_id, nombre, descripcion) VALUES (?, ?, ?)",
        [fase_id, nombre, descripcion],
        function (err) {
            if (err) {
                console.error("Error al insertar actividad:", err.message);
                res.status(500).json({ error: err.message });
            } else {
                console.log("Actividad insertada con id:", this.lastID);
                res.json({ id: this.lastID, mensaje: "Actividad creada exitosamente" });
            }
        }
    );
});

// PUT /actividades/:id: Actualizar una actividad
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { fase_id, nombre, descripcion } = req.body;
    if (!nombre) {
        return res.status(400).json({ error: "El nombre de la actividad es obligatorio" });
    }
    db.run(
        "UPDATE actividades SET fase_id = ?, nombre = ?, descripcion = ? WHERE id = ?",
        [fase_id, nombre, descripcion, id],
        function(err) {
            if (err) {
                console.error("Error al actualizar actividad:", err.message);
                return res.status(500).json({ error: err.message });
            }
            res.json({ mensaje: "Actividad actualizada exitosamente" });
        }
    );
});


module.exports = router;
