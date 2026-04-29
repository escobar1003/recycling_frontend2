import { useState } from "react";
import { ALL_POINTS, MAT_COLORS } from "../constants/data";

export default function Mapa({ showToast }) {
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("Todos");
  const [selected, setSelected] = useState(null);
  const [favs,     setFavs]     = useState([1, 3]);

  const openCount = ALL_POINTS.filter(p => p.open).length;

  const filtered = ALL_POINTS.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase());
    const mo = filter === "Todos" || (filter === "Abiertos" ? p.open : !p.open);
    return ms && mo;
  });

  const selPoint  = selected ? ALL_POINTS.find(p => p.id === selected) : null;
  const toggleFav = (id, e) => { e?.stopPropagation(); setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]); };

  return (
    <div>
      <h4 className="fw-bold mb-4">📍 Puntos de Reciclaje</h4>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm h-100 border-0 bg-success text-white">
            <div className="card-body py-3">
              <div className="small fw-semibold opacity-75 mb-1">Puntos abiertos</div>
              <div className="fw-bold" style={{ fontSize: 28 }}>{openCount}</div>
              <div className="opacity-75 small mt-1">disponibles ahora</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body py-3">
              <div className="text-muted small fw-semibold mb-1">Más cercano</div>
              <div className="fw-bold text-success" style={{ fontSize: 28 }}>0.4 km</div>
              <div className="text-muted small mt-1">Punto Verde Centro</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100 border-0" style={{ background: "#fef9c3" }}>
            <div className="card-body py-3">
              <div className="small fw-semibold mb-1" style={{ color: "#854d0e", opacity: .85 }}>Favoritos</div>
              <div className="fw-bold" style={{ fontSize: 28, color: "#854d0e" }}>{favs.length}</div>
              <div className="small mt-1" style={{ color: "#854d0e", opacity: .75 }}>guardados</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Lista */}
        <div className="col-md-5">
          {/* Buscador */}
          <div className="input-group mb-2">
            <span className="input-group-text bg-white border-end-0 rounded-start-3">🔍</span>
            <input
              className="form-control border-start-0 rounded-end-3"
              placeholder="Buscar punto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ fontSize: 13 }}
            />
          </div>

          {/* Tabs */}
          <div className="btn-group mb-3 w-100" role="group">
            {["Todos", "Abiertos", "Cerrados"].map(f => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? "btn-success" : "btn-outline-secondary"}`}
                onClick={() => setFilter(f)}
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Tarjetas */}
          <div className="d-flex flex-column gap-2 pe-1" style={{ maxHeight: 520, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <div className="fs-2 mb-2">📍</div>
                Sin resultados
              </div>
            ) : filtered.map(p => (
              <div
                key={p.id}
                className={`card shadow-sm border-2 d-flex flex-row align-items-start gap-3 p-3 ${selected === p.id ? "border-success" : "border-transparent"}`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelected(p.id)}
              >
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${p.open ? "bg-success-subtle" : "bg-light"}`}
                  style={{ width: 44, height: 44, fontSize: 20 }}
                >
                  📍
                </div>
                <div className="flex-fill" style={{ minWidth: 0 }}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-bold small text-dark">{p.name}</span>
                    <span className={`badge rounded-pill ${p.open ? "bg-success" : "bg-secondary"}`} style={{ fontSize: 10 }}>
                      {p.open ? "Abierto" : "Cerrado"}
                    </span>
                  </div>
                  <div className="text-muted mb-2" style={{ fontSize: 12 }}>{p.address}</div>
                  <div className="d-flex flex-wrap gap-1 mb-1">
                    {p.materials.slice(0, 3).map(m => (
                      <span
                        key={m}
                        className="badge rounded-pill fw-semibold"
                        style={{ fontSize: 10, background: `${MAT_COLORS[m] || "#6b7280"}20`, color: MAT_COLORS[m] || "#6b7280" }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <div className="text-muted" style={{ fontSize: 12 }}>⭐ {p.rating} &nbsp; 📍 {p.distance}</div>
                </div>
                <button
                  className="btn btn-sm border-0 bg-transparent p-0 flex-shrink-0"
                  style={{ fontSize: 20 }}
                  onClick={e => toggleFav(p.id, e)}
                >
                  {favs.includes(p.id) ? "❤️" : "🤍"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Detalle */}
        <div className="col-md-7">
          {selPoint ? (
            <div className="card shadow-sm" style={{ position: "sticky", top: 80 }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <div className="fw-bold fs-5 text-dark mb-1">{selPoint.name}</div>
                    <div className="text-muted small">{selPoint.address}</div>
                  </div>
                  <span className={`badge rounded-pill px-3 py-2 ${selPoint.open ? "bg-success" : "bg-secondary"}`} style={{ fontSize: 12 }}>
                    {selPoint.open ? "🟢 Abierto" : "⚪ Cerrado"}
                  </span>
                </div>

                {/* Mapa placeholder */}
                <div
                  className="bg-light rounded-3 d-flex align-items-center justify-content-center mb-3"
                  style={{ height: 180, fontSize: 40 }}
                >
                  🗺️
                </div>

                <div className="row g-2 mb-3">
                  {[
                    ["HORARIO",      selPoint.hours],
                    ["TELÉFONO",     selPoint.phone],
                    ["DISTANCIA",    `📍 ${selPoint.distance}`],
                    ["CALIFICACIÓN", `⭐ ${selPoint.rating} / 5.0`],
                  ].map(([l, v]) => (
                    <div key={l} className="col-6">
                      <div className="bg-light rounded-3 p-3">
                        <div className="text-muted fw-semibold mb-1 text-uppercase" style={{ fontSize: 11 }}>{l}</div>
                        <div className="fw-semibold small">{v}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <div className="text-muted fw-semibold text-uppercase mb-2" style={{ fontSize: 12 }}>Materiales aceptados</div>
                  <div className="d-flex flex-wrap gap-2">
                    {selPoint.materials.map(m => (
                      <span
                        key={m}
                        className="badge rounded-pill fw-semibold px-3 py-2"
                        style={{ fontSize: 12, background: `${MAT_COLORS[m] || "#6b7280"}20`, color: MAT_COLORS[m] || "#6b7280" }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-success rounded-3 flex-fill" onClick={() => showToast("🧭 Abriendo navegación...")}>
                    🧭 Cómo llegar
                  </button>
                  <button className="btn btn-outline-secondary rounded-3" onClick={e => toggleFav(selPoint.id, e)}>
                    {favs.includes(selPoint.id) ? "❤️" : "🤍"}
                  </button>
                  <button className="btn btn-secondary rounded-3" onClick={() => setSelected(null)}>✕</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: 400 }}>
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <div style={{ fontSize: 64, marginBottom: 16 }}>🗺️</div>
                <h5 className="text-secondary mb-2">Selecciona un punto</h5>
                <p className="text-muted small mb-0">Haz clic en cualquier punto de reciclaje para ver su detalle, horario, materiales y más.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}