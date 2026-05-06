import { useState } from "react";
import { ROLES_CFG, ZONAS, ALL_POINTS } from "../constants/data";
import { RolBadge, Toggle, rolDesc, ModalDetalle, TablaUsuarios } from "./UserShared";

const EMPTY_FORM = {
  nombre: "", email: "", telefono: "",
  rol: "Admin", activo: true,
};

export default function Administradores({ state, dispatch, showToast }) {
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [errors,   setErrors]   = useState({});
  const [search,   setSearch]   = useState("");
  const [viewUser, setViewUser] = useState(null);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const admins = state.usuarios.filter(u => u.rol === "Admin");

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
        id: Date.now(), nombre: form.nombre.trim(), email: form.email.trim(),
        telefono: form.telefono.trim(), rol: "Admin",
        pts: 0, activo: form.activo,
        av: initials, fechaAlta: new Date().toLocaleDateString("es-CO"),
      },
    });
    showToast(`✅ Administrador "${form.nombre.trim()}" creado`);
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

  const handleSave     = (u) => dispatch({ type: "UPDATE_USER", payload: u });

  const handleEliminar = (id) => {
    if (admins.length <= 1) { showToast("Debe existir al menos un administrador", "error"); return; }
    dispatch({ type: "DEL_USER", payload: id });
    showToast("Administrador eliminado", "error");
    if (viewUser?.id === id) setViewUser(null);
  };

  const filtered = admins.filter(u => {
    const q = search.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.zona || "").toLowerCase().includes(q)
    );
  });

  const avatarPreview = form.nombre.trim().split(" ").slice(0, 2)
    .map(w => w[0]?.toUpperCase() || "").join("") || "?";

  return (
    <div className="container-fluid px-0">

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-0 text-dark">
            <i className="bi bi-shield-lock me-2 text-success"></i>
            Gestión de administradores
          </h5>
          <small className="text-muted">
            {admins.length} administrador{admins.length !== 1 ? "es" : ""} registrado{admins.length !== 1 ? "s" : ""}
          </small>
        </div>
        <button
          className="btn btn-success btn-sm rounded-3 d-flex align-items-center gap-2"
          onClick={() => setModal(true)}
        >
          <i className="bi bi-person-plus"></i>
          Nuevo administrador
        </button>
      </div>

      {/* ── Buscador ── */}
      <div className="mb-3">
        <div className="input-group input-group-sm" style={{ maxWidth: 380 }}>
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-secondary"></i>
          </span>
          <input
            className="form-control border-start-0 rounded-end-3"
            placeholder="Buscar por nombre, correo o zona..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Tabla ── */}
      <div className="card border rounded-3 shadow-none">
        <div className="card-body p-0">
          <TablaUsuarios
            lista={filtered}
            onToggle={handleToggle}
            onVer={setViewUser}
            onEliminar={handleEliminar}
          />
        </div>
      </div>

      <ModalDetalle
        user={viewUser}
        onClose={() => setViewUser(null)}
        onSave={handleSave}
        showToast={showToast}
      />

      {/* ── Modal nuevo administrador ── */}
      {modal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.4)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow">

              {/* Header */}
              <div className="modal-header border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold bg-light border text-dark"
                    style={{ width: 44, height: 44, fontSize: 15 }}
                  >
                    {avatarPreview}
                  </div>
                  <div>
                    <h6 className="modal-title fw-bold mb-0 text-dark">
                      <i className="bi bi-shield-lock me-2 text-success"></i>
                      Nuevo administrador
                    </h6>
                    <small className="text-muted">Acceso total al sistema</small>
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={cerrarModal} />
              </div>

              {/* Body */}
              <div className="modal-body p-4">
                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      <i className="bi bi-person me-1 text-secondary"></i>Nombre completo *
                    </label>
                    <input
                      value={form.nombre}
                      onChange={e => set("nombre", e.target.value)}
                      placeholder="Ej: Ana García"
                      className={`form-control form-control-sm rounded-3 ${errors.nombre ? "is-invalid" : ""}`}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      <i className="bi bi-envelope me-1 text-secondary"></i>Correo electrónico *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      placeholder="admin@ejemplo.com"
                      className={`form-control form-control-sm rounded-3 ${errors.email ? "is-invalid" : ""}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      <i className="bi bi-telephone me-1 text-secondary"></i>Teléfono
                    </label>
                    <input
                      value={form.telefono}
                      onChange={e => set("telefono", e.target.value)}
                      placeholder="Ej: 300 123 4567"
                      className="form-control form-control-sm rounded-3"
                    />
                  </div>

                  

                  

                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light border">
                      <div>
                        <div className="small fw-semibold text-dark">Estado inicial</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>
                          El administrador podrá acceder si está activo
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge rounded-pill ${form.activo ? "bg-success" : "bg-secondary"}`}>
                          {form.activo ? "Activo" : "Inactivo"}
                        </span>
                        <Toggle checked={form.activo} onChange={v => set("activo", v)} />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer border-top gap-2">
                <button className="btn btn-outline-secondary btn-sm rounded-3 flex-fill" onClick={cerrarModal}>
                  <i className="bi bi-x me-1"></i>Cancelar
                </button>
                <button className="btn btn-success btn-sm rounded-3 flex-fill" onClick={guardar}>
                  <i className="bi bi-check-lg me-1"></i>Crear administrador
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}