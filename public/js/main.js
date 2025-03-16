// Función auxiliar para manejar errores
function handleError(message, error) {
    alert(message);
    console.error(error);
}

// -------------------------------------------------------------------
// Funciones para cargar dropdowns
// -------------------------------------------------------------------
async function loadProjectsIntoSelect(selectId) {
    try {
        const res = await fetch("/proyectos");
        const projects = await res.json();
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">-- Seleccionar Proyecto --</option>';
        projects.forEach(p => {
            const option = document.createElement("option");
            option.value = p.id;
            option.text = p.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar proyectos en select:", error);
    }
}

async function loadFasesIntoSelect(selectId) {
    try {
        const res = await fetch("/proyectos");
        const projects = await res.json();
        let allFases = [];
        for (const p of projects) {
            const resF = await fetch(`/fases/${p.id}`);
            const fases = await resF.json();
            allFases = allFases.concat(fases);
        }
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">-- Seleccionar Fase --</option>';
        allFases.forEach(f => {
            const option = document.createElement("option");
            option.value = f.id;
            option.text = `${f.nombre} (Proyecto: ${f.proyecto_id})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar fases en select:", error);
    }
}

async function loadActividadesIntoSelect(selectId) {
    try {
        const res = await fetch("/proyectos");
        const projects = await res.json();
        let allActividades = [];
        for (const p of projects) {
            const resF = await fetch(`/fases/${p.id}`);
            const fases = await resF.json();
            for (const f of fases) {
                const resA = await fetch(`/actividades/${f.id}`);
                const acts = await resA.json();
                allActividades = allActividades.concat(acts);
            }
        }
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">-- Seleccionar Actividad --</option>';
        allActividades.forEach(a => {
            const option = document.createElement("option");
            option.value = a.id;
            option.text = `${a.nombre} (Fase: ${a.fase_id})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar actividades en select:", error);
    }
}

async function loadResponsablesIntoSelect(selectId) {
    try {
        const res = await fetch("/responsables");
        const responsables = await res.json();
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">-- Seleccionar Responsable --</option>';
        responsables.forEach(r => {
            const option = document.createElement("option");
            option.value = r.id;
            option.text = `${r.nombre} (Cédula: ${r.cedula})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar responsables en select:", error);
    }
}

// -------------------------------------------------------------------
// PROYECTOS
// -------------------------------------------------------------------
document.getElementById("projectForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const project = {
        nombre: document.getElementById("p_nombre").value,
        descripcion: document.getElementById("p_descripcion").value,
        fecha_inicio: document.getElementById("p_fecha_inicio").value,
        fecha_fin: document.getElementById("p_fecha_fin").value
    };
    try {
        const res = await fetch("/proyectos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project)
        });
        const data = await res.json();
        alert("Proyecto creado con ID: " + data.id);
        document.getElementById("projectForm").reset();
        loadProjects();
        loadProjectsIntoSelect("fase_proyecto_select");
        loadProjectsIntoSelect("fase_proyecto_filter");
    } catch (error) {
        handleError("Error al crear el proyecto", error);
    }
});

async function loadProjects() {
    try {
        const res = await fetch("/proyectos");
        const projects = await res.json();
        const list = document.getElementById("projectList");
        list.innerHTML = "";
        projects.forEach(project => {
            const li = document.createElement("li");
            li.innerHTML = `
        <strong>ID:</strong> ${project.id} <br>
        <strong>Nombre:</strong> ${project.nombre} <br>
        <strong>Descripción:</strong> ${project.descripcion || "N/A"} <br>
        <strong>Fecha inicio:</strong> ${project.fecha_inicio || "N/A"} <br>
        <strong>Fecha fin:</strong> ${project.fecha_fin || "N/A"} 
        <button class="edit-btn btn" onclick="showEditProject(${project.id}, '${project.nombre}', '${project.descripcion || ""}', '${project.fecha_inicio || ""}', '${project.fecha_fin || ""}')">Editar</button>
        <button class="delete-btn btn" onclick="deleteProject(${project.id})">Eliminar</button>
      `;
            list.appendChild(li);
        });
    } catch (error) {
        handleError("Error al cargar proyectos", error);
    }
}
document.getElementById("loadProjects").addEventListener("click", loadProjects);

async function deleteProject(id) {
    if (confirm("¿Eliminar proyecto con ID " + id + "?")) {
        try {
            const res = await fetch(`/proyectos/${id}`, { method: "DELETE" });
            const data = await res.json();
            alert(data.mensaje);
            loadProjects();
            loadProjectsIntoSelect("fase_proyecto_select");
            loadProjectsIntoSelect("fase_proyecto_filter");
        } catch (error) {
            handleError("Error al eliminar el proyecto", error);
        }
    }
}

function showEditProject(id, nombre, descripcion, fecha_inicio, fecha_fin) {
    document.getElementById("edit_project_id").value = id;
    document.getElementById("edit_p_nombre").value = nombre;
    document.getElementById("edit_p_descripcion").value = descripcion;
    document.getElementById("edit_p_fecha_inicio").value = fecha_inicio;
    document.getElementById("edit_p_fecha_fin").value = fecha_fin;
    document.getElementById("editProjectContainer").classList.remove("hidden");
}

function cancelEditProject() {
    document.getElementById("editProjectContainer").classList.add("hidden");
    document.getElementById("editProjectForm").reset();
}

document.getElementById("editProjectForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit_project_id").value;
    const project = {
        nombre: document.getElementById("edit_p_nombre").value,
        descripcion: document.getElementById("edit_p_descripcion").value,
        fecha_inicio: document.getElementById("edit_p_fecha_inicio").value,
        fecha_fin: document.getElementById("edit_p_fecha_fin").value
    };
    try {
        const res = await fetch(`/proyectos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project)
        });
        const data = await res.json();
        alert("Proyecto actualizado: " + data.mensaje);
        cancelEditProject();
        loadProjects();
    } catch (error) {
        handleError("Error al actualizar el proyecto", error);
    }
});

// -------------------------------------------------------------------
// FASES
// -------------------------------------------------------------------
document.getElementById("faseForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const proyectoId = document.getElementById("fase_proyecto_select").value;
    const fase = {
        proyecto_id: parseInt(proyectoId),
        nombre: document.getElementById("fase_nombre").value,
        descripcion: document.getElementById("fase_descripcion").value
    };
    try {
        const res = await fetch("/fases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fase)
        });
        const data = await res.json();
        alert("Fase creada con ID: " + data.id);
        document.getElementById("faseForm").reset();
        loadFases();
        loadFasesIntoSelect("actividad_fase_select");
        loadFasesIntoSelect("actividad_fase_filter");
    } catch (error) {
        handleError("Error al crear la fase", error);
    }
});

