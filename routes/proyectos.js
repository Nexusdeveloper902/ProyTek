const express = require("express");
const router = express.Router();
const db = require("../models/database");

// GET /proyectos: Obtener todos los proyectos
router.get("/", (req, res) => {
    console.log("Ruta GET /proyectos activada");
    db.all("SELECT * FROM proyectos", [], (err, rows) => {
        if (err) {
            console.error("Error al obtener proyectos:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            console.log("Proyectos obtenidos:", rows);
            res.json(rows);
        }
    });
});

// POST /proyectos: Crear un nuevo proyecto
router.post("/", (req, res) => {
    console.log("Ruta POST /proyectos activada, body:", req.body);
    const { nombre, descripcion, fecha_inicio, fecha_fin } = req.body;
    if (!nombre) {
        return res.status(400).json({ error: "El nombre del proyecto es obligatorio" });
    }
    db.run(
        "INSERT INTO proyectos (nombre, descripcion, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)",
        [nombre, descripcion, fecha_inicio, fecha_fin],
        function (err) {
            if (err) {
                console.error("Error al insertar proyecto:", err.message);
                res.status(500).json({ error: err.message });
            } else {
                console.log("Proyecto insertado con id:", this.lastID);
                res.json({ id: this.lastID, mensaje: "Proyecto creado exitosamente" });
            }
        }
    );
});

// DELETE /proyectos/:id: Eliminar un proyecto
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM proyectos WHERE id = ?", [id], function(err) {
        if (err) {
            console.error("Error al eliminar proyecto:", err.message);
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            res.status(404).json({ mensaje: "Proyecto no encontrado" });
        } else {
            console.log(`Proyecto con id ${id} eliminado`);
            res.json({ mensaje: "Proyecto eliminado exitosamente" });
        }
    });
});

// PUT /fases/:id: Actualizar una fase
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { proyecto_id, nombre, descripcion } = req.body;
    if (!nombre) {
        return res.status(400).json({ error: "El nombre de la fase es obligatorio" });
    }
    db.run(
        "UPDATE fases SET proyecto_id = ?, nombre = ?, descripcion = ? WHERE id = ?",
        [proyecto_id, nombre, descripcion, id],
        function(err) {
            if (err) {
                console.error("Error al actualizar fase:", err.message);
                return res.status(500).json({ error: err.message });
            }
            res.json({ mensaje: "Fase actualizada exitosamente" });
        }
    );
});

module.exports = router;
