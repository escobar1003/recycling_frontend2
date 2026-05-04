import { useState } from "react";
import { ZONAS, ALL_POINTS } from "../constants/data";
import { getRolCfg, Toggle, rolDesc, ModalDetalle, TablaUsuarios } from "./UserShared";

const EMPTY_FORM = {
  nombre: "", email: "", telefono: "",
  rol: "Encargado", zona: "", puntoAsignado: "", activo: true,
};

export default function Encargados({ state, dispatch, showToast }) {
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [errors,   setErrors]   = useState({});
  const [search,   setSearch]   = useState("");
  const [viewUser, setViewUser] = useState(null);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const encargados = state.usuarios.filter(u => u.rol === "Encargado");

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.email.trim())  e.email  = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido";
    else if (state.usuarios.some(u => u.email === form.email.trim())) e.email = "Este correo ya existe";
    return e;
  };

  const guardar = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const initials = form.nombre.trim().split(" ").slice(0, 2).map(w => w[0].toUpperCase()).join("");
    dispatch({
      type: "ADD_USER",
      payload: {
        id:            Date.now(),
        nombre:        form.nombre.trim(),
        email:         form.email.trim(),
        telefono:      form.telefono.trim(),
        rol:           "Encargado",
        zona:          form.zona,
        puntoAsignado: form.puntoAsignado,
        pts:           0,
        activo:        form.activo,
        av:            initials,
        fechaAlta:     new Date().toLocaleDateString("es-CO"),
      },
    });

    showToast(`Encargado "${form.nombre.trim()}" registrado`);
    setModal(false); setForm(EMPTY_FORM); setErrors({});
  };

  const cerrarModal = () => { setModal(false); setForm(EMPTY_FORM); setErrors({}); };

  const handleToggle = (id, nombre, estadoActual) => {
    dispatch({ type: "TOGGLE_USER", payload: id });
    showToast(
      estadoActual ? `${nombre} ha sido desactivado` : `${nombre} ha sido activado`,
      estadoActual ? "error" : "success"
    );
  };

  const handleSave = (updatedUser) => {
    dispatch({ type: "UPDATE_USER", payload: updatedUser });
  };

  const handleEliminar = (id) => {
    dispatch({ type: "DEL_USER", payload: id });
    showToast("Encargado eliminado", "error");
    if (viewUser?.id === id) setViewUser(null);
  };

  const filtered = encargados.filter(u => {
    const q = search.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.zona || "").toLowerCase().includes(q) ||
      (u.puntoAsignado || "").toLowerCase().includes(q)
    );
  });

  const avatarPreview = form.nombre.trim().split(" ").slice(0, 2)
    .map(w => w[0]?.toUpperCase() || "").join("") || "?";

  const cfg = getRolCfg("Encargado");

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">
          <i className="bi bi-shop me-2 text-success"></i>Gestion de encargados
        </h4>
        <button className="btn btn-success fw-semibold" onClick={() => setModal(true)}>
          <i className="bi bi-person-badge me-1"></i> Nuevo encargado
        </button>
      </div>

      {/* Buscador */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <div className="input-group w-auto">
          <span className="input-group-text bg-white">
            <i className="bi bi-search"></i>
          </span>
          <input
            className="form-control"
            placeholder="Buscar por nombre, correo, zona o punto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span className="badge bg-success-subtle text-success border border-success rounded-pill align-self-center px-3 py-2">
          {encargados.length} encargado{encargados.length !== 1 ? "s" : ""} registrado{encargados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tabla */}
      <TablaUsuarios
        lista={filtered}
        onToggle={handleToggle}
        onVer={setViewUser}
        onEliminar={handleEliminar}
      />

      {/* Modal editar */}
      <ModalDetalle
        user={viewUser}
        onClose={() => setViewUser(null)}
        onSave={handleSave}
        showToast={showToast}
      />

      {/* Modal nuevo encargado */}
      {modal && (
        <div className="modal d-block" style={{background:"rgba(0,0,0,.45)",zIndex:9000}}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border shadow-lg">

              {/* Header */}
              <div className="modal-header bg-success-subtle border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-white border border-success d-flex align-items-center justify-content-center fw-bold text-success flex-shrink-0 fs-5 p-3">
                    {avatarPreview}
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold mb-0 text-success">
                      <i className="bi bi-shop me-1"></i> Nuevo encargado
                    </h5>
                    <div className="small text-success opacity-75 mt-1">
                      Responsable de un punto de recoleccion
                    </div>
                  </div>
                </div>
                <button type="button" className="btn-close ms-auto" onClick={cerrarModal} />
              </div>

              <div className="modal-body">
                <p className="text-uppercase fw-bold text-muted mb-2 small">
                  <i className="bi bi-person me-1"></i> Informacion personal
                </p>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Nombre completo *</label>
                    <input
                      value={form.nombre}
                      onChange={e => set("nombre", e.target.value)}
                      placeholder="Ej: Maria Lopez"
                      className={`form-control form-control-sm bg-light ${errors.nombre ? "is-invalid" : ""}`}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Correo electronico *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className={`form-control form-control-sm bg-light ${errors.email ? "is-invalid" : ""}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Telefono</label>
                    <input
                      value={form.telefono}
                      onChange={e => set("telefono", e.target.value)}
                      placeholder="Ej: 300 123 4567"
                      className="form-control form-control-sm bg-light"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Zona</label>
                    <select value={form.zona} onChange={e => set("zona", e.target.value)}
                      className="form-select form-select-sm bg-light">
                      <option value="">Sin zona</option>
                      {ZONAS.map(z => <option key={z}>{z}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-secondary">Punto de recoleccion asignado</label>
                    <select value={form.puntoAsignado} onChange={e => set("puntoAsignado", e.target.value)}
                      className="form-select form-select-sm bg-light">
                      <option value="">Sin asignar</option>
                      {ALL_POINTS.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Info rol */}
                <div className="alert alert-success small fw-semibold mb-3">
                  <i className="bi bi-info-circle me-1"></i> {rolDesc["Encargado"]}
                </div>

                {/* Estado */}
                <div className="d-flex align-items-center justify-content-between p-3 rounded bg-light border">
                  <div>
                    <div className="fw-bold small">Estado inicial</div>
                    <div className="text-muted small">El encargado podra gestionar su punto si esta activo</div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`small fw-semibold ${form.activo ? "text-success" : "text-secondary"}`}>
                      {form.activo ? "Activo" : "Inactivo"}
                    </span>
                    <Toggle checked={form.activo} onChange={v => set("activo", v)} />
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top gap-2">
                <button className="btn btn-outline-secondary flex-fill" onClick={cerrarModal}>
                  <i className="bi bi-x-lg me-1"></i> Cancelar
                </button>
                <button className="btn btn-success flex-fill fw-bold" onClick={guardar}>
                  <i className="bi bi-shop me-1"></i> Registrar encargado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}