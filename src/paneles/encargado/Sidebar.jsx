// src/paneles/encargado/Sidebar.jsx
import Av from "./Av";

const NAV = [
  { key: "dashboard",  icon: "bi-house-door-fill",    label: "Dashboard"          },
  { key: "control",    icon: "bi-grid-fill",           label: "Panel de control"   },
  { key: "registrar",  icon: "bi-plus-circle-fill",    label: "Registrar entrega"  },
  { key: "historial",  icon: "bi-clock-history",       label: "Historial entregas" },
  { key: "canjes",     icon: "bi-gift-fill",            label: "Canjes"             },
  { key: "reportes",   icon: "bi-bar-chart-line-fill",  label: "Reportes"           },
];

export default function Sidebar({ active, onNav, encargado, onLogout }) {
  return (
    <div
      className="d-flex flex-column bg-dark"
      style={{
        width: 230,
        minHeight: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
        borderRight: "3px solid #ffc107",
      }}
    >
      {/* Logo */}
      <div className="px-3 py-3 d-flex align-items-center gap-2" style={{ borderBottom: "2px solid #ffc107" }}>
        <div
          className="d-flex align-items-center justify-content-center rounded-2 bg-warning border border-dark"
          style={{ width: 38, height: 38, flexShrink: 0 }}
        >
          <i className="bi bi-recycle text-dark" style={{ fontSize: 20 }} />
        </div>
        <div>
          <div className="fw-black text-white" style={{ fontSize: 13, letterSpacing: "-0.3px" }}>
            Recycling Points
          </div>
          <div className="text-warning fw-semibold" style={{ fontSize: 10 }}>Panel Encargado</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-fill px-2 py-2 d-flex flex-column gap-1">
        {NAV.map(n => (
          <button
            key={n.key}
            onClick={() => onNav(n.key)}
            className={`btn d-flex align-items-center gap-2 text-start fw-semibold rounded-2 px-3 py-2 border-0 ${
              active === n.key ? "bg-warning text-dark" : "text-white"
            }`}
            style={{
              fontSize: 13,
              background: active === n.key ? undefined : "transparent",
              transition: "background .15s",
            }}
            onMouseEnter={e => { if (active !== n.key) e.currentTarget.style.background = "rgba(255,193,7,0.18)"; }}
            onMouseLeave={e => { if (active !== n.key) e.currentTarget.style.background = "transparent"; }}
          >
            <i className={`bi ${n.icon}`} style={{ fontSize: 15, width: 18 }} />
            {n.label}
          </button>
        ))}
      </nav>

      {/* Usuario */}
      <div className="px-3 py-3" style={{ borderTop: "2px solid #ffc107" }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <Av text={encargado.av} size={34} bg="#ffc107" color="#000" />
          <div>
            <div className="fw-bold text-white" style={{ fontSize: 12 }}>{encargado.nombre}</div>
            <div className="text-warning fw-semibold" style={{ fontSize: 10 }}>Encargado</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="btn btn-outline-warning btn-sm w-100 d-flex align-items-center gap-2 justify-content-center fw-bold"
          style={{ fontSize: 12 }}
        >
          <i className="bi bi-box-arrow-left" /> Salir
        </button>
      </div>
    </div>
  );
}