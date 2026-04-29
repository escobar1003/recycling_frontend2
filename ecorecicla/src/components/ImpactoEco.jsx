import { G, GL, GS } from "../constants/data";

export default function ImpactoEco({ state }) {
  const totalKg = state.entregas.reduce((a, e) => a + e.peso, 0);
  const co2     = (totalKg * 0.13).toFixed(1);
  const agua    = Math.round(totalKg * 1.86);
  const arboles = (co2 / 7).toFixed(1);

  const logros = [
    { icon: "🌱", title: "Primer reciclaje",  desc: "Registraste tu primera entrega",     done: true },
    { icon: "🔟", title: "10 entregas",        desc: `${state.entregas.length}/10 entregas`, done: state.entregas.length >= 10 },
    { icon: "💯", title: "100 kg reciclados",  desc: `${totalKg.toFixed(1)}/100 kg`,        done: totalKg >= 100 },
    { icon: "⭐", title: "Acumulador",          desc: "Llega a 5,000 puntos",               done: state.pts >= 5000 },
  ];

  return (
    <div>
      <h4 className="page-title">🌿 Impacto Ecológico</h4>

      {/* Métricas */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="eco-card" style={{ background: G, border: "none" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🌳</div>
            <div style={{ fontSize: 11, color: "#fff", opacity: .8, marginBottom: 4 }}>CO₂ evitado</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{co2} kg</div>
            <div style={{ fontSize: 12, color: "#fff", opacity: .7, marginTop: 6 }}>≈ {arboles} árboles</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="eco-card" style={{ background: "#dbeafe", border: "none" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>💧</div>
            <div style={{ fontSize: 11, color: "#1e40af", opacity: .8, marginBottom: 4 }}>Agua ahorrada</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#1e40af", lineHeight: 1 }}>{agua} L</div>
            <div style={{ fontSize: 12, color: "#1e40af", opacity: .7, marginTop: 6 }}>Este mes</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="eco-card" style={{ background: GL, border: "none" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🌿</div>
            <div style={{ fontSize: 11, color: G, opacity: .8, marginBottom: 4 }}>Residuos reciclados</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: G, lineHeight: 1 }}>{totalKg.toFixed(1)} kg</div>
            <div style={{ fontSize: 12, color: G, opacity: .7, marginTop: 6 }}>Total acumulado</div>
          </div>
        </div>
      </div>

      {/* Logros */}
      <div className="eco-card">
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>🏅 Logros ambientales</div>
        <div className="row g-3">
          {logros.map((l, i) => (
            <div key={i} className="col-md-6">
              <div
                className="d-flex align-items-center gap-3 p-3 rounded-3"
                style={{ background: l.done ? GL : "#f9fafb", border: `1px solid ${l.done ? "#c6e6d5" : "#e5e7eb"}` }}
              >
                <div style={{ fontSize: 28, opacity: l.done ? 1 : .4 }}>{l.icon}</div>
                <div className="flex-fill">
                  <div style={{ fontWeight: 700, fontSize: 13, color: l.done ? G : "#6b7280" }}>{l.title}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{l.desc}</div>
                </div>
                {l.done && <div style={{ fontSize: 16 }}>✅</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
