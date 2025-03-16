const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./proytek.db", (err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite.");
    crearTablas();
  }
});

function crearTablas() {
  db.serialize(() => {
    // Tabla de Proyectos
    db.run(`
      CREATE TABLE IF NOT EXISTS proyectos (
                                             id INTEGER PRIMARY KEY AUTOINCREMENT,
                                             nombre TEXT NOT NULL,
                                             descripcion TEXT,
                                             fecha_inicio TEXT,
                                             fecha_fin TEXT
      )
    `);

    // Tabla de Fases
    db.run(`
      CREATE TABLE IF NOT EXISTS fases (
                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         proyecto_id INTEGER,
                                         nombre TEXT NOT NULL,
                                         descripcion TEXT,
                                         FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
        )
    `);

    // Tabla de Actividades
    db.run(`
      CREATE TABLE IF NOT EXISTS actividades (
                                               id INTEGER PRIMARY KEY AUTOINCREMENT,
                                               fase_id INTEGER,
                                               nombre TEXT NOT NULL,
                                               descripcion TEXT,
                                               FOREIGN KEY (fase_id) REFERENCES fases(id) ON DELETE CASCADE
        )
    `);

    // Tabla de Responsables (nuevo)
    db.run(`
      CREATE TABLE IF NOT EXISTS responsables (
                                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                cedula TEXT NOT NULL UNIQUE,
                                                nombre TEXT NOT NULL,
                                                correo TEXT NOT NULL
      )
    `);

    // Tabla de Tareas (añadimos la columna responsable_id)
    // Si la tabla tareas NO existe, créala directamente con la columna:
    db.run(`
      CREATE TABLE IF NOT EXISTS tareas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        actividad_id INTEGER,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        fecha_inicio TEXT,
        fecha_fin TEXT,
        fecha_actualizacion TEXT,
        observacion TEXT,
        avance INTEGER DEFAULT 0,
        responsable_id INTEGER,  -- nueva columna
        FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE,
        FOREIGN KEY (responsable_id) REFERENCES responsables(id) ON DELETE SET NULL
      )
    `);

    // Si la tabla 'tareas' ya existía sin la columna 'responsable_id',
    // puedes usar un ALTER TABLE (solo se hace una vez):
    db.run(`
      ALTER TABLE tareas ADD COLUMN responsable_id INTEGER 
        REFERENCES responsables(id) ON DELETE SET NULL
    `, (err) => {
      // Ignoramos el error si la columna ya existe
      if (err && !err.message.includes("duplicate column")) {
        console.error("Error al alterar la tabla 'tareas':", err.message);
      }
    });

    console.log("Tablas verificadas o creadas exitosamente.");
  });
}

module.exports = db;
