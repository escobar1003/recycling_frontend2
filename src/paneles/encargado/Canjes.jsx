// src/paneles/encargado/Canjes.jsx
import { useState } from "react";

// ── Datos mock de recompensas ──────────────────────────────────────────────
const RECOMPENSAS = [
  { id: 1, nombre: "Bono Supermercado",    pts: 500,  icon: "bi-bag-fill",         color: "#198754", stock: 10 },
  { id: 2, nombre: "Descuento Transporte", pts: 300,  icon: "bi-bus-front-fill",   color: "#0d6efd", stock: 5  },
  { id: 3, nombre: "Vale Restaurante",     pts: 750,  icon: "bi-cup-hot-fill",     color: "#dc3545", stock: 8  },
  { id: 4, nombre: "Bono Farmacia",        pts: 400,  icon: "bi-heart-pulse-fill", color: "#d63384", stock: 12 },
  { id: 5, nombre: "Crédito Internet",     pts: 250,  icon: "bi-wifi",             color: "#0dcaf0", stock: 20 },
  { id: 6, nombre: "Entrada Cine",         pts: 600,  icon: "bi-camera-reels",     color: "#6f42c1", stock: 3  },
];

// ── Historial mock de canjes ───────────────────────────────────────────────
const HISTORIAL_MOCK = [
  { id: 101, usuario: "Elena Santacruz",  recompensa: "Bono Supermercado",    pts: 500, fecha: "2026-05-14", codigo: "ECO-7X2K", estado: "Completado" },
  { id: 102, usuario: "Carlos Muñoz",     recompensa: "Crédito Internet",     pts: 250, fecha: "2026-05-13", codigo: "ECO-9M4P", estado: "Completado" },
  { id: 103, usuario: "Laura Pérez",      recompensa: "Vale Restaurante",     pts: 750, fecha: "2026-05-12", codigo: "ECO-3R8T", estado: "Pendiente"  },
  { id: 104, usuario: "Andrés Torres",    recompensa: "Bono Farmacia",        pts: 400, fecha: "2026-05-11", codigo: "ECO-5L1N", estado: "Completado" },
  { id: 105, usuario: "María Gómez",      recompensa: "Descuento Transporte", pts: 300, fecha: "2026-05-10", codigo: "ECO-2W6Q", estado: "Cancelado"  },
];

