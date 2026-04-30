import { useState } from "react";
import { ALL_POINTS, ZONAS } from "../constants/data";
import { getRolCfg, Toggle, rolDesc, ModalDetalle, TablaUsuarios } from "./UserShared";

const EMPTY_FORM = {
  nombre: "", email: "", telefono: "",
  rol: "Afiliado", zona: "", puntoAsignado: "",
  nombreEntidad: "", activo: true,
};

export default function Afiliados({ state, dispatch, showToast }) {
  const [tab,      setTab]      = useState("Afiliado");
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState({ ...EMPTY_FORM, rol: "Afiliado" });
  const [errors,   setErrors]   = useState({});
  const [search,   setSearch]   = useState("");
  const [viewUser, setViewUser] = useState(null);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const abrirModal = () => { setForm({ ...EMPTY_FORM, rol: tab }); setErrors({}); setModal(true); };
  const cerrarModal = () => { setModal(false); setForm({ ...EMPTY_FORM, rol: tab }); setErrors({}); };

  const lista = state.usuarios.filter(u => u.rol === tab);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.email.trim())  e.email  = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido";
    else if (state.usuarios.some(u => u.email === form.email.trim())) e.email = "Este correo ya existe";
    if (tab === "Afiliado" && !form.nombreEntidad.trim()) e.nombreEntidad = "El nombre de la entidad es obligatorio";
    return e;
  };

  const guardar = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const initials = form.nombre.trim().split(" ").slice(0, 2).map(w => w[0].toUpperCase()).join("");
    dispatch({
      type: "ADD_USER",
      payload: {
        id: Date.now(),
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        rol: tab,
        zona: form.zona,
        puntoAsignado: form.puntoAsignado,
        nombreEntidad: form.nombreEntidad.trim(),
        pts: 0,
        activo: form.activo,
        av: initials,
        fechaAlta: new Date().toLocaleDateString("es-CO"),
      },
    });
    showToast(`✅ ${tab} "${form.nombre.trim()}" registrado`);
    cerrarModal();
  };

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
    dispatch({ type: "DEL_USER", payload: id });
    showToast("🗑️ Registro eliminado", "error");
    if (viewUser?.id === id) setViewUser(null);
  };

  const filtered = lista.filter(u => {
    const q = search.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.zona || "").toLowerCase().includes(q) ||
      (u.nombreEntidad || "").toLowerCase().includes(q)
    );
  });

  const avatarPreview = form.nombre.trim().split(" ").slice(0, 2)
    .map(w => w[0]?.toUpperCase() || "").join("") || "?";

  const cfgActual = getRolCfg(tab);

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">🏪 Afiliados y Encargados</h4>
        <button
          className="btn rounded-3 fw-bold"
          style={{ background: cfgActual.bg, color: cfgActual.color, border: `1.5px solid ${cfgActual.color}` }}
          onClick={abrirModal}
        >
          <i className="bi bi-plus-lg me-1"></i> Nuevo {tab}
        </button>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-3">
        {["Afiliado", "Encargado"].map(t => {
          const c = getRolCfg(t);
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => { setTab(t); setSearch(""); }}
              className="btn rounded-3 fw-bold d-flex align-items-center gap-2"
              style={{
                fontSize: 13,
                background: active ? c.bg : "transparent",
                color: active ? c.color : "#9ca3af",
                border: active ? `1.5px solid ${c.color}` : "1.5px solid #e5e7eb",
                transition: ".15s",
              }}
            >
              {c.icon} {t}s
              <span className="badge rounded-pill"
                style={{ background: active ? c.color : "#e5e7eb", color: active ? "#fff" : "#6b7280", fontSize: 10 }}>
                {state.usuarios.filter(u => u.rol === t).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Descripción del tab */}
      <div className="rounded-3 p-3 mb-3 small fw-semibold"
        style={{ background: cfgActual.bg, color: cfgActual.color }}>
        {cfgActual.icon} {rolDesc[tab]}
      </div>

      {/* Buscador */}
      <div className="mb-3">
        <div className="input-group" style={{ maxWidth: 340 }}>
          <span className="input-group-text bg-white border-end-0 rounded-start-3">🔍</span>
          <input
            className="form-control border-start-0 rounded-end-3"
            placeholder={`Buscar ${tab.toLowerCase()}...`}
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

      {/* Modal nuevo */}
      {modal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.45)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg p-2"
              style={{ maxHeight: "90vh", overflowY: "auto" }}>
              <div className="modal-header border-0">
                <div>
                  <h5 className="modal-title fw-bold" style={{ color: cfgActual.color }}>
                    {cfgActual.icon} Nuevo {tab}
                  </h5>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    {tab === "Afiliado"
                      ? "Registra un supermercado, empresa u entidad aliada."
                      : "Registra el encargado responsable de un punto de recolección."}
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={cerrarModal} />
              </div>

              <div className="modal-body">
                <div className="text-center mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto"
                    style={{ width: 56, height: 56, fontSize: 18, background: cfgActual.bg, color: cfgActual.color, border: `2px solid ${cfgActual.color}` }}
                  >{avatarPreview}</div>
                </div>

                <div className="row g-3">
                  {tab === "Afiliado" && (
                    <div className="col-12">
                      <label className="form-label fw-bold small text-secondary">Nombre de la entidad / empresa *</label>
                      <input
                        value={form.nombreEntidad} onChange={e => set("nombreEntidad", e.target.value)}
                        placeholder="Ej: Supermercado La 14, Éxito Norte..."
                        className={`form-control form-control-sm bg-light ${errors.nombreEntidad ? "is-invalid" : ""}`}
                      />
                      {errors.nombreEntidad && <div className="invalid-feedback">{errors.nombreEntidad}</div>}
                    </div>
                  )}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">
                      {tab === "Afiliado" ? "Nombre del contacto *" : "Nombre completo *"}
                    </label>
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
                      placeholder="correo@ejemplo.com"
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
                    <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light">
                      <div>
                        <div className="fw-bold small">Estado inicial</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>Podrá operar de inmediato si está activo</div>
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
                <button
                  className="btn rounded-3 flex-fill fw-bold"
                  style={{ background: cfgActual.color, color: "#fff" }}
                  onClick={guardar}
                >
                  {cfgActual.icon} Registrar {tab}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}