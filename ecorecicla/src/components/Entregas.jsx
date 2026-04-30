import { useState, useEffect } from "react";
import { G, GL, MAT_CFG } from "../constants/data";
import { getPuntos } from "../services/api";  // ← importamos del api.js

const selStyle = {
  width: "100%", padding: "9px 12px",
  border: "1px solid #e5e7eb", borderRadius: 8,
  fontSize: 13, fontFamily: "inherit", background: "#f9fafb",
};

export default function Entregas({ state, dispatch, showToast }) {
  const [modal, setModal] = useState(false);
  const [mat,   setMat]   = useState(Object.keys(MAT_CFG)[0]);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [peso,  setPeso]  = useState("");

  // ── Puntos de reciclaje venidos del backend ───────────────────────────────
  const [puntosBackend, setPuntosBackend] = useState([]);

  useEffect(() => {
    // Al cargar el componente, traemos los puntos reales del backend
    getPuntos()
      .then(data => setPuntosBackend(data))
      .catch(() => {
        // Si falla, no pasa nada: el selector quedará vacío y mostramos aviso
        showToast("⚠️ No se cargaron los puntos de reciclaje del servidor", "error");
      });
  }, []);

  // El selector usa los puntos del backend; si aún no llegaron, muestra "Cargando..."
  const opcionesPuntos = puntosBackend.length > 0
    ? puntosBackend
    : [{ id: 0, nombre: "Cargando puntos..." }];

  const [puntoSeleccionado, setPuntoSeleccionado] = useState("");

  // Cuando lleguen los puntos del backend, seleccionamos el primero por defecto
  useEffect(() => {
    if (puntosBackend.length > 0) {
      setPuntoSeleccionado(puntosBackend[0].nombre);
    }
  }, [puntosBackend]);

  const registrar = () => {
    const p = parseFloat(peso);
    if (!p || p <= 0) { showToast("❌ Ingresa un peso válido", "error"); return; }
    if (!puntoSeleccionado) { showToast("❌ Selecciona un punto de entrega", "error"); return; }

    const cfg = MAT_CFG[mat] || { pts: 20, icon: "♻️" };
    const pts = Math.round(p * cfg.pts);

    // Guardamos localmente en el reducer (el backend de acumulación aún no tiene ruta registrada)
    dispatch({
      type: "ADD_ENTREGA",
      payload: {
        id:       Date.now(),
        material: mat,
        icon:     cfg.icon,
        punto:    puntoSeleccionado,
        fecha,
        peso:     p,
        pts,
        estado:   "Pendiente",
      },
    });
    dispatch({
      type: "ADD_HISTORIAL",
      payload: {
        id:     Date.now(),
        desc:   `Ganaste ${pts} puntos`,
        sub:    `Entrega de ${mat}`,
        tiempo: "Ahora",
        icon:   "⭐",
      },
    });
    dispatch({ type: "ADD_PTS", payload: pts });
    showToast(`✅ Entrega registrada — +${pts} pts`);
    setModal(false);
    setPeso("");
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="page-title m-0">📦 Entregas</h4>
        <button className="btn btn-eco-primary rounded-3" onClick={() => setModal(true)}>
          <i className="bi bi-plus-lg me-1"></i> Nueva entrega
        </button>
      </div>

      <div className="eco-card p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
            <thead style={{ background: "#f9fafb" }}>
              <tr>
                {["Material","Punto de entrega","Fecha","Peso","Puntos","Estado"].map(h => (
                  <th key={h} className="text-uppercase" style={{ padding: "10px 16px", fontSize: 11, color: "#9ca3af", fontWeight: 600, border: "none" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.entregas.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-5" style={{ color: "#9ca3af" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>Sin entregas registradas
                </td></tr>
              ) : state.entregas.map(e => (
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
                  <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                    <span className={`eco-badge ${e.estado === "Validada" ? "eco-badge-success" : "eco-badge-gray"}`}>{e.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal nueva entrega */}
      {modal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.45)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg p-2">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: G }}>📦 Nueva entrega</h5>
                <button type="button" className="btn-close" onClick={() => setModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>Material</label>
                  <select className="form-select" value={mat} onChange={e => setMat(e.target.value)} style={selStyle}>
                    {Object.keys(MAT_CFG).map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>

                {/* Selector de puntos — datos reales del backend */}
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: 12, color: "#4b5563" }}>
                    Punto de entrega
                    {puntosBackend.length === 0 && (
                      <span style={{ color: "#9ca3af", fontWeight: 400 }}> (cargando...)</span>
                    )}
                  </label>
                  <select
                    className="form-select"
                    value={puntoSeleccionado}
                    onChange={e => setPuntoSeleccionado(e.target.value)}
                    style={selStyle}
                    disabled={puntosBackend.length === 0}
                  >
                    {opcionesPuntos.map(p => (
                      <option key={p.id} value={p.nombre}>{p.nombre}</option>
                    ))}
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
                <button className="btn btn-eco-primary rounded-3 flex-fill" onClick={registrar}>Registrar entrega</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}