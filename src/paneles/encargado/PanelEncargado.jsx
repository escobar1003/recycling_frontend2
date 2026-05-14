// src/paneles/encargado/PanelEncargado.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar           from "./Sidebar";
import VistaDashboard    from "./VistaDashboard";
import RegistrarEntrega  from "./RegistrarEntrega";
import HistorialEntregas from "./HistorialdeEntregas";
import Av                from "./Av";

const ENCARGADO = { nombre: "María López", punto: "Punto Verde Centro", av: "ML" };

const NAV = [
  { key: "dashboard",  icon: "bi-house-door-fill",    label: "Dashboard"          },
  { key: "control",    icon: "bi-grid-fill",           label: "Panel de control"   },
  { key: "registrar",  icon: "bi-plus-circle-fill",    label: "Registrar entrega"  },
  { key: "historial",  icon: "bi-clock-history",       label: "Historial entregas" },
  { key: "canjes",     icon: "bi-gift-fill",            label: "Canjes"             },
  { key: "reportes",   icon: "bi-bar-chart-line-fill",  label: "Reportes"           },
];

function VistaPlaceholder({ icon, label }) {
  return (
    <div className="card border border-2 border-dark rounded-3 shadow-sm text-center p-5">
      <i className={`bi ${icon} text-secondary`} style={{ fontSize: 52 }} />
      <div className="fw-black text-secondary mt-3" style={{ fontSize: 17 }}>{label}</div>
      <div className="text-secondary mt-1" style={{ fontSize: 13 }}>Esta sección está en construcción</div>
    </div>
  );
}

export default function PanelEncargado({ onLogout }) {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("usuario");
    if (onLogout) onLogout();
    navigate("/login");
  };

  const renderVista = () => {
    switch (active) {
      case "dashboard":  return <VistaDashboard />;
      case "control":    return <VistaPlaceholder icon="bi-grid"           label="Panel de control"      />;
      case "registrar":  return <RegistrarEntrega />;
      case "historial":  return <HistorialEntregas />;
      case "canjes":     return <VistaPlaceholder icon="bi-gift"           label="Canjes"                />;
      case "reportes":   return <VistaPlaceholder icon="bi-bar-chart-line" label="Reportes"              />;
      default:           return <VistaDashboard />;
    }
  };

  const tituloActivo = NAV.find(n => n.key === active)?.label || "Dashboard";

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar active={active} onNav={setActive} encargado={ENCARGADO} onLogout={handleLogout} />

      <main style={{ marginLeft: 230, flex: 1, padding: 28, overflowY: "auto" }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <div className="fw-black text-dark" style={{ fontSize: 22 }}>{tituloActivo}</div>
            <div className="text-secondary fw-semibold" style={{ fontSize: 13 }}>
              {ENCARGADO.punto} · Bienvenido, {ENCARGADO.nombre.split(" ")[0]}
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-dark border-2 rounded-2 d-flex align-items-center justify-content-center p-0"
              style={{ width: 38, height: 38 }}
            >
              <i className="bi bi-bell-fill text-dark" style={{ fontSize: 16 }} />
            </button>
            <Av text={ENCARGADO.av} size={38} bg="#ffc107" color="#000" />
          </div>
        </div>

        {renderVista()}
      </main>
    </div>
  );
}