document.getElementById("loadFases").addEventListener("click", async () => {
    const proyectoId = document.getElementById("fase_proyecto_filter").value;
    if (!proyectoId) {
        alert("Selecciona un proyecto para ver sus fases.");
        return;
    }
    try {
        const res = await fetch(`/fases/${proyectoId}`);
        const fases = await res.json();
        const list = document.getElementById("faseList");
        list.innerHTML = "";
        fases.forEach(fase => {
            const li = document.createElement("li");
            li.innerHTML = `
        <strong>ID:</strong> ${fase.id} <br>
        <strong>Nombre:</strong> ${fase.nombre} <br>
        <strong>Descripción:</strong> ${fase.descripcion || "N/A"} <br>
        <button class="edit-btn btn" onclick="showEditFase(${fase.id}, ${fase.proyecto_id}, '${fase.nombre}', '${fase.descripcion || ""}')">Editar</button>
        <button class="delete-btn btn" onclick="deleteFase(${fase.id}, ${proyectoId})">Eliminar</button>
      `;
            list.appendChild(li);
        });
    } catch (error) {
        handleError("Error al cargar fases", error);
    }
});

async function deleteFase(faseId, proyectoId) {
    if (confirm("¿Eliminar fase con ID " + faseId + "?")) {
        try {
            const res = await fetch(`/fases/${faseId}`, { method: "DELETE" });
            const data = await res.json();
            alert(data.mensaje);
            const res2 = await fetch(`/fases/${proyectoId}`);
            const fases = await res2.json();
            const list = document.getElementById("faseList");
            list.innerHTML = "";
            fases.forEach(fase => {
                const li = document.createElement("li");
                li.innerHTML = `
          <strong>ID:</strong> ${fase.id} <br>
          <strong>Nombre:</strong> ${fase.nombre} <br>
          <strong>Descripción:</strong> ${fase.descripcion || "N/A"} <br>
          <button class="edit-btn btn" onclick="showEditFase(${fase.id}, ${fase.proyecto_id}, '${fase.nombre}', '${fase.descripcion || ""}')">Editar</button>
          <button class="delete-btn btn" onclick="deleteFase(${fase.id}, ${proyectoId})">Eliminar</button>
        `;
                list.appendChild(li);
            });
            loadFasesIntoSelect("actividad_fase_select");
            loadFasesIntoSelect("actividad_fase_filter");
        } catch (error) {
            handleError("Error al eliminar la fase", error);
        }
    }
}

