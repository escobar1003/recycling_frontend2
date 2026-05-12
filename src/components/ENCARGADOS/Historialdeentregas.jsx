import { useReducer, useRef } from "react";

const COLORS = {
  green: "#1a7a3c",
  greenDark: "#145e2e",
  greenLight: "#e8f5ee",
  greenMid: "#2e9e55",
  gold: "#f59e0b",
  white: "#ffffff",
  bg: "#f4f7f4",
  sidebar: "#1a5c2a",
  sidebarDark: "#133f1d",
  text: "#1a2e1f",
  textMuted: "#6b7f70",
  border: "#d1e0d5",
  danger: "#dc2626",
  dangerLight: "#fef2f2",
};

const initialState = {
  activePage: "historiar-entregas",
  selectedDelivery: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, activePage: action.payload, selectedDelivery: null };
    case "SELECT_DELIVERY":
      return { ...state, selectedDelivery: action.payload };
    case "BACK_TO_LIST":
      return { ...state, selectedDelivery: null };
    default:
      return state;
  }
}

const navItems = [
  { id: "panel-control", label: "Panel de control", icon: "⊞" },
  { id: "historial-entregas", label: "Historial entregas", icon: "📋" },
  { id: "canjes", label: "Canjes", icon: "🎁" },
  { id: "reportes", label: "Reportes", icon: "📊" },
  { id: "perfil", label: "Perfil", icon: "👤" },
  { id: "salir", label: "Salir", icon: "↑" },
];

const deliveries = [
  { id: 1, usuario: "Juan Pérez", material: "Plástico PET", peso: "5.2 kg", puntos: 520, fecha: "2023-10-26", estado: "Válido" },
  { id: 2, usuario: "María López", material: "Cartón", peso: "8.1 kg", puntos: 324, fecha: "2023-10-25", estado: "Válido" },
  { id: 3, usuario: "Carlos Gómez", material: "Rechazado", peso: "2.3 kg", puntos: 0, fecha: "2023-10-24", estado: "Rechazado" },
  { id: 4, usuario: "Peteriko", material: "Vidrio", peso: "4.7 kg", puntos: 188, fecha: "2023-10-23", estado: "Válido" },
  { id: 5, usuario: "Ana Martínez", material: "Plástico PET", peso: "3.5 kg", puntos: 350, fecha: "2023-10-22", estado: "Válido" },
  { id: 6, usuario: "Luis Torres", material: "Metal", peso: "6.0 kg", puntos: 480, fecha: "2023-10-21", estado: "Pendiente" },
];

const historialManjes = [
  { id: 1, usuarial: "Plástico", recompensa: "Bono reciclados", puntosUsados: 500, puntosPeso: 150, puntosOtorgados: 3000, fecha: "2024-07-01", estado: "Completado" },
  { id: 2, usuarial: "Vidrio", recompensa: "Bolsa reutilizable", puntosUsados: 100, puntosPeso: 80, puntosOtorgados: 3000, fecha: "2024-07-01", estado: "En proceso" },
  { id: 3, usuarial: "Juan Pérez", recompensa: "Bolsa reutilizable", puntosUsados: 180, puntosPeso: 60, puntosOtorgados: 1800, fecha: "2024-07-01", estado: "Pendiente" },
  { id: 4, usuarial: "Cartón", recompensa: "Bolsa reutilizable", puntosUsados: 750, puntosPeso: 250, puntosOtorgados: 3600, fecha: "2024-07-01", estado: "En proceso" },
];

const materialColors = {
  "Plástico PET": COLORS.greenMid,
  Cartón: "#a16207",
  Vidrio: "#0891b2",
  Metal: "#6b7280",
  Rechazado: COLORS.danger,
};

