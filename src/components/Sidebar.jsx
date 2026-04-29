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
    <nav
      className="d-flex flex-column align-items-center py-3 px-2 bg-white border-end shadow-sm"
      style={{ width: 64, minHeight: "100vh", position: "sticky", top: 0 }}
    >
      {/* Logo */}
      <div
        className="bg-success rounded-3 d-flex align-items-center justify-content-center text-white mb-3 flex-shrink-0"
        style={{ width: 38, height: 38, fontSize: 18 }}
      >
        ♻
      </div>

      {/* Botones de navegación */}
      <div className="d-flex flex-column align-items-center gap-1 w-100">
        {NAV.map(n => (
          <button
            key={n.view}
            title={n.title}
            className={`btn rounded-3 p-0 d-flex align-items-center justify-content-center ${
              view === n.view
                ? "btn-success"
                : "btn-outline-secondary border-0"
            }`}
            style={{ width: 42, height: 42, fontSize: 20 }}
            onClick={() => setView(n.view)}
          >
            {n.icon}
          </button>
        ))}
      </div>

      <div className="flex-fill" />

      {/* Salir */}
      <button
        title="Salir"
        className="btn btn-outline-secondary border-0 rounded-3 d-flex align-items-center justify-content-center"
        style={{ width: 42, height: 42, fontSize: 20 }}
      >
        🚪
      </button>
    </nav>
  );
}