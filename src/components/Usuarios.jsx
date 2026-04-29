import { useState } from "react";
import { ALL_POINTS, ROLES_CFG, ZONAS } from "../constants/data";

// ── Badge de rol ───────────────────────────────────────────────────────────────
function RolBadge({ rol }) {
  const cfg = ROLES_CFG[rol] || { color: "#6b7280", bg: "#f3f4f6", icon: "👤" };
  return (
    <span
      className="badge rounded-pill d-inline-flex align-items-center gap-1 fw-bold"
      style={{ background: cfg.bg, color: cfg.color, fontSize: 11, padding: "4px 10px" }}
    >
      {cfg.icon} {rol}
    </span>
  );
}

// ── Toggle switch Bootstrap ────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <div className="form-check form-switch mb-0">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ width: 40, height: 22, cursor: "pointer" }}
      />
    </div>
  );
}

const EMPTY_FORM = { nombre: "", email: "", telefono: "", rol: "Reciclador", zona: "", puntoAsignado: "", activo: true };

const rolDesc = {
  "Admin":      "Acceso total al sistema, puede gestionar usuarios y configuración.",
  "Encargado":  "Gestiona un punto de recolección, valida entregas y reportes.",
  "Reciclador": "Usuario que registra entregas y acumula puntos.",
  "Validador":  "Revisa y aprueba las entregas registradas por los recicladores.",
  "Empresa":    "Empresa o comercio que ofrece recompensas y beneficios.",
};

