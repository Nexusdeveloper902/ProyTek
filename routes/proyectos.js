const express = require("express");
const router = express.Router();
const db = require("../models/database");

// GET /proyectos: Obtener todos los proyectos
router.get("/", (req, res) => {
    db.all("SELECT * FROM proyectos", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST /proyectos: Crear un nuevo proyecto
router.post("/", (req, res) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre del proyecto es obligatorio" });
    db.run(
        "INSERT INTO proyectos (nombre, descripcion, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)",
        [nombre, descripcion, fecha_inicio, fecha_fin],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, mensaje: "Proyecto creado exitosamente" });
        }
    );
});

// PUT /proyectos/:id: Actualizar un proyecto
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, fecha_inicio, fecha_fin } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre del proyecto es obligatorio" });
    db.run(
        "UPDATE proyectos SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ? WHERE id = ?",
        [nombre, descripcion, fecha_inicio, fecha_fin, id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: "Proyecto actualizado exitosamente" });
        }
    );
});

// DELETE /proyectos/:id: Eliminar un proyecto
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM proyectos WHERE id = ?", [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ mensaje: "Proyecto no encontrado" });
        res.json({ mensaje: "Proyecto eliminado exitosamente" });
    });
});

module.exports = router;
