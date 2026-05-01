import { useState } from "react";
import { REWARDS } from "../constants/data";

const COLORES = [
  { label: "Verde",   value: "#16a34a" },
  { label: "Azul",    value: "#2563eb" },
  { label: "Morado",  value: "#9333ea" },
  { label: "Naranja", value: "#ea580c" },
  { label: "Rojo",    value: "#dc2626" },
  { label: "Cyan",    value: "#0891b2" },
];

const selStyle = {
  width: "100%", padding: "9px 12px",
  border: "1px solid #e5e7eb", borderRadius: 8,
  fontSize: 13, fontFamily: "inherit", background: "#f9fafb",
};

const emptyForm = { titulo: "", empresa: "", pts: "", icon: "🎁", color: "#16a34a" };

export default function Recompensas({ state, dispatch, showToast }) {
  const rewards = state.rewards || REWARDS;

  const [modal,  setModal]  = useState(false);
  const [editId, setEditId] = useState(null);
  const [form,   setForm]   = useState(emptyForm);

  const abrirNuevo = () => {
    setEditId(null);
    setForm(emptyForm);
    setModal(true);
  };

  const abrirEditar = (r) => {
    setEditId(r.id);
    setForm({ titulo: r.titulo, empresa: r.empresa, pts: String(r.pts), icon: r.icon, color: r.color });
    setModal(true);
  };

  const guardar = () => {
    const pts = parseInt(form.pts);
    if (!form.titulo.trim())  { showToast("❌ Ingresa un título",      "error"); return; }
    if (!form.empresa.trim()) { showToast("❌ Ingresa una empresa",     "error"); return; }
    if (!pts || pts <= 0)     { showToast("❌ Ingresa puntos válidos",  "error"); return; }
    if (!form.icon.trim())    { showToast("❌ Ingresa un ícono (emoji)","error"); return; }

    if (editId !== null) {
      dispatch({ type: "EDIT_REWARD", payload: { id: editId, ...form, pts } });
      showToast("✅ Recompensa actualizada");
    } else {
      dispatch({ type: "ADD_REWARD", payload: { id: Date.now(), ...form, pts, activo: true } });
      showToast("✅ Recompensa creada");
    }
    setModal(false);
  };

  const eliminar = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta recompensa?")) return;
    dispatch({ type: "DELETE_REWARD", payload: id });
    showToast("🗑️ Recompensa eliminada");
  };

  const toggleActivo = (id) => {
    dispatch({ type: "TOGGLE_ACTIVO_REWARD", payload: id });
  };

  const canjear = (r) => {
    if (!r.activo)         { showToast("⚠️ Esta recompensa no está activa", "error"); return; }
    if (state.pts < r.pts) { showToast("❌ Puntos insuficientes",            "error"); return; }
    dispatch({ type: "ADD_PTS", payload: -r.pts });
    dispatch({
      type: "ADD_HISTORIAL",
      payload: { id: Date.now(), desc: "Canje realizado", sub: r.titulo, tiempo: "Ahora", icon: "🎁" },
    });
    showToast(`🎉 ¡Canjeado! ${r.titulo}`);
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">🎁 Recompensas disponibles</h4>
        <div className="d-flex align-items-center gap-3">
          <div className="small text-secondary">
            Disponibles: <strong className="text-success fs-6">{state.pts.toLocaleString()} pts</strong>
          </div>
          <button className="btn btn-eco-primary rounded-3" onClick={abrirNuevo}>
            <i className="bi bi-plus-lg me-1"></i> Nueva recompensa
          </button>
        </div>
      </div>

      {/* Tarjetas */}
      <div className="row g-3">
        {rewards.map(r => {
          const can = state.pts >= r.pts && r.activo;
          const pct = Math.min(100, Math.round((state.pts / r.pts) * 100));
          return (
            <div key={r.id} className="col-md-4">
              <div className="card shadow-sm h-100" style={{ opacity: r.activo ? 1 : 0.55, transition: "opacity .3s" }}>
                <div className="card-body d-flex flex-column">

                  {/* Fila superior: ícono + acciones */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3 fs-4 fw-bold text-white"
                      style={{ width: 52, height: 52, background: r.color, flexShrink: 0 }}
                    >
                      {r.icon}
                    </div>

                    {/* Toggle + Editar + Eliminar */}
                    <div className="d-flex align-items-center gap-2">
                      {/* Toggle activo */}
                      <div
                        onClick={() => toggleActivo(r.id)}
                        title={r.activo ? "Desactivar" : "Activar"}
                        style={{
                          width: 38, height: 22, borderRadius: 22, cursor: "pointer",
                          background: r.activo ? "#16a34a" : "#d1d5db",
                          position: "relative", transition: "background .3s", flexShrink: 0,
                        }}
                      >
                        <div style={{
                          position: "absolute", top: 2,
                          left: r.activo ? 18 : 2,
                          width: 18, height: 18, borderRadius: "50%",
                          background: "white", transition: "left .3s",
                          boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                        }} />
                      </div>

                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                        background: r.activo ? "#d1fae5" : "#f3f4f6",
                        color:      r.activo ? "#059669" : "#6b7280",
                      }}>
                        {r.activo ? "Activo" : "Inactivo"}
                      </span>

                      {/* Botón Editar */}
                      <button
                        onClick={() => abrirEditar(r)}
                        title="Editar"
                        style={{
                          background: "#eff6ff", color: "#3b82f6", border: "none",
                          borderRadius: 8, padding: "4px 10px", fontSize: 13,
                          cursor: "pointer", fontWeight: 600,
                        }}
                      >
                        <i className="bi bi-pencil-fill" />
                      </button>

                      {/* Botón Eliminar */}
                      <button
                        onClick={() => eliminar(r.id)}
                        title="Eliminar"
                        style={{
                          background: "white", color: "#ef4444",
                          border: "1.5px solid #fca5a5", borderRadius: 8,
                          padding: "4px 8px", fontSize: 13, cursor: "pointer",
                        }}
                      >
                        <i className="bi bi-trash3-fill" />
                      </button>
                    </div>
                  </div>

                  {/* Título y empresa */}
                  <div className="fw-bold small mb-1">{r.titulo}</div>
                  <div className="text-muted mb-3" style={{ fontSize: 12 }}>{r.empresa}</div>

                  {/* Puntos + progreso + botón */}
                  <div className="mt-auto">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="fw-bold text-success" style={{ fontSize: 15 }}>
                        {r.pts.toLocaleString()} pts
                      </span>
                      {!can && r.activo && (
                        <span className="text-muted" style={{ fontSize: 11 }}>
                          Faltan {(r.pts - state.pts).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="progress mb-3" style={{ height: 6, borderRadius: 3 }}>
                      <div
                        className={`progress-bar ${can ? "bg-success" : "bg-warning"}`}
                        role="progressbar"
                        style={{ width: `${pct}%`, transition: ".4s" }}
                        aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100"
                      />
                    </div>

                    <button
                      className={`btn w-100 rounded-3 ${can ? "btn-success" : "btn-secondary"}`}
                      onClick={() => can && canjear(r)}
                      disabled={!can}
                    >
                      {!r.activo ? "⛔ Recompensa inactiva" : can ? "🎁 Canjear ahora" : "❌ Puntos insuficientes"}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal nueva / edición */}
      {modal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.45)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg p-2">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: "#16a34a" }}>
                  {editId ? "✏️ Editar recompensa" : "🎁 Nueva recompensa"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setModal(false)} />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Título</label>
                  <input
                    type="text" className="form-control" style={selStyle}
                    value={form.titulo} placeholder="Ej: Descuento 10% Supermercado"
                    onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Empresa</label>
                  <input
                    type="text" className="form-control" style={selStyle}
                    value={form.empresa} placeholder="Ej: EcoMarket"
                    onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Puntos requeridos</label>
                  <input
                    type="number" className="form-control" style={selStyle}
                    value={form.pts} placeholder="Ej: 500"
                    onChange={e => setForm(f => ({ ...f, pts: e.target.value }))}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Ícono (emoji)</label>
                  <input
                    type="text" className="form-control" style={selStyle}
                    value={form.icon} placeholder="Ej: 🎁"
                    onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Color</label>
                  <div className="d-flex gap-2 flex-wrap mt-1">
                    {COLORES.map(c => (
                      <div
                        key={c.value}
                        onClick={() => setForm(f => ({ ...f, color: c.value }))}
                        title={c.label}
                        style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: c.value, cursor: "pointer",
                          border: form.color === c.value ? "3px solid #111" : "3px solid transparent",
                          transition: "border .15s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-eco-secondary rounded-3 flex-fill" onClick={() => setModal(false)}>Cancelar</button>
                <button className="btn btn-eco-primary rounded-3 flex-fill" onClick={guardar}>
                  {editId ? "Guardar cambios" : "Crear recompensa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}