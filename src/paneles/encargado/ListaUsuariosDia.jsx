// src/components/ListaUsuariosDia.jsx
import Av from "./Av";
import Badge from "./Badge";

export default function ListaUsuariosDia({ dia, entregas, onSelect }) {
  const fecha = new Date(dia + "T12:00:00");
  const label = fecha.toLocaleDateString("es-CO", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div className="card border border-2 border-dark rounded-3 h-100 shadow-sm">
      <div className="card-body p-3">
        <div className="mb-3">
          <div className="fw-black text-dark text-capitalize" style={{ fontSize: 15 }}>{label}</div>
          <div className="text-secondary fw-semibold" style={{ fontSize: 11 }}>
            {entregas.length} entrega{entregas.length !== 1 ? "s" : ""} registrada{entregas.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="d-flex flex-column gap-2">
          {entregas.map(e => (
            <div
              key={e.id}
              onClick={() => onSelect(e)}
              className="d-flex align-items-center gap-2 p-2 rounded-2 border border-dark bg-white"
              style={{ cursor: "pointer", transition: "all .15s" }}
              onMouseEnter={el => { el.currentTarget.style.background = "#ffc107"; }}
              onMouseLeave={el => { el.currentTarget.style.background = "#fff"; }}
            >
              <Av text={e.av} size={38} />
              <div className="flex-grow-1">
                <div className="fw-bold text-dark" style={{ fontSize: 13 }}>{e.nombre}</div>
                <div className="text-secondary" style={{ fontSize: 11 }}>
                  {e.materiales.join(", ")} · {e.peso} kg
                </div>
              </div>
              <div className="d-flex flex-column align-items-end gap-1">
                <Badge estado={e.estado} />
                <span className="fw-bold text-success" style={{ fontSize: 11 }}>+{e.pts} pts</span>
              </div>
              <i className="bi bi-chevron-right text-secondary" style={{ fontSize: 13 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}