function StatCard({ label, value, icon }) {
  return (
    <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px 20px", flex: 1, minWidth: 130 }}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ estado }) {
  const colors = {
    Válido: { bg: "#dcfce7", color: "#166534" },
    Rechazado: { bg: "#fee2e2", color: "#991b1b" },
    Pendiente: { bg: "#fef9c3", color: "#854d0e" },
    Completado: { bg: "#dcfce7", color: "#166534" },
    "En proceso": { bg: "#dbeafe", color: "#1e40af" },
  };
  const s = colors[estado] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
      {estado}
    </span>
  );
}

function DeliveryDetail({ delivery, dispatch }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => dispatch({ type: "BACK_TO_LIST" })}
          style={{ background: COLORS.greenLight, border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: COLORS.green, fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}
        >
          ← Volver
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>Detalle de entrega</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ fontSize: 14, color: COLORS.textMuted, fontWeight: 500, marginBottom: 16 }}>Información del reciclador</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><span style={{ color: COLORS.textMuted, fontSize: 13 }}>Usuario:</span> <strong style={{ color: COLORS.text }}>{delivery.usuario}</strong></div>
            <div><span style={{ color: COLORS.textMuted, fontSize: 13 }}>Material:</span> <strong style={{ color: materialColors[delivery.material] || COLORS.text }}>{delivery.material}</strong></div>
            <div><span style={{ color: COLORS.textMuted, fontSize: 13 }}>Peso:</span> <strong style={{ color: COLORS.text }}>{delivery.peso}</strong></div>
            <div><span style={{ color: COLORS.textMuted, fontSize: 13 }}>Fecha:</span> <strong style={{ color: COLORS.text }}>{delivery.fecha}</strong></div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ color: COLORS.textMuted, fontSize: 13 }}>Estado:</span> <StatusBadge estado={delivery.estado} /></div>
          </div>
        </div>

        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>♻️</div>
          <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 4 }}>Puntos otorgados</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: COLORS.gold }}>{delivery.puntos}</div>
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button style={{ background: COLORS.greenLight, color: COLORS.green, border: `1px solid ${COLORS.green}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Editar</button>
            <button style={{ background: "#fff7ed", color: "#c2410c", border: "1px solid #c2410c", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Corregir pts</button>
          </div>
        </div>
      </div>

      <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 24px", marginTop: 20 }}>
        <div style={{ fontSize: 14, color: COLORS.textMuted, fontWeight: 500, marginBottom: 12 }}>Observaciones</div>
        <div style={{ background: COLORS.bg, borderRadius: 8, padding: "12px 16px", fontSize: 14, color: COLORS.textMuted, fontStyle: "italic" }}>
          Sin observaciones registradas.
        </div>
      </div>
    </div>
  );
}

function HistorialEntregas({ dispatch }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 20 }}>Historial de entregas</h2>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <select style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "7px 14px", fontSize: 13, color: COLORS.text, background: COLORS.white }}>
          <option>Fecha</option>
          <option>2024-07</option>
          <option>2024-06</option>
        </select>
        <select style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "7px 14px", fontSize: 13, color: COLORS.text, background: COLORS.white }}>
          <option>Material</option>
          <option>Plástico PET</option>
          <option>Cartón</option>
          <option>Vidrio</option>
        </select>
      </div>

      <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: COLORS.bg }}>
              {["Usuario", "Material", "Peso", "Puntos", "Fecha", "Estado", "Acciones"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: COLORS.textMuted, fontSize: 12, borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deliveries.map((d, i) => (
              <tr key={d.id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? COLORS.white : "#fafdf9" }}>
                <td style={{ padding: "12px 16px", color: COLORS.text, fontWeight: 500 }}>{d.usuario}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: materialColors[d.material] || "#888", display: "inline-block" }}></span>
                    <span style={{ color: COLORS.text }}>{d.material}</span>
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: COLORS.text }}>{d.peso}</td>
                <td style={{ padding: "12px 16px", color: COLORS.gold, fontWeight: 700 }}>{d.puntos}</td>
                <td style={{ padding: "12px 16px", color: COLORS.textMuted }}>{d.fecha}</td>
                <td style={{ padding: "12px 16px" }}><StatusBadge estado={d.estado} /></td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => dispatch({ type: "SELECT_DELIVERY", payload: d })}
                      style={{ background: COLORS.greenLight, color: COLORS.green, border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                    >Ver</button>
                    <button style={{ background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HistorialManjes() {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>Historial de manjes</h2>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <span style={{ fontSize: 14, color: COLORS.textMuted }}>Fecha:</span>
        <select style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "7px 14px", fontSize: 13, color: COLORS.text, background: COLORS.white }}>
          <option>Material</option>
          <option>Plástico</option>
          <option>Vidrio</option>
          <option>Cartón</option>
        </select>
        <select style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "7px 14px", fontSize: 13, color: COLORS.text, background: COLORS.white }}>
          <option>↓ Ordenar</option>
        </select>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 12 }}>Resumen por material</div>
      <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: COLORS.bg }}>
              {["Usuarial", "Recompensa", "Puntos usados", "Puntos / Peso", "Puntos otorgados", "Fecha", "Estado", "Acciones"].map((h) => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, color: COLORS.textMuted, fontSize: 12, borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {historialManjes.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? COLORS.white : "#fafdf9" }}>
                <td style={{ padding: "12px 14px", color: COLORS.text, fontWeight: 500 }}>{r.usuarial}</td>
                <td style={{ padding: "12px 14px", color: COLORS.text }}>{r.recompensa}</td>
                <td style={{ padding: "12px 14px", color: COLORS.text }}>{r.puntosUsados}</td>
                <td style={{ padding: "12px 14px", color: COLORS.text }}>{r.puntosPeso}</td>
                <td style={{ padding: "12px 14px", color: COLORS.gold, fontWeight: 700 }}>{r.puntosOtorgados}</td>
                <td style={{ padding: "12px 14px", color: COLORS.textMuted }}>{r.fecha}</td>
                <td style={{ padding: "12px 14px" }}><StatusBadge estado={r.estado} /></td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ background: COLORS.greenLight, color: COLORS.green, border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Editar</button>
                    <button style={{ background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PanelControl() {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 20 }}>Registrar entrega recyclable</h2>
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="Kg reciclados hoy" value="150 kg" icon="🌿" />
        <StatCard label="Usuarios atendidos" value="45" icon="👤" />
        <StatCard label="Puntos otorgados" value="12,500" icon="⭐" />
        <StatCard label="Canjes realizados" value="12" icon="🎁" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.text, marginBottom: 16 }}>Nueva entrega</div>
          <div style={{ position: "relative", marginBottom: 14 }}>
            <input
              type="text"
              placeholder="Buscar reciclador (name or ID)"
              style={{ width: "100%", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 36px 9px 12px", fontSize: 14, color: COLORS.text, background: COLORS.bg, boxSizing: "border-box" }}
            />
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: COLORS.textMuted }}>🔍</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Tipo de material</label>
              <input defaultValue="Cartón" style={{ width: "100%", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, background: COLORS.bg, boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Peso en kg</label>
              <select style={{ width: "100%", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, background: COLORS.bg }}>
                <option>Vidrio</option>
                <option>Plástico PET</option>
                <option>Cartón</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Observaciones</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <span style={{ background: "#dcfce7", color: "#166534", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>Válido</span>
              <span style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>Rechazo</span>
            </div>
            <textarea placeholder="Observaciones" style={{ width: "100%", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, background: COLORS.bg, minHeight: 56, resize: "vertical", boxSizing: "border-box" }} />
          </div>
          <button style={{ width: "100%", background: COLORS.green, color: COLORS.white, border: "none", borderRadius: 8, padding: "11px 0", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Registrar entrega
          </button>
        </div>

        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 4 }}>♻️</div>
          <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 16 }}>Resumen</div>
          <div style={{ width: "100%", fontSize: 14, color: COLORS.text, display: "flex", flexDirection: "column", gap: 8 }}>
            <div><span style={{ color: COLORS.textMuted }}>Usuario: </span><strong>Juan Perez</strong></div>
            <div><span style={{ color: COLORS.textMuted }}>Material: </span><strong>Plástico PET</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><span style={{ color: COLORS.textMuted }}>Peso: </span><strong>5,2 kg</strong></div>
              <span style={{ fontSize: 28, fontWeight: 800, color: COLORS.gold }}>520</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><span style={{ color: COLORS.textMuted }}>Fecha: </span><strong>2023-10-26</strong></div>
              <span style={{ background: "#dcfce7", color: "#166534", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>Válido</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span style={{ color: COLORS.textMuted }}>Estado:</span>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.greenMid, display: "inline-block" }}></span>
              <button style={{ background: COLORS.greenLight, color: COLORS.green, border: `1px solid ${COLORS.green}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Editar</button>
              <button style={{ background: "#fff7ed", color: "#c2410c", border: "1px solid #c2410c", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Corregir pts</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 24px" }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.text, marginBottom: 16 }}>Recent deliveries</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: COLORS.bg }}>
              {["Usuario", "Material", "Peso", "Puntos", "Fstada", "Acciones"].map((h) => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: COLORS.textMuted, fontSize: 12, borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deliveries.slice(0, 4).map((d, i) => (
              <tr key={d.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: "10px 12px", color: COLORS.text }}>{d.usuario}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: materialColors[d.material] || "#888", display: "inline-block" }}></span>
                    {d.material}
                  </span>
                </td>
                <td style={{ padding: "10px 12px" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.greenMid, display: "inline-block" }}></span></td>
                <td style={{ padding: "10px 12px", color: COLORS.text }}>{i + 1}</td>
                <td style={{ padding: "10px 12px", color: COLORS.text }}>{i + 1}</td>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.greenMid, display: "inline-block" }}></span>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.danger, display: "inline-block" }}></span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PageContent({ state, dispatch }) {
  if (state.activePage === "historial-entregas") {
    if (state.selectedDelivery) {
      return <DeliveryDetail delivery={state.selectedDelivery} dispatch={dispatch} />;
    }
    return <HistorialEntregas dispatch={dispatch} />;
  }
  if (state.activePage === "historiar-entregas") return <PanelControl />;
  if (state.activePage === "canjes") return <HistorialManjes />;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, color: COLORS.textMuted }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
      <div style={{ fontSize: 16 }}>Sección en construcción</div>
    </div>
  );
}

