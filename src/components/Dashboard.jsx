import { CHART_DATA } from "../constants/data";

export default function Dashboard({ state, setView }) {
  const totalKg = state.entregas.reduce((a, e) => a + e.peso, 0);
  const max = Math.max(...CHART_DATA.map(d => d.val));

  return (
    <div className="row g-3">

      {/* Resumen reciclaje */}
      <div className="col-md-6">
        <div className="card shadow-sm border h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold text-dark">
                <i className="bi bi-recycle text-success me-1"></i>Resumen de reciclaje
              </span>
              <span className="badge bg-light border text-muted fw-normal">
                <i className="bi bi-calendar3 me-1"></i>Este mes
              </span>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <div className="text-muted small mb-1">Total reciclado</div>
                <div className="fw-bold text-dark fs-3 lh-1">{totalKg.toFixed(1)} kg</div>
                <div className="text-success small mt-1">
                  <i className="bi bi-arrow-up me-1"></i>12% vs mes anterior
                </div>
              </div>
              <div className="col-6">
                <div className="text-muted small mb-1">Puntos acumulados</div>
                <div className="fw-bold text-dark fs-3 lh-1">
                  {state.pts.toLocaleString()} <i className="bi bi-star-fill text-warning"></i>
                </div>
                <div className="text-muted small mt-1">Disponibles</div>
              </div>
            </div>

            {/* Mini grafica */}
            <div className="d-flex align-items-end gap-2 mb-1" style={{height:100}}>
              {CHART_DATA.map((d, i) => (
                <div key={i} className="flex-fill d-flex flex-column align-items-center gap-1">
                  {d.hi && (
                    <span className="badge bg-warning text-dark" style={{fontSize:9}}>
                      {d.val}kg
                    </span>
                  )}
                  <div
                    className={`w-100 rounded-top ${d.hi ? "bg-warning" : "bg-success-subtle"}`}
                    style={{height: Math.max(4, Math.round((d.val / max) * 70))}}
                  />
                </div>
              ))}
            </div>
            <div className="d-flex">
              {CHART_DATA.map((d, i) => (
                <div key={i} className="flex-fill text-center text-muted" style={{fontSize:9}}>{d.label}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Entregas recientes */}
      <div className="col-md-6">
        <div className="card shadow-sm border h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold text-dark">
                <i className="bi bi-box-seam text-success me-1"></i>Entregas recientes
              </span>
              <span className="text-success fw-semibold small" role="button" onClick={() => setView("entregas")}>
                Ver todas <i className="bi bi-arrow-right"></i>
              </span>
            </div>
            {state.entregas.slice(0, 4).map(e => (
              <div key={e.id} className="d-flex align-items-center gap-2 py-2 border-bottom">
                <div className="bg-success-subtle rounded d-flex align-items-center justify-content-center flex-shrink-0 p-2">
                  <i className="bi bi-recycle text-success fs-5"></i>
                </div>
                <div className="flex-fill">
                  <div className="fw-semibold small">{e.material}</div>
                  <div className="text-muted" style={{fontSize:11}}>{e.punto}</div>
                </div>
                <div className="text-end flex-shrink-0">
                  <div className="fw-bold small">{e.peso} kg</div>
                  <div className="text-success fw-bold" style={{fontSize:11}}>+{e.pts} pts</div>
                  <span className={`badge rounded-pill ${e.estado === "Validada" ? "bg-success" : "bg-secondary"}`} style={{fontSize:10}}>
                    {e.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impacto ambiental */}
      <div className="col-md-6">
        <div className="card shadow-sm border h-100">
          <div className="card-body">
            <div className="fw-bold mb-3 text-dark">
              <i className="bi bi-tree text-success me-1"></i>Impacto ambiental
            </div>
            {[
              ["bi-tree-fill",      "CO2 evitado",         "8.4 kg",                  "aprox. 1.2 arboles"],
              ["bi-droplet-fill",   "Agua ahorrada",       "120 L",                   "Este mes"],
              ["bi-recycle",        "Residuos reciclados", `${totalKg.toFixed(1)} kg`, "Este mes"],
            ].map(([ic, lb, v, s], i) => (
              <div key={i} className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-success-subtle rounded d-flex align-items-center justify-content-center flex-shrink-0 p-2">
                  <i className={`bi ${ic} text-success fs-4`}></i>
                </div>
                <div>
                  <div className="text-muted small">{lb}</div>
                  <div className="fw-bold text-dark fs-5 lh-sm">{v}</div>
                  <div className="text-success small">{s}</div>
                </div>
              </div>
            ))}
            <button className="btn btn-outline-success w-100 fw-bold" onClick={() => setView("eco")}>
              <i className="bi bi-bar-chart-line me-1"></i>Ver mi impacto
            </button>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="col-md-6">
        <div className="card shadow-sm border h-100">
          <div className="card-body">
            <div className="fw-bold mb-3 text-dark">
              <i className="bi bi-bell text-success me-1"></i>Actividad reciente
            </div>
            {state.historial.slice(0, 5).map(h => (
              <div key={h.id} className="d-flex align-items-start gap-2 py-2 border-bottom">
                <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 p-1">
                  <i className="bi bi-check2 text-success"></i>
                </div>
                <div className="flex-fill">
                  <div className="fw-bold small">{h.desc}</div>
                  <div className="text-muted" style={{fontSize:11}}>{h.sub}</div>
                </div>
                <div className="text-muted flex-shrink-0 small">{h.tiempo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}