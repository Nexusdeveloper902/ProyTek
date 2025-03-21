const express = require("express");
const router = express.Router();
const db = require("../models/database");

// GET /tareas/:actividad_id: Obtener tareas de una actividad
router.get("/:actividad_id", (req, res) => {
    const { actividad_id } = req.params;
    db.all("SELECT * FROM tareas WHERE actividad_id = ?", [actividad_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST /tareas: Crear una nueva tarea
router.post("/", (req, res) => {
    const { actividad_id, nombre, descripcion, fecha_inicio, fecha_fin, fecha_actualizacion, observacion, avance, responsable_id } = req.body;
    if (!actividad_id || !nombre) return res.status(400).json({ error: "El ID de actividad y el nombre son obligatorios" });
    db.run(
        `INSERT INTO tareas (actividad_id, nombre, descripcion, fecha_inicio, fecha_fin, fecha_actualizacion, observacion, avance, responsable_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [actividad_id, nombre, descripcion, fecha_inicio, fecha_fin, fecha_actualizacion, observacion, avance || 0, responsable_id || null],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, mensaje: "Tarea creada exitosamente" });
        }
    );
});

// PUT /tareas/:id: Actualizar una tarea
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { actividad_id, nombre, descripcion, fecha_inicio, fecha_fin, fecha_actualizacion, observacion, avance, responsable_id } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre de la tarea es obligatorio" });
    db.run(
        `UPDATE tareas
         SET actividad_id = ?, nombre = ?, descripcion = ?, fecha_inicio = ?,
             fecha_fin = ?, fecha_actualizacion = ?, observacion = ?, avance = ?,
             responsable_id = ?
         WHERE id = ?`,
        [actividad_id, nombre, descripcion, fecha_inicio, fecha_fin, fecha_actualizacion, observacion, avance || 0, responsable_id || null, id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ mensaje: "Tarea no encontrada" });
            res.json({ mensaje: "Tarea actualizada exitosamente" });
        }
    );
});

// DELETE /tareas/:id: Eliminar una tarea
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM tareas WHERE id = ?", [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ mensaje: "Tarea no encontrada" });
        res.json({ mensaje: "Tarea eliminada exitosamente" });
    });
});

module.exports = router;
