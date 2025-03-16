const express = require("express");
const router = express.Router();
const db = require("../models/database");

// GET /actividades/:fase_id: Obtener actividades de una fase
router.get("/:fase_id", (req, res) => {
    const { fase_id } = req.params;
    db.all("SELECT * FROM actividades WHERE fase_id = ?", [fase_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST /actividades: Crear una nueva actividad
router.post("/", (req, res) => {
    const { fase_id, nombre, descripcion } = req.body;
    if (!fase_id || !nombre) return res.status(400).json({ error: "El ID de fase y el nombre son obligatorios" });
    db.run("INSERT INTO actividades (fase_id, nombre, descripcion) VALUES (?, ?, ?)",
        [fase_id, nombre, descripcion],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, mensaje: "Actividad creada exitosamente" });
        }
    );
});

// PUT /actividades/:id: Actualizar una actividad
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { fase_id, nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre de la actividad es obligatorio" });
    db.run("UPDATE actividades SET fase_id = ?, nombre = ?, descripcion = ? WHERE id = ?",
        [fase_id, nombre, descripcion, id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: "Actividad actualizada exitosamente" });
        }
    );
});

// DELETE /actividades/:id: Eliminar una actividad
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM actividades WHERE id = ?", [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ mensaje: "Actividad no encontrada" });
        res.json({ mensaje: "Actividad eliminada exitosamente" });
    });
});

module.exports = router;