function showEditFase(id, proyecto_id, nombre, descripcion) {
    document.getElementById("edit_fase_id").value = id;
    document.getElementById("edit_fase_nombre").value = nombre;
    document.getElementById("edit_fase_descripcion").value = descripcion;
    document.getElementById("editFaseContainer").classList.remove("hidden");
    loadProjectsIntoSelect("edit_fase_proyecto_select").then(() => {
        document.getElementById("edit_fase_proyecto_select").value = proyecto_id;
    });
}

function cancelEditFase() {
    document.getElementById("editFaseContainer").classList.add("hidden");
    document.getElementById("editFaseForm").reset();
}

document.getElementById("editFaseForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit_fase_id").value;
    const proyecto_id = parseInt(document.getElementById("edit_fase_proyecto_select").value);
    const nombre = document.getElementById("edit_fase_nombre").value;
    const descripcion = document.getElementById("edit_fase_descripcion").value;
    const fase = { proyecto_id, nombre, descripcion };
    try {
        const res = await fetch(`/fases/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fase)
        });
        const data = await res.json();
        alert("Fase actualizada: " + data.mensaje);
        cancelEditFase();
    } catch (error) {
        handleError("Error al actualizar la fase", error);
    }
});

// -------------------------------------------------------------------
// ACTIVIDADES
// -------------------------------------------------------------------
document.getElementById("actividadForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const faseId = document.getElementById("actividad_fase_select").value;
    const actividad = {
        fase_id: parseInt(faseId),
        nombre: document.getElementById("actividad_nombre").value,
        descripcion: document.getElementById("actividad_descripcion").value
    };
    try {
        const res = await fetch("/actividades", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(actividad)
        });
        const data = await res.json();
        alert("Actividad creada con ID: " + data.id);
        document.getElementById("actividadForm").reset();
        loadActividades();
        loadActividadesIntoSelect("tarea_actividad_select");
        loadActividadesIntoSelect("tarea_actividad_filter");
    } catch (error) {
        handleError("Error al crear la actividad", error);
    }
});

document.getElementById("loadActividades").addEventListener("click", async () => {
    const faseId = document.getElementById("actividad_fase_filter").value;
    if (!faseId) {
        alert("Selecciona una fase para ver sus actividades.");
        return;
    }
    try {
        const res = await fetch(`/actividades/${faseId}`);
        const actividades = await res.json();
        const list = document.getElementById("actividadList");
        list.innerHTML = "";
        actividades.forEach(act => {
            const li = document.createElement("li");
            li.innerHTML = `
        <strong>ID:</strong> ${act.id} <br>
        <strong>Nombre:</strong> ${act.nombre} <br>
        <strong>Descripción:</strong> ${act.descripcion || "N/A"}
        <button class="edit-btn btn" onclick="showEditActividad(${act.id}, ${act.fase_id}, '${act.nombre}', '${act.descripcion || ""}')">Editar</button>
        <button class="delete-btn btn" onclick="deleteActividad(${act.id}, ${faseId})">Eliminar</button>
      `;
            list.appendChild(li);
        });
    } catch (error) {
        handleError("Error al cargar actividades", error);
    }
});

async function deleteActividad(actividadId, faseId) {
    if (confirm("¿Eliminar actividad con ID " + actividadId + "?")) {
        try {
            const res = await fetch(`/actividades/${actividadId}`, { method: "DELETE" });
            const data = await res.json();
            alert(data.mensaje);
            const res2 = await fetch(`/actividades/${faseId}`);
            const acts = await res2.json();
            const list = document.getElementById("actividadList");
            list.innerHTML = "";
            acts.forEach(act => {
                const li = document.createElement("li");
                li.innerHTML = `
          <strong>ID:</strong> ${act.id} <br>
          <strong>Nombre:</strong> ${act.nombre} <br>
          <strong>Descripción:</strong> ${act.descripcion || "N/A"}
          <button class="edit-btn btn" onclick="showEditActividad(${act.id}, ${act.fase_id}, '${act.nombre}', '${act.descripcion || ""}')">Editar</button>
          <button class="delete-btn btn" onclick="deleteActividad(${act.id}, ${faseId})">Eliminar</button>
        `;
                list.appendChild(li);
            });
            loadActividadesIntoSelect("tarea_actividad_select");
            loadActividadesIntoSelect("tarea_actividad_filter");
        } catch (error) {
            handleError("Error al eliminar la actividad", error);
        }
    }
}

function showEditActividad(id, fase_id, nombre, descripcion) {
    document.getElementById("edit_actividad_id").value = id;
    document.getElementById("edit_actividad_nombre").value = nombre;
    document.getElementById("edit_actividad_descripcion").value = descripcion;
    document.getElementById("editActividadContainer").classList.remove("hidden");
    loadFasesIntoSelect("edit_actividad_fase_select").then(() => {
        document.getElementById("edit_actividad_fase_select").value = fase_id;
    });
}

function cancelEditActividad() {
    document.getElementById("editActividadContainer").classList.add("hidden");
    document.getElementById("editActividadForm").reset();
}

document.getElementById("editActividadForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit_actividad_id").value;
    const fase_id = parseInt(document.getElementById("edit_actividad_fase_select").value);
    const nombre = document.getElementById("edit_actividad_nombre").value;
    const descripcion = document.getElementById("edit_actividad_descripcion").value;
    const actividad = { fase_id, nombre, descripcion };
    try {
        const res = await fetch(`/actividades/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(actividad)
        });
        const data = await res.json();
        alert("Actividad actualizada: " + data.mensaje);
        cancelEditActividad();
    } catch (error) {
        handleError("Error al actualizar la actividad", error);
    }
});

