import { useState, useEffect } from "react";
import { MAT_CFG } from "../constants/data";
import { getPuntos } from "../services/api";

export default function Entregas({ state, dispatch, showToast }) {
  const [modal, setModal] = useState(false);
  const [mat,   setMat]   = useState(Object.keys(MAT_CFG)[0]);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [peso,  setPeso]  = useState("");

  const [puntos,            setPuntos]            = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState("");

  useEffect(() => {
    getPuntos()
      .then(data => {
        setPuntos(data);
        if (data.length > 0) setPuntoSeleccionado(data[0].nombre);
      })
      .catch(() => showToast("No se cargaron los puntos del servidor", "error"));
  }, []);

  const registrar = () => {
    const p = parseFloat(peso);
    if (!p || p <= 0) { showToast("Ingresa un peso válido", "error"); return; }
    const cfg = MAT_CFG[mat] || { pts: 20, icon: "♻️" };
    const pts = Math.round(p * cfg.pts);
    dispatch({
      type: "ADD_ENTREGA",
      payload: { id: Date.now(), material: mat, icon: cfg.icon, punto: puntoSeleccionado, fecha, peso: p, pts, estado: "Pendiente" },
    });
    dispatch({
      type: "ADD_HISTORIAL",
      payload: { id: Date.now(), desc: `Ganaste ${pts} puntos`, sub: `Entrega de ${mat}`, tiempo: "Ahora", icon: "⭐" },
    });
    dispatch({ type: "ADD_PTS", payload: pts });
    showToast(`Entrega registrada — +${pts} pts`);
    setModal(false); setPeso("");
  };

  return (
    <div className="container-fluid px-0">

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-0 text-dark">
            <i className="bi bi-box-seam me-2 text-success"></i>
            Entregas
          </h5>
          <small className="text-muted">
            {state.entregas.length} entrega{state.entregas.length !== 1 ? "s" : ""} registrada{state.entregas.length !== 1 ? "s" : ""}
          </small>
        </div>
        <button
          className="btn btn-success btn-sm rounded-3 d-flex align-items-center gap-2"
          onClick={() => setModal(true)}
        >
          <i className="bi bi-plus-lg"></i>
          Nueva entrega
        </button>
      </div>

      {/* ── Tabla ── */}
      <div className="card border rounded-3 shadow-none">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: 13 }}>
              <thead className="table-light border-bottom">
                <tr>
                  <th className="ps-4 py-3 fw-semibold text-muted text-uppercase border-0" style={{ fontSize: 11 }}>
                    <i className="bi bi-recycle me-1"></i>Material
                  </th>
                  <th className="py-3 fw-semibold text-muted text-uppercase border-0" style={{ fontSize: 11 }}>
                    <i className="bi bi-geo-alt me-1"></i>Punto de entrega
                  </th>
                  <th className="py-3 fw-semibold text-muted text-uppercase border-0" style={{ fontSize: 11 }}>
                    <i className="bi bi-calendar me-1"></i>Fecha
                  </th>
                  <th className="py-3 fw-semibold text-muted text-uppercase border-0" style={{ fontSize: 11 }}>
                    <i className="bi bi-speedometer2 me-1"></i>Peso
                  </th>
                  <th className="py-3 fw-semibold text-muted text-uppercase border-0" style={{ fontSize: 11 }}>
                    <i className="bi bi-star me-1"></i>Puntos
                  </th>
                  <th className="py-3 fw-semibold text-muted text-uppercase border-0" style={{ fontSize: 11 }}>
                    <i className="bi bi-check-circle me-1"></i>Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.entregas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-5">
                      <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
                      <span className="small">No hay entregas registradas</span>
                    </td>
                  </tr>
                ) : state.entregas.map(e => (
                  <tr key={e.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-2">
                        <span>{e.icon}</span>
                        <span className="fw-semibold text-dark">{e.material}</span>
                      </div>
                    </td>
                    <td className="text-secondary">{e.punto}</td>
                    <td className="text-secondary">{e.fecha}</td>
                    <td className="fw-semibold text-dark">{e.peso} kg</td>
                    <td>
                      <span
                        className="badge rounded-pill text-dark fw-semibold"
                        style={{ background: "#fef08a", fontSize: 11 }}
                      >
                        +{e.pts} pts
                      </span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill fw-normal ${e.estado === "Validada" ? "bg-success" : "bg-light text-secondary border"}`}>
                        <i className={`bi ${e.estado === "Validada" ? "bi-check-circle" : "bi-clock"} me-1`}></i>
                        {e.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Modal nueva entrega ── */}
      {modal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.4)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">

              {/* Header */}
              <div className="modal-header border-bottom">
                <h6 className="modal-title fw-bold text-dark">
                  <i className="bi bi-box-seam me-2 text-success"></i>
                  Nueva entrega
                </h6>
                <button type="button" className="btn-close" onClick={() => setModal(false)} />
              </div>

              {/* Body */}
              <div className="modal-body p-4">

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">
                    <i className="bi bi-recycle me-1 text-secondary"></i>Material
                  </label>
                  <select
                    className="form-select form-select-sm rounded-3"
                    value={mat}
                    onChange={e => setMat(e.target.value)}
                  >
                    {Object.keys(MAT_CFG).map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">
                    <i className="bi bi-geo-alt me-1 text-secondary"></i>
                    Punto de entrega
                    {puntos.length === 0 && (
                      <span className="text-muted fw-normal ms-1" style={{ fontSize: 11 }}>(cargando...)</span>
                    )}
                  </label>
                  <select
                    className="form-select form-select-sm rounded-3"
                    value={puntoSeleccionado}
                    onChange={e => setPuntoSeleccionado(e.target.value)}
                    disabled={puntos.length === 0}
                  >
                    {puntos.length === 0
                      ? <option>Cargando puntos...</option>
                      : puntos.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)
                    }
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">
                    <i className="bi bi-calendar me-1 text-secondary"></i>Fecha
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm rounded-3"
                    value={fecha}
                    onChange={e => setFecha(e.target.value)}
                  />
                </div>

                <div className="mb-1">
                  <label className="form-label small fw-semibold text-dark">
                    <i className="bi bi-speedometer2 me-1 text-secondary"></i>Peso (kg)
                  </label>
                  <div className="input-group input-group-sm">
                    <input
                      type="number"
                      className="form-control rounded-start-3"
                      value={peso}
                      onChange={e => setPeso(e.target.value)}
                      placeholder="Ej: 2.5"
                      min="0"
                      step="0.1"
                    />
                    <span className="input-group-text rounded-end-3 text-muted">kg</span>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="modal-footer border-top gap-2">
                <button className="btn btn-outline-secondary btn-sm rounded-3 flex-fill" onClick={() => setModal(false)}>
                  <i className="bi bi-x me-1"></i>Cancelar
                </button>
                <button className="btn btn-success btn-sm rounded-3 flex-fill" onClick={registrar}>
                  <i className="bi bi-check-lg me-1"></i>Registrar entrega
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}