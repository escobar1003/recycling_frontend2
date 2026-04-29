export default function MisPuntos({ state }) {
  const ganados   = state.historial.filter(h => h.icon === "⭐").reduce((a, h) => a + (parseInt(h.desc.match(/\d+/)?.[0]) || 0), 0);
  const canjeados = state.historial.filter(h => h.icon === "🎁").length;

  return (
    <div>
      <h4 className="fw-bold mb-4"> Mis Puntos</h4>

      <div className="row g-3 mb-4">

        {/* Saldo actual */}
        <div className="col-md-4">
          <div className="bg-success rounded-3 p-4 text-white h-100">
            <div className="small fw-semibold opacity-75 mb-2">Saldo actual</div>
            <div className="fw-bold lh-1" style={{ fontSize: 30 }}>{state.pts.toLocaleString()}</div>
            <div className="opacity-75 mt-2" style={{ fontSize: 12 }}>puntos disponibles</div>
          </div>
        </div>

        {/* Total ganado */}
        <div className="col-md-4">
          <div className="bg-success-subtle rounded-3 p-4 text-success h-100">
            <div className="small fw-semibold opacity-75 mb-2">Total ganado</div>
            <div className="fw-bold lh-1" style={{ fontSize: 30 }}>{ganados.toLocaleString()}</div>
            <div className="opacity-75 mt-2" style={{ fontSize: 12 }}>este mes</div>
          </div>
        </div>

        {/* Canjes */}
        <div className="col-md-4">
          <div className="rounded-3 p-4 h-100" style={{ background: "#fef9c3", color: "#c79a0f" }}>
            <div className="small fw-semibold opacity-75 mb-2">Canjes realizados</div>
            <div className="fw-bold lh-1" style={{ fontSize: 30 }}>{canjeados}</div>
            <div className="opacity-75 mt-2" style={{ fontSize: 12 }}>recompensas</div>
          </div>
        </div>

      </div>

      {/* Historial */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="fw-bold mb-3" style={{ fontSize: 15 }}>📋 Historial de movimientos</div>

          {state.historial.length === 0 ? (
            <div className="text-center text-muted small py-3">Sin movimientos aún</div>
          ) : (
            state.historial.map(h => (
              <div key={h.id} className="d-flex align-items-center gap-3 py-3 border-bottom">
                <div
                  className="bg-success-subtle rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 38, height: 38, fontSize: 18 }}
                >
                  {h.icon}
                </div>
                <div className="flex-fill">
                  <div className="fw-bold small">{h.desc}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>{h.sub}</div>
                </div>
                <div className="text-muted" style={{ fontSize: 12 }}>{h.tiempo}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}