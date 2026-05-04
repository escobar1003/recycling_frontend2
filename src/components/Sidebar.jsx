import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const CATALOGOS = [
  { path: "/catalogos/roles",               icon: "bi-key-fill",          title: "Roles" },
  { path: "/catalogos/estados-puntos",      icon: "bi-geo-alt-fill",      title: "Estados puntos" },
  { path: "/catalogos/estados-materiales",  icon: "bi-recycle",           title: "Estados materiales" },
  { path: "/catalogos/estados-entregas",    icon: "bi-box-seam-fill",     title: "Estados entregas" },
  { path: "/catalogos/estados-aliados",     icon: "bi-handshake-fill",    title: "Estados aliados" },
  { path: "/catalogos/estados-canjes",      icon: "bi-arrow-left-right",  title: "Estados canjes" },
  { path: "/catalogos/estados-usuarios",    icon: "bi-person-check-fill", title: "Estados usuarios" },
  { path: "/catalogos/estados-recompensas", icon: "bi-gift-fill",         title: "Estados recompensas" },
  { path: "/catalogos/tipos-recompensa",    icon: "bi-tag-fill",          title: "Tipos de recompensa" },
];

const NAV = [
  { path: "/dashboard",       icon: "bi-house-fill",       title: "Dashboard" },
  { path: "/usuarios",        icon: "bi-people-fill",      title: "Gestión usuarios" },
  { path: "/administradores", icon: "bi-shield-lock-fill", title: "Gestión administradores" },
  { path: "/aliados",         icon: "bi-handshake-fill",   title: "Aliados" },
  { path: "/encargados",      icon: "bi-person-badge-fill",title: "Encargados" },
  { path: "/materiales",      icon: "bi-recycle",          title: "Materiales" },
  { path: "/entregas",        icon: "bi-box-seam-fill",    title: "Entregas" },
];

export default function Sidebar() {
  const location = useLocation();
  const isCatalogActive = location.pathname.startsWith("/catalogos");
  const [catalogosOpen, setCatalogosOpen] = useState(isCatalogActive);

  const linkClass = ({ isActive }) =>
    `btn d-flex align-items-center gap-2 text-start px-3 py-2 rounded-2 w-100 text-decoration-none border-0 ${
      isActive ? "btn-success text-white fw-semibold" : "btn-light text-secondary"
    }`;

  return (
    <div
      className="d-flex flex-column bg-white border-end shadow-sm"
      style={{ width: 235, minHeight: "100vh", flexShrink: 0 }}
    >
      {/* Logo */}
      <div className="d-flex align-items-center gap-2 px-3 py-3 border-bottom">
        <div
          className="bg-success rounded-2 d-flex align-items-center justify-content-center text-white flex-shrink-0"
          style={{ width: 36, height: 36, fontSize: 18 }}
        >
          <i className="bi bi-recycle" />
        </div>
        <span className="fw-bold text-success fs-6">EcoRecicla</span>
      </div>

      {/* Nav */}
      <nav className="flex-grow-1 py-2 px-2 d-flex flex-column gap-1 overflow-y-auto">

        {NAV.map(n => (
          <NavLink key={n.path} to={n.path} className={linkClass} style={{ fontSize: 13 }}>
            <i className={`bi ${n.icon}`} style={{ fontSize: 15, width: 18 }} />
            {n.title}
          </NavLink>
        ))}

        {/* Catálogos desplegable */}
        <div>
          <button
            className={`btn d-flex align-items-center gap-2 text-start px-3 py-2 rounded-2 w-100 border-0 ${
              isCatalogActive ? "btn-success text-white fw-semibold" : "btn-light text-secondary"
            }`}
            style={{ fontSize: 13 }}
            onClick={() => setCatalogosOpen(o => !o)}
          >
            <i className="bi bi-journals" style={{ fontSize: 15, width: 18 }} />
            <span className="flex-grow-1">Catálogos</span>
            <i className={`bi bi-chevron-${catalogosOpen ? "up" : "down"}`} style={{ fontSize: 11 }} />
          </button>

          {catalogosOpen && (
            <div className="d-flex flex-column gap-1 mt-1 ms-3 ps-2 border-start border-success border-opacity-25">
              {CATALOGOS.map(sub => (
                <NavLink
                  key={sub.path}
                  to={sub.path}
                  className={linkClass}
                  style={{ fontSize: 12 }}
                >
                  <i className={`bi ${sub.icon}`} style={{ fontSize: 13, width: 16 }} />
                  {sub.title}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Salir */}
      <div className="px-2 py-3 border-top">
        <button className="btn btn-light text-danger d-flex align-items-center gap-2 w-100 px-3 py-2 rounded-2 border-0" style={{ fontSize: 13 }}>
          <i className="bi bi-box-arrow-left" style={{ fontSize: 15 }} />
          Salir
        </button>
      </div>
    </div>
  );
}