export default function RecyclingDashboard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: COLORS.bg }}>
      <aside style={{ width: 220, background: COLORS.sidebar, display: "flex", flexDirection: "column", flexShrink: 0, position: "relative" }}>
        <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: COLORS.greenMid, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>♻️</div>
            <div>
              <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>Recycling Points</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>Recicla y gana</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 0" }}>
          {navItems.map((item) => {
            const isActive = state.activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => dispatch({ type: "SET_PAGE", payload: item.id })}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  width: "100%", padding: "10px 20px",
                  background: isActive ? "rgba(255,255,255,0.13)" : "transparent",
                  border: "none", cursor: "pointer",
                  color: isActive ? COLORS.white : "rgba(255,255,255,0.65)",
                  fontSize: 14, fontWeight: isActive ? 600 : 400,
                  textAlign: "left",
                  borderLeft: isActive ? `3px solid ${COLORS.greenMid}` : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: `1px solid rgba(255,255,255,0.1)`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.greenMid, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
          <div>
            <div style={{ color: COLORS.white, fontSize: 13, fontWeight: 600 }}>Juan Perez</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Encargado</div>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 24, gap: 14 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>🔔</button>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>🔔</button>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.green, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.white, fontSize: 14, fontWeight: 700 }}>JP</div>
          </div>
          <PageContent state={state} dispatch={dispatch} />
        </div>
      </main>
    </div>
  );
}