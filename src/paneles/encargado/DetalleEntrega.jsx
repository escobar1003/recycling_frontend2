import { useState } from "react";
import Av from "./Av";
import Badge from "./Badge";

const TODOS_MATERIALES = [
  { nombre: "Plástico (PET)", pts: 30, icon: "bi-bag",          color: "#ffc107" },
  { nombre: "Papel",          pts: 15, icon: "bi-file-earmark", color: "#ffc107" },
  { nombre: "Cartón",         pts: 20, icon: "bi-box-seam",     color: "#198754" },
  { nombre: "Vidrio",         pts: 25, icon: "bi-cup-straw",    color: "#000"    },
  { nombre: "Metal",          pts: 35, icon: "bi-gear",         color: "#6c757d" },
];

export default function DetalleEntrega({ entrega, onBack, onValidar, onRechazar }) {
  const [obs, setObs] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Materiales seleccionados con su peso
  const [seleccionados, setSeleccionados] = useState(
    Object.fromEntries(entrega.materiales.map(m => [m, ""]))
  );

  const toggleMaterial = (nombre) => {
    setSeleccionados(prev => {
      const nuevo = { ...prev };
      if (nuevo[nombre] !== undefined) {
        delete nuevo[nombre];
      } else {
        nuevo[nombre] = "";
      }
      return nuevo;
    });
  };

  const handlePeso = (mat, val) => {
    setSeleccionados(prev => ({ ...prev, [mat]: val }));
  };

  const ptsMat = (nombre) => {
    const mat = TODOS_MATERIALES.find(m => m.nombre === nombre);
    const p = parseFloat(seleccionados[nombre]) || 0;
    return Math.round(p * (mat?.pts || 0));
  };

  const totalPts   = Object.keys(seleccionados).reduce((acc, m) => acc + ptsMat(m), 0);
  const pesoTotal  = Object.values(seleccionados).reduce((acc, v) => acc + (parseFloat(v) || 0), 0);
  const haySeleccionados = Object.keys(seleccionados).length > 0;

  return (
    <div className="card border border-2 border-dark rounded-3 shadow-sm">
      <div className="card-body p-3">

        {/* Volver */}
        <button
          onClick={onBack}
          className="btn btn-link text-dark fw-bold px-0 mb-3 d-flex align-items-center gap-1"
          style={{ fontSize: 13, textDecoration: "none" }}
        >
          <i className="bi bi-arrow-left" /> Volver a la lista
        </button>

        {/* Usuario */}
        <div className="d-flex align-items-center gap-3 p-3 rounded-2 mb-3 bg-warning border border-2 border-dark">
          <Av text={entrega.av} size={52} bg="#000" color="#ffc107" />
          <div>
            <div className="fw-black text-dark" style={{ fontSize: 16 }}>{entrega.nombre}</div>
            <div className="fw-semibold text-dark" style={{ fontSize: 12 }}>Usuario reciclador</div>
            <div className="mt-1"><Badge estado={entrega.estado} /></div>
          </div>
        </div>

        {/* ── SELECTOR DE MATERIALES ── */}
        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="fw-bold text-secondary text-uppercase" style={{ fontSize: 10, letterSpacing: 1 }}>
              Materiales recibidos
            </div>
            {entrega.estado === "Pendiente" && (
              <button
                type="button"
                className="btn btn-sm btn-outline-dark border-2 fw-bold d-flex align-items-center gap-1"
                style={{ fontSize: 11 }}
                onClick={() => setMenuAbierto(o => !o)}
              >
                <i className={`bi ${menuAbierto ? "bi-x-lg" : "bi-plus-lg"}`} />
                {menuAbierto ? "Cerrar" : "Agregar material"}
              </button>
            )}
          </div>

          {/* Menú desplegable de materiales */}
          {menuAbierto && (
            <div
              className="border border-2 border-dark rounded-3 p-2 mb-3 bg-white shadow-sm"
              style={{ maxHeight: 260, overflowY: "auto" }}
            >
              <div className="fw-bold text-secondary mb-2" style={{ fontSize: 10, letterSpacing: 1 }}>
                SELECCIONA LOS MATERIALES
              </div>
              <div className="d-flex flex-column gap-1">
                {TODOS_MATERIALES.map(mat => {
                  const activo = seleccionados[mat.nombre] !== undefined;
                  return (
                    <button
                      key={mat.nombre}
                      type="button"
                      onClick={() => toggleMaterial(mat.nombre)}
                      className={`btn d-flex align-items-center gap-2 px-2 py-2 rounded-2 border fw-bold text-start ${
                        activo
                          ? "border-dark bg-warning text-dark border-2"
                          : "border-secondary bg-white text-dark"
                      }`}
                      style={{ fontSize: 13 }}
                    >
                      {/* Ícono */}
                      <div
                        className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                        style={{ width: 30, height: 30, backgroundColor: mat.color }}
                      >
                        <i
                          className={`bi ${mat.icon}`}
                          style={{ fontSize: 14, color: mat.color === "#000" ? "#ffc107" : "#fff" }}
                        />
                      </div>

                      {/* Nombre */}
                      <span className="flex-grow-1">{mat.nombre}</span>

                      {/* Pts/kg */}
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: activo ? "#000" : "#f0f0f0",
                          color: activo ? "#ffc107" : "#666",
                          fontSize: 10,
                        }}
                      >
                        {mat.pts} pts/kg
                      </span>

                      {/* Check */}
                      <i className={`bi ${activo ? "bi-check-circle-fill text-success" : "bi-circle text-secondary"}`} />
                    </button>
                  );
                })}
              </div>

              {/* Botón confirmar selección */}
              <div className="mt-2 d-grid">
                <button
                  type="button"
                  className="btn btn-dark fw-bold border-2"
                  style={{ fontSize: 13 }}
                  onClick={() => setMenuAbierto(false)}
                >
                  <i className="bi bi-check2 me-1" />
                  Confirmar selección ({Object.keys(seleccionados).length})
                </button>
              </div>
            </div>
          )}

          {/* Lista de materiales seleccionados con inputs de peso */}
          {haySeleccionados ? (
            <div className="d-flex flex-column gap-2">
              {Object.keys(seleccionados).map(nombre => {
                const mat = TODOS_MATERIALES.find(m => m.nombre === nombre);
                return (
                  <div
                    key={nombre}
                    className="d-flex align-items-center gap-2 p-2 rounded-2 border border-dark bg-white"
                  >
                    {/* Ícono */}
                    <div
                      className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                      style={{ width: 36, height: 36, backgroundColor: mat?.color || "#198754" }}
                    >
                      <i
                        className={`bi ${mat?.icon || "bi-recycle"}`}
                        style={{ fontSize: 16, color: mat?.color === "#000" ? "#ffc107" : "#fff" }}
                      />
                    </div>

                    {/* Nombre y pts */}
                    <div className="flex-grow-1">
                      <div className="fw-bold text-dark" style={{ fontSize: 13 }}>{nombre}</div>
                      <div className="text-secondary" style={{ fontSize: 11 }}>{mat?.pts} pts / kg</div>
                    </div>

                    {/* Input peso */}
                    <input
                      type="number"
                      value={seleccionados[nombre]}
                      onChange={e => handlePeso(nombre, e.target.value)}
                      placeholder="0.0"
                      min="0"
                      step="0.1"
                      className="form-control border border-dark text-center fw-bold"
                      style={{ width: 72, fontSize: 14 }}
                    />
                    <span className="text-secondary fw-semibold" style={{ fontSize: 12, minWidth: 18 }}>kg</span>

                    {/* Puntos calculados */}
                    <div
                      className="rounded-2 px-2 py-1 text-center fw-black border border-dark"
                      style={{
                        minWidth: 54, fontSize: 12,
                        backgroundColor: ptsMat(nombre) > 0 ? "#ffc107" : "#f8f9fa",
                      }}
                    >
                      +{ptsMat(nombre)}
                      <div style={{ fontSize: 9, fontWeight: 600 }}>pts</div>
                    </div>

                    {/* Quitar material */}
                    {entrega.estado === "Pendiente" && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger border-0 p-1"
                        onClick={() => toggleMaterial(nombre)}
                        title="Quitar material"
                      >
                        <i className="bi bi-trash3" style={{ fontSize: 13 }} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="rounded-2 border border-2 border-dashed border-secondary text-center py-4 text-secondary"
              style={{ fontSize: 13, borderStyle: "dashed" }}
            >
              <i className="bi bi-plus-circle fs-4 d-block mb-1 opacity-50" />
              Ningún material agregado aún
            </div>
          )}
        </div>

        {/* Resumen peso total y puntos totales */}
        <div className="row g-2 mb-3">
          <div className="col-6">
            <div className="card border border-dark rounded-2 p-2 h-100">
              <div className="fw-bold text-secondary mb-1" style={{ fontSize: 10 }}>
                <i className="bi bi-speedometer2 me-1" />Peso total
              </div>
              <div className="fw-black text-dark lh-1" style={{ fontSize: 24 }}>
                {pesoTotal.toFixed(1)}
              </div>
              <div className="text-secondary" style={{ fontSize: 10 }}>kg</div>
            </div>
          </div>
          <div className="col-6">
            <div className="card border border-2 border-dark rounded-2 p-2 h-100 bg-warning">
              <div className="fw-bold text-dark mb-1" style={{ fontSize: 10 }}>
                <i className="bi bi-star-fill me-1" />Puntos a otorgar
              </div>
              <div className="fw-black text-dark lh-1" style={{ fontSize: 28 }}>{totalPts}</div>
              <div className="fw-semibold text-dark" style={{ fontSize: 10 }}>puntos</div>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div className="mb-3">
          <div className="fw-bold text-secondary text-uppercase mb-1" style={{ fontSize: 10, letterSpacing: 1 }}>
            Observaciones
          </div>
          <textarea
            value={obs}
            onChange={e => setObs(e.target.value)}
            rows={3}
            placeholder="Agrega una nota sobre esta entrega..."
            className="form-control border border-dark"
            style={{ fontSize: 13, resize: "none" }}
          />
        </div>

        {/* Acciones */}
        {entrega.estado === "Pendiente" && (
          <div className="d-flex gap-2">
            <button
              onClick={onRechazar}
              className="btn btn-outline-dark border-2 fw-bold flex-fill d-flex align-items-center justify-content-center gap-2"
            >
              <i className="bi bi-x-circle" /> Rechazar
            </button>
            <button
              onClick={() => onValidar({ seleccionados, totalPts, pesoTotal, obs })}
              disabled={!haySeleccionados}
              className="btn btn-success border border-2 border-dark fw-bold d-flex align-items-center justify-content-center gap-2"
              style={{ flex: 2 }}
            >
              <i className="bi bi-check-circle-fill" /> Validar entrega
            </button>
          </div>
        )}

        {entrega.estado !== "Pendiente" && (
          <div
            className={`rounded-2 p-3 text-center fw-bold border border-2 border-dark ${
              entrega.estado === "Validada" ? "bg-success text-white" : "bg-dark text-warning"
            }`}
            style={{ fontSize: 14 }}
          >
            <i className={`bi ${entrega.estado === "Validada" ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-2`} />
            Entrega {entrega.estado}
          </div>
        )}

      </div>
    </div>
  );
}