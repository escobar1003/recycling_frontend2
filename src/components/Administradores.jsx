import { useState } from "react";
import { ROLES_CFG, ZONAS, ALL_POINTS } from "../constants/data";
import { RolBadge, Toggle, rolDesc, ModalDetalle, TablaUsuarios } from "./UserShared";

const EMPTY_FORM = {
  nombre: "", email: "", telefono: "",
  rol: "Admin", zona: "", puntoAsignado: "", activo: true,
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
        zona: form.zona, puntoAsignado: form.puntoAsignado,
        pts: 0, activo: form.activo,
        av: initials, fechaAlta: new Date().toLocaleDateString("es-CO"),
      },
    });
    showToast(`✅ Administrador "${form.nombre.trim()}" creado`);
    setModal(false); setForm(EMPTY_FORM); setErrors({});
  };

  const cerrarModal = () => { setModal(false); setForm(EMPTY_FORM); setErrors({}); };

  // ── Toggle con toast de activado/desactivado ──────────────────────────────
  const handleToggle = (id, nombre, estadoActual) => {
    dispatch({ type: "TOGGLE_USER", payload: id });
    showToast(
      estadoActual
        ? `🔴 ${nombre} ha sido desactivado`
        : `🟢 ${nombre} ha sido activado`,
      estadoActual ? "error" : "success"
    );
  };

  // ── Guardar cambios desde el modal de edición ─────────────────────────────
  const handleSave = (updatedUser) => {
    dispatch({ type: "UPDATE_USER", payload: updatedUser });
  };

  const handleEliminar = (id) => {
    if (admins.length <= 1) {
      showToast("⚠️ Debe existir al menos un administrador", "error");
      return;
    }
    dispatch({ type: "DEL_USER", payload: id });
    showToast("🗑️ Administrador eliminado", "error");
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

  const adminCfg = ROLES_CFG?.["Admin"] || { color: "#1e40af", bg: "#dbeafe", icon: "🛡️" };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">🛡️ Gestión de administradores</h4>
        <button className="btn btn-primary rounded-3" onClick={() => setModal(true)}>
          <i className="bi bi-person-plus me-1"></i> Nuevo administrador
        </button>
      </div>

      {/* Alerta informativa */}
      <div
        className="rounded-3 p-3 mb-4 small fw-semibold d-flex align-items-center gap-2"
        style={{ background: adminCfg.bg, color: adminCfg.color }}
      >
        {adminCfg.icon} Los administradores tienen acceso total al sistema.
        Asegúrate de otorgar este rol solo a personas de confianza.
      </div>

      {/* Buscador */}
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

      {/* Modal nuevo administrador */}
      {modal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.45)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg p-2"
              style={{ maxHeight: "90vh", overflowY: "auto" }}>
              <div className="modal-header border-0">
                <div>
                  <h5 className="modal-title fw-bold text-primary">🛡️ Nuevo administrador</h5>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    Este usuario tendrá acceso total al sistema.
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={cerrarModal} />
              </div>

              <div className="modal-body">
                <div className="text-center mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto"
                    style={{
                      width: 56, height: 56, fontSize: 18,
                      background: adminCfg.bg, color: adminCfg.color,
                      border: `2px solid ${adminCfg.color}`,
                    }}
                  >{avatarPreview}</div>
                  <div className="mt-2"><RolBadge rol="Admin" /></div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Nombre completo *</label>
                    <input
                      value={form.nombre} onChange={e => set("nombre", e.target.value)}
                      placeholder="Ej: Ana García"
                      className={`form-control form-control-sm bg-light ${errors.nombre ? "is-invalid" : ""}`}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Correo electrónico *</label>
                    <input
                      type="email" value={form.email} onChange={e => set("email", e.target.value)}
                      placeholder="admin@ejemplo.com"
                      className={`form-control form-control-sm bg-light ${errors.email ? "is-invalid" : ""}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Teléfono</label>
                    <input
                      value={form.telefono} onChange={e => set("telefono", e.target.value)}
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
                    <label className="form-label fw-bold small text-secondary">Punto asignado</label>
                    <select value={form.puntoAsignado} onChange={e => set("puntoAsignado", e.target.value)}
                      className="form-select form-select-sm bg-light">
                      <option value="">Sin asignar</option>
                      {ALL_POINTS.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <div className="rounded-3 p-3 small fw-semibold"
                      style={{ background: adminCfg.bg, color: adminCfg.color }}>
                      {adminCfg.icon} {rolDesc["Admin"]}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light">
                      <div>
                        <div className="fw-bold small">Estado inicial</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>
                          El administrador podrá acceder de inmediato si está activo
                        </div>
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
                <button className="btn btn-primary rounded-3 flex-fill" onClick={guardar}>🛡️ Crear administrador</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}