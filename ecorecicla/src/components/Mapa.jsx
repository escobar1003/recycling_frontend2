import { useState, useEffect } from "react";
import { G, GL, MAT_COLORS } from "../constants/data";
import { getPuntos } from "../services/api";  // ← importamos del api.js

export default function Mapa({ showToast }) {
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("Todos");
  const [selected, setSelected] = useState(null);
  const [favs,     setFavs]     = useState([]);

  // ── Puntos del backend ────────────────────────────────────────────────────
  const [puntos,   setPuntos]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getPuntos()
      .then(data => {
        // El backend devuelve { id, nombre, direccion }
        // Adaptamos al formato que usa el componente
        const adaptados = data.map(p => ({
          id:        p.id,
          name:      p.nombre,
          address:   p.direccion ?? "Sin dirección",
          open:      true,           // El backend no tiene este campo aún
          materials: [],             // El backend no tiene este campo aún
          rating:    "—",
          distance:  "—",
          hours:     "Consultar",
          phone:     "—",
        }));
        setPuntos(adaptados);
      })
      .catch(() => {
        showToast("⚠️ No se cargaron los puntos del servidor", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  const openCount = puntos.filter(p => p.open).length;

  const filtered = puntos.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) ||
               p.address.toLowerCase().includes(search.toLowerCase());
    const mo = filter === "Todos" || (filter === "Abiertos" ? p.open : !p.open);
    return ms && mo;
  });

  const selPoint  = selected ? puntos.find(p => p.id === selected) : null;
  const toggleFav = (id, e) => {
    e?.stopPropagation();
    setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  };

  return (
    <div>
      <h4 className="page-title">📍 Puntos de Reciclaje</h4>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="stat-card green">
            <div className="stat-label">Puntos abiertos</div>
            <div className="stat-value">{loading ? "..." : openCount}</div>
            <div className="stat-change">disponibles ahora</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-label" style={{ color: "#9ca3af" }}>Total puntos</div>
            <div className="stat-value" style={{ color: G }}>{loading ? "..." : puntos.length}</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>en el sistema</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card yellow">
            <div className="stat-label">Favoritos</div>
            <div className="stat-value">{favs.length}</div>
            <div className="stat-change">guardados</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Lista */}
        <div className="col-md-5">
          <div className="input-group mb-2">
            <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "8px 0 0 8px" }}>🔍</span>
            <input
              className="form-control border-start-0"
              placeholder="Buscar punto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ borderRadius: "0 8px 8px 0", fontSize: 13 }}
            />
          </div>

          <div className="btn-group mb-3 w-100" role="group">
            {["Todos","Abiertos","Cerrados"].map(f => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? "btn-eco-primary" : "btn-outline-secondary"}`}
                onClick={() => setFilter(f)}
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ maxHeight: 520, overflowY: "auto" }} className="d-flex flex-column gap-2 pe-1">
            {loading ? (
              <div className="text-center py-5" style={{ color: "#9ca3af" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>⏳</div>
                Cargando puntos...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5" style={{ color: "#9ca3af" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📍</div>
                Sin resultados
              </div>
            ) : filtered.map(p => (
              <div key={p.id} className={`point-card ${selected === p.id ? "selected" : ""}`} onClick={() => setSelected(p.id)}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: p.open ? GL : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📍</div>
                <div className="flex-fill" style={{ minWidth: 0 }}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#1f2937" }}>{p.name}</span>
                    <span className={`eco-badge ${p.open ? "eco-badge-success" : "eco-badge-gray"}`}>{p.open ? "Abierto" : "Cerrado"}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>{p.address}</div>
                  {p.materials.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mb-1">
                      {p.materials.slice(0, 3).map(m => (
                        <span key={m} className="mat-tag" style={{ background: `${MAT_COLORS[m] || "#6b7280"}20`, color: MAT_COLORS[m] || "#6b7280" }}>{m}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={e => toggleFav(p.id, e)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, flexShrink: 0 }}>
                  {favs.includes(p.id) ? "❤️" : "🤍"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Detalle */}
        <div className="col-md-7">
          {selPoint ? (
            <div className="eco-card" style={{ position: "sticky", top: 80 }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "#1f2937", marginBottom: 2 }}>{selPoint.name}</div>
                  <div style={{ fontSize: 13, color: "#9ca3af" }}>{selPoint.address}</div>
                </div>
                <span className={`eco-badge ${selPoint.open ? "eco-badge-success" : "eco-badge-gray"}`} style={{ fontSize: 13, padding: "5px 12px" }}>
                  {selPoint.open ? "🟢 Abierto" : "⚪ Cerrado"}
                </span>
              </div>

              <div style={{ background: "#f3f4f6", borderRadius: 12, height: 180, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, marginBottom: 14 }}>🗺️</div>

              <div className="row g-2 mb-3">
                {[
                  ["HORARIO",     selPoint.hours],
                  ["TELÉFONO",    selPoint.phone],
                  ["DISTANCIA",   selPoint.distance],
                  ["ID EN SISTEMA", `#${selPoint.id}`],
                ].map(([l, v]) => (
                  <div key={l} className="col-6">
                    <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px" }}>
                      <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>{l}</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
                    </div>
                  </div>
                ))}
              </div>

              {selPoint.materials.length > 0 && (
                <div className="mb-3">
                  <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Materiales aceptados</div>
                  <div className="d-flex flex-wrap gap-2">
                    {selPoint.materials.map(m => (
                      <span key={m} className="mat-tag" style={{ fontSize: 13, fontWeight: 600, padding: "5px 14px", background: `${MAT_COLORS[m] || "#6b7280"}20`, color: MAT_COLORS[m] || "#6b7280" }}>{m}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="d-flex gap-2">
                <button className="btn btn-eco-primary rounded-3 flex-fill" onClick={() => showToast("🧭 Abriendo navegación...")}>🧭 Cómo llegar</button>
                <button className="btn btn-eco-outline rounded-3" onClick={e => toggleFav(selPoint.id, e)}>{favs.includes(selPoint.id) ? "❤️" : "🤍"}</button>
                <button className="btn btn-eco-secondary rounded-3" onClick={() => setSelected(null)}>✕</button>
              </div>
            </div>
          ) : (
            <div className="eco-card d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: 400 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🗺️</div>
              <h5 style={{ color: "#6b7280", marginBottom: 8 }}>Selecciona un punto</h5>
              <p style={{ fontSize: 14, color: "#9ca3af" }}>Haz clic en cualquier punto de reciclaje para ver su detalle.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}