import { G, GL } from "../constants/data";

const NAV = [
  { view: "dashboard",   icon: "🏠", title: "Dashboard" },
  { view: "entregas",    icon: "📦", title: "Entregas" },
  { view: "ia",          icon: "📷", title: "Clasificar IA" },
  { view: "recompensas", icon: "🎁", title: "Recompensas" },
  { view: "puntos",      icon: "🏆", title: "Mis Puntos" },
  { view: "mapa",        icon: "📍", title: "Puntos Cercanos" },
  { view: "eco",         icon: "🌿", title: "Impacto Ecológico" },
  { view: "usuarios",    icon: "👥", title: "Usuarios" },
  { view: "perfil",      icon: "👤", title: "Mi Perfil" },
];

export default function Sidebar({ view, setView }) {
  return (
    <nav className="eco-sidebar">
      {/* Logo */}
      <div
        style={{
          width: 38, height: 38, background: G, borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, color: "#fff", marginBottom: 12,
        }}
      >
        ♻
      </div>

      {/* Botones de navegación */}
      {NAV.map(n => (
        <button
          key={n.view}
          title={n.title}
          className={`nav-btn ${view === n.view ? "active" : ""}`}
          onClick={() => setView(n.view)}
        >
          {n.icon}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      {/* Salir */}
      <button title="Salir" className="nav-btn">🚪</button>
    </nav>
  );
}
