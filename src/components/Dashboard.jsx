import { CHART_DATA } from "../constants/data";

export default function Dashboard({ state }) {
  const totalKg = state.entregas.reduce((a, e) => a + e.peso, 0);
  const max = Math.max(...CHART_DATA.map(d => d.val));

  return (
    <div className="row g-3">

      {/* Resumen reciclaje */}
      <div className="col-md-6">
        <div className="card shadow-sm border-0 h-100" style={{ borderLeft: "4px solid #16a34a" }}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold text-dark">
                <i className="bi bi-recycle me-1" style={{ color: "#16a34a" }}></i>Resumen de reciclaje
              </span>
              <span className="badge rounded-pill fw-normal" style={{ background: "#f3f4f6", color: "#111111", fontSize: 11 }}>
                <i className="bi bi-calendar3 me-1"></i>Este mes
              </span>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <div className="text-muted small mb-1">Total reciclado</div>
                <div className="fw-bold fs-3 lh-1" style={{ color: "#111111" }}>{totalKg.toFixed(1)} kg</div>
                <div className="small mt-1" style={{ color: "#16a34a" }}>
                  <i className="bi bi-arrow-up me-1"></i>12% vs mes anterior
                </div>
              </div>
              <div className="col-6">
                <div className="text-muted small mb-1">Puntos acumulados</div>
                <div className="fw-bold fs-3 lh-1" style={{ color: "#111111" }}>
                  {state.pts.toLocaleString()} <i className="bi bi-star-fill" style={{ color: "#facc15" }}></i>
                </div>
                <div className="text-muted small mt-1">Disponibles</div>
              </div>
            </div>

            {/* Mini gráfica */}
            <div className="d-flex align-items-end gap-2 mb-1" style={{ height: 100 }}>
              {CHART_DATA.map((d, i) => (
                <div key={i} className="flex-fill d-flex flex-column align-items-center gap-1">
                  {d.hi && (
                    <span className="badge" style={{ background: "#facc15", color: "#111111", fontSize: 9 }}>
                      {d.val}kg
                    </span>
                  )}
                  <div
                    className="w-100 rounded-top"
                    style={{
                      height: Math.max(4, Math.round((d.val / max) * 70)),
                      background: d.hi ? "#facc15" : "#dcfce7",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="d-flex">
              {CHART_DATA.map((d, i) => (
                <div key={i} className="flex-fill text-center text-muted" style={{ fontSize: 9 }}>{d.label}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Entregas recientes */}
      <div className="col-md-6">
        <div className="card shadow-sm border-0 h-100" style={{ borderLeft: "4px solid #facc15" }}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold text-dark">
                <i className="bi bi-box-seam me-1" style={{ color: "#16a34a" }}></i>Entregas recientes
              </span>
            </div>
            {state.entregas.length === 0 ? (
              <div className="text-center text-muted py-4">
                <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                <span className="small">No hay entregas registradas</span>
              </div>
            ) : state.entregas.slice(0, 4).map(e => (
              <div key={e.id} className="d-flex align-items-center gap-2 py-2 border-bottom">
                <div
                  className="rounded d-flex align-items-center justify-content-center flex-shrink-0 p-2"
                  style={{ background: "#f0fdf4" }}
                >
                  <i className="bi bi-recycle fs-5" style={{ color: "#16a34a" }}></i>
                </div>
                <div className="flex-fill">
                  <div className="fw-semibold small">{e.material}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{e.punto}</div>
                </div>
                <div className="text-end flex-shrink-0">
                  <div className="fw-bold small">{e.peso} kg</div>
                  <div className="fw-bold small" style={{ color: "#16a34a" }}>+{e.pts} pts</div>
                  <span
                    className="badge rounded-pill"
                    style={{
                      fontSize: 10,
                      background: e.estado === "Validada" ? "#16a34a" : "#f3f4f6",
                      color: e.estado === "Validada" ? "#fff" : "#6b7280",
                    }}
                  >
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
        <div className="card shadow-sm border-0 h-100" style={{ borderLeft: "4px solid #16a34a" }}>
          <div className="card-body">
            <div className="fw-bold mb-3 text-dark">
              <i className="bi bi-tree me-1" style={{ color: "#16a34a" }}></i>Impacto ambiental
            </div>
            {[
              ["bi-tree-fill",    "CO2 evitado",         "8.4 kg",                   "aprox. 1.2 arboles"],
              ["bi-droplet-fill", "Agua ahorrada",       "120 L",                    "Este mes"],
              ["bi-recycle",      "Residuos reciclados", `${totalKg.toFixed(1)} kg`, "Este mes"],
            ].map(([ic, lb, v, s], i) => (
              <div key={i} className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded d-flex align-items-center justify-content-center flex-shrink-0 p-2"
                  style={{ background: "#f0fdf4" }}
                >
                  <i className={`bi ${ic} fs-4`} style={{ color: "#16a34a" }}></i>
                </div>
                <div>
                  <div className="text-muted small">{lb}</div>
                  <div className="fw-bold fs-5 lh-sm" style={{ color: "#111111" }}>{v}</div>
                  <div className="small" style={{ color: "#16a34a" }}>{s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="col-md-6">
        <div className="card shadow-sm border-0 h-100" style={{ borderLeft: "4px solid #facc15" }}>
          <div className="card-body">
            <div className="fw-bold mb-3 text-dark">
              <i className="bi bi-bell me-1" style={{ color: "#16a34a" }}></i>Actividad reciente
            </div>
            {state.historial.length === 0 ? (
              <div className="text-center text-muted py-4">
                <i className="bi bi-clock-history fs-2 d-block mb-2"></i>
                <span className="small">Sin actividad reciente</span>
              </div>
            ) : state.historial.slice(0, 5).map(h => (
              <div key={h.id} className="d-flex align-items-start gap-2 py-2 border-bottom">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 p-1"
                  style={{ background: "#f0fdf4" }}
                >
                  <i className="bi bi-check2" style={{ color: "#16a34a" }}></i>
                </div>
                <div className="flex-fill">
                  <div className="fw-bold small">{h.desc}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{h.sub}</div>
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