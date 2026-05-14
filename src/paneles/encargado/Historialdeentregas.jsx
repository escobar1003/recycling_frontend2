// src/paneles/encargado/HistorialdeEntregas.jsx
import { useState } from "react";
import Badge from "./Badge";
import Av    from "./Av";

const MAT_ICON = {
  "Plástico (PET)": "bi-bag",
  "Cartón":         "bi-box-seam",
  "Vidrio":         "bi-cup-straw",
  "Papel":          "bi-file-earmark",
};

const ENTREGAS_INICIALES = [
  { id: 1,  nombre: "Diego Tamayo",     av: "DT", material: "Cartón",         peso: 4.2, pts: 130, fecha: "2026-05-05", estado: "Validada",  obs: "" },
  { id: 2,  nombre: "Carlos Jaramillo", av: "CJ", material: "Plástico (PET)", peso: 2.1, pts: 63,  fecha: "2026-05-05", estado: "Pendiente", obs: "" },
  { id: 3,  nombre: "Elena Santacruz",  av: "ES", material: "Papel",          peso: 1.8, pts: 78,  fecha: "2026-05-05", estado: "Validada",  obs: "" },
  { id: 4,  nombre: "Luisa Perdomo",    av: "LP", material: "Vidrio",         peso: 0.9, pts: 36,  fecha: "2026-05-08", estado: "Pendiente", obs: "" },
  { id: 5,  nombre: "Andrés Torres",    av: "AT", material: "Cartón",         peso: 3.5, pts: 95,  fecha: "2026-05-08", estado: "Pendiente", obs: "" },
  { id: 6,  nombre: "Diego Tamayo",     av: "DT", material: "Vidrio",         peso: 2.0, pts: 50,  fecha: "2026-05-11", estado: "Pendiente", obs: "" },
  { id: 7,  nombre: "Sofía Muñoz",      av: "SM", material: "Papel",          peso: 1.2, pts: 18,  fecha: "2026-05-11", estado: "Pendiente", obs: "" },
  { id: 8,  nombre: "Carlos Jaramillo", av: "CJ", material: "Plástico (PET)", peso: 0.5, pts: 30,  fecha: "2026-05-11", estado: "Rechazada", obs: "" },
  { id: 9,  nombre: "Elena Santacruz",  av: "ES", material: "Cartón",         peso: 5.1, pts: 148, fecha: "2026-05-14", estado: "Pendiente", obs: "" },
  { id: 10, nombre: "Luisa Perdomo",    av: "LP", material: "Plástico (PET)", peso: 2.8, pts: 84,  fecha: "2026-05-14", estado: "Pendiente", obs: "" },
  { id: 11, nombre: "Andrés Torres",    av: "AT", material: "Papel",          peso: 3.3, pts: 118, fecha: "2026-05-19", estado: "Pendiente", obs: "" },
  { id: 12, nombre: "Sofía Muñoz",      av: "SM", material: "Cartón",         peso: 2.5, pts: 50,  fecha: "2026-05-22", estado: "Pendiente", obs: "" },
  { id: 13, nombre: "Diego Tamayo",     av: "DT", material: "Plástico (PET)", peso: 3.0, pts: 75,  fecha: "2026-05-22", estado: "Pendiente", obs: "" },
];

const MATERIALES = ["Todos", "Papel", "Cartón", "Vidrio", "Plástico (PET)"];
const ESTADOS    = ["Todos", "Pendiente", "Validada", "Rechazada"];