// -------------------------------------------------------------------
// TAREAS
// -------------------------------------------------------------------
document.getElementById("tareaForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const actividadId = document.getElementById("tarea_actividad_select").value;
    const responsableId = document.getElementById("tarea_responsable_select").value;
    const tarea = {
        actividad_id: parseInt(actividadId),
        nombre: document.getElementById("tarea_nombre").value,
        descripcion: document.getElementById("tarea_descripcion").value,
        fecha_inicio: document.getElementById("tarea_fecha_inicio").value,
        fecha_fin: document.getElementById("tarea_fecha_fin").value,
        fecha_actualizacion: document.getElementById("tarea_fecha_actualizacion").value,
        observacion: document.getElementById("tarea_observacion").value,
        avance: parseInt(document.getElementById("tarea_avance").value) || 0,
        responsable_id: parseInt(responsableId) || null
    };
    try {
        const res = await fetch("/tareas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tarea)
        });
        const data = await res.json();
        alert("Tarea creada con ID: " + data.id);
        document.getElementById("tareaForm").reset();
    } catch (error) {
        handleError("Error al crear la tarea", error);
    }
});

document.getElementById("loadTareas").addEventListener("click", async () => {
    const actividadId = document.getElementById("tarea_actividad_filter").value;
    if (!actividadId) {
        alert("Selecciona una actividad para ver sus tareas.");
        return;
    }
    try {
        const res = await fetch(`/tareas/${actividadId}`);
        const tareas = await res.json();
        const list = document.getElementById("tareaList");
        list.innerHTML = "";
        tareas.forEach(t => {
            const li = document.createElement("li");
            li.innerHTML = `
        <strong>ID:</strong> ${t.id} <br>
        <strong>Nombre:</strong> ${t.nombre} <br>
        <strong>Descripción:</strong> ${t.descripcion || "N/A"} <br>
        <strong>Responsable ID:</strong> ${t.responsable_id || "N/A"} <br>
        <strong>Fecha inicio:</strong> ${t.fecha_inicio || "N/A"} <br>
        <strong>Fecha fin:</strong> ${t.fecha_fin || "N/A"} <br>
        <strong>Actualización:</strong> ${t.fecha_actualizacion || "N/A"} <br>
        <strong>Observación:</strong> ${t.observacion || "N/A"} <br>
        <strong>Avance:</strong> ${t.avance || 0}%
        <button class="edit-btn btn" onclick="showEditTarea(${t.id}, ${t.actividad_id}, '${t.nombre}', '${t.descripcion || ""}', '${t.responsable_id || ""}', '${t.fecha_inicio || ""}', '${t.fecha_fin || ""}', '${t.fecha_actualizacion || ""}', '${t.observacion || ""}', ${t.avance || 0})">Editar</button>
        <button class="delete-btn btn" onclick="deleteTarea(${t.id}, ${actividadId})">Eliminar</button>
      `;
            list.appendChild(li);
        });
    } catch (error) {
        handleError("Error al cargar tareas", error);
    }
});

