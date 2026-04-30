// ============================================================
//  src/components/Usuarios.jsx  —  Con fetch real al backend
// ============================================================
import { useState, useEffect } from "react";
import { G, GL, GS, ALL_POINTS, ROLES_CFG, ZONAS } from "../constants/data";
import { getUsuarios, crearUsuario, cambiarEstadoUsuario } from "../services/api";

const selStyle = {
  width: "100%", padding: "9px 12px",
  border: "1px solid #e5e7eb", borderRadius: 8,
  fontSize: 13, fontFamily: "inherit", background: "#f9fafb",
};

function RolBadge({ rol }) {
  const cfg = ROLES_CFG[rol] || { color: "#6b7280", bg: "#f3f4f6", icon: "👤" };
  return (
    <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
      {cfg.icon} {rol}
    </span>
  );
}

const EMPTY_FORM = { nombre: "", email: "", telefono: "", rol: "Reciclador", zona: "", puntoAsignado: "", activo: true };

export default function Usuarios({ state, dispatch, showToast }) {
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [errors,    setErrors]    = useState({});
  const [search,    setSearch]    = useState("");
  const [filterRol, setFilterRol] = useState("Todos");
  const [viewUser,  setViewUser]  = useState(null);

  // ── Estado de carga ──────────────────────────────────────────
  const [loading,   setLoading]   = useState(true);
  const [apiError,  setApiError]  = useState(null);

  // ── Cargar usuarios desde el backend al montar ───────────────
  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    setLoading(true);
    setApiError(null);
    try {
      const data = await getUsuarios();
      // Sincronizamos el estado global del reducer con los datos reales
      dispatch({ type: "SET_USUARIOS", payload: data });
    } catch (err) {
      setApiError(err.message);
      showToast("⚠️ No se pudo cargar usuarios: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.email.trim())  e.email  = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido";
    else if (state.usuarios.some(u => u.email === form.email.trim())) e.email = "Este correo ya existe";
    return e;
  };

  // ── Guardar usuario: llama al backend y luego actualiza el estado ──
  const guardar = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    try {
      const nuevoUsuario = await crearUsuario({
        nombre_completo: form.nombre.trim(),
        correo:          form.email.trim(),
        rol:             form.rol,
      });

      // Construimos el objeto local a partir de la respuesta del backend
      const initials = form.nombre.trim().split(" ").slice(0, 2).map(w => w[0].toUpperCase()).join("");
      dispatch({
        type: "ADD_USER",
        payload: {
          id:             nuevoUsuario.id ?? Date.now(),
          nombre:         form.nombre.trim(),
          email:          form.email.trim(),
          telefono:       form.telefono.trim(),
          rol:            form.rol,
          zona:           form.zona,
          puntoAsignado:  form.puntoAsignado,
          pts:            0,
          activo:         form.activo,
          av:             initials,
          fechaAlta:      new Date().toLocaleDateString("es-CO"),
        },
      });

      showToast(`✅ Usuario "${form.nombre.trim()}" creado`);
      setModal(false); setForm(EMPTY_FORM); setErrors({});
    } catch (err) {
      showToast("❌ Error al crear usuario: " + err.message, "error");
    }
  };

  // ── Toggle estado: llama al backend y luego actualiza el estado ──
  const toggleEstado = async (usuario) => {
    const nuevoEstado = !usuario.activo;
    try {
      await cambiarEstadoUsuario(usuario.id, nuevoEstado);
      dispatch({ type: "TOGGLE_USER", payload: usuario.id });
      showToast(nuevoEstado ? "✅ Usuario activado" : "⏸️ Usuario desactivado");
    } catch (err) {
      showToast("❌ Error al cambiar estado: " + err.message, "error");
    }
  };

  const cerrarModal = () => { setModal(false); setForm(EMPTY_FORM); setErrors({}); };

  const filtered = state.usuarios.filter(u => {
    const q = search.toLowerCase();
    const matchQ = u.nombre?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || (u.zona || "").toLowerCase().includes(q);
    const matchR = filterRol === "Todos" || u.rol === filterRol;
    return matchQ && matchR;
  });

  const totalActivos = state.usuarios.filter(u => u.activo).length;

  const rolDesc = {
    "Admin":      "Acceso total al sistema, puede gestionar usuarios y configuración.",
    "Encargado":  "Gestiona un punto de recolección, valida entregas y reportes.",
    "Reciclador": "Usuario que registra entregas y acumula puntos.",
    "Validador":  "Revisa y aprueba las entregas registradas por los recicladores.",
    "Empresa":    "Empresa o comercio que ofrece recompensas y beneficios.",
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="page-title m-0">👥 Gestión de usuarios</h4>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary rounded-3" onClick={cargarUsuarios} disabled={loading}>
            {loading ? "⏳" : "🔄"} Recargar
          </button>
          <button className="btn btn-eco-primary rounded-3" onClick={() => setModal(true)}>
            <i className="bi bi-person-plus me-1"></i> Nuevo usuario
          </button>
        </div>
      </div>

      {/* Error de API */}
      {apiError && (
        <div className="alert alert-warning d-flex align-items-center gap-2 mb-3" role="alert">
          ⚠️ <span>{apiError} — Los datos mostrados pueden ser locales.</span>
        </div>
      )}

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          ["👥", "Total usuarios",  state.usuarios.length,                              "#1f2937"],
          ["✅", "Activos",          totalActivos,                                       G],
          ["⏸️", "Inactivos",        state.usuarios.length - totalActivos,               "#9ca3af"],
          ["🛡️", "Admins",           state.usuarios.filter(u => u.rol === "Admin").length, "#1e40af"],
        ].map(([ic, lb, val, col]) => (
          <div key={lb} className="col-md-3">
            <div className="eco-card" style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{ic}</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>{lb}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: col }}>{val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Buscador + filtros */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <div className="input-group" style={{ maxWidth: 340 }}>
          <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "8px 0 0 8px" }}>🔍</span>
          <input
            className="form-control border-start-0"
            placeholder="Buscar por nombre, correo o zona..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ borderRadius: "0 8px 8px 0", fontSize: 13 }}
          />
        </div>
        <div className="btn-group">
          {["Todos", ...Object.keys(ROLES_CFG)].map(r => (
            <button
              key={r}
              className={`btn btn-sm ${filterRol === r ? "btn-eco-primary" : "btn-outline-secondary"}`}
              onClick={() => setFilterRol(r)}
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="eco-card p-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-5" style={{ color: "#9ca3af" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
            Cargando usuarios desde el servidor...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
              <thead style={{ background: "#f9fafb" }}>
                <tr>
                  {["Usuario","Email","Rol","Zona","Puntos","Estado","Acciones"].map(h => (
                    <th key={h} className="text-uppercase" style={{ padding: "10px 16px", fontSize: 11, color: "#9ca3af", fontWeight: 600, border: "none" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-5" style={{ color: "#9ca3af" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>👤</div>Sin usuarios que coincidan
                  </td></tr>
                ) : filtered.map(u => (
                  <tr key={u.id} style={{ opacity: u.activo ? 1 : .55, transition: ".15s" }}>
                    <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: u.activo ? GL : "#f3f4f6", border: `2px solid ${u.activo ? G : "#9ca3af"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, color: u.activo ? G : "#9ca3af", flexShrink: 0 }}>{u.av}</div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{u.nombre}</div>
                          {u.fechaAlta && <div style={{ fontSize: 10, color: "#9ca3af" }}>Alta: {u.fechaAlta}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#6b7280", verticalAlign: "middle" }}>{u.email}</td>
                    <td style={{ padding: "12px 16px", verticalAlign: "middle" }}><RolBadge rol={u.rol} /></td>
                    <td style={{ padding: "12px 16px", color: "#6b7280", fontSize: 12, verticalAlign: "middle" }}>{u.zona || "—"}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 800, color: G, verticalAlign: "middle" }}>{(u.pts || 0).toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                      <div
                        className="eco-switch"
                        style={{ background: u.activo ? GS : "#d1d5db", cursor: "pointer" }}
                        onClick={() => toggleEstado(u)}
                      >
                        <div className="knob" style={{ left: u.activo ? 20 : 4 }} />
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                      <div className="d-flex gap-1">
                        <button title="Ver detalle" style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${GL}`, background: GL, cursor: "pointer", fontSize: 13 }} onClick={() => setViewUser(u)}>👁</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: GL, border: `3px solid ${G}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, color: G, margin: "0 auto 10px" }}>{viewUser.av}</div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{viewUser.nombre}</div>
                <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>{viewUser.email}</div>
                <div className="mt-2"><RolBadge rol={viewUser.rol} /></div>
              </div>
              <div className="row g-2 mx-3 mb-3">
                {[
                  ["📍 Zona",     viewUser.zona || "Sin asignar"],
                  ["📞 Teléfono", viewUser.telefono || "Sin registrar"],
                  ["⭐ Puntos",   `${(viewUser.pts || 0).toLocaleString()} pts`],
                  ["📅 Alta",     viewUser.fechaAlta || "—"],
                  ["🏪 Punto",    viewUser.puntoAsignado || "Sin asignar"],
                  ["Estado",      viewUser.activo ? "🟢 Activo" : "⚪ Inactivo"],
                ].map(([l, v]) => (
                  <div key={l} className="col-6">
                    <div style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>{l}</div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{v}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-eco-secondary rounded-3 w-100" onClick={() => setViewUser(null)}>Cerrar</button>
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
                  <h5 className="modal-title fw-bold" style={{ color: G }}>👤 Nuevo usuario</h5>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Completa la información para registrar un nuevo usuario.</div>
                </div>
                <button type="button" className="btn-close" onClick={cerrarModal} />
              </div>

              <div className="modal-body">
                <div className="text-center mb-3">
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: GL, border: `2px solid ${G}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: G, margin: "0 auto" }}>
                    {form.nombre.trim().split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "?"}
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Nombre completo *</label>
                    <input value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Ej: Carlos Ruiz" className={`form-control ${errors.nombre ? "is-invalid" : ""}`} style={selStyle} />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Correo electrónico *</label>
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="correo@ejemplo.com" className={`form-control ${errors.email ? "is-invalid" : ""}`} style={selStyle} />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Teléfono</label>
                    <input value={form.telefono} onChange={e => set("telefono", e.target.value)} placeholder="Ej: 300 123 4567" className="form-control" style={selStyle} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Tipo / Rol *</label>
                    <select value={form.rol} onChange={e => set("rol", e.target.value)} className="form-select" style={selStyle}>
                      {Object.keys(ROLES_CFG).map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Zona</label>
                    <select value={form.zona} onChange={e => set("zona", e.target.value)} className="form-select" style={selStyle}>
                      <option value="">Sin zona</option>
                      {ZONAS.map(z => <option key={z}>{z}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Punto asignado</label>
                    <select value={form.puntoAsignado} onChange={e => set("puntoAsignado", e.target.value)} className="form-select" style={selStyle}>
                      <option value="">Sin asignar</option>
                      {ALL_POINTS.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 gap-2">
                <button className="btn btn-eco-secondary rounded-3 flex-fill" onClick={cerrarModal}>Cancelar</button>
                <button className="btn btn-eco-primary rounded-3 flex-fill" onClick={guardar}>✅ Crear usuario</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { RolBadge };