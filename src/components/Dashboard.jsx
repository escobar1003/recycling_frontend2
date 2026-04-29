import { CHART_DATA, REWARDS } from "../constants/data";

export default function Dashboard({ state, setView }) {
  const totalKg = state.entregas.reduce((a, e) => a + e.peso, 0);
  const max = Math.max(...CHART_DATA.map(d => d.val));

  return (
    <div className="row g-3">

      {/* ── Resumen reciclaje ── */}
      <div className="col-md-4">
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
      <div className="col-md-4">
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

      {/* ── Recompensas ── */}
      <div className="col-md-4">
        <div className="card shadow-sm h-100">
          <div className="card-body d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold" style={{ fontSize: 15 }}>🎁 Recompensas disponibles</span>
              <span className="text-success fw-semibold small" style={{ cursor: "pointer" }} onClick={() => setView("recompensas")}>Ver todas</span>
            </div>
            {REWARDS.slice(0, 3).map(r => (
              <div key={r.id} className="d-flex align-items-center gap-2 mb-2">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                  style={{ width: 40, height: 40, background: r.color, fontSize: 16 }}
                >
                  {r.icon}
                </div>
                <div className="flex-fill">
                  <div className="fw-bold small">{r.titulo}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{r.empresa}</div>
                </div>
                <div className="fw-bold text-success small">{r.pts.toLocaleString()} pts</div>
              </div>
            ))}
            <div className="mt-auto pt-2">
              <button className="btn btn-warning w-100 rounded-3 fw-bold" onClick={() => setView("recompensas")}>🎁 Ver más recompensas</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Saldo ── */}
      <div className="col-md-4">
        <div className="d-flex flex-column gap-3">
          <div className="bg-success rounded-3 p-4 text-white">
            <div className="fw-semibold mb-2" style={{ fontSize: 13, opacity: .85 }}>Saldo de puntos</div>
            <div className="fw-bold" style={{ fontSize: 32 }}>{state.pts.toLocaleString()} pts</div>
          </div>
          <div className="rounded-3 p-3" style={{ background: "#fbbf24" }}>
            <div className="fw-bold mb-1" style={{ fontSize: 12, color: "#7a5a00" }}>Puntos disponibles</div>
            <div className="fw-bold" style={{ fontSize: 26, color: "#1a1a1a" }}>{state.pts.toLocaleString()} pts</div>
            <div className="mt-1" style={{ fontSize: 11, color: "#7a5a00" }}>Canjear por recompensas y beneficios</div>
          </div>
          <button className="btn btn-outline-success rounded-3 w-100" onClick={() => setView("recompensas")}>🎁 Canjear ahora</button>
        </div>
      </div>

      {/* ── Impacto ── */}
      <div className="col-md-4">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <div className="fw-bold mb-3" style={{ fontSize: 15 }}>🌿 Impacto ambiental</div>
            {[
              ["🌳", "CO₂ evitado",          "8.4 kg",              "≈ 1.2 árboles"],
              ["💧", "Agua ahorrada",         "120 L",               "Este mes"],
              ["🌿", "Residuos reciclados",   `${totalKg.toFixed(1)} kg`, "Este mes"],
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

      {/* ── IA + Actividad ── */}
      <div className="col-md-4">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold" style={{ fontSize: 15 }}>🤖 Clasificación IA</span>
              <span className="text-success fw-semibold small" style={{ cursor: "pointer" }} onClick={() => setView("ia")}>Ver historial</span>
            </div>

            {(state.iaResult || state.iaHist[0]) ? (
              <div className="bg-light rounded-3 p-3 mb-3 d-flex align-items-center gap-3">
                <div className="bg-white rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 60, height: 60, fontSize: 32, border: "1px solid #e5e7eb" }}>
                  {(state.iaResult || state.iaHist[0]).icon}
                </div>
                <div>
                  <span className="badge bg-success rounded-pill px-3 py-1">{(state.iaResult || state.iaHist[0]).material}</span>
                  <div className="text-secondary mt-2" style={{ fontSize: 12 }}>Confianza: <strong>{(state.iaResult || state.iaHist[0]).confianza}%</strong></div>
                  <div className="text-secondary" style={{ fontSize: 12 }}>🗑️ {(state.iaResult || state.iaHist[0]).caneca}</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted py-4" style={{ fontSize: 13 }}>
                <div className="fs-2 mb-2">📷</div>
                Sin clasificaciones
              </div>
            )}

            <button className="btn btn-success w-100 rounded-3 mb-3" onClick={() => setView("ia")}>📷 Clasificar residuo</button>

            <div className="fw-bold mb-2" style={{ fontSize: 13 }}>🔔 Actividad reciente</div>
            {state.historial.slice(0, 3).map(h => (
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

      {/* ── Mapa cercanos ── */}
      <div className="col-12">
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold" style={{ fontSize: 15 }}>📍 Puntos de reciclaje cercanos</span>
            </div>
            <div className="row g-3">
              {[
                { id: 1, nombre: "Punto Verde Centro", dist: "0.4 km", horario: "Lun-Dom 7:00AM – 7:00PM", abierto: true,  icon: "🏪" },
                { id: 2, nombre: "EcoPunto Norte",      dist: "1.2 km", horario: "Lun-Dom 8:00AM – 6:00PM", abierto: true,  icon: "♻️" },
                { id: 3, nombre: "EcoPunto Sur",        dist: "1.8 km", horario: "Lun-Sáb 8:00AM – 5:00PM", abierto: false, icon: "🏬" },
                { id: 4, nombre: "Supermercado Verde",  dist: "2.1 km", horario: "Lun-Dom 8:00AM – 9:00PM", abierto: true,  icon: "🛒" },
              ].map(p => (
                <div key={p.id} className="col-md-3">
                  <div className="bg-light rounded-3 p-3 h-100 border">
                    <div className="fs-4 mb-2">{p.icon}</div>
                    <div className="fw-bold small mb-1">{p.nombre}</div>
                    <div className="text-muted mb-2" style={{ fontSize: 11 }}>A {p.dist}</div>
                    <span className={`badge rounded-pill ${p.abierto ? "bg-success" : "bg-secondary"}`} style={{ fontSize: 10 }}>
                      {p.abierto ? "Abierto" : "Cerrado"}
                    </span>
                    <div className="text-muted mt-2" style={{ fontSize: 10 }}>{p.horario}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-outline-success rounded-3 w-100 mt-3" onClick={() => setView("mapa")}>📍 Ver todos los puntos</button>
          </div>
        </div>
      </div>

    </div>
  );
}