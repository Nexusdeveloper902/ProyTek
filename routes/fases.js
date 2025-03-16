const express = require("express");
const router = express.Router();
const db = require("../models/database");

// GET /fases/:proyecto_id: Obtener fases de un proyecto
router.get("/:proyecto_id", (req, res) => {
    const { proyecto_id } = req.params;
    db.all("SELECT * FROM fases WHERE proyecto_id = ?", [proyecto_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST /fases: Crear una nueva fase
router.post("/", (req, res) => {
    const { proyecto_id, nombre, descripcion } = req.body;
    if (!proyecto_id || !nombre) return res.status(400).json({ error: "El ID de proyecto y el nombre son obligatorios" });
    db.run("INSERT INTO fases (proyecto_id, nombre, descripcion) VALUES (?, ?, ?)",
        [proyecto_id, nombre, descripcion],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, mensaje: "Fase creada exitosamente" });
        }
    );
});

// PUT /fases/:id: Actualizar una fase
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { proyecto_id, nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre de la fase es obligatorio" });
    db.run("UPDATE fases SET proyecto_id = ?, nombre = ?, descripcion = ? WHERE id = ?",
        [proyecto_id, nombre, descripcion, id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: "Fase actualizada exitosamente" });
        }
    );
});

// DELETE /fases/:id: Eliminar una fase
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM fases WHERE id = ?", [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ mensaje: "Fase no encontrada" });
        res.json({ mensaje: "Fase eliminada exitosamente" });
    });
});

module.exports = router;
