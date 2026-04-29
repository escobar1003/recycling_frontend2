import { useState } from "react";
import { ADMIN_PROFILE } from "../constants/data";
import { RolBadge } from "./Usuarios";

export default function Perfil({ state, showToast }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm]         = useState({ ...ADMIN_PROFILE });
  const [saved, setSaved]       = useState({ ...ADMIN_PROFILE });

  const totalEntregas = state.entregas.length;
  const totalKg       = state.entregas.reduce((a, e) => a + e.peso, 0);
  const canjes        = state.historial.filter(h => h.icon === "🎁").length;

  const guardar = () => {
    if (!form.nombre.trim()) { showToast("❌ El nombre es obligatorio", "error"); return; }
    setSaved({ ...form });
    setEditMode(false);
    showToast("✅ Perfil actualizado correctamente");
  };

  const cancelar = () => { setForm({ ...saved }); setEditMode(false); };

  return (
    <div>
      <h4 className="fw-bold mb-4">👤 Mi Perfil</h4>

      <div className="row g-3">

        {/* ── Tarjeta principal ── */}
        <div className="col-md-4">
          <div className="card shadow-sm text-center" style={{ position: "sticky", top: 80 }}>
            <div className="card-body">

              {/* Avatar */}
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white mx-auto mb-3"
                style={{
                  width: 96, height: 96, fontSize: 36,
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  boxShadow: "0 4px 20px rgba(22,163,74,0.35)",
                }}
              >
                {saved.av}
              </div>

              <div className="fw-bold fs-4 text-dark mb-1">{saved.nombre}</div>
              <div className="text-muted small mb-3">{saved.email}</div>
              <div className="mb-3"><RolBadge rol={saved.rol} /></div>

              {/* Bio */}
              <div className="bg-success-subtle text-success rounded-3 p-3 text-start small mb-3">
                💬 {saved.bio}
              </div>

              {/* Info rápida */}
              <div className="d-flex flex-column gap-2 text-start mb-4">
                {[
                  ["📍", "Ciudad",        saved.ciudad],
                  ["📞", "Teléfono",      saved.telefono],
                  ["🏪", "Punto",         saved.punto],
                  ["📅", "Miembro desde", saved.fechaAlta],
                ].map(([ic, lb, val]) => (
                  <div key={lb} className="d-flex align-items-center gap-2 small">
                    <span style={{ fontSize: 16 }}>{ic}</span>
                    <span className="text-muted">{lb}:</span>
                    <span className="fw-semibold text-dark">{val}</span>
                  </div>
                ))}
              </div>

              <button
                className={`btn w-100 rounded-3 ${editMode ? "btn-secondary" : "btn-success"}`}
                onClick={() => editMode ? cancelar() : setEditMode(true)}
              >
                {editMode ? "✕ Cancelar edición" : "✏️ Editar perfil"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Panel derecho ── */}
        <div className="col-md-8 d-flex flex-column gap-3">

          {/* Estadísticas */}
          <div className="row g-3">
            {[
              { label: "Puntos acumulados",  value: `${state.pts.toLocaleString()} ⭐`, bg: "bg-success",       tc: "text-white" },
              { label: "Entregas realizadas", value: `${totalEntregas} 📦`,             bg: "bg-success-subtle", tc: "text-success" },
              { label: "kg reciclados",       value: `${totalKg.toFixed(1)} 🌿`,        bg: "",                  tc: "",            style: { background: "#fef9c3", color: "#854f0b" } },
              { label: "Canjes realizados",   value: `${canjes} 🎁`,                    bg: "",                  tc: "",            style: { background: "#dbeafe", color: "#1e40af" } },
            ].map(({ label, value, bg, tc, style }) => (
              <div key={label} className="col-6">
                <div className={`rounded-3 p-3 h-100 ${bg} ${tc}`} style={style}>
                  <div className="small opacity-75 mb-2">{label}</div>
                  <div className="fw-bold" style={{ fontSize: 24 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Formulario edición / vista */}
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="fw-bold" style={{ fontSize: 15 }}>
                  {editMode ? "✏️ Editar información" : "📋 Información personal"}
                </div>
                {editMode && (
                  <button className="btn btn-success btn-sm rounded-3" onClick={guardar}>
                    💾 Guardar cambios
                  </button>
                )}
              </div>

              {editMode ? (
                <div className="row g-3">
                  {[
                    ["nombre",   "Nombre completo",    "text"],
                    ["email",    "Correo electrónico",  "email"],
                    ["telefono", "Teléfono",            "text"],
                    ["ciudad",   "Ciudad",              "text"],
                  ].map(([key, label, type]) => (
                    <div key={key} className="col-md-6">
                      <label className="form-label fw-bold small text-secondary">{label}</label>
                      <input
                        type={type}
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="form-control form-control-sm bg-light"
                      />
                    </div>
                  ))}
                  <div className="col-12">
                    <label className="form-label fw-bold small text-secondary">Biografía</label>
                    <textarea
                      value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                      className="form-control form-control-sm bg-light"
                      style={{ minHeight: 80, resize: "vertical" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  {[
                    ["Nombre completo", saved.nombre],
                    ["Correo",          saved.email],
                    ["Teléfono",        saved.telefono],
                    ["Ciudad",          saved.ciudad],
                    ["Zona asignada",   saved.zona],
                    ["Punto asignado",  saved.punto],
                    ["Rol",             saved.rol],
                    ["Miembro desde",   saved.fechaAlta],
                  ].map(([lb, val]) => (
                    <div key={lb} className="col-md-6">
                      <div className="bg-light rounded-3 p-3">
                        <div className="text-muted mb-1" style={{ fontSize: 11 }}>{lb}</div>
                        <div className="fw-bold small">
                          {lb === "Rol" ? <RolBadge rol={val} /> : val}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="col-12">
                    <div className="bg-light rounded-3 p-3">
                      <div className="text-muted mb-1" style={{ fontSize: 11 }}>Biografía</div>
                      <div className="fw-semibold small">{saved.bio}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Seguridad */}
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="fw-bold mb-3" style={{ fontSize: 15 }}>🔒 Seguridad</div>
              <div className="d-flex flex-column gap-2">
                {[
                  { icon: "🔑", title: "Cambiar contraseña",            desc: "Última actualización: hace 3 meses" },
                  { icon: "📱", title: "Autenticación de dos factores",  desc: "No habilitada" },
                  { icon: "🖥️", title: "Sesiones activas",               desc: "1 dispositivo conectado" },
                ].map(({ icon, title, desc }) => (
                  <div
                    key={title}
                    className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border"
                    style={{ cursor: "pointer" }}
                    onClick={() => showToast("🔐 Funcionalidad próximamente", "warning")}
                  >
                    <div style={{ fontSize: 22 }}>{icon}</div>
                    <div className="flex-fill">
                      <div className="fw-bold small">{title}</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>{desc}</div>
                    </div>
                    <div className="text-muted fs-5">›</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}