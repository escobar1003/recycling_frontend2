// src/components/DetalleEntrega.jsx
import { useState } from "react";
import Av from "./Av";
import Badge from "./Badge";

const MAT_PTS = {
  "Plástico (PET)": 30, "Cartón": 20, "Vidrio": 25, "Aluminio": 40,
  "Papel": 15, "Tetrapack": 18, "Electrónicos": 60, "Metal": 35,
  "Orgánico": 10, "Tela": 22, "Mixto": 12,
};
const MAT_ICON = {
  "Plástico (PET)": "bi-bag",        "Cartón": "bi-box-seam",
  "Vidrio": "bi-cup-straw",          "Aluminio": "bi-cup",
  "Papel": "bi-file-earmark",        "Tetrapack": "bi-box2",
  "Electrónicos": "bi-phone",        "Metal": "bi-gear",
  "Orgánico": "bi-tree",             "Tela": "bi-scissors",
  "Mixto": "bi-recycle",
};

export default function DetalleEntrega({ entrega, onBack, onValidar, onRechazar }) {
  const [obs,  setObs]  = useState("");
  const [peso, setPeso] = useState(entrega.peso);

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

        {/* Materiales */}
        <div className="mb-3">
          <div className="fw-bold text-secondary text-uppercase mb-2" style={{ fontSize: 10, letterSpacing: 1 }}>
            Material entregado
          </div>
          <div className="d-flex flex-wrap gap-2">
            {entrega.materiales.map(m => (
              <div
                key={m}
                className="d-flex align-items-center gap-1 px-2 py-1 rounded-2 border border-dark bg-white"
              >
                <i className={`bi ${MAT_ICON[m] || "bi-recycle"} text-success`} style={{ fontSize: 14 }} />
                <span className="fw-bold text-dark" style={{ fontSize: 12 }}>{m}</span>
                <span className="text-secondary" style={{ fontSize: 10 }}>{MAT_PTS[m]} pts/u</span>
              </div>
            ))}
          </div>
        </div>

        {/* Peso y puntos */}
        <div className="row g-2 mb-3">
          <div className="col-6">
            <div className="card border border-dark rounded-2 p-2 h-100">
              <div className="fw-bold text-secondary mb-1" style={{ fontSize: 10 }}>
                <i className="bi bi-speedometer2 me-1" />Peso (kg)
              </div>
              <input
                type="number"
                value={peso}
                onChange={e => setPeso(e.target.value)}
                step="0.1"
                min="0"
                className="form-control fw-black border border-dark"
                style={{ fontSize: 20 }}
              />
            </div>
          </div>
          <div className="col-6">
            <div className="card border border-2 border-dark rounded-2 p-2 h-100 bg-warning">
              <div className="fw-bold text-dark mb-1" style={{ fontSize: 10 }}>
                <i className="bi bi-star-fill me-1" />Puntos a otorgar
              </div>
              <div className="fw-black text-dark lh-1" style={{ fontSize: 28 }}>{entrega.pts}</div>
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
              onClick={onValidar}
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