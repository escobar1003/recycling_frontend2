import { G, GL, Y } from "../constants/data";

export default function MisPuntos({ state }) {
  const ganados   = state.historial.filter(h => h.icon === "⭐").reduce((a, h) => a + (parseInt(h.desc.match(/\d+/)?.[0]) || 0), 0);
  const canjeados = state.historial.filter(h => h.icon === "🎁").length;

  return (
    <div>
      <h4 className="page-title">🏆 Mis Puntos</h4>

      <div className="row g-3 mb-4">
        {/* Saldo actual */}
        <div className="col-md-4">
          <div style={{ background: G, borderRadius: 16, padding: "20px 22px", color: "#fff", height: "100%" }}>
            <div style={{ fontSize: 12, fontWeight: 600, opacity: .8, marginBottom: 8 }}>Saldo actual</div>
            <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>{state.pts.toLocaleString()}</div>
            <div style={{ fontSize: 12, opacity: .7, marginTop: 6 }}>puntos disponibles</div>
          </div>
        </div>
        {/* Total ganado */}
        <div className="col-md-4">
          <div style={{ background: GL, borderRadius: 16, padding: "20px 22px", color: G, height: "100%" }}>
            <div style={{ fontSize: 12, fontWeight: 600, opacity: .8, marginBottom: 8 }}>Total ganado</div>
            <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>{ganados.toLocaleString()}</div>
            <div style={{ fontSize: 12, opacity: .7, marginTop: 6 }}>este mes</div>
          </div>
        </div>
        {/* Canjes */}
        <div className="col-md-4">
          <div style={{ background: "#fef9c3", borderRadius: 16, padding: "20px 22px", color: "#c79a0f", height: "100%" }}>
            <div style={{ fontSize: 12, fontWeight: 600, opacity: .8, marginBottom: 8 }}>Canjes realizados</div>
            <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>{canjeados}</div>
            <div style={{ fontSize: 12, opacity: .7, marginTop: 6 }}>recompensas</div>
          </div>
        </div>
      </div>

      {/* Historial */}
      <div className="eco-card">
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📋 Historial de movimientos</div>
        {state.historial.map(h => (
          <div key={h.id} className="d-flex align-items-center gap-3 py-3 border-bottom">
            <div style={{ width: 38, height: 38, borderRadius: 10, background: GL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
              {h.icon}
            </div>
            <div className="flex-fill">
              <div style={{ fontWeight: 700, fontSize: 13 }}>{h.desc}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>{h.sub}</div>
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{h.tiempo}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
