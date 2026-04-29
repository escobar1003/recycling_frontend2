import { G, GL, GS, Y, CHART_DATA, REWARDS } from "../constants/data";

export default function Dashboard({ state, setView }) {
  const totalKg = state.entregas.reduce((a, e) => a + e.peso, 0);
  const max = Math.max(...CHART_DATA.map(d => d.val));

  return (
    <div className="row g-3">

      {/* ── Resumen reciclaje ────────────────────────────────────────────────── */}
      <div className="col-md-4">
        <div className="eco-card h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontWeight: 700, fontSize: 15 }}>🌿 Resumen de reciclaje</span>
            <span className="badge rounded-pill" style={{ background: "#f9fafb", border: "1px solid #e5e7eb", color: "#9ca3af", fontSize: 12, fontWeight: 500 }}>📅 Este mes ▾</span>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Total reciclado</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#1f2937", lineHeight: 1 }}>{totalKg.toFixed(1)} kg</div>
              <div style={{ fontSize: 11, color: GS, marginTop: 4 }}>↑ 12% vs mes anterior</div>
            </div>
            <div className="col-6">
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Puntos acumulados</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#1f2937", lineHeight: 1 }}>{state.pts.toLocaleString()} ⭐</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>Disponibles</div>
            </div>
          </div>

          {/* Mini gráfica */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, marginBottom: 6 }}>
            {CHART_DATA.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                {d.hi && (
                  <div style={{ background: G, color: "#fff", borderRadius: 6, padding: "2px 6px", fontSize: 9, fontWeight: 700, whiteSpace: "nowrap", textAlign: "center" }}>
                    {d.val}kg<br />+{d.pts}pts
                  </div>
                )}
                <div style={{ width: "100%", height: Math.max(4, Math.round((d.val / max) * 70)), background: d.hi ? Y : GL, borderRadius: "4px 4px 0 0" }} />
              </div>
            ))}
          </div>
          <div className="d-flex">
            {CHART_DATA.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "#9ca3af" }}>{d.label}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Entregas recientes ───────────────────────────────────────────────── */}
      <div className="col-md-4">
        <div className="eco-card h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontWeight: 700, fontSize: 15 }}>♻️ Entregas recientes</span>
            <span style={{ fontSize: 12, color: G, cursor: "pointer", fontWeight: 600 }} onClick={() => setView("entregas")}>Ver todas</span>
          </div>
          {state.entregas.slice(0, 4).map(e => (
            <div key={e.id} className="d-flex align-items-center gap-2 py-2 border-bottom">
              <div style={{ width: 38, height: 38, background: GL, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{e.icon}</div>
              <div className="flex-fill" style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{e.material}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{e.punto}</div>
              </div>
              <div className="text-end" style={{ flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{e.peso} kg</div>
                <div style={{ fontSize: 11, color: G, fontWeight: 700 }}>+{e.pts} pts</div>
                <span className={`eco-badge ${e.estado === "Validada" ? "eco-badge-success" : "eco-badge-gray"}`}>{e.estado}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recompensas ──────────────────────────────────────────────────────── */}
      <div className="col-md-4">
        <div className="eco-card h-100 d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontWeight: 700, fontSize: 15 }}>🎁 Recompensas disponibles</span>
            <span style={{ fontSize: 12, color: G, cursor: "pointer", fontWeight: 600 }} onClick={() => setView("recompensas")}>Ver todas</span>
          </div>
          {REWARDS.slice(0, 3).map(r => (
            <div key={r.id} className="d-flex align-items-center gap-2 mb-2">
              <div style={{ width: 40, height: 40, background: r.color, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{r.icon}</div>
              <div className="flex-fill">
                <div style={{ fontWeight: 700, fontSize: 13 }}>{r.titulo}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{r.empresa}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 14, color: G }}>{r.pts.toLocaleString()} pts</div>
            </div>
          ))}
          <div className="mt-auto">
            <button className="btn btn-eco-yellow w-100 rounded-3" onClick={() => setView("recompensas")}>🎁 Ver más recompensas</button>
          </div>
        </div>
      </div>

      {/* ── Saldo ────────────────────────────────────────────────────────────── */}
      <div className="col-md-4">
        <div className="d-flex flex-column gap-3">
          <div style={{ background: G, borderRadius: 16, padding: 20, color: "#fff" }}>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: .85, marginBottom: 6 }}>Saldo de puntos</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{state.pts.toLocaleString()} pts</div>
          </div>
          <div style={{ background: Y, borderRadius: 16, padding: "16px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#7a5a00", marginBottom: 4 }}>Puntos disponibles</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a" }}>{state.pts.toLocaleString()} pts</div>
            <div style={{ fontSize: 11, color: "#7a5a00", marginTop: 4 }}>Canjear por recompensas y beneficios</div>
          </div>
          <button className="btn btn-eco-outline rounded-3 w-100" onClick={() => setView("recompensas")}>🎁 Canjear ahora</button>
        </div>
      </div>

      {/* ── Impacto ──────────────────────────────────────────────────────────── */}
      <div className="col-md-4">
        <div className="eco-card h-100">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>🌿 Impacto ambiental</div>
          {[
            ["🌳","CO₂ evitado","8.4 kg","≈ 1.2 árboles"],
            ["💧","Agua ahorrada","120 L","Este mes"],
            ["🌿","Residuos reciclados",`${totalKg.toFixed(1)} kg`,"Este mes"],
          ].map(([ic, lb, v, s], i) => (
            <div key={i} className="d-flex align-items-center gap-3 mb-3">
              <div style={{ width: 42, height: 42, background: GL, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{ic}</div>
              <div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{lb}</div>
                <div style={{ fontWeight: 800, fontSize: 20, color: "#1f2937", lineHeight: 1.1 }}>{v}</div>
                <div style={{ fontSize: 11, color: GS }}>{s}</div>
              </div>
            </div>
          ))}
          <button className="btn btn-eco-outline rounded-3 w-100" onClick={() => setView("eco")}>📊 Ver mi impacto</button>
        </div>
      </div>

      {/* ── IA + Actividad ───────────────────────────────────────────────────── */}
      <div className="col-md-4">
        <div className="eco-card h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontWeight: 700, fontSize: 15 }}>🤖 Clasificación IA</span>
            <span style={{ fontSize: 12, color: G, cursor: "pointer", fontWeight: 600 }} onClick={() => setView("ia")}>Ver historial</span>
          </div>
          {(state.iaResult || state.iaHist[0]) ? (
            <div style={{ background: "#f9fafb", borderRadius: 12, padding: 12, marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 60, height: 60, background: "#f0f0f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
                {(state.iaResult || state.iaHist[0]).icon}
              </div>
              <div>
                <span className="eco-badge eco-badge-success">{(state.iaResult || state.iaHist[0]).material}</span>
                <div style={{ fontSize: 12, color: "#4b5563", marginTop: 6 }}>Confianza: <strong>{(state.iaResult || state.iaHist[0]).confianza}%</strong></div>
                <div style={{ fontSize: 12, color: "#4b5563", marginTop: 2 }}>🗑️ {(state.iaResult || state.iaHist[0]).caneca}</div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#9ca3af", padding: "20px 0", fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>Sin clasificaciones
            </div>
          )}
          <button className="btn btn-eco-primary w-100 rounded-3 mb-3" onClick={() => setView("ia")}>📷 Clasificar residuo</button>

          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>🔔 Actividad reciente</div>
          {state.historial.slice(0, 3).map(h => (
            <div key={h.id} className="d-flex align-items-start gap-2 py-2 border-bottom">
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: GL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{h.icon}</div>
              <div className="flex-fill">
                <div style={{ fontWeight: 700, fontSize: 12 }}>{h.desc}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{h.sub}</div>
              </div>
              <div style={{ fontSize: 10, color: "#9ca3af", flexShrink: 0 }}>{h.tiempo}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mapa cercanos ────────────────────────────────────────────────────── */}
      <div className="col-12">
        <div className="eco-card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontWeight: 700, fontSize: 15 }}>📍 Puntos de reciclaje cercanos</span>
          </div>
          <div className="row g-3">
            {[
              { id: 1, nombre: "Punto Verde Centro", dist: "0.4 km", horario: "Lun-Dom 7:00AM – 7:00PM", abierto: true,  icon: "🏪" },
              { id: 2, nombre: "EcoPunto Norte",      dist: "1.2 km", horario: "Lun-Dom 8:00AM – 6:00PM", abierto: true,  icon: "♻️" },
              { id: 3, nombre: "EcoPunto Sur",        dist: "1.8 km", horario: "Lun-Sáb 8:00AM – 5:00PM", abierto: false, icon: "🏬" },
              { id: 4, nombre: "Supermercado Verde",  dist: "2.1 km", horario: "Lun-Dom 8:00AM – 9:00PM", abierto: true,  icon: "🛒" },
            ].map(p => (
              <div key={p.id} className="col-md-3">
                <div style={{ background: "#f9fafb", borderRadius: 12, padding: 12, border: "1px solid #f0f0f0", height: "100%" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{p.nombre}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>A {p.dist}</div>
                  <span className={`eco-badge ${p.abierto ? "eco-badge-success" : "eco-badge-gray"}`}>{p.abierto ? "Abierto" : "Cerrado"}</span>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 6 }}>{p.horario}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-eco-outline rounded-3 w-100 mt-3" onClick={() => setView("mapa")}>📍 Ver todos los puntos</button>
        </div>
      </div>

    </div>
  );
}
