import { useState } from "react";
import { G, GL, GS, Y, ADMIN_PROFILE, ROLES_CFG } from "../constants/data";
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

  const rolCfg = ROLES_CFG[saved.rol] || { color: "#6b7280", bg: "#f3f4f6", icon: "👤" };

  const inputSt = {
    width: "100%", padding: "9px 12px",
    border: "1px solid #e5e7eb", borderRadius: 8,
    fontSize: 13, fontFamily: "inherit", background: "#f9fafb",
  };

  return (
    <div>
      <h4 className="page-title">👤 Mi Perfil</h4>

      <div className="row g-3">

        {/* ── Tarjeta principal ──────────────────────────────────────────────── */}
        <div className="col-md-4">
          <div className="eco-card text-center" style={{ position: "sticky", top: 80 }}>
            {/* Avatar grande */}
            <div
              style={{
                width: 96, height: 96, borderRadius: "50%",
                background: `linear-gradient(135deg, ${G}, ${GS})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 36, color: "#fff",
                margin: "0 auto 16px",
                boxShadow: `0 4px 20px ${G}55`,
              }}
            >
              {saved.av}
            </div>

            <div style={{ fontWeight: 800, fontSize: 22, color: "#1f2937", marginBottom: 4 }}>{saved.nombre}</div>
            <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 12 }}>{saved.email}</div>
            <div className="mb-3"><RolBadge rol={saved.rol} /></div>

            {/* Bio */}
            <div style={{ background: GL, borderRadius: 12, padding: "12px 14px", fontSize: 13, color: G, textAlign: "left", marginBottom: 16 }}>
              💬 {saved.bio}
            </div>

            {/* Info rápida */}
            <div className="d-flex flex-column gap-2 text-start mb-4">
              {[
                ["📍", "Ciudad",     saved.ciudad],
                ["📞", "Teléfono",   saved.telefono],
                ["🏪", "Punto",      saved.punto],
                ["📅", "Miembro desde", saved.fechaAlta],
              ].map(([ic, lb, val]) => (
                <div key={lb} className="d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                  <span style={{ fontSize: 16 }}>{ic}</span>
                  <span style={{ color: "#9ca3af" }}>{lb}:</span>
                  <span style={{ fontWeight: 600, color: "#1f2937" }}>{val}</span>
                </div>
              ))}
            </div>

            <button
              className={`btn w-100 rounded-3 ${editMode ? "btn-eco-secondary" : "btn-eco-primary"}`}
              onClick={() => editMode ? cancelar() : setEditMode(true)}
            >
              {editMode ? "✕ Cancelar edición" : "✏️ Editar perfil"}
            </button>
          </div>
        </div>

        {/* ── Panel derecho ─────────────────────────────────────────────────── */}
        <div className="col-md-8 d-flex flex-column gap-3">

          {/* Estadísticas */}
          <div className="row g-3">
            {[
              { label: "Puntos acumulados", value: `${state.pts.toLocaleString()} ⭐`, bg: G, tc: "#fff" },
              { label: "Entregas realizadas", value: `${totalEntregas} 📦`,            bg: GL, tc: G },
              { label: "kg reciclados",       value: `${totalKg.toFixed(1)} 🌿`,       bg: "#fef9c3", tc: "#854f0b" },
              { label: "Canjes realizados",   value: `${canjes} 🎁`,                   bg: "#dbeafe", tc: "#1e40af" },
            ].map(({ label, value, bg, tc }) => (
              <div key={label} className="col-6">
                <div style={{ background: bg, borderRadius: 14, padding: "16px 18px" }}>
                  <div style={{ fontSize: 11, color: tc, opacity: .75, marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: tc }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Formulario edición / vista */}
          <div className="eco-card">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div style={{ fontWeight: 700, fontSize: 15 }}>{editMode ? "✏️ Editar información" : "📋 Información personal"}</div>
              {editMode && (
                <button className="btn btn-eco-primary btn-sm rounded-3" onClick={guardar}>💾 Guardar cambios</button>
              )}
            </div>

            {editMode ? (
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Nombre completo</label>
                  <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={inputSt} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Correo electrónico</label>
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputSt} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Teléfono</label>
                  <input value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} style={inputSt} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Ciudad</label>
                  <input value={form.ciudad} onChange={e => setForm(f => ({ ...f, ciudad: e.target.value }))} style={inputSt} className="form-control" />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Biografía</label>
                  <textarea
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    style={{ ...inputSt, minHeight: 80, resize: "vertical" }}
                    className="form-control"
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
                    <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>{lb}</div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>
                        {lb === "Rol" ? <RolBadge rol={val} /> : val}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="col-12">
                  <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>Biografía</div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{saved.bio}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Seguridad */}
          <div className="eco-card">
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>🔒 Seguridad</div>
            <div className="row g-2">
              {[
                { icon: "🔑", title: "Cambiar contraseña",           desc: "Última actualización: hace 3 meses" },
                { icon: "📱", title: "Autenticación de dos factores", desc: "No habilitada" },
                { icon: "🖥️", title: "Sesiones activas",              desc: "1 dispositivo conectado" },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="col-12">
                  <div
                    className="d-flex align-items-center gap-3 p-3 rounded-3"
                    style={{ background: "#f9fafb", border: "1px solid #e5e7eb", cursor: "pointer" }}
                    onClick={() => showToast("🔐 Funcionalidad próximamente", "warning")}
                  >
                    <div style={{ fontSize: 22 }}>{icon}</div>
                    <div className="flex-fill">
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{title}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{desc}</div>
                    </div>
                    <div style={{ color: "#9ca3af", fontSize: 18 }}>›</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
