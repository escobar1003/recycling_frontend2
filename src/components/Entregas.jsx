import { useState, useEffect } from "react";
import { G, GL, MAT_CFG } from "../constants/data";
import { getPuntos } from "../services/api";

const selStyle = {
  width: "100%", padding: "9px 12px",
  border: "1px solid #e5e7eb", borderRadius: 8,
  fontSize: 13, fontFamily: "inherit", background: "#f9fafb",
};

export default function Entregas({ state, dispatch, showToast }) {
  const [modal, setModal]   = useState(false);
  const [mat,   setMat]     = useState(Object.keys(MAT_CFG)[0]);
  const [fecha, setFecha]   = useState(new Date().toISOString().split("T")[0]);
  const [peso,  setPeso]    = useState("");

  // ── NUEVO: modo edición ───────────────────────────────────────────────────
  const [editId, setEditId] = useState(null); // null = nueva entrega

  // ── Puntos de reciclaje del backend ──────────────────────────────────────
  const [puntos,              setPuntos]              = useState([]);
  const [puntoSeleccionado,   setPuntoSeleccionado]   = useState("");

  useEffect(() => {
    getPuntos()
      .then(data => {
        setPuntos(data);
        if (data.length > 0) setPuntoSeleccionado(data[0].nombre);
      })
      .catch(() => {
        showToast("⚠️ No se cargaron los puntos del servidor", "error");
      });
  }, []);

  // ── Abrir modal en modo edición ───────────────────────────────────────────
  const abrirEditar = (entrega) => {
    setEditId(entrega.id);
    setMat(entrega.material);
    setFecha(entrega.fecha);
    setPeso(String(entrega.peso));
    setPuntoSeleccionado(entrega.punto);
    setModal(true);
  };

  // ── Abrir modal en modo nuevo ─────────────────────────────────────────────
  const abrirNuevo = () => {
    setEditId(null);
    setMat(Object.keys(MAT_CFG)[0]);
    setFecha(new Date().toISOString().split("T")[0]);
    setPeso("");
    if (puntos.length > 0) setPuntoSeleccionado(puntos[0].nombre);
    setModal(true);
  };

  // ── Registrar o guardar edición ───────────────────────────────────────────
  const registrar = () => {
    const p = parseFloat(peso);
    if (!p || p <= 0) { showToast("❌ Ingresa un peso válido", "error"); return; }
    const cfg = MAT_CFG[mat] || { pts: 20, icon: "♻️" };
    const pts = Math.round(p * cfg.pts);

    if (editId !== null) {
      // ── Modo edición: actualizar entrega existente ──
      dispatch({
        type: "EDIT_ENTREGA",
        payload: { id: editId, material: mat, icon: cfg.icon, punto: puntoSeleccionado, fecha, peso: p, pts },
      });
      showToast("✅ Entrega actualizada");
    } else {
      // ── Modo nuevo: igual que antes ──
      dispatch({
        type: "ADD_ENTREGA",
        payload: { id: Date.now(), material: mat, icon: cfg.icon, punto: puntoSeleccionado, fecha, peso: p, pts, estado: "Pendiente" },
      });
      dispatch({
        type: "ADD_HISTORIAL",
        payload: { id: Date.now(), desc: `Ganaste ${pts} puntos`, sub: `Entrega de ${mat}`, tiempo: "Ahora", icon: "⭐" },
      });
      dispatch({ type: "ADD_PTS", payload: pts });
      showToast(`✅ Entrega registrada — +${pts} pts`);
    }

    setModal(false); setPeso(""); setEditId(null);
  };

  // ── Eliminar entrega ──────────────────────────────────────────────────────
  const eliminar = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta entrega?")) return;
    dispatch({ type: "DELETE_ENTREGA", payload: id });
    showToast("🗑️ Entrega eliminada");
  };

  // ── Toggle estado Validada / Pendiente ────────────────────────────────────
  const toggleEstado = (id, estadoActual) => {
    dispatch({
      type: "TOGGLE_ESTADO_ENTREGA",
      payload: { id, estado: estadoActual === "Validada" ? "Pendiente" : "Validada" },
    });
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="page-title m-0">📦 Entregas</h4>
        <button className="btn btn-eco-primary rounded-3" onClick={abrirNuevo}>
          <i className="bi bi-plus-lg me-1"></i> Nueva entrega
        </button>
      </div>

      {/* Tabla Bootstrap */}
      <div className="eco-card p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
            <thead style={{ background: "#f9fafb" }}>
              <tr>
                {["Material","Punto de entrega","Fecha","Peso","Puntos","Estado","Acciones"].map(h => (
                  <th key={h} className="text-uppercase" style={{ padding: "10px 16px", fontSize: 11, color: "#9ca3af", fontWeight: 600, border: "none" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.entregas.map(e => (
                <tr key={e.id}>
                  <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: 18 }}>{e.icon}</span>
                      <span style={{ fontWeight: 600 }}>{e.material}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6b7280", verticalAlign: "middle" }}>{e.punto}</td>
                  <td style={{ padding: "12px 16px", color: "#6b7280", verticalAlign: "middle" }}>{e.fecha}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, verticalAlign: "middle" }}>{e.peso} kg</td>
                  <td style={{ padding: "12px 16px", fontWeight: 800, color: G, verticalAlign: "middle" }}>+{e.pts}</td>

                  {/* ── NUEVO: columna Estado con toggle ── */}
                  <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                    <div className="d-flex align-items-center gap-2">
                      {/* Toggle switch */}
                      <div
                        onClick={() => toggleEstado(e.id, e.estado)}
                        style={{
                          width: 42, height: 24, borderRadius: 24, cursor: "pointer",
                          background: e.estado === "Validada" ? G : "#d1d5db",
                          position: "relative", transition: "background .3s", flexShrink: 0,
                        }}
                      >
                        <div style={{
                          position: "absolute", top: 3,
                          left: e.estado === "Validada" ? 21 : 3,
                          width: 18, height: 18, borderRadius: "50%",
                          background: "white", transition: "left .3s",
                          boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                        }} />
                      </div>
                      {/* Badge */}
                      <span className={`eco-badge ${e.estado === "Validada" ? "eco-badge-success" : "eco-badge-gray"}`}>
                        {e.estado}
                      </span>
                    </div>
                  </td>

                  {/* ── NUEVO: columna Acciones ── */}
                  <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => abrirEditar(e)}
                        style={{
                          background: "#eff6ff", color: "#3b82f6", border: "none",
                          borderRadius: 8, padding: "6px 14px", fontSize: 13,
                          cursor: "pointer", fontWeight: 600, display: "flex",
                          alignItems: "center", gap: 4,
                        }}
                      >
                        <i className="bi bi-pencil-fill" /> Editar
                      </button>
                      <button
                        onClick={() => eliminar(e.id)}
                        style={{
                          background: "white", color: "#ef4444",
                          border: "1.5px solid #fca5a5", borderRadius: 8,
                          padding: "6px 10px", fontSize: 15, cursor: "pointer",
                          display: "flex", alignItems: "center",
                        }}
                      >
                        <i className="bi bi-trash3-fill" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal nueva entrega / edición */}
      {modal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.45)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg p-2">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: G }}>
                  {editId ? "✏️ Editar entrega" : "📦 Nueva entrega"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Material</label>
                  <select className="form-select" value={mat} onChange={e => setMat(e.target.value)} style={selStyle}>
                    {Object.keys(MAT_CFG).map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>
                    Punto de entrega
                    {puntos.length === 0 && <span style={{ color: "#9ca3af", fontWeight: 400 }}> (cargando...)</span>}
                  </label>
                  <select
                    className="form-select"
                    value={puntoSeleccionado}
                    onChange={e => setPuntoSeleccionado(e.target.value)}
                    style={selStyle}
                    disabled={puntos.length === 0}
                  >
                    {puntos.length === 0
                      ? <option>Cargando puntos...</option>
                      : puntos.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)
                    }
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Fecha</label>
                  <input type="date" className="form-control" value={fecha} onChange={e => setFecha(e.target.value)} style={selStyle} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Peso (kg)</label>
                  <input type="number" className="form-control" value={peso} onChange={e => setPeso(e.target.value)} placeholder="Ej: 2.5" style={selStyle} />
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-eco-secondary rounded-3 flex-fill" onClick={() => setModal(false)}>Cancelar</button>
                <button className="btn btn-eco-primary rounded-3 flex-fill" onClick={registrar}>
                  {editId ? "Guardar cambios" : "Registrar entrega"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}