// ── Usuarios mock con puntos ───────────────────────────────────────────────
const USUARIOS_MOCK = [
  { id: 1, nombre: "Elena Santacruz",  av: "ES", pts: 1240 },
  { id: 2, nombre: "Carlos Muñoz",     av: "CM", pts: 870  },
  { id: 3, nombre: "Laura Pérez",      av: "LP", pts: 2100 },
  { id: 4, nombre: "Andrés Torres",    av: "AT", pts: 450  },
  { id: 5, nombre: "María Gómez",      av: "MG", pts: 630  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function Av({ text, size = 36, bg = "#ffc107", color = "#000" }) {
  return (
    <div
      className="d-flex align-items-center justify-content-center rounded-circle fw-black flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: bg, color, fontSize: size * 0.36 }}
    >
      {text}
    </div>
  );
}

function BadgeCanje({ estado }) {
  const map = {
    Completado: { bg: "#198754", text: "white",   icon: "bi-check-circle-fill" },
    Pendiente:  { bg: "#ffc107", text: "#000",    icon: "bi-clock-fill"        },
    Cancelado:  { bg: "#dc3545", text: "white",   icon: "bi-x-circle-fill"     },
  };
  const s = map[estado] || map.Pendiente;
  return (
    <span
      className="badge d-inline-flex align-items-center gap-1 fw-bold"
      style={{ backgroundColor: s.bg, color: s.text, fontSize: 11 }}
    >
      <i className={`bi ${s.icon}`} /> {estado}
    </span>
  );
}

function generarCodigo() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return "ECO-" + Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// ══════════════════════════════════════════════════════════════════════════
export default function Canjes() {
  const [tab, setTab]               = useState("canjear");   // canjear | historial
  const [busqueda, setBusqueda]     = useState("");
  const [usuarioSel, setUsuarioSel] = useState(null);
  const [recompSel, setRecompSel]   = useState(null);
  const [historial, setHistorial]   = useState(HISTORIAL_MOCK);
  const [comprobante, setComprobante] = useState(null);      // modal comprobante
  const [errorSaldo, setErrorSaldo]   = useState(false);

  // ── Búsqueda de usuario ──────────────────────────────────────────────
  const usuariosFiltrados = busqueda.trim().length > 0
    ? USUARIOS_MOCK.filter(u =>
        u.nombre.toLowerCase().includes(busqueda.toLowerCase())
      )
    : [];

  const seleccionarUsuario = (u) => {
    setUsuarioSel(u);
    setBusqueda(u.nombre);
    setRecompSel(null);
    setErrorSaldo(false);
  };

  // ── Canjear ──────────────────────────────────────────────────────────
  const handleCanjear = () => {
    if (!usuarioSel || !recompSel) return;

    if (usuarioSel.pts < recompSel.pts) {
      setErrorSaldo(true);
      return;
    }

    const nuevo = {
      id:         Date.now(),
      usuario:    usuarioSel.nombre,
      recompensa: recompSel.nombre,
      pts:        recompSel.pts,
      fecha:      new Date().toISOString().split("T")[0],
      codigo:     generarCodigo(),
      estado:     "Completado",
    };

    setHistorial(prev => [nuevo, ...prev]);
    setComprobante(nuevo);
    setUsuarioSel(null);
    setBusqueda("");
    setRecompSel(null);
    setErrorSaldo(false);
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div>

      {/* ── Tabs ── */}
      <div className="d-flex gap-2 mb-4">
        {[
          { key: "canjear",   icon: "bi-gift-fill",        label: "Gestión de canjes"    },
          { key: "historial", icon: "bi-clock-history",    label: "Historial de canjes"  },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`btn fw-bold d-flex align-items-center gap-2 border-2 ${
              tab === t.key
                ? "btn-warning border-dark text-dark"
                : "btn-outline-dark text-dark"
            }`}
            style={{ fontSize: 13 }}
          >
            <i className={`bi ${t.icon}`} /> {t.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          TAB: GESTIÓN DE CANJES
      ════════════════════════════════════════════════════ */}
      {tab === "canjear" && (
        <div className="row g-4">

          {/* ── Columna izquierda: buscar usuario + recompensas ── */}
          <div className="col-lg-7">

            {/* Buscar usuario — SCRUM-480 */}
            <div className="card border border-2 border-dark rounded-3 shadow-sm mb-3">
              <div className="card-body p-3">
                <div className="fw-black text-dark mb-1" style={{ fontSize: 15 }}>
                  <i className="bi bi-person-fill text-warning me-2" />
                  Buscar usuario
                </div>
                <div className="text-secondary mb-3" style={{ fontSize: 12 }}>
                  Escribe el nombre del reciclador
                </div>

                <div className="position-relative">
                  <div className="input-group">
                    <span className="input-group-text border-dark border-2 bg-white">
                      <i className="bi bi-search text-secondary" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-dark border-2 fw-semibold"
                      placeholder="Ej: Elena Santacruz"
                      value={busqueda}
                      onChange={e => {
                        setBusqueda(e.target.value);
                        setUsuarioSel(null);
                        setErrorSaldo(false);
                      }}
                      style={{ fontSize: 14 }}
                    />
                    {busqueda && (
                      <button
                        className="btn btn-outline-dark border-2"
                        onClick={() => { setBusqueda(""); setUsuarioSel(null); setRecompSel(null); setErrorSaldo(false); }}
                      >
                        <i className="bi bi-x-lg" />
                      </button>
                    )}
                  </div>

                  {/* Dropdown resultados */}
                  {usuariosFiltrados.length > 0 && !usuarioSel && (
                    <div
                      className="position-absolute w-100 bg-white border border-2 border-dark rounded-3 shadow mt-1"
                      style={{ zIndex: 99 }}
                    >
                      {usuariosFiltrados.map(u => (
                        <button
                          key={u.id}
                          className="btn w-100 d-flex align-items-center gap-3 px-3 py-2 text-start border-0 rounded-0"
                          onClick={() => seleccionarUsuario(u)}
                          style={{ fontSize: 13 }}
                          onMouseEnter={e => e.currentTarget.style.background = "#fff8e1"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <Av text={u.av} size={34} bg="#ffc107" color="#000" />
                          <div>
                            <div className="fw-bold text-dark">{u.nombre}</div>
                            <div className="text-secondary" style={{ fontSize: 11 }}>
                              <i className="bi bi-star-fill text-warning me-1" />{u.pts} puntos disponibles
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Usuario seleccionado — SCRUM-481 puntos disponibles */}
                {usuarioSel && (
                  <div className="mt-3 p-3 rounded-2 border border-2 border-dark bg-warning d-flex align-items-center gap-3">
                    <Av text={usuarioSel.av} size={44} bg="#000" color="#ffc107" />
                    <div className="flex-grow-1">
                      <div className="fw-black text-dark" style={{ fontSize: 15 }}>{usuarioSel.nombre}</div>
                      <div className="fw-semibold text-dark" style={{ fontSize: 12 }}>Usuario reciclador</div>
                    </div>
                    <div className="text-center">
                      <div className="fw-black text-dark lh-1" style={{ fontSize: 24 }}>{usuarioSel.pts}</div>
                      <div className="fw-bold text-dark" style={{ fontSize: 10 }}>PUNTOS</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recompensas disponibles — SCRUM-482 */}
            <div className="card border border-2 border-dark rounded-3 shadow-sm">
              <div className="card-body p-3">
                <div className="fw-black text-dark mb-3" style={{ fontSize: 15 }}>
                  <i className="bi bi-gift-fill text-warning me-2" />
                  Recompensas disponibles
                </div>

                <div className="row g-2">
                  {RECOMPENSAS.map(r => {
                    const activa    = recompSel?.id === r.id;
                    const sinSaldo  = usuarioSel && usuarioSel.pts < r.pts;
                    return (
                      <div className="col-6" key={r.id}>
                        <button
                          type="button"
                          onClick={() => { setRecompSel(r); setErrorSaldo(false); }}
                          disabled={sinSaldo}
                          className={`btn w-100 h-100 d-flex flex-column align-items-start p-3 rounded-2 border-2 fw-bold text-start ${
                            activa
                              ? "bg-warning border-dark text-dark"
                              : sinSaldo
                                ? "btn-outline-secondary opacity-50"
                                : "btn-outline-dark text-dark"
                          }`}
                          style={{ fontSize: 13, minHeight: 90 }}
                        >
                          <div className="d-flex align-items-center gap-2 mb-1 w-100">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-2"
                              style={{ width: 30, height: 30, backgroundColor: r.color, flexShrink: 0 }}
                            >
                              <i className={`bi ${r.icon} text-white`} style={{ fontSize: 14 }} />
                            </div>
                            <span style={{ fontSize: 12, lineHeight: 1.2 }}>{r.nombre}</span>
                            {activa && <i className="bi bi-check-circle-fill text-success ms-auto" />}
                          </div>
                          <div className="d-flex align-items-center justify-content-between w-100 mt-1">
                            <span
                              className="badge border border-dark fw-black"
                              style={{ backgroundColor: activa ? "#000" : "#ffc107", color: activa ? "#ffc107" : "#000", fontSize: 11 }}
                            >
                              <i className="bi bi-star-fill me-1" />{r.pts} pts
                            </span>
                            <span className="text-secondary" style={{ fontSize: 10 }}>Stock: {r.stock}</span>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Columna derecha: resumen y canjear ── */}
          <div className="col-lg-5">
            <div className="card border border-2 border-dark rounded-3 shadow-sm" style={{ position: "sticky", top: 20 }}>
              <div className="card-body p-3">
                <div className="fw-black text-dark mb-3" style={{ fontSize: 15 }}>
                  <i className="bi bi-receipt-cutoff me-2 text-warning" />
                  Resumen del canje
                </div>

                {/* Usuario */}
                <div className="mb-2">
                  <div className="text-secondary fw-bold text-uppercase mb-1" style={{ fontSize: 10, letterSpacing: 1 }}>Usuario</div>
                  <div className="p-2 rounded-2 border border-dark bg-light d-flex align-items-center gap-2" style={{ minHeight: 48 }}>
                    {usuarioSel
                      ? <><Av text={usuarioSel.av} size={30} bg="#ffc107" color="#000" />
                          <span className="fw-bold text-dark" style={{ fontSize: 13 }}>{usuarioSel.nombre}</span></>
                      : <span className="text-secondary" style={{ fontSize: 12 }}>Sin usuario seleccionado</span>
                    }
                  </div>
                </div>

                {/* Recompensa */}
                <div className="mb-2">
                  <div className="text-secondary fw-bold text-uppercase mb-1" style={{ fontSize: 10, letterSpacing: 1 }}>Recompensa</div>
                  <div className="p-2 rounded-2 border border-dark bg-light d-flex align-items-center gap-2" style={{ minHeight: 48 }}>
                    {recompSel
                      ? <><div className="d-flex align-items-center justify-content-center rounded-2" style={{ width: 28, height: 28, backgroundColor: recompSel.color, flexShrink: 0 }}>
                            <i className={`bi ${recompSel.icon} text-white`} style={{ fontSize: 13 }} />
                          </div>
                          <span className="fw-bold text-dark" style={{ fontSize: 13 }}>{recompSel.nombre}</span></>
                      : <span className="text-secondary" style={{ fontSize: 12 }}>Sin recompensa seleccionada</span>
                    }
                  </div>
                </div>

                {/* Puntos */}
                <div className="mb-3">
                  <div className="text-secondary fw-bold text-uppercase mb-1" style={{ fontSize: 10, letterSpacing: 1 }}>Puntos</div>
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="p-2 rounded-2 border border-dark bg-light text-center">
                        <div className="fw-black text-dark" style={{ fontSize: 20 }}>{usuarioSel?.pts ?? "—"}</div>
                        <div className="text-secondary" style={{ fontSize: 10 }}>Disponibles</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className={`p-2 rounded-2 border border-2 border-dark text-center ${recompSel ? "bg-warning" : "bg-light"}`}>
                        <div className="fw-black text-dark" style={{ fontSize: 20 }}>{recompSel ? `-${recompSel.pts}` : "—"}</div>
                        <div className="text-dark" style={{ fontSize: 10 }}>A descontar</div>
                      </div>
                    </div>
                  </div>

                  {/* Saldo resultante */}
                  {usuarioSel && recompSel && (
                    <div className={`mt-2 p-2 rounded-2 border border-2 border-dark text-center ${usuarioSel.pts >= recompSel.pts ? "bg-success" : "bg-danger"}`}>
                      <div className="fw-black text-white" style={{ fontSize: 18 }}>
                        {usuarioSel.pts - recompSel.pts} pts restantes
                      </div>
                    </div>
                  )}
                </div>

                {/* Error saldo insuficiente — SCRUM-487 */}
                {errorSaldo && (
                  <div className="alert alert-danger border border-2 border-dark py-2 d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-exclamation-triangle-fill" />
                    <span style={{ fontSize: 13 }}>Saldo insuficiente para esta recompensa</span>
                  </div>
                )}

                {/* Botón canjear — SCRUM-483 */}
                <div className="d-grid">
                  <button
                    className="btn btn-dark border border-2 border-warning fw-black py-2 d-flex align-items-center justify-content-center gap-2"
                    style={{ fontSize: 14 }}
                    onClick={handleCanjear}
                    disabled={!usuarioSel || !recompSel}
                  >
                    <i className="bi bi-gift-fill text-warning" /> Canjear recompensa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          TAB: HISTORIAL — SCRUM-485
      ════════════════════════════════════════════════════ */}
      {tab === "historial" && (
        <div className="card border border-2 border-dark rounded-3 shadow-sm">
          <div className="card-body p-3">
            <div className="fw-black text-dark mb-3" style={{ fontSize: 15 }}>
              <i className="bi bi-clock-history text-warning me-2" />
              Historial de canjes
            </div>

            <div className="table-responsive">
              <table className="table table-bordered border-dark align-middle mb-0" style={{ fontSize: 13 }}>
                <thead className="bg-dark text-warning">
                  <tr>
                    <th className="fw-black">Usuario</th>
                    <th className="fw-black">Recompensa</th>
                    <th className="fw-black text-center">Puntos</th>
                    <th className="fw-black">Código</th>
                    <th className="fw-black">Fecha</th>
                    <th className="fw-black text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map(h => (
                    <tr key={h.id}>
                      <td className="fw-bold">{h.usuario}</td>
                      <td>{h.recompensa}</td>
                      <td className="text-center fw-black text-warning">
                        <span className="badge bg-dark border border-warning" style={{ fontSize: 12 }}>
                          <i className="bi bi-star-fill me-1" />{h.pts}
                        </span>
                      </td>
                      {/* SCRUM-484 código/comprobante */}
                      <td>
                        <span
                          className="badge bg-light border border-2 border-dark text-dark fw-black"
                          style={{ fontSize: 11, letterSpacing: 1 }}
                        >
                          <i className="bi bi-upc me-1" />{h.codigo}
                        </span>
                      </td>
                      <td className="text-secondary">{h.fecha}</td>
                      <td className="text-center"><BadgeCanje estado={h.estado} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          MODAL COMPROBANTE — SCRUM-484
      ════════════════════════════════════════════════════ */}
      {comprobante && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 999 }}
          onClick={() => setComprobante(null)}
        >
          <div
            className="bg-white border border-3 border-dark rounded-3 shadow-lg p-4 text-center"
            style={{ maxWidth: 340, width: "90%" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: 64, height: 64 }}>
              <i className="bi bi-check-lg text-white" style={{ fontSize: 32 }} />
            </div>

            <div className="fw-black text-dark mb-1" style={{ fontSize: 18 }}>¡Canje exitoso!</div>
            <div className="text-secondary mb-3" style={{ fontSize: 13 }}>Comprobante generado</div>

            <div className="bg-warning border border-2 border-dark rounded-2 p-3 mb-3">
              <div className="fw-bold text-dark" style={{ fontSize: 12 }}>CÓDIGO DE COMPROBANTE</div>
              <div className="fw-black text-dark" style={{ fontSize: 26, letterSpacing: 3 }}>{comprobante.codigo}</div>
            </div>

            <div className="text-start border border-dark rounded-2 p-3 mb-3" style={{ fontSize: 13 }}>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-secondary">Usuario</span>
                <span className="fw-bold">{comprobante.usuario}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-secondary">Recompensa</span>
                <span className="fw-bold">{comprobante.recompensa}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Puntos descontados</span>
                <span className="fw-black text-danger">-{comprobante.pts} pts</span>
              </div>
            </div>

            <button
              className="btn btn-dark border border-2 border-warning fw-black w-100"
              onClick={() => setComprobante(null)}
            >
              <i className="bi bi-check2 me-2 text-warning" />Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}