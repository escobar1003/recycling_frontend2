const NAV = [
  { view: "dashboard",   icon: "bi-house-fill",    title: "Dashboard",          color: "#16a34a" },
  { view: "entregas",    icon: "bi-box-seam-fill", title: "Entregas",           color: "#2563eb" },
  { view: "ia",          icon: "bi-camera-fill",   title: "Clasificar IA",      color: "#7c3aed" },
  { view: "recompensas", icon: "bi-gift-fill",     title: "Recompensas",        color: "#db2777" },
  { view: "puntos",      icon: "bi-trophy-fill",   title: "Mis Puntos",         color: "#d97706" },
  { view: "mapa",        icon: "bi-geo-alt-fill",  title: "Puntos Cercanos",    color: "#0891b2" },
  { view: "eco",         icon: "bi-tree-fill",     title: "Impacto Ecológico",  color: "#16a34a" },
  { view: "usuarios",    icon: "bi-people-fill",   title: "Usuarios",           color: "#64748b" },
  { view: "perfil",      icon: "bi-person-circle", title: "Mi Perfil",          color: "#374151" },
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
        style={{ width: 38, height: 38 }}
      >
        <i className="bi bi-recycle fs-5" />
      </div>

      {/* Botones de navegación */}
      <div className="d-flex flex-column align-items-center gap-1 w-100">
        {NAV.map(n => {
          const isActive = view === n.view;
          return (
            <button
              key={n.view}
              title={n.title}
              className="btn rounded-3 p-0 d-flex align-items-center justify-content-center border-0"
              style={{
                width: 42,
                height: 42,
                background: isActive ? `${n.color}18` : "transparent",
                color: isActive ? n.color : "#9ca3af",
                transition: "background .15s, color .15s",
              }}
              onClick={() => setView(n.view)}
            >
              <i className={`bi ${n.icon} fs-5`} />
            </button>
          );
        })}
      </div>

      <div className="flex-fill" />

      {/* Salir */}
      <button
        title="Salir"
        className="btn border-0 rounded-3 d-flex align-items-center justify-content-center"
        style={{ width: 42, height: 42, color: "#ef4444", background: "#fff1f1" }}
      >
        <i className="bi bi-box-arrow-right fs-5" />
      </button>
    </nav>
  );
}