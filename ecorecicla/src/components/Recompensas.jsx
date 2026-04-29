import { G, Y, REWARDS } from "../constants/data";

export default function Recompensas({ state, dispatch, showToast }) {
  const canjear = (r) => {
    if (state.pts < r.pts) { showToast("❌ Puntos insuficientes", "error"); return; }
    dispatch({ type: "ADD_PTS", payload: -r.pts });
    dispatch({ type: "ADD_HISTORIAL", payload: { id: Date.now(), desc: "Canje realizado", sub: r.titulo, tiempo: "Ahora", icon: "🎁" } });
    showToast(`🎁 ¡Canjeado! ${r.titulo}`);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="page-title m-0">🎁 Recompensas disponibles</h4>
        <div style={{ fontSize: 14, color: "#4b5563" }}>
          Disponibles: <strong style={{ color: G, fontSize: 16 }}>{state.pts.toLocaleString()} pts</strong>
        </div>
      </div>

      <div className="row g-3">
        {REWARDS.map(r => {
          const can = state.pts >= r.pts;
          const pct = Math.min(100, Math.round((state.pts / r.pts) * 100));
          return (
            <div key={r.id} className="col-md-4">
              <div className="eco-card h-100 d-flex flex-column">
                <div style={{ width: 52, height: 52, background: r.color, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 10, color: "#fff", fontWeight: 800 }}>
                  {r.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{r.titulo}</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>{r.empresa}</div>

                <div className="mt-auto">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span style={{ fontWeight: 800, fontSize: 15, color: G }}>{r.pts.toLocaleString()} pts</span>
                    {!can && <span style={{ fontSize: 11, color: "#9ca3af" }}>Faltan {(r.pts - state.pts).toLocaleString()}</span>}
                  </div>
                  <div className="progress mb-3" style={{ height: 6, borderRadius: 3 }}>
                    <div className="progress-bar" style={{ width: `${pct}%`, background: can ? G : Y, transition: ".4s" }} />
                  </div>
                  <button
                    className={`btn w-100 rounded-3 ${can ? "btn-eco-primary" : "btn-eco-secondary"}`}
                    onClick={() => can && canjear(r)}
                    disabled={!can}
                  >
                    {can ? "🎁 Canjear ahora" : "🔒 Puntos insuficientes"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
