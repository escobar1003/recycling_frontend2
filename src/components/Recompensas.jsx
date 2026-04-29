import { REWARDS } from "../constants/data";

export default function Recompensas({ state, dispatch, showToast }) {
  const canjear = (r) => {
    if (state.pts < r.pts) { showToast(" Puntos insuficientes", "error"); return; }
    dispatch({ type: "ADD_PTS", payload: -r.pts });
    dispatch({ type: "ADD_HISTORIAL", payload: { id: Date.now(), desc: "Canje realizado", sub: r.titulo, tiempo: "Ahora", icon: "" } });
    showToast(` ¡Canjeado! ${r.titulo}`);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0"> Recompensas disponibles</h4>
        <div className="small text-secondary">
          Disponibles: <strong className="text-success fs-6">{state.pts.toLocaleString()} pts</strong>
        </div>
      </div>

      <div className="row g-3">
        {REWARDS.map(r => {
          const can = state.pts >= r.pts;
          const pct = Math.min(100, Math.round((state.pts / r.pts) * 100));
          return (
            <div key={r.id} className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">

                  {/* Ícono */}
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 mb-3 fs-4 fw-bold text-white"
                    style={{ width: 52, height: 52, background: r.color }}
                  >
                    {r.icon}
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
                      {!can && (
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
                        aria-valuenow={pct}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>

                    <button
                      className={`btn w-100 rounded-3 ${can ? "btn-success" : "btn-secondary"}`}
                      onClick={() => can && canjear(r)}
                      disabled={!can}
                    >
                      {can ? " Canjear ahora" : " Puntos insuficientes"}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}