async function deleteTarea(tareaId, actividadId) {
    if (confirm("¿Eliminar tarea con ID " + tareaId + "?")) {
        try {
            const res = await fetch(`/tareas/${tareaId}`, { method: "DELETE" });
            const data = await res.json();
            alert(data.mensaje);
            const res2 = await fetch(`/tareas/${actividadId}`);
            const tareas = await res2.json();
            const list = document.getElementById("tareaList");
            list.innerHTML = "";
            tareas.forEach(t => {
                const li = document.createElement("li");
                li.innerHTML = `
          <strong>ID:</strong> ${t.id} <br>
          <strong>Nombre:</strong> ${t.nombre} <br>
          <strong>Descripción:</strong> ${t.descripcion || "N/A"} <br>
          <strong>Responsable ID:</strong> ${t.responsable_id || "N/A"} <br>
          <strong>Fecha inicio:</strong> ${t.fecha_inicio || "N/A"} <br>
          <strong>Fecha fin:</strong> ${t.fecha_fin || "N/A"} <br>
          <strong>Actualización:</strong> ${t.fecha_actualizacion || "N/A"} <br>
          <strong>Observación:</strong> ${t.observacion || "N/A"} <br>
          <strong>Avance:</strong> ${t.avance || 0}%
          <button class="edit-btn btn" onclick="showEditTarea(${t.id}, ${t.actividad_id}, '${t.nombre}', '${t.descripcion || ""}', '${t.responsable_id || ""}', '${t.fecha_inicio || ""}', '${t.fecha_fin || ""}', '${t.fecha_actualizacion || ""}', '${t.observacion || ""}', ${t.avance || 0})">Editar</button>
          <button class="delete-btn btn" onclick="deleteTarea(${t.id}, ${actividadId})">Eliminar</button>
        `;
                list.appendChild(li);
            });
        } catch (error) {
            handleError("Error al eliminar la tarea", error);
        }
    }
}

function showEditTarea(id, actividad_id, nombre, descripcion, responsable_id, fecha_inicio, fecha_fin, fecha_actualizacion, observacion, avance) {
    document.getElementById("edit_tarea_id").value = id;
    document.getElementById("edit_tarea_nombre").value = nombre;
    document.getElementById("edit_tarea_descripcion").value = descripcion;
    // Se usa el dropdown para responsables en lugar de input de texto:
    document.getElementById("edit_tarea_responsable_select").value = responsable_id;
    document.getElementById("edit_tarea_fecha_inicio").value = fecha_inicio;
    document.getElementById("edit_tarea_fecha_fin").value = fecha_fin;
    document.getElementById("edit_tarea_fecha_actualizacion").value = fecha_actualizacion;
    document.getElementById("edit_tarea_observacion").value = observacion;
    document.getElementById("edit_tarea_avance").value = avance;
    document.getElementById("editTareaContainer").classList.remove("hidden");
    loadActividadesIntoSelect("edit_tarea_actividad_select").then(() => {
        document.getElementById("edit_tarea_actividad_select").value = actividad_id;
    });
    loadResponsablesIntoSelect("edit_tarea_responsable_select").then(() => {
        document.getElementById("edit_tarea_responsable_select").value = responsable_id;
    });
}

function cancelEditTarea() {
    document.getElementById("editTareaContainer").classList.add("hidden");
    document.getElementById("editTareaForm").reset();
}

