import { useState, useEffect } from "react";
import { ZONAS, ALL_POINTS } from "../constants/data";
import { getRolCfg, Toggle, rolDesc, ModalDetalle, TablaUsuarios } from "./UserShared";
import { getAliados } from "../services/api";

const EMPTY_FORM = {
  nombre: "", email: "", telefono: "",
  nombreEntidad: "", rol: "Afiliado",
  zona: "", puntoAsignado: "", activo: true,
};

export default function Aliados({ state, dispatch, showToast }) {
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [errors,   setErrors]   = useState({});
  const [search,   setSearch]   = useState("");
  const [viewUser, setViewUser] = useState(null);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const aliados = state.aliados || [];

  const validate = () => {
    const e = {};
    if (!form.nombre.trim())        e.nombre       = "El nombre del contacto es obligatorio";
    if (!form.nombreEntidad.trim()) e.nombreEntidad = "El nombre de la entidad es obligatorio";
    if (!form.email.trim())         e.email        = "El correo es obligatorio";
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
        id:             Date.now(),
        nombre:         form.nombre.trim(),
        nombreEntidad:  form.nombreEntidad.trim(),
        email:          form.email.trim(),
        telefono:       form.telefono.trim(),
        rol:            "Afiliado",
        zona:           form.zona,
        puntoAsignado:  form.puntoAsignado,
        pts:            0,
        activo:         form.activo,
        av:             initials,
        fechaAlta:      new Date().toLocaleDateString("es-CO"),
      },
    });

    showToast(`✅ Aliado "${form.nombreEntidad.trim()}" registrado`);
    setModal(false); setForm(EMPTY_FORM); setErrors({});
  };

  const cerrarModal = () => { setModal(false); setForm(EMPTY_FORM); setErrors({}); };

  const handleToggle = (id, nombre, estadoActual) => {
    dispatch({ type: "TOGGLE_USER", payload: id });
    showToast(
      estadoActual ? `🔴 ${nombre} ha sido desactivado` : `🟢 ${nombre} ha sido activado`,
      estadoActual ? "error" : "success"
    );
  };

  const handleSave = (updatedUser) => {
    dispatch({ type: "UPDATE_USER", payload: updatedUser });
  };

  const handleEliminar = (id) => {
    dispatch({ type: "DEL_USER", payload: id });
    showToast("🗑️ Aliado eliminado", "error");
    if (viewUser?.id === id) setViewUser(null);
  };

  const filtered = aliados.filter(u => {
    const q = search.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.nombreEntidad || "").toLowerCase().includes(q) ||
      (u.zona || "").toLowerCase().includes(q)
    );
  });

  const avatarPreview = form.nombre.trim().split(" ").slice(0, 2)
    .map(w => w[0]?.toUpperCase() || "").join("") || "?";

  const cfg = getRolCfg("Afiliado");

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">🤝 Gestión de aliados</h4>
        <button className="btn btn-warning rounded-3 fw-semibold" onClick={() => setModal(true)}>
          <i className="bi bi-shop me-1"></i> Nuevo aliado
        </button>
      </div>

      {/* Buscador */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <div className="input-group" style={{ maxWidth: 380 }}>
          <span className="input-group-text bg-white border-end-0 rounded-start-3">🔍</span>
          <input
            className="form-control border-start-0 rounded-end-3"
            placeholder="Buscar por nombre, entidad, correo o zona..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: 13 }}
          />
        </div>
        <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill align-self-center px-3 py-2" style={{ fontSize: 12 }}>
          {aliados.length} aliado{aliados.length !== 1 ? "s" : ""} registrado{aliados.length !== 1 ? "s" : ""}
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

      {/* Modal nuevo aliado */}
      {modal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.45)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg p-2"
              style={{ maxHeight: "90vh", overflowY: "auto" }}>

              {/* Header */}
              <div className="modal-header border-0" style={{ background: cfg.bg }}>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                    style={{ width: 52, height: 52, fontSize: 18, background: "#fff", color: cfg.color, border: `2px solid ${cfg.color}` }}
                  >{avatarPreview}</div>
                  <div>
                    <h5 className="modal-title fw-bold mb-0" style={{ color: cfg.color }}>🤝 Nuevo aliado</h5>
                    <div className="small mt-1" style={{ color: cfg.color, opacity: 0.75 }}>
                      Registra una empresa u organización aliada
                    </div>
                  </div>
                </div>
                <button type="button" className="btn-close ms-auto" onClick={cerrarModal} />
              </div>

              <div className="modal-body">
                {/* Sección entidad */}
                <p className="text-uppercase fw-bold text-muted mb-2" style={{ fontSize: 11, letterSpacing: 1 }}>🏪 Datos de la entidad</p>
                <div className="row g-3 mb-3">
                  <div className="col-12">
                    <label className="form-label fw-bold small text-secondary">Nombre de la entidad / empresa *</label>
                    <input
                      value={form.nombreEntidad}
                      onChange={e => set("nombreEntidad", e.target.value)}
                      placeholder="Ej: Supermercado La 14"
                      className={`form-control form-control-sm bg-light rounded-3 ${errors.nombreEntidad ? "is-invalid" : ""}`}
                    />
                    {errors.nombreEntidad && <div className="invalid-feedback">{errors.nombreEntidad}</div>}
                  </div>
                </div>

                {/* Sección contacto */}
                <p className="text-uppercase fw-bold text-muted mb-2" style={{ fontSize: 11, letterSpacing: 1 }}>👤 Datos del contacto</p>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Nombre del contacto *</label>
                    <input
                      value={form.nombre}
                      onChange={e => set("nombre", e.target.value)}
                      placeholder="Ej: Carlos Ruiz"
                      className={`form-control form-control-sm bg-light rounded-3 ${errors.nombre ? "is-invalid" : ""}`}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Correo electrónico *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      placeholder="correo@empresa.com"
                      className={`form-control form-control-sm bg-light rounded-3 ${errors.email ? "is-invalid" : ""}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Teléfono</label>
                    <input
                      value={form.telefono}
                      onChange={e => set("telefono", e.target.value)}
                      placeholder="Ej: 300 123 4567"
                      className="form-control form-control-sm bg-light rounded-3"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Zona</label>
                    <select value={form.zona} onChange={e => set("zona", e.target.value)}
                      className="form-select form-select-sm bg-light rounded-3">
                      <option value="">Sin zona</option>
                      {ZONAS.map(z => <option key={z}>{z}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-secondary">Punto asignado</label>
                    <select value={form.puntoAsignado} onChange={e => set("puntoAsignado", e.target.value)}
                      className="form-select form-select-sm bg-light rounded-3">
                      <option value="">Sin asignar</option>
                      {ALL_POINTS.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Info rol */}
                <div className="rounded-3 p-3 small fw-semibold mb-3" style={{ background: cfg.bg, color: cfg.color }}>
                  {cfg.icon} {rolDesc["Afiliado"]}
                </div>

                {/* Estado */}
                <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light">
                  <div>
                    <div className="fw-bold small">Estado inicial</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>El aliado podrá operar si está activo</div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`small fw-semibold ${form.activo ? "text-success" : "text-secondary"}`}>
                      {form.activo ? "Activo" : "Inactivo"}
                    </span>
                    <Toggle checked={form.activo} onChange={v => set("activo", v)} />
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 gap-2">
                <button className="btn btn-secondary rounded-3 flex-fill" onClick={cerrarModal}>Cancelar</button>
                <button className="btn rounded-3 flex-fill fw-bold"
                  style={{ background: cfg.color, color: "#fff" }}
                  onClick={guardar}>
                  🤝 Registrar aliado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}