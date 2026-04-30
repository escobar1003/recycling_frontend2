// ── Componentes compartidos ────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { ALL_POINTS, ZONAS, ROLES_CFG } from "../constants/data";

export const rolDesc = {
  "Admin":     "Acceso total al sistema, puede gestionar usuarios y configuración.",
  "Usuario":   "Usuario que registra entregas y acumula puntos de reciclaje.",
  "Afiliado":  "Empresa, supermercado o entidad aliada que ofrece beneficios y recompensas.",
  "Encargado": "Responsable designado por un afiliado para gestionar su punto de recolección.",
};

const ROL_DEFAULTS = {
  "Admin":     { color: "#1e40af", bg: "#dbeafe", icon: "🛡️" },
  "Usuario":   { color: "#16a34a", bg: "#dcfce7", icon: "♻️" },
  "Afiliado":  { color: "#b45309", bg: "#fef3c7", icon: "🏪" },
  "Encargado": { color: "#7c3aed", bg: "#ede9fe", icon: "🔑" },
};

export function getRolCfg(rol) {
  return ROLES_CFG?.[rol] || ROL_DEFAULTS[rol] || { color: "#6b7280", bg: "#f3f4f6", icon: "👤" };
}

// ── Badge de rol ───────────────────────────────────────────────────────────────
export function RolBadge({ rol }) {
  const cfg = getRolCfg(rol);
  return (
    <span
      className="badge rounded-pill d-inline-flex align-items-center gap-1 fw-bold"
      style={{ background: cfg.bg, color: cfg.color, fontSize: 11, padding: "4px 10px" }}
    >
      {cfg.icon} {rol}
    </span>
  );
}

