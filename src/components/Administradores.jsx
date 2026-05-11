import { useState, useEffect } from "react";
import { ROLES_CFG, ZONAS, ALL_POINTS } from "../constants/data";
import { RolBadge, Toggle, rolDesc, ModalDetalle, TablaUsuarios } from "./UserShared";
import { getAdmins, crearAdmin, actualizarAdmin, eliminarAdmin } from "../services/api";

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
  const [loading,  setLoading]  = useState(true);

  // ── Cargar admins del backend al montar ──────────────────────
  useEffect(() => {
    getAdmins()
      .then(data => {
        const lista = (data.admins ?? data.administradores ?? []).map(u => ({
          id:        u.idAdmin ?? u.idUsuario,
          nombre:    u.nombre,
          email:     u.correo,
          telefono:  u.telefono ?? "",
          rol:       "Admin",
          zona:      "",
          pts:       0,
          activo:    u.idEstadoUsuario === 1,
          av:        (u.nombre ?? "").trim().split(" ").slice(0, 2)
                       .map(w => w[0]?.toUpperCase() ?? "").join(""),
          fechaAlta: u.fechaRegistro
                       ? new Date(u.fechaRegistro).toLocaleDateString("es-CO")
                       : "—",
        }));
        dispatch({ type: "SET_ADMINS", payload: lista });
      })
      .catch(() => showToast("No se pudieron cargar los administradores", "error"))
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const admins = state.usuarios.filter(u => u.rol === "Admin");

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.email.trim())  e.email  = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido";
    else if (state.usuarios.some(u => u.email === form.email.trim())) e.email = "Este correo ya existe";
    if (!form.telefono.trim())   e.telefono = "El teléfono es obligatorio";
    else if (!/^\d{10}$/.test(form.telefono.trim())) e.telefono = "El teléfono debe tener exactamente 10 dígitos";
    return e;
  };

  const guardar = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }


    try {
      const resp = await crearAdmin({
        nombre:   form.nombre.trim(),
        correo:   form.email.trim(),
        password: "Temporal123!",
        telefono: form.telefono.trim() || undefined,
      });

      const initials = form.nombre.trim().split(" ").slice(0, 2).map(w => w[0].toUpperCase()).join("");
      dispatch({
        type: "ADD_USER",
        payload: {
          id:        resp.admin?.idAdmin ?? resp.usuario?.idUsuario ?? Date.now(),
          nombre:    form.nombre.trim(),
          email:     form.email.trim(),
          telefono:  form.telefono.trim(),
          rol:       "Admin",
          pts:       0,
          activo:    true,
          av:        initials,
          fechaAlta: new Date().toLocaleDateString("es-CO"),
        },
      });

      showToast(`Administrador "${form.nombre.trim()}" creado`);
      setModal(false); setForm(EMPTY_FORM); setErrors({});
    } catch (err) {
      showToast("Error al crear administrador: " + err.message, "error");
    }

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

  const handleToggle = async (id, nombre, estadoActual) => {
    try {
      await actualizarAdmin(id, { idEstadoUsuario: estadoActual ? 2 : 1 });
      dispatch({ type: "TOGGLE_USER", payload: id });
      showToast(
        estadoActual ? `${nombre} ha sido desactivado` : `${nombre} ha sido activado`,
        estadoActual ? "error" : "success"
      );
    } catch (err) {
      showToast("Error al cambiar estado: " + err.message, "error");
    }
  };

  const handleSave = (u) => dispatch({ type: "UPDATE_USER", payload: u });

  const handleEliminar = async (id) => {
    if (admins.length <= 1) { showToast("Debe existir al menos un administrador", "error"); return; }
    try {
      await eliminarAdmin(id);
      dispatch({ type: "DEL_USER", payload: id });
      showToast("Administrador eliminado", "error");
      if (viewUser?.id === id) setViewUser(null);
    } catch (err) {
      showToast("Error al eliminar: " + err.message, "error");
    }
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


      {/* ── Indicador de carga ── */}
      {loading && (
        <div className="text-center py-3 text-muted small">
          <div className="spinner-border spinner-border-sm text-success me-2"></div>
          Cargando administradores del servidor...
        </div>
      )}

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

        <div className="modal d-block" style={{ background: "rgba(0,0,0,.4)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow">

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
                      <i className="bi bi-telephone me-1 text-secondary"></i>Teléfono *
                    </label>
                    <input
                      value={form.telefono}
                      onChange={e => set("telefono", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Ej: 3001234567"
                      maxLength={10}
                      className={`form-control form-control-sm rounded-3 ${errors.telefono ? "is-invalid" : ""}`}
                    />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
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

              <div className="modal-footer border-top gap-2">
                <button className="btn btn-outline-secondary btn-sm rounded-3 flex-fill" onClick={cerrarModal}>
                  <i className="bi bi-x me-1"></i>Cancelar
                </button>
                <button className="btn btn-success btn-sm rounded-3 flex-fill" onClick={guardar}>
                  <i className="bi bi-check-lg me-1"></i>Crear administrador
                </button>
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