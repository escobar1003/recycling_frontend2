import { CHART_DATA } from "../constants/data";

export default function Dashboard({ state, setView }) {
  const totalKg = state.entregas.reduce((a, e) => a + e.peso, 0);
  const max = Math.max(...CHART_DATA.map(d => d.val));

  return (
    <div className="row g-3">

      {/* ── Resumen reciclaje ── */}
      <div className="col-md-6">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold" style={{ fontSize: 15 }}>🌿 Resumen de reciclaje</span>
              <span className="badge bg-light border text-muted fw-normal" style={{ fontSize: 12 }}>📅 Este mes ▾</span>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <div className="text-muted mb-1" style={{ fontSize: 11 }}>Total reciclado</div>
                <div className="fw-bold text-dark lh-1" style={{ fontSize: 28 }}>{totalKg.toFixed(1)} kg</div>
                <div className="text-success mt-1" style={{ fontSize: 11 }}>↑ 12% vs mes anterior</div>
              </div>
              <div className="col-6">
                <div className="text-muted mb-1" style={{ fontSize: 11 }}>Puntos acumulados</div>
                <div className="fw-bold text-dark lh-1" style={{ fontSize: 28 }}>{state.pts.toLocaleString()} ⭐</div>
                <div className="text-muted mt-1" style={{ fontSize: 11 }}>Disponibles</div>
              </div>
            </div>

            {/* Mini gráfica */}
            <div className="d-flex align-items-end gap-2 mb-1" style={{ height: 100 }}>
              {CHART_DATA.map((d, i) => (
                <div key={i} className="flex-fill d-flex flex-column align-items-center gap-1">
                  {d.hi && (
                    <div className="bg-success text-white rounded-2 text-center fw-bold" style={{ padding: "2px 6px", fontSize: 9, whiteSpace: "nowrap" }}>
                      {d.val}kg<br />+{d.pts}pts
                    </div>
                  )}
                  <div
                    className="w-100 rounded-top-2"
                    style={{ height: Math.max(4, Math.round((d.val / max) * 70)), background: d.hi ? "#fbbf24" : "#dcfce7" }}
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

      {/* ── Entregas recientes ── */}
      <div className="col-md-6">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold" style={{ fontSize: 15 }}>♻️ Entregas recientes</span>
              <span className="text-success fw-semibold small" style={{ cursor: "pointer" }} onClick={() => setView("entregas")}>Ver todas</span>
            </div>
            {state.entregas.slice(0, 4).map(e => (
              <div key={e.id} className="d-flex align-items-center gap-2 py-2 border-bottom">
                <div className="bg-success-subtle rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 38, height: 38, fontSize: 18 }}>
                  {e.icon}
                </div>
                <div className="flex-fill" style={{ minWidth: 0 }}>
                  <div className="fw-semibold small">{e.material}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{e.punto}</div>
                </div>
                <div className="text-end flex-shrink-0">
                  <div className="fw-bold small">{e.peso} kg</div>
                  <div className="text-success fw-bold" style={{ fontSize: 11 }}>+{e.pts} pts</div>
                  <span className={`badge rounded-pill ${e.estado === "Validada" ? "bg-success" : "bg-secondary"}`} style={{ fontSize: 10 }}>{e.estado}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Impacto ── */}
      <div className="col-md-6">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <div className="fw-bold mb-3" style={{ fontSize: 15 }}>🌿 Impacto ambiental</div>
            {[
              ["🌳", "CO₂ evitado",        "8.4 kg",                    "≈ 1.2 árboles"],
              ["💧", "Agua ahorrada",       "120 L",                     "Este mes"],
              ["🌿", "Residuos reciclados", `${totalKg.toFixed(1)} kg`,  "Este mes"],
            ].map(([ic, lb, v, s], i) => (
              <div key={i} className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-success-subtle rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 42, height: 42, fontSize: 22 }}>
                  {ic}
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{lb}</div>
                  <div className="fw-bold text-dark lh-sm" style={{ fontSize: 20 }}>{v}</div>
                  <div className="text-success" style={{ fontSize: 11 }}>{s}</div>
                </div>
              </div>
            ))}
            <button className="btn btn-outline-success rounded-3 w-100" onClick={() => setView("eco")}>📊 Ver mi impacto</button>
          </div>
        </div>
      </div>

      {/* ── Actividad reciente ── */}
      <div className="col-md-6">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <div className="fw-bold mb-3" style={{ fontSize: 15 }}>🔔 Actividad reciente</div>
            {state.historial.slice(0, 5).map(h => (
              <div key={h.id} className="d-flex align-items-start gap-2 py-2 border-bottom">
                <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 28, height: 28, fontSize: 14 }}>
                  {h.icon}
                </div>
                <div className="flex-fill">
                  <div className="fw-bold" style={{ fontSize: 12 }}>{h.desc}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{h.sub}</div>
                </div>
                <div className="text-muted flex-shrink-0" style={{ fontSize: 10 }}>{h.tiempo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}