export default function Usuarios({ state, dispatch, showToast }) {
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [errors,    setErrors]    = useState({});
  const [search,    setSearch]    = useState("");
  const [filterRol, setFilterRol] = useState("Todos");
  const [viewUser,  setViewUser]  = useState(null);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

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
        telefono: form.telefono.trim(), rol: form.rol, zona: form.zona,
        puntoAsignado: form.puntoAsignado, pts: 0, activo: form.activo, av: initials,
        fechaAlta: new Date().toLocaleDateString("es-CO"),
      },
    });
    showToast(`✅ Usuario "${form.nombre.trim()}" creado`);
    setModal(false); setForm(EMPTY_FORM); setErrors({});
  };

  const cerrarModal = () => { setModal(false); setForm(EMPTY_FORM); setErrors({}); };

  const filtered = state.usuarios.filter(u => {
    const q = search.toLowerCase();
    const matchQ = u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.zona || "").toLowerCase().includes(q);
    const matchR = filterRol === "Todos" || u.rol === filterRol;
    return matchQ && matchR;
  });

  const totalActivos = state.usuarios.filter(u => u.activo).length;
  const avatarPreview = form.nombre.trim().split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "?";

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">👥 Gestión de usuarios</h4>
        <button className="btn btn-success rounded-3" onClick={() => setModal(true)}>
          <i className="bi bi-person-plus me-1"></i> Nuevo usuario
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          ["👥", "Total usuarios",  state.usuarios.length,                               "text-dark"],
          ["✅", "Activos",          totalActivos,                                        "text-success"],
          ["⏸️", "Inactivos",        state.usuarios.length - totalActivos,                "text-secondary"],
          ["🛡️", "Admins",           state.usuarios.filter(u => u.rol === "Admin").length, "text-primary"],
        ].map(([ic, lb, val, col]) => (
          <div key={lb} className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body py-3 px-3">
                <div className="fs-5 mb-1">{ic}</div>
                <div className="text-muted mb-1" style={{ fontSize: 11 }}>{lb}</div>
                <div className={`fw-bold ${col}`} style={{ fontSize: 24 }}>{val}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Buscador + filtros */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <div className="input-group" style={{ maxWidth: 340 }}>
          <span className="input-group-text bg-white border-end-0 rounded-start-3">🔍</span>
          <input
            className="form-control border-start-0 rounded-end-3"
            placeholder="Buscar por nombre, correo o zona..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: 13 }}
          />
        </div>
        <div className="btn-group">
          {["Todos", ...Object.keys(ROLES_CFG)].map(r => (
            <button
              key={r}
              className={`btn btn-sm ${filterRol === r ? "btn-success" : "btn-outline-secondary"}`}
              onClick={() => setFilterRol(r)}
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="card shadow-sm overflow-hidden p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
            <thead className="table-light">
              <tr>
                {["Usuario", "Email", "Rol", "Zona", "Puntos", "Estado", "Acciones"].map(h => (
                  <th key={h} className="text-uppercase text-muted fw-semibold border-0" style={{ padding: "10px 16px", fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    <div className="fs-2 mb-2">👤</div>
                    Sin usuarios que coincidan
                  </td>
                </tr>
              ) : filtered.map(u => (
                <tr key={u.id} style={{ opacity: u.activo ? 1 : 0.55, transition: ".15s" }}>
                  {/* Usuario */}
                  <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0 ${u.activo ? "bg-success-subtle text-success border border-success" : "bg-light text-secondary border"}`}
                        style={{ width: 34, height: 34, fontSize: 11 }}
                      >
                        {u.av}
                      </div>
                      <div>
                        <div className="fw-bold">{u.nombre}</div>
                        {u.fechaAlta && <div className="text-muted" style={{ fontSize: 10 }}>Alta: {u.fechaAlta}</div>}
                      </div>
                    </div>
                  </td>
                  {/* Email */}
                  <td className="text-secondary align-middle" style={{ padding: "12px 16px" }}>{u.email}</td>
                  {/* Rol */}
                  <td className="align-middle" style={{ padding: "12px 16px" }}><RolBadge rol={u.rol} /></td>
                  {/* Zona */}
                  <td className="text-secondary align-middle" style={{ padding: "12px 16px", fontSize: 12 }}>{u.zona || "—"}</td>
                  {/* Puntos */}
                  <td className="fw-bold text-success align-middle" style={{ padding: "12px 16px" }}>{u.pts.toLocaleString()}</td>
                  {/* Estado */}
                  <td className="align-middle" style={{ padding: "12px 16px" }}>
                    <Toggle
                      checked={u.activo}
                      onChange={() => dispatch({ type: "TOGGLE_USER", payload: u.id })}
                    />
                  </td>
                  {/* Acciones */}
                  <td className="align-middle" style={{ padding: "12px 16px" }}>
                    <div className="d-flex gap-1">
                      <button
                        title="Ver detalle"
                        className="btn btn-success btn-sm rounded-2 p-0 d-flex align-items-center justify-content-center"
                        style={{ width: 30, height: 30, fontSize: 13 }}
                        onClick={() => setViewUser(u)}
                      >
                        👁
                      </button>
                      <button
                        title="Eliminar"
                        className="btn btn-outline-danger btn-sm rounded-2 p-0 d-flex align-items-center justify-content-center"
                        style={{ width: 30, height: 30, fontSize: 13 }}
                        onClick={() => {
                          dispatch({ type: "DEL_USER", payload: u.id });
                          showToast("🗑️ Usuario eliminado", "error");
                          if (viewUser?.id === u.id) setViewUser(null);
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal detalle */}
      {viewUser && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.45)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg p-2">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Detalle de usuario</h5>
                <button type="button" className="btn-close" onClick={() => setViewUser(null)} />
              </div>
              <div className="modal-body text-center">
                <div
                  className="rounded-circle bg-success-subtle border border-success d-flex align-items-center justify-content-center fw-bold text-success mx-auto mb-3"
                  style={{ width: 64, height: 64, fontSize: 22, borderWidth: 3 }}
                >
                  {viewUser.av}
                </div>
                <div className="fw-bold fs-5">{viewUser.nombre}</div>
                <div className="text-muted small mt-1">{viewUser.email}</div>
                <div className="mt-2"><RolBadge rol={viewUser.rol} /></div>
              </div>
              <div className="row g-2 mx-3 mb-3">
                {[
                  ["📍 Zona",     viewUser.zona       || "Sin asignar"],
                  ["📞 Teléfono", viewUser.telefono   || "Sin registrar"],
                  ["⭐ Puntos",   `${viewUser.pts.toLocaleString()} pts`],
                  ["📅 Alta",     viewUser.fechaAlta  || "—"],
                  ["🏪 Punto",    viewUser.puntoAsignado || "Sin asignar"],
                  ["Estado",      viewUser.activo ? "🟢 Activo" : "⚪ Inactivo"],
                ].map(([l, v]) => (
                  <div key={l} className="col-6">
                    <div className="bg-light rounded-3 p-2">
                      <div className="text-muted mb-1" style={{ fontSize: 11 }}>{l}</div>
                      <div className="fw-bold small">{v}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-secondary rounded-3 w-100" onClick={() => setViewUser(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal nuevo usuario */}
      {modal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.45)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg p-2" style={{ maxHeight: "90vh", overflowY: "auto" }}>
              <div className="modal-header border-0">
                <div>
                  <h5 className="modal-title fw-bold text-success">👤 Nuevo usuario</h5>
                  <div className="text-muted" style={{ fontSize: 12 }}>Completa la información para registrar un nuevo usuario.</div>
                </div>
                <button type="button" className="btn-close" onClick={cerrarModal} />
              </div>

              <div className="modal-body">
                {/* Avatar preview */}
                <div className="text-center mb-3">
                  <div
                    className="rounded-circle bg-success-subtle border border-success d-flex align-items-center justify-content-center fw-bold text-success mx-auto"
                    style={{ width: 56, height: 56, fontSize: 18 }}
                  >
                    {avatarPreview}
                  </div>
                </div>

                <div className="row g-3">
                  {/* Nombre */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Nombre completo *</label>
                    <input
                      value={form.nombre}
                      onChange={e => set("nombre", e.target.value)}
                      placeholder="Ej: Carlos Ruiz"
                      className={`form-control form-control-sm bg-light ${errors.nombre ? "is-invalid" : ""}`}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>
                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Correo electrónico *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className={`form-control form-control-sm bg-light ${errors.email ? "is-invalid" : ""}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  {/* Teléfono */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Teléfono</label>
                    <input
                      value={form.telefono}
                      onChange={e => set("telefono", e.target.value)}
                      placeholder="Ej: 300 123 4567"
                      className="form-control form-control-sm bg-light"
                    />
                  </div>
                  {/* Rol */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Tipo / Rol *</label>
                    <select
                      value={form.rol}
                      onChange={e => set("rol", e.target.value)}
                      className="form-select form-select-sm bg-light"
                    >
                      {Object.keys(ROLES_CFG).map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>

                  {/* Descripción rol */}
                  {form.rol && (
                    <div className="col-12">
                      <div
                        className="rounded-3 p-3 small fw-semibold"
                        style={{ background: ROLES_CFG[form.rol]?.bg || "#dcfce7", color: ROLES_CFG[form.rol]?.color || "#16a34a" }}
                      >
                        {ROLES_CFG[form.rol]?.icon} {rolDesc[form.rol]}
                      </div>
                    </div>
                  )}

                  {/* Zona */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Zona</label>
                    <select
                      value={form.zona}
                      onChange={e => set("zona", e.target.value)}
                      className="form-select form-select-sm bg-light"
                    >
                      <option value="">Sin zona</option>
                      {ZONAS.map(z => <option key={z}>{z}</option>)}
                    </select>
                  </div>
                  {/* Punto */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Punto asignado</label>
                    <select
                      value={form.puntoAsignado}
                      onChange={e => set("puntoAsignado", e.target.value)}
                      className="form-select form-select-sm bg-light"
                    >
                      <option value="">Sin asignar</option>
                      {ALL_POINTS.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                  </div>

                  {/* Estado inicial */}
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light">
                      <div>
                        <div className="fw-bold small">Estado inicial</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>El usuario podrá acceder de inmediato si está activo</div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`small fw-semibold ${form.activo ? "text-success" : "text-secondary"}`}>
                          {form.activo ? "Activo" : "Inactivo"}
                        </span>
                        <Toggle checked={form.activo} onChange={v => set("activo", v)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 gap-2">
                <button className="btn btn-secondary rounded-3 flex-fill" onClick={cerrarModal}>Cancelar</button>
                <button className="btn btn-success rounded-3 flex-fill" onClick={guardar}>✅ Crear usuario</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { RolBadge };