// ── Toggle switch — Bootstrap nativo ──────────────────────────────────────────
export function Toggle({ checked, onChange }) {
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

// ── Modal editable (reemplaza ModalDetalle) ────────────────────────────────────
// Props: user, onClose, onSave(updatedUser), showToast
export function ModalDetalle({ user, onClose, onSave, showToast }) {
  const [form,   setForm]   = useState(null);
  const [errors, setErrors] = useState({});

  // Sincronizar form cuando cambia el usuario abierto
  useEffect(() => {
    if (user) {
      setForm({ ...user });
      setErrors({});
    }
  }, [user]);

  if (!user || !form) return null;

  const cfg = getRolCfg(user.rol);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const avatarPreview = (form.nombre || "")
    .trim().split(" ").slice(0, 2)
    .map(w => w[0]?.toUpperCase() || "").join("") || "?";

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.email.trim())  e.email  = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido";
    if (form.pts !== "" && isNaN(Number(form.pts))) e.pts = "Debe ser un número válido";
    return e;
  };

  const guardar = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const updatedUser = {
      ...form,
      nombre: form.nombre.trim(),
      email:  form.email.trim(),
      pts:    Number(form.pts) || 0,
      av:     form.nombre.trim().split(" ").slice(0, 2).map(w => w[0].toUpperCase()).join(""),
    };
    if (onSave) onSave(updatedUser);
    if (showToast) showToast(`✅ ${updatedUser.nombre} actualizado correctamente`);
    onClose();
  };

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)", zIndex: 9000 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content rounded-4 border-0 shadow-lg">

          {/* ── Header coloreado por rol ── */}
          <div
            className="modal-header border-0 rounded-top-4 px-4 pt-4 pb-3"
            style={{ background: cfg.bg }}
          >
            <div className="d-flex align-items-center gap-3 w-100">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                style={{
                  width: 56, height: 56, fontSize: 20,
                  background: "#fff", color: cfg.color,
                  border: `3px solid ${cfg.color}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,.12)",
                }}
              >
                {avatarPreview}
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0" style={{ color: cfg.color }}>
                  {cfg.icon} Editar {user.rol}
                </h5>
                <div className="small mt-1" style={{ color: cfg.color, opacity: 0.75 }}>
                  Modifica los datos y guarda los cambios
                </div>
              </div>
            </div>
            <button type="button" className="btn-close ms-3" onClick={onClose} />
          </div>

          {/* ── Body ── */}
          <div className="modal-body px-4 py-3">

            {/* Sección: Información personal */}
            <p className="text-uppercase fw-bold text-muted mb-2" style={{ fontSize: 11, letterSpacing: 1 }}>
              📋 Información personal
            </p>
            <div className="row g-3 mb-4">

              {/* Nombre de entidad — solo Afiliados */}
              {user.rol === "Afiliado" && (
                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary mb-1">
                    Nombre de la entidad / empresa
                  </label>
                  <input
                    className="form-control form-control-sm bg-light rounded-3"
                    value={form.nombreEntidad || ""}
                    onChange={e => set("nombreEntidad", e.target.value)}
                    placeholder="Ej: Supermercado La 14"
                  />
                </div>
              )}

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-secondary mb-1">
                  {user.rol === "Afiliado" ? "Nombre del contacto *" : "Nombre completo *"}
                </label>
                <input
                  className={`form-control form-control-sm bg-light rounded-3 ${errors.nombre ? "is-invalid" : ""}`}
                  value={form.nombre}
                  onChange={e => set("nombre", e.target.value)}
                  placeholder="Ej: Carlos Ruiz"
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-secondary mb-1">Correo electrónico *</label>
                <input
                  type="email"
                  className={`form-control form-control-sm bg-light rounded-3 ${errors.email ? "is-invalid" : ""}`}
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-secondary mb-1">Teléfono</label>
                <input
                  className="form-control form-control-sm bg-light rounded-3"
                  value={form.telefono || ""}
                  onChange={e => set("telefono", e.target.value)}
                  placeholder="Ej: 300 123 4567"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-secondary mb-1">Zona</label>
                <select
                  className="form-select form-select-sm bg-light rounded-3"
                  value={form.zona || ""}
                  onChange={e => set("zona", e.target.value)}
                >
                  <option value="">Sin zona</option>
                  {ZONAS.map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
            </div>

            {/* Sección: Asignación y puntos */}
            <p className="text-uppercase fw-bold text-muted mb-2" style={{ fontSize: 11, letterSpacing: 1 }}>
              📍 Asignación y puntos
            </p>
            <div className="row g-3 mb-4">
              <div className="col-md-8">
                <label className="form-label fw-semibold small text-secondary mb-1">Punto asignado</label>
                <select
                  className="form-select form-select-sm bg-light rounded-3"
                  value={form.puntoAsignado || ""}
                  onChange={e => set("puntoAsignado", e.target.value)}
                >
                  <option value="">Sin asignar</option>
                  {ALL_POINTS.map(p => <option key={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold small text-secondary mb-1">⭐ Puntos acumulados</label>
                <div className="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    className={`form-control bg-light rounded-start-3 ${errors.pts ? "is-invalid" : ""}`}
                    value={form.pts ?? 0}
                    onChange={e => set("pts", e.target.value)}
                  />
                  <span className="input-group-text rounded-end-3 bg-success-subtle text-success fw-bold border-0">
                    pts
                  </span>
                  {errors.pts && <div className="invalid-feedback">{errors.pts}</div>}
                </div>
              </div>
            </div>

            {/* Sección: Estado */}
            <p className="text-uppercase fw-bold text-muted mb-2" style={{ fontSize: 11, letterSpacing: 1 }}>
              🔘 Estado del registro
            </p>
            <div
              className="d-flex align-items-center justify-content-between p-3 rounded-3 border"
              style={{ background: form.activo ? "#f0fdf4" : "#f9fafb", transition: ".2s" }}
            >
              <div>
                <div className="fw-bold small">Estado actual</div>
                <div className="text-muted" style={{ fontSize: 11 }}>
                  {form.activo
                    ? "Este registro está activo y puede operar normalmente."
                    : "Este registro está inactivo y no puede operar."}
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span
                  className={`badge rounded-pill fw-semibold ${form.activo ? "bg-success" : "bg-secondary"}`}
                  style={{ fontSize: 11, minWidth: 66 }}
                >
                  {form.activo ? "✅ Activo" : "⚫ Inactivo"}
                </span>
                <Toggle checked={form.activo} onChange={v => set("activo", v)} />
              </div>
            </div>

            {/* Info de solo lectura */}
            <div className="row g-2 mt-3">
              {[
                ["📅 Fecha de alta", user.fechaAlta || "—"],
                ["🪪 Rol",           user.rol],
              ].map(([l, v]) => (
                <div key={l} className="col-6">
                  <div className="bg-light rounded-3 p-2 border">
                    <div className="text-muted mb-1" style={{ fontSize: 10 }}>{l}</div>
                    <div className="fw-bold small">{v}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>{/* /modal-body */}

          {/* ── Footer ── */}
          <div className="modal-footer border-0 px-4 pb-4 pt-2 gap-2">
            <button className="btn btn-light border rounded-3 flex-fill" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn fw-bold rounded-3 flex-fill"
              style={{ background: cfg.color, color: "#fff" }}
              onClick={guardar}
            >
              {cfg.icon} Guardar cambios
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Tabla genérica — Toggle con toast integrado ────────────────────────────────
// onToggle recibe (id, nombre, estadoActual) para que el padre muestre el toast
export function TablaUsuarios({ lista, onToggle, onVer, onEliminar }) {
  if (lista.length === 0) {
    return (
      <div className="card shadow-sm p-0 overflow-hidden">
        <div className="text-center py-5 text-muted">
          <div className="fs-2 mb-2">👤</div>
          <div className="fw-semibold">Sin registros que coincidan</div>
          <div className="small mt-1">Intenta con otro término de búsqueda</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm overflow-hidden p-0">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0" style={{ fontSize: 13 }}>
          <thead className="table-light">
            <tr>
              {["Usuario", "Email", "Rol", "Zona", "Puntos", "Estado", "Acciones"].map(h => (
                <th key={h}
                  className="text-uppercase text-muted fw-semibold border-0"
                  style={{ padding: "10px 16px", fontSize: 11 }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lista.map(u => {
              const cfg = getRolCfg(u.rol);
              return (
                <tr key={u.id} style={{ opacity: u.activo ? 1 : 0.5, transition: ".2s" }}>

                  {/* Avatar + nombre */}
                  <td style={{ padding: "12px 16px" }}>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                        style={{
                          width: 34, height: 34, fontSize: 11,
                          background: u.activo ? cfg.bg : "#f3f4f6",
                          color:      u.activo ? cfg.color : "#9ca3af",
                          border: `1.5px solid ${u.activo ? cfg.color : "#d1d5db"}`,
                          transition: ".2s",
                        }}
                      >
                        {u.av}
                      </div>
                      <div>
                        <div className="fw-bold">{u.nombre}</div>
                        {u.fechaAlta && (
                          <div className="text-muted" style={{ fontSize: 10 }}>Alta: {u.fechaAlta}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="text-secondary" style={{ padding: "12px 16px" }}>{u.email}</td>
                  <td style={{ padding: "12px 16px" }}><RolBadge rol={u.rol} /></td>
                  <td className="text-secondary" style={{ padding: "12px 16px", fontSize: 12 }}>{u.zona || "—"}</td>
                  <td className="fw-bold text-success" style={{ padding: "12px 16px" }}>
                    {(u.pts || 0).toLocaleString()}
                  </td>

                  {/* Toggle con badge de estado */}
                  <td style={{ padding: "12px 16px" }}>
                    <div className="d-flex align-items-center gap-2">
                      <Toggle
                        checked={u.activo}
                        onChange={() => onToggle(u.id, u.nombre, u.activo)}
                      />
                      <span
                        className={`badge rounded-pill ${u.activo ? "bg-success" : "bg-secondary"}`}
                        style={{ fontSize: 10, minWidth: 58 }}
                      >
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </td>

                  {/* Acciones */}
                  <td style={{ padding: "12px 16px" }}>
                    <div className="d-flex gap-1">
                      <button
                        title="Editar"
                        className="btn btn-sm rounded-3 fw-semibold d-flex align-items-center gap-1"
                        style={{
                          fontSize: 11, padding: "4px 10px",
                          background: cfg.bg, color: cfg.color, border: "none",
                        }}
                        onClick={() => onVer(u)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        title="Eliminar"
                        className="btn btn-outline-danger btn-sm rounded-3 d-flex align-items-center justify-content-center"
                        style={{ width: 30, height: 30, fontSize: 13, padding: 0 }}
                        onClick={() => onEliminar(u.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}