// ── Modal corregir puntos ─────────────────────────────────────────────────────
function ModalCorregirPts({ entrega, onGuardar, onCerrar }) {
  const [nuevosPts, setNuevosPts] = useState(entrega.pts);
  const [motivo,    setMotivo]    = useState("");

  const guardar = () => {
    if (!nuevosPts || isNaN(nuevosPts) || Number(nuevosPts) < 0) return;
    onGuardar(entrega.id, Number(nuevosPts));
    onCerrar();
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999 }}
      onClick={onCerrar}
    >
      <div
        className="card border border-2 border-dark rounded-3 shadow-lg"
        style={{ width: 380 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="fw-black text-dark" style={{ fontSize: 16 }}>
              <i className="bi bi-arrow-repeat text-warning me-2" />
              Corregir puntos
            </div>
            <button onClick={onCerrar} className="btn btn-sm btn-outline-dark border-2 rounded-2 p-0" style={{ width: 28, height: 28 }}>
              <i className="bi bi-x" />
            </button>
          </div>

          <div className="p-2 rounded-2 bg-warning border border-dark mb-3 d-flex align-items-center gap-2">
            <Av text={entrega.av} size={32} bg="#000" color="#ffc107" />
            <div>
              <div className="fw-bold text-dark" style={{ fontSize: 13 }}>{entrega.nombre}</div>
              <div className="text-dark" style={{ fontSize: 11 }}>{entrega.material} · {entrega.peso} kg</div>
            </div>
          </div>

          <div className="mb-3">
            <label className="fw-bold text-secondary text-uppercase mb-1 d-block" style={{ fontSize: 10, letterSpacing: 1 }}>
              Puntos actuales
            </label>
            <div className="fw-black text-warning" style={{ fontSize: 28 }}>{entrega.pts} pts</div>
          </div>

          <div className="mb-3">
            <label className="fw-bold text-secondary text-uppercase mb-1 d-block" style={{ fontSize: 10, letterSpacing: 1 }}>
              Nuevos puntos
            </label>
            <input
              type="number"
              min="0"
              className="form-control border-2 border-dark fw-bold"
              style={{ fontSize: 18 }}
              value={nuevosPts}
              onChange={e => setNuevosPts(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="fw-bold text-secondary text-uppercase mb-1 d-block" style={{ fontSize: 10, letterSpacing: 1 }}>
              Motivo de corrección
            </label>
            <textarea
              className="form-control border-2 border-dark"
              rows={2}
              placeholder="Ej: Error de pesaje, corrección manual..."
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              style={{ fontSize: 13, resize: "none" }}
            />
          </div>

          <div className="d-flex gap-2">
            <button onClick={onCerrar} className="btn btn-outline-dark border-2 fw-bold flex-fill">
              Cancelar
            </button>
            <button onClick={guardar} className="btn btn-warning border border-2 border-dark fw-bold flex-fill">
              <i className="bi bi-check-circle-fill me-1" /> Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal editar entrega ──────────────────────────────────────────────────────
function ModalEditar({ entrega, onGuardar, onCerrar }) {
  const [peso,     setPeso]     = useState(entrega.peso);
  const [material, setMaterial] = useState(entrega.material);
  const [fecha,    setFecha]    = useState(entrega.fecha);

  const guardar = () => {
    if (!peso || isNaN(peso) || Number(peso) <= 0) return;
    onGuardar(entrega.id, {
      peso:     Number(peso),
      material,
      fecha,
    });
    onCerrar();
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999 }}
      onClick={onCerrar}
    >
      <div
        className="card border border-2 border-dark rounded-3 shadow-lg"
        style={{ width: 400 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="fw-black text-dark" style={{ fontSize: 16 }}>
              <i className="bi bi-pencil-square text-success me-2" />
              Editar entrega
            </div>
            <button onClick={onCerrar} className="btn btn-sm btn-outline-dark border-2 rounded-2 p-0" style={{ width: 28, height: 28 }}>
              <i className="bi bi-x" />
            </button>
          </div>

          <div className="p-2 rounded-2 bg-warning border border-dark mb-3 d-flex align-items-center gap-2">
            <Av text={entrega.av} size={32} bg="#000" color="#ffc107" />
            <div className="fw-bold text-dark" style={{ fontSize: 13 }}>{entrega.nombre}</div>
          </div>

          <div className="mb-3">
            <label className="fw-bold text-secondary text-uppercase mb-1 d-block" style={{ fontSize: 10, letterSpacing: 1 }}>Material</label>
            <select
              className="form-select border-2 border-dark fw-semibold"
              value={material}
              onChange={e => setMaterial(e.target.value)}
              style={{ fontSize: 13 }}
            >
              {["Papel", "Cartón", "Vidrio", "Plástico (PET)"].map(m => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="fw-bold text-secondary text-uppercase mb-1 d-block" style={{ fontSize: 10, letterSpacing: 1 }}>Peso (kg)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              className="form-control border-2 border-dark fw-bold"
              style={{ fontSize: 16 }}
              value={peso}
              onChange={e => setPeso(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="fw-bold text-secondary text-uppercase mb-1 d-block" style={{ fontSize: 10, letterSpacing: 1 }}>Fecha</label>
            <input
              type="date"
              className="form-control border-2 border-dark fw-semibold"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              style={{ fontSize: 13 }}
            />
          </div>

          <div className="d-flex gap-2">
            <button onClick={onCerrar} className="btn btn-outline-dark border-2 fw-bold flex-fill">
              Cancelar
            </button>
            <button onClick={guardar} className="btn btn-success border border-2 border-dark fw-bold flex-fill">
              <i className="bi bi-check-circle-fill me-1" /> Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Detalle entrega ───────────────────────────────────────────────────────────
function DetalleEntrega({ entrega, onVolver, onCambiarEstado, onCorregirPts, onEditar }) {
  const siguienteEstado = entrega.estado === "Validada" ? "Pendiente" : "Validada";
  const [obsEdit, setObsEdit] = useState(entrega.obs || "");
  const [obsSaved, setObsSaved] = useState(entrega.obs || "");
  const [editandoObs, setEditandoObs] = useState(false);

  return (
    <div>
      <button
        onClick={onVolver}
        className="btn btn-outline-dark border-2 fw-bold mb-4 d-flex align-items-center gap-2"
      >
        <i className="bi bi-arrow-left" /> Volver al historial
      </button>

      <div className="row g-3">
        {/* Info reciclador */}
        <div className="col-md-6">
          <div className="card border border-2 border-dark rounded-3 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="fw-bold text-secondary text-uppercase mb-3" style={{ fontSize: 10, letterSpacing: 1 }}>
                Información del reciclador
              </div>
              <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-2 bg-warning border border-dark">
                <Av text={entrega.av} size={52} bg="#000" color="#ffc107" />
                <div>
                  <div className="fw-black text-dark" style={{ fontSize: 16 }}>{entrega.nombre}</div>
                  <div className="fw-semibold text-dark" style={{ fontSize: 12 }}>Usuario reciclador</div>
                  <div className="mt-1"><Badge estado={entrega.estado} /></div>
                </div>
              </div>
              <div className="d-flex flex-column gap-2 mb-3">
                {[
                  ["bi-box-seam",     "Material", entrega.material],
                  ["bi-speedometer2", "Peso",     `${entrega.peso} kg`],
                  ["bi-calendar3",    "Fecha",    entrega.fecha],
                ].map(([icon, label, val]) => (
                  <div key={label} className="d-flex align-items-center gap-2 p-2 rounded-2 bg-light border border-dark">
                    <i className={`bi ${icon} text-success`} style={{ fontSize: 15, width: 18 }} />
                    <span className="text-secondary fw-semibold" style={{ fontSize: 12 }}>{label}:</span>
                    <span className="fw-bold text-dark" style={{ fontSize: 13 }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Botón cambiar estado */}
              <button
                onClick={() => onCambiarEstado(entrega.id, siguienteEstado)}
                className={`btn border-2 border-dark fw-bold w-100 d-flex align-items-center justify-content-center gap-2 ${
                  entrega.estado === "Validada" ? "btn-outline-dark" : "btn-success"
                }`}
              >
                <i className={`bi ${entrega.estado === "Validada" ? "bi-arrow-counterclockwise" : "bi-check-circle-fill"}`} />
                {entrega.estado === "Validada" ? "Marcar como Pendiente" : "Marcar como Validada"}
              </button>
            </div>
          </div>
        </div>

        {/* Puntos */}
        <div className="col-md-6">
          <div className="card border border-2 border-dark rounded-3 shadow-sm h-100">
            <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center text-center">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 bg-success border border-dark mb-3"
                style={{ width: 60, height: 60 }}
              >
                <i className="bi bi-recycle text-white" style={{ fontSize: 28 }} />
              </div>
              <div className="text-secondary fw-semibold mb-1" style={{ fontSize: 13 }}>Puntos otorgados</div>
              <div className="fw-black text-warning" style={{ fontSize: 56 }}>{entrega.pts}</div>
              <div className="text-secondary" style={{ fontSize: 12 }}>puntos</div>
              <div className="mt-4 d-flex gap-2 w-100">
                <button
                  onClick={() => onEditar(entrega)}
                  className="btn btn-outline-dark border-2 fw-bold flex-fill btn-sm"
                >
                  <i className="bi bi-pencil me-1" /> Editar
                </button>
                <button
                  onClick={() => onCorregirPts(entrega)}
                  className="btn btn-warning border border-2 border-dark fw-bold flex-fill btn-sm"
                >
                  <i className="bi bi-arrow-repeat me-1" /> Corregir pts
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div className="col-12">
          <div className="card border border-2 border-dark rounded-3 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="fw-bold text-secondary text-uppercase" style={{ fontSize: 10, letterSpacing: 1 }}>
                  Observaciones
                </div>
                <button
                  onClick={() => setEditandoObs(o => !o)}
                  className="btn btn-sm btn-outline-dark border-2 fw-bold"
                  style={{ fontSize: 11 }}
                >
                  <i className={`bi ${editandoObs ? "bi-x" : "bi-pencil"} me-1`} />
                  {editandoObs ? "Cancelar" : "Editar"}
                </button>
              </div>

              {editandoObs ? (
                <>
                  <textarea
                    className="form-control border-2 border-dark mb-2"
                    rows={3}
                    value={obsEdit}
                    onChange={e => setObsEdit(e.target.value)}
                    placeholder="Escribe una observación..."
                    style={{ fontSize: 13, resize: "none" }}
                  />
                  <button
                    onClick={() => { setObsSaved(obsEdit); setEditandoObs(false); }}
                    className="btn btn-success border border-2 border-dark fw-bold btn-sm"
                  >
                    <i className="bi bi-floppy me-1" /> Guardar observación
                  </button>
                </>
              ) : (
                <div className="rounded-2 p-3 bg-light border border-dark text-secondary fst-italic" style={{ fontSize: 14 }}>
                  {obsSaved || "Sin observaciones registradas."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Historial principal ───────────────────────────────────────────────────────
export default function HistorialdeEntregas() {
  const [entregas,     setEntregas]     = useState(ENTREGAS_INICIALES);
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtroMat,    setFiltroMat]    = useState("Todos");
  const [filtroEst,    setFiltroEst]    = useState("Todos");
  const [busqueda,     setBusqueda]     = useState("");
  const [modalPts,     setModalPts]     = useState(null); // entrega a corregir pts
  const [modalEditar,  setModalEditar]  = useState(null); // entrega a editar

  // Cambiar estado de una entrega
  const handleCambiarEstado = (id, nuevoEstado) => {
    setEntregas(prev => prev.map(e => e.id === id ? { ...e, estado: nuevoEstado } : e));
    setSeleccionado(prev => prev ? { ...prev, estado: nuevoEstado } : prev);
  };

  // Corregir puntos
  const handleCorregirPts = (id, nuevosPts) => {
    setEntregas(prev => prev.map(e => e.id === id ? { ...e, pts: nuevosPts } : e));
    setSeleccionado(prev => prev ? { ...prev, pts: nuevosPts } : prev);
  };

  // Editar entrega (peso, material, fecha)
  const handleEditar = (id, cambios) => {
    setEntregas(prev => prev.map(e => e.id === id ? { ...e, ...cambios } : e));
    setSeleccionado(prev => prev ? { ...prev, ...cambios } : prev);
  };

  // Vista detalle
  if (seleccionado) {
    const entregaActual = entregas.find(e => e.id === seleccionado.id) || seleccionado;
    return (
      <>
        {modalPts && (
          <ModalCorregirPts
            entrega={modalPts}
            onGuardar={handleCorregirPts}
            onCerrar={() => setModalPts(null)}
          />
        )}
        {modalEditar && (
          <ModalEditar
            entrega={modalEditar}
            onGuardar={handleEditar}
            onCerrar={() => setModalEditar(null)}
          />
        )}
        <DetalleEntrega
          entrega={entregaActual}
          onVolver={() => setSeleccionado(null)}
          onCambiarEstado={handleCambiarEstado}
          onCorregirPts={e => setModalPts(e)}
          onEditar={e => setModalEditar(e)}
        />
      </>
    );
  }

  const filtradas = entregas.filter(e => {
    const matchMat = filtroMat === "Todos" || e.material === filtroMat;
    const matchEst = filtroEst === "Todos" || e.estado   === filtroEst;
    const matchBus = e.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchMat && matchEst && matchBus;
  });

  const totalKg  = filtradas.reduce((a, e) => a + e.peso, 0).toFixed(1);
  const totalPts = filtradas.reduce((a, e) => a + e.pts,  0);

  return (
    <>
      {modalPts && (
        <ModalCorregirPts
          entrega={modalPts}
          onGuardar={handleCorregirPts}
          onCerrar={() => setModalPts(null)}
        />
      )}

      <div>
        {/* Búsqueda y filtros */}
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          <div className="input-group" style={{ maxWidth: 260 }}>
            <span className="input-group-text border-2 border-dark bg-white">
              <i className="bi bi-search text-dark" />
            </span>
            <input
              type="text"
              className="form-control border-2 border-dark fw-semibold"
              placeholder="Buscar reciclador..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ fontSize: 13 }}
            />
          </div>

          <select
            className="form-select border-2 border-dark fw-semibold"
            style={{ maxWidth: 170, fontSize: 13 }}
            value={filtroMat}
            onChange={e => setFiltroMat(e.target.value)}
          >
            {MATERIALES.map(m => <option key={m}>{m}</option>)}
          </select>

          <select
            className="form-select border-2 border-dark fw-semibold"
            style={{ maxWidth: 150, fontSize: 13 }}
            value={filtroEst}
            onChange={e => setFiltroEst(e.target.value)}
          >
            {ESTADOS.map(s => <option key={s}>{s}</option>)}
          </select>

          <span className="ms-auto text-secondary fw-semibold" style={{ fontSize: 12 }}>
            {filtradas.length} resultado{filtradas.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Resumen rápido */}
        <div className="row g-2 mb-3">
          <div className="col-4">
            <div className="card border border-2 border-dark rounded-3 text-center py-2 bg-white shadow-sm">
              <div className="fw-black text-dark" style={{ fontSize: 20 }}>{filtradas.length}</div>
              <div className="text-secondary fw-semibold" style={{ fontSize: 11 }}>Entregas</div>
            </div>
          </div>
          <div className="col-4">
            <div className="card border border-2 border-dark rounded-3 text-center py-2 bg-success shadow-sm">
              <div className="fw-black text-white" style={{ fontSize: 20 }}>{totalKg} kg</div>
              <div className="text-white fw-semibold" style={{ fontSize: 11 }}>Total reciclado</div>
            </div>
          </div>
          <div className="col-4">
            <div className="card border border-2 border-dark rounded-3 text-center py-2 bg-warning shadow-sm">
              <div className="fw-black text-dark" style={{ fontSize: 20 }}>{totalPts}</div>
              <div className="text-dark fw-semibold" style={{ fontSize: 11 }}>Puntos otorgados</div>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="card border border-2 border-dark rounded-3 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: 13 }}>
              <thead className="bg-dark text-white">
                <tr>
                  {["Usuario", "Material", "Peso", "Puntos", "Fecha", "Estado", "Acciones"].map(h => (
                    <th key={h} className="fw-bold border-0 px-3 py-2" style={{ fontSize: 11, letterSpacing: 0.5 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtradas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-secondary py-5 fw-semibold">
                      <i className="bi bi-inbox d-block mb-2" style={{ fontSize: 32 }} />
                      Sin resultados para los filtros aplicados
                    </td>
                  </tr>
                ) : (
                  filtradas.map(e => (
                    <tr key={e.id}>
                      <td className="px-3 py-2">
                        <div className="d-flex align-items-center gap-2">
                          <Av text={e.av} size={30} />
                          <span className="fw-bold text-dark">{e.nombre}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="d-flex align-items-center gap-1">
                          <i className={`bi ${MAT_ICON[e.material] || "bi-recycle"} text-success`} />
                          <span className="fw-semibold text-dark">{e.material}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 fw-bold text-dark">{e.peso} kg</td>
                      <td className="px-3 py-2 fw-black text-warning">{e.pts}</td>
                      <td className="px-3 py-2 text-secondary">{e.fecha}</td>
                      <td className="px-3 py-2"><Badge estado={e.estado} /></td>
                      <td className="px-3 py-2">
                        <div className="d-flex gap-1">
                          {/* Ver detalle */}
                          <button
                            onClick={() => setSeleccionado(e)}
                            className="btn btn-sm btn-warning border border-dark fw-bold d-flex align-items-center gap-1"
                            style={{ fontSize: 11 }}
                          >
                            <i className="bi bi-eye" /> Ver
                          </button>
                          {/* Cambiar estado rápido */}
                          <button
                            onClick={() => handleCambiarEstado(e.id, e.estado === "Validada" ? "Pendiente" : "Validada")}
                            className={`btn btn-sm border-2 border-dark fw-bold d-flex align-items-center gap-1 ${
                              e.estado === "Validada" ? "btn-outline-dark" : "btn-success"
                            }`}
                            style={{ fontSize: 11 }}
                            title={e.estado === "Validada" ? "Marcar Pendiente" : "Marcar Validada"}
                          >
                            <i className={`bi ${e.estado === "Validada" ? "bi-arrow-counterclockwise" : "bi-check-circle-fill"}`} />
                          </button>
                          {/* Corregir puntos */}
                          <button
                            onClick={() => setModalPts(e)}
                            className="btn btn-sm btn-outline-dark border-2 fw-bold d-flex align-items-center gap-1"
                            style={{ fontSize: 11 }}
                            title="Corregir puntos"
                          >
                            <i className="bi bi-arrow-repeat" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}