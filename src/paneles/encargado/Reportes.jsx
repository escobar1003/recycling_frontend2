// src/paneles/encargado/Reportes.jsx
import { useState } from "react";

// ── Datos mock ─────────────────────────────────────────────────────────────
const MATERIALES_MES = [
  { mes: "Ene", kg: 320 },
  { mes: "Feb", kg: 480 },
  { mes: "Mar", kg: 410 },
  { mes: "Abr", kg: 560 },
  { mes: "May", kg: 390 },
];

const CANJES_PERIODO = [
  { recompensa: "Bono Supermercado",    cantidad: 12, pts: 6000 },
  { recompensa: "Crédito Internet",     cantidad: 9,  pts: 2250 },
  { recompensa: "Bono Farmacia",        cantidad: 7,  pts: 2800 },
  { recompensa: "Vale Restaurante",     cantidad: 5,  pts: 3750 },
  { recompensa: "Descuento Transporte", cantidad: 4,  pts: 1200 },
  { recompensa: "Entrada Cine",         cantidad: 2,  pts: 1200 },
];

const USUARIOS_TOP = [
  { nombre: "Laura Pérez",     av: "LP", entregas: 18, pts: 2100, canjes: 3 },
  { nombre: "Elena Santacruz", av: "ES", entregas: 12, pts: 1240, canjes: 2 },
  { nombre: "Carlos Muñoz",    av: "CM", entregas: 9,  pts: 870,  canjes: 1 },
  { nombre: "María Gómez",     av: "MG", entregas: 7,  pts: 630,  canjes: 1 },
  { nombre: "Andrés Torres",   av: "AT", entregas: 5,  pts: 450,  canjes: 0 },
];

const PERIODOS = ["Esta semana", "Este mes", "Este año"];

// ── Helpers ────────────────────────────────────────────────────────────────
function Av({ text, size = 36, bg = "#ffc107", color = "#000" }) {
  return (
    <div
      className="d-flex align-items-center justify-content-center rounded-circle fw-bold flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: bg, color, fontSize: size * 0.36 }}
    >
      {text}
    </div>
  );
}

