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
    showToast(`Administrador "${form.nombre.trim()}" creado`);
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
    <div className="panel-page">

      {/* ── ENCABEZADO ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        <div>
          <h4 className="panel-title">
            <i className="bi bi-shield-lock" style={{ color: "var(--verde)", marginRight: 8 }}></i>
            Gestión de administradores
          </h4>
          <span className="panel-subtitle">
            {admins.length} administrador{admins.length !== 1 ? "es" : ""} registrado{admins.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button className="btn-panel primary" onClick={() => setModal(true)}>
          <i className="bi bi-person-plus"></i>
          Nuevo administrador
        </button>
      </div>

      {/* ── BUSCADOR ── */}
      <div style={{ marginBottom: 16 }}>
        <div className="search-box" style={{ maxWidth: 380 }}>
          <i className="bi bi-search"></i>
          <input
            placeholder="Buscar por nombre, correo o zona..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* ── TABLA ── */}
      <div className="panel-table-wrap">
        <TablaUsuarios
          lista={filtered}
          onToggle={handleToggle}
          onVer={setViewUser}
          onEliminar={handleEliminar}
        />
      </div>

      <ModalDetalle
        user={viewUser}
        onClose={() => setViewUser(null)}
        onSave={handleSave}
        showToast={showToast}
      />

      {/* ── MODAL NUEVO ADMINISTRADOR ── */}
      {modal && (
        <div
          className="panel-modal-bg"
          onClick={ev => { if (ev.target === ev.currentTarget) cerrarModal(); }}
        >
          <div className="panel-modal">

            {/* Header */}
            <div className="panel-modal-head">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Avatar preview */}
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "var(--verde-claro)", border: "1px solid var(--gris-borde)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "0.85rem", color: "var(--verde)",
                  flexShrink: 0,
                }}>
                  {avatarPreview}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--negro)" }}>
                    <i className="bi bi-shield-lock" style={{ color: "var(--verde)", marginRight: 6 }}></i>
                    Nuevo administrador
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--gris-texto)" }}>Acceso total al sistema</div>
                </div>
              </div>
              <button className="btn-icon" onClick={cerrarModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Body */}
            <div className="panel-modal-body">
              <div className="panel-modal-grid">

                <div>
                  <label className="panel-label">
                    <i className="bi bi-person" style={{ marginRight: 4 }}></i>Nombre completo *
                  </label>
                  <input
                    className="panel-input"
                    value={form.nombre}
                    onChange={e => set("nombre", e.target.value)}
                    placeholder="Ej: Ana García"
                    style={errors.nombre ? { borderColor: "var(--rojo)" } : {}}
                  />
                  {errors.nombre && (
                    <span style={{ fontSize: "0.72rem", color: "var(--rojo)", marginTop: 2, display: "block" }}>
                      {errors.nombre}
                    </span>
                  )}
                </div>

                <div>
                  <label className="panel-label">
                    <i className="bi bi-envelope" style={{ marginRight: 4 }}></i>Correo electrónico *
                  </label>
                  <input
                    type="email"
                    className="panel-input"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                    placeholder="admin@ejemplo.com"
                    style={errors.email ? { borderColor: "var(--rojo)" } : {}}
                  />
                  {errors.email && (
                    <span style={{ fontSize: "0.72rem", color: "var(--rojo)", marginTop: 2, display: "block" }}>
                      {errors.email}
                    </span>
                  )}
                </div>

                <div>
                  <label className="panel-label">
                    <i className="bi bi-telephone" style={{ marginRight: 4 }}></i>Teléfono
                  </label>
                  <input
                    className="panel-input"
                    value={form.telefono}
                    onChange={e => set("telefono", e.target.value)}
                    placeholder="Ej: 300 123 4567"
                  />
                </div>

                {/* Estado toggle — ocupa columna completa */}
                <div className="full">
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 14px", borderRadius: 6,
                    background: "#fafafa", border: "1px solid var(--gris-borde)",
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--negro)" }}>Estado inicial</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--gris-texto)" }}>
                        El administrador podrá acceder si está activo
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        className="panel-badge"
                        style={{
                          background: form.activo ? "var(--verde-claro)" : "#f0f0f0",
                          color: form.activo ? "var(--verde)" : "#aaa",
                        }}
                      >
                        {form.activo ? "Activo" : "Inactivo"}
                      </span>
                      <Toggle checked={form.activo} onChange={v => set("activo", v)} />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="panel-modal-foot">
              <button className="btn-panel ghost" onClick={cerrarModal}>
                <i className="bi bi-x"></i> Cancelar
              </button>
              <button className="btn-panel primary" onClick={guardar}>
                <i className="bi bi-check-lg"></i> Crear administrador
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}