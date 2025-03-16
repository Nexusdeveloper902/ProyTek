const express = require("express");
const router = express.Router();
const db = require("../models/database");

// GET /responsables - Listar todos
router.get("/", (req, res) => {
    db.all("SELECT * FROM responsables", [], (err, rows) => {
        if (err) {
            console.error("Error al obtener responsables:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST /responsables - Crear uno nuevo
// Campos: cedula, nombre, correo
router.post("/", (req, res) => {
    const { cedula, nombre, correo } = req.body;
    if (!cedula || !nombre || !correo) {
        return res.status(400).json({ error: "cedula, nombre y correo son obligatorios" });
    }
    db.run(
        "INSERT INTO responsables (cedula, nombre, correo) VALUES (?, ?, ?)",
        [cedula, nombre, correo],
        function (err) {
            if (err) {
                // Si se viola la unique constraint de la cédula, devolver un error entendible
                if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(400).json({ error: "La cédula ya existe, no se pueden repetir" });
                }
                console.error("Error al insertar responsable:", err.message);
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, mensaje: "Responsable creado exitosamente" });
        }
    );
});

// PUT /responsables/:id - Actualizar
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { cedula, nombre, correo } = req.body;
    if (!cedula || !nombre || !correo) {
        return res.status(400).json({ error: "cedula, nombre y correo son obligatorios" });
    }
    db.run(
        "UPDATE responsables SET cedula = ?, nombre = ?, correo = ? WHERE id = ?",
        [cedula, nombre, correo, id],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(400).json({ error: "La cédula ya existe, no se pueden repetir" });
                }
                console.error("Error al actualizar responsable:", err.message);
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ mensaje: "Responsable no encontrado" });
            }
            res.json({ mensaje: "Responsable actualizado exitosamente" });
        }
    );
});

// DELETE /responsables/:id - Eliminar
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM responsables WHERE id = ?", [id], function (err) {
        if (err) {
            console.error("Error al eliminar responsable:", err.message);
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ mensaje: "Responsable no encontrado" });
        }
        res.json({ mensaje: "Responsable eliminado exitosamente" });
    });
});

module.exports = router;