// Gráfica de barras simple con divs
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.kg));
  return (
    <div className="d-flex align-items-end gap-2 w-100" style={{ height: 140 }}>
      {data.map((d, i) => (
        <div key={i} className="d-flex flex-column align-items-center flex-grow-1 gap-1">
          <span className="fw-bold text-dark" style={{ fontSize: 10 }}>{d.kg}</span>
          <div
            className="w-100 rounded-top border border-2 border-dark"
            style={{
              height: `${(d.kg / max) * 110}px`,
              background: i === data.length - 1 ? "#ffc107" : "#212529",
            }}
          />
          <span className="fw-bold text-secondary" style={{ fontSize: 11 }}>{d.mes}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
export default function Reportes() {
  const [periodo, setPeriodo] = useState("Este mes");

  const maxCanjes = Math.max(...CANJES_PERIODO.map(c => c.cantidad));

  return (
    <div>

      {/* ── Selector de periodo ── */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="text-secondary fw-semibold" style={{ fontSize: 13 }}>
          <i className="bi bi-calendar3 me-2 text-warning" />
          Mostrando datos de: <span className="fw-black text-dark">{periodo}</span>
        </div>
        <div className="d-flex gap-2">
          {PERIODOS.map(p => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`btn fw-bold border-2 ${periodo === p ? "btn-warning border-dark text-dark" : "btn-outline-dark text-dark"}`}
              style={{ fontSize: 12 }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPIs limpios ── */}
      <div className="row g-3 mb-4">
        {[
          { icon: "bi-recycle",     label: "Total kg recolectados", value: "2,160 kg", sub: "este año",      iconColor: "#198754" },
          { icon: "bi-star-fill",   label: "Puntos entregados",     value: "18,400",   sub: "acumulados",    iconColor: "#ffc107" },
          { icon: "bi-gift-fill",   label: "Canjes realizados",     value: 39,          sub: "este periodo",  iconColor: "#212529" },
          { icon: "bi-people-fill", label: "Usuarios activos",      value: 5,           sub: "recicladores",  iconColor: "#198754" },
        ].map((r, i) => (
          <div key={i} className="col-6 col-lg-3">
            <div className="card border border-2 border-dark rounded-3 shadow-sm h-100 bg-white">
              <div className="card-body p-3">
                <i className={`bi ${r.icon} d-block mb-2`} style={{ fontSize: 22, color: r.iconColor }} />
                <div className="fw-black text-dark lh-1 mb-1" style={{ fontSize: 26 }}>{r.value}</div>
                <div className="fw-bold text-dark" style={{ fontSize: 12 }}>{r.label}</div>
                <div className="text-secondary" style={{ fontSize: 10 }}>{r.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">

        {/* ── Gráfica materiales por mes ── */}
        <div className="col-lg-6">
          <div className="card border border-2 border-dark rounded-3 shadow-sm h-100 bg-white">
            <div className="card-body p-3">
              <div className="fw-black text-dark mb-1" style={{ fontSize: 15 }}>
                <i className="bi bi-bar-chart-fill text-warning me-2" />
                Materiales recolectados (kg)
              </div>
              <div className="text-secondary mb-3" style={{ fontSize: 11 }}>Últimos 5 meses · barra amarilla = mes actual</div>
              <BarChart data={MATERIALES_MES} />
            </div>
          </div>
        </div>

        {/* ── Canjes por recompensa ── */}
        <div className="col-lg-6">
          <div className="card border border-2 border-dark rounded-3 shadow-sm h-100 bg-white">
            <div className="card-body p-3">
              <div className="fw-black text-dark mb-1" style={{ fontSize: 15 }}>
                <i className="bi bi-gift-fill text-warning me-2" />
                Canjes por recompensa
              </div>
              <div className="text-secondary mb-3" style={{ fontSize: 11 }}>Ranking del periodo</div>

              <div className="d-flex flex-column gap-2">
                {CANJES_PERIODO.map((c, i) => (
                  <div key={i}>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-bold text-dark" style={{ fontSize: 12 }}>{c.recompensa}</span>
                      <span className="fw-black text-dark" style={{ fontSize: 12 }}>{c.cantidad}</span>
                    </div>
                    <div className="rounded-pill border border-dark overflow-hidden" style={{ height: 10, background: "#f8f9fa" }}>
                      <div
                        className="h-100 rounded-pill"
                        style={{
                          width: `${(c.cantidad / maxCanjes) * 100}%`,
                          background: i === 0 ? "#ffc107" : "#212529",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabla usuarios top ── */}
        <div className="col-lg-7">
          <div className="card border border-2 border-dark rounded-3 shadow-sm bg-white">
            <div className="card-body p-3">
              <div className="fw-black text-dark mb-3" style={{ fontSize: 15 }}>
                <i className="bi bi-trophy-fill text-warning me-2" />
                Ranking de usuarios recicladores
              </div>
              <div className="table-responsive">
                <table className="table table-bordered border-dark align-middle mb-0" style={{ fontSize: 13 }}>
                  <thead style={{ background: "#212529" }}>
                    <tr>
                      <th className="fw-black text-warning text-center" style={{ width: 40 }}>#</th>
                      <th className="fw-black text-warning">Usuario</th>
                      <th className="fw-black text-warning text-center">Entregas</th>
                      <th className="fw-black text-warning text-center">Puntos</th>
                      <th className="fw-black text-warning text-center">Canjes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {USUARIOS_TOP.map((u, i) => (
                      <tr key={i} style={{ background: "white" }}>
                        <td className="text-center fw-black">
                          {i === 0
                            ? <i className="bi bi-trophy-fill text-warning" />
                            : <span className="text-secondary">{i + 1}</span>
                          }
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Av
                              text={u.av}
                              size={30}
                              bg={i === 0 ? "#ffc107" : "#212529"}
                              color={i === 0 ? "#000" : "#ffc107"}
                            />
                            <span className="fw-bold text-dark">{u.nombre}</span>
                          </div>
                        </td>
                        <td className="text-center fw-bold text-dark">{u.entregas}</td>
                        <td className="text-center">
                          <span className="badge bg-dark border border-warning text-warning fw-black" style={{ fontSize: 11 }}>
                            <i className="bi bi-star-fill me-1" />{u.pts}
                          </span>
                        </td>
                        <td className="text-center fw-bold text-dark">{u.canjes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ── Puntos entregados vs canjeados ── */}
        <div className="col-lg-5">
          <div className="card border border-2 border-dark rounded-3 shadow-sm h-100 bg-white">
            <div className="card-body p-3">
              <div className="fw-black text-dark mb-3" style={{ fontSize: 15 }}>
                <i className="bi bi-arrow-left-right text-warning me-2" />
                Puntos: entregados vs canjeados
              </div>

              <div className="d-flex flex-column gap-3">
                {[
                  { icon: "bi-star-fill",  color: "#ffc107", label: "Entregados",  value: "18,400 pts", pct: 100, barBg: "#ffc107"  },
                  { icon: "bi-gift-fill",  color: "#212529", label: "Canjeados",   value: "11,200 pts", pct: 61,  barBg: "#212529"  },
                  { icon: "bi-wallet2",    color: "#198754", label: "Disponibles", value: "7,200 pts",  pct: 39,  barBg: "#198754"  },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-bold text-dark" style={{ fontSize: 13 }}>
                        <i className={`bi ${item.icon} me-1`} style={{ color: item.color }} />
                        {item.label}
                      </span>
                      <span className="fw-black text-dark" style={{ fontSize: 13 }}>{item.value}</span>
                    </div>
                    <div className="rounded-pill border border-dark overflow-hidden" style={{ height: 12, background: "#f8f9fa" }}>
                      <div
                        className="h-100 rounded-pill"
                        style={{ width: `${item.pct}%`, background: item.barBg }}
                      />
                    </div>
                  </div>
                ))}

                {/* Tasa de canje */}
                <div className="mt-2 p-3 rounded-2 border border-2 border-dark text-center bg-white">
                  <div className="fw-bold text-dark" style={{ fontSize: 12 }}>Tasa de canje</div>
                  <div className="fw-black text-dark" style={{ fontSize: 32 }}>61%</div>
                  <div className="text-secondary" style={{ fontSize: 11 }}>
                    de los puntos entregados fueron canjeados
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}