// src/components/RegistrarEntrega.jsx
import { useState } from "react";

const MATERIALES = [
  { key: "papel",    label: "Papel",    icon: "bi-file-earmark-text", ptsPorKg: 15, color: "#ffc107", colorText: "#000" },
  { key: "carton",   label: "Cartón",   icon: "bi-box-seam",          ptsPorKg: 20, color: "#198754", colorText: "#fff" },
  { key: "vidrio",   label: "Vidrio",   icon: "bi-cup-straw",         ptsPorKg: 25, color: "#000",    colorText: "#ffc107" },
  { key: "plastico", label: "Plástico", icon: "bi-bag",               ptsPorKg: 30, color: "#198754", colorText: "#fff" },
];

const PESOS_INICIAL = { papel: "", carton: "", vidrio: "", plastico: "" };

export default function RegistrarEntrega() {
  const [usuario, setUsuario] = useState("");
  const [pesos,   setPesos]   = useState(PESOS_INICIAL);
  const [enviado, setEnviado] = useState(false);

  const handlePeso = (key, val) => {
    if (val === "" || (/^\d*\.?\d*$/.test(val) && Number(val) >= 0)) {
      setPesos(p => ({ ...p, [key]: val }));
    }
  };

  // Calcular totales por material y globales
  const filas = MATERIALES.map(m => {
    const kg  = parseFloat(pesos[m.key]) || 0;
    const pts = Math.round(kg * m.ptsPorKg);
    return { ...m, kg, pts };
  });

  const totalKg  = filas.reduce((a, f) => a + f.kg,  0);
  const totalPts = filas.reduce((a, f) => a + f.pts, 0);
  const hayAlgo  = filas.some(f => f.kg > 0);

  const handleRegistrar = () => {
    if (!usuario.trim() || !hayAlgo) return;
    setEnviado(true);
  };

  const handleNuevo = () => {
    setUsuario("");
    setPesos(PESOS_INICIAL);
    setEnviado(false);
  };

  // ── Vista de éxito ──────────────────────────────────────────────────────────
  if (enviado) {
    return (
      <div className="card border border-2 border-dark rounded-3 shadow-sm text-center p-5">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle bg-success border border-2 border-dark mx-auto mb-3"
          style={{ width: 72, height: 72 }}
        >
          <i className="bi bi-check-lg text-white" style={{ fontSize: 36 }} />
        </div>
        <h4 className="fw-black text-dark mb-1">¡Entrega registrada!</h4>
        <p className="text-secondary mb-4" style={{ fontSize: 14 }}>
          La entrega de <strong>{usuario}</strong> fue guardada correctamente.
        </p>

        {/* Resumen */}
        <div className="card border border-2 border-dark rounded-3 mb-4 text-start mx-auto" style={{ maxWidth: 420 }}>
          <div className="card-body p-3">
            <div className="fw-bold text-secondary text-uppercase mb-3" style={{ fontSize: 10, letterSpacing: 1 }}>
              Resumen de entrega
            </div>
            {filas.filter(f => f.kg > 0).map(f => (
              <div key={f.key} className="d-flex align-items-center justify-content-between py-2 border-bottom border-light">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2 border border-dark"
                    style={{ width: 30, height: 30, background: f.color, flexShrink: 0 }}
                  >
                    <i className={`bi ${f.icon}`} style={{ color: f.colorText, fontSize: 13 }} />
                  </div>
                  <span className="fw-semibold text-dark" style={{ fontSize: 13 }}>{f.label}</span>
                </div>
                <div className="text-end">
                  <span className="fw-bold text-dark" style={{ fontSize: 13 }}>{f.kg.toFixed(2)} kg</span>
                  <span className="text-success fw-bold ms-3" style={{ fontSize: 13 }}>+{f.pts} pts</span>
                </div>
              </div>
            ))}
            <div className="d-flex justify-content-between align-items-center pt-2">
              <span className="fw-black text-dark">Total</span>
              <div>
                <span className="fw-black text-dark">{totalKg.toFixed(2)} kg</span>
                <span className="fw-black text-success ms-3">+{totalPts} pts</span>
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleNuevo} className="btn btn-warning border border-2 border-dark fw-bold px-4 mx-auto">
          <i className="bi bi-plus-circle-fill me-2" />
          Registrar otra entrega
        </button>
      </div>
    );
  }

  // ── Formulario ──────────────────────────────────────────────────────────────
  return (
    <div className="row g-3 justify-content-center">
      <div className="col-lg-7">
        <div className="card border border-2 border-dark rounded-3 shadow-sm">
          <div className="card-body p-4">

            {/* Header */}
            <div className="d-flex align-items-center gap-2 mb-4">
              <div
                className="d-flex align-items-center justify-content-center rounded-2 bg-warning border border-dark"
                style={{ width: 40, height: 40 }}
              >
                <i className="bi bi-plus-circle-fill text-dark fs-5" />
              </div>
              <div>
                <div className="fw-black text-dark" style={{ fontSize: 16 }}>Nueva entrega</div>
                <div className="text-secondary" style={{ fontSize: 12 }}>Completa los datos del reciclador</div>
              </div>
            </div>

            {/* Usuario */}
            <div className="mb-4">
              <label className="fw-bold text-secondary text-uppercase mb-1 d-block" style={{ fontSize: 10, letterSpacing: 1 }}>
                <i className="bi bi-person-fill me-1" />Nombre del usuario
              </label>
              <input
                type="text"
                className="form-control border border-2 border-dark fw-semibold"
                placeholder="Ej: Diego Tamayo"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                style={{ fontSize: 14 }}
              />
            </div>

            {/* Materiales */}
            <div className="fw-bold text-secondary text-uppercase mb-2" style={{ fontSize: 10, letterSpacing: 1 }}>
              <i className="bi bi-recycle me-1" />Peso por material (kg)
            </div>

            <div className="d-flex flex-column gap-2 mb-4">
              {MATERIALES.map(m => {
                const kg  = parseFloat(pesos[m.key]) || 0;
                const pts = Math.round(kg * m.ptsPorKg);
                return (
                  <div
                    key={m.key}
                    className="d-flex align-items-center gap-3 p-3 rounded-2 border border-2 border-dark"
                    style={{ background: "#fafafa" }}
                  >
                    {/* Ícono material */}
                    <div
                      className="d-flex align-items-center justify-content-center rounded-2 border border-dark flex-shrink-0"
                      style={{ width: 42, height: 42, background: m.color }}
                    >
                      <i className={`bi ${m.icon}`} style={{ color: m.colorText, fontSize: 18 }} />
                    </div>

                    {/* Nombre + pts/kg */}
                    <div style={{ minWidth: 90 }}>
                      <div className="fw-black text-dark" style={{ fontSize: 14 }}>{m.label}</div>
                      <div className="text-secondary" style={{ fontSize: 11 }}>{m.ptsPorKg} pts / kg</div>
                    </div>

                    {/* Input peso */}
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0.0"
                      value={pesos[m.key]}
                      onChange={e => handlePeso(m.key, e.target.value)}
                      className="form-control border border-2 border-dark fw-bold text-center"
                      style={{ width: 90, fontSize: 16 }}
                    />

                    <span className="text-secondary fw-semibold" style={{ fontSize: 13 }}>kg</span>

                    {/* Puntos calculados */}
                    <div className="ms-auto text-end">
                      <div
                        className={`fw-black ${pts > 0 ? "text-success" : "text-secondary"}`}
                        style={{ fontSize: 18 }}
                      >
                        +{pts}
                      </div>
                      <div className="text-secondary" style={{ fontSize: 10 }}>puntos</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totales */}
            <div className="card border border-2 border-dark rounded-3 bg-warning mb-4">
              <div className="card-body p-3 d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold text-dark text-uppercase" style={{ fontSize: 10, letterSpacing: 1 }}>Total entrega</div>
                  <div className="fw-black text-dark" style={{ fontSize: 22 }}>{totalKg.toFixed(2)} kg</div>
                </div>
                <div className="text-end">
                  <div className="fw-bold text-dark text-uppercase" style={{ fontSize: 10, letterSpacing: 1 }}>Puntos a otorgar</div>
                  <div className="fw-black text-dark" style={{ fontSize: 28 }}>+{totalPts}</div>
                </div>
              </div>
            </div>

            {/* Botón */}
            <button
              onClick={handleRegistrar}
              disabled={!usuario.trim() || !hayAlgo}
              className="btn btn-success border border-2 border-dark fw-black w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              style={{ fontSize: 15 }}
            >
              <i className="bi bi-check-circle-fill" />
              Registrar entrega
            </button>

            {(!usuario.trim() || !hayAlgo) && (
              <div className="text-center text-secondary mt-2" style={{ fontSize: 11 }}>
                <i className="bi bi-info-circle me-1" />
                Ingresa el nombre del usuario y al menos un material con peso mayor a 0
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}