document.getElementById("editTareaForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit_tarea_id").value;
    const tarea = {
        actividad_id: parseInt(document.getElementById("edit_tarea_actividad_select").value),
        nombre: document.getElementById("edit_tarea_nombre").value,
        descripcion: document.getElementById("edit_tarea_descripcion").value,
        responsable_id: parseInt(document.getElementById("edit_tarea_responsable_select").value) || null,
        fecha_inicio: document.getElementById("edit_tarea_fecha_inicio").value,
        fecha_fin: document.getElementById("edit_tarea_fecha_fin").value,
        fecha_actualizacion: document.getElementById("edit_tarea_fecha_actualizacion").value,
        observacion: document.getElementById("edit_tarea_observacion").value,
        avance: parseInt(document.getElementById("edit_tarea_avance").value) || 0
    };
    try {
        const res = await fetch(`/tareas/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tarea)
        });
        const data = await res.json();
        alert("Tarea actualizada: " + data.mensaje);
        cancelEditTarea();
    } catch (error) {
        handleError("Error al actualizar la tarea", error);
    }
});

// -------------------------------------------------------------------
// RESPONSABLES
// -------------------------------------------------------------------
document.getElementById("responsableForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const responsable = {
        cedula: document.getElementById("r_cedula").value,
        nombre: document.getElementById("r_nombre").value,
        correo: document.getElementById("r_correo").value
    };
    try {
        const res = await fetch("/responsables", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(responsable)
        });
        const data = await res.json();
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            alert("Responsable creado con ID: " + data.id);
            document.getElementById("responsableForm").reset();
            loadResponsables();
            loadResponsablesIntoSelect("tarea_responsable_select");
        }
    } catch (error) {
        console.error("Error al crear responsable:", error);
    }
});

document.getElementById("loadResponsables").addEventListener("click", loadResponsables);
async function loadResponsables() {
    try {
        const res = await fetch("/responsables");
        const responsables = await res.json();
        const list = document.getElementById("responsableList");
        list.innerHTML = "";
        responsables.forEach(r => {
            const li = document.createElement("li");
            li.innerHTML = `
        <strong>ID:</strong> ${r.id} <br>
        <strong>Cédula:</strong> ${r.cedula} <br>
        <strong>Nombre:</strong> ${r.nombre} <br>
        <strong>Correo:</strong> ${r.correo}
        <button class="edit-btn btn" onclick="showEditResponsable(${r.id}, '${r.cedula}', '${r.nombre}', '${r.correo}')">Editar</button>
        <button class="delete-btn btn" onclick="deleteResponsable(${r.id})">Eliminar</button>
      `;
            list.appendChild(li);
        });
    } catch (error) {
        console.error("Error al cargar responsables:", error);
    }
}

async function deleteResponsable(id) {
    if (confirm("¿Eliminar responsable con ID " + id + "?")) {
        try {
            const res = await fetch(`/responsables/${id}`, { method: "DELETE" });
            const data = await res.json();
            alert(data.mensaje || data.error);
            loadResponsables();
            loadResponsablesIntoSelect("tarea_responsable_select");
        } catch (error) {
            console.error("Error al eliminar responsable:", error);
        }
    }
}

function showEditResponsable(id, cedula, nombre, correo) {
    document.getElementById("edit_responsable_id").value = id;
    document.getElementById("edit_r_cedula").value = cedula;
    document.getElementById("edit_r_nombre").value = nombre;
    document.getElementById("edit_r_correo").value = correo;
    document.getElementById("editResponsableContainer").classList.remove("hidden");
}

function cancelEditResponsable() {
    document.getElementById("editResponsableContainer").classList.add("hidden");
    document.getElementById("editResponsableForm").reset();
}

document.getElementById("editResponsableForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit_responsable_id").value;
    const responsable = {
        cedula: document.getElementById("edit_r_cedula").value,
        nombre: document.getElementById("edit_r_nombre").value,
        correo: document.getElementById("edit_r_correo").value
    };
    try {
        const res = await fetch(`/responsables/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(responsable)
        });
        const data = await res.json();
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            alert(data.mensaje);
            cancelEditResponsable();
            loadResponsables();
            loadResponsablesIntoSelect("tarea_responsable_select");
        }
    } catch (error) {
        console.error("Error al actualizar responsable:", error);
    }
});

// -------------------------------------------------------------------
// CARGAR DROPDOWNS AL INICIAR
// -------------------------------------------------------------------
window.addEventListener("load", () => {
    loadProjectsIntoSelect("fase_proyecto_select");
    loadProjectsIntoSelect("fase_proyecto_filter");
    loadFasesIntoSelect("actividad_fase_select");
    loadFasesIntoSelect("actividad_fase_filter");
    loadActividadesIntoSelect("tarea_actividad_select");
    loadActividadesIntoSelect("tarea_actividad_filter");
    loadResponsablesIntoSelect("tarea_responsable_select");
});
