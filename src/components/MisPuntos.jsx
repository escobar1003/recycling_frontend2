import { useState, useEffect } from "react";
import { getPuntos, getHistorialPuntos } from "../services/api";

export default function MisPuntos({ state, showToast }) {
  const [resumen,   setResumen]   = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([getPuntos(), getHistorialPuntos()])
      .then(([r, h]) => {
        setResumen(r);
        setHistorial(h.movimientos ?? []);
      })
      .catch(() => {
        // Si falla (ej. usuario no logueado como "usuario"), usa datos locales
        setResumen(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Fallback a datos locales del state si el backend no responde
  const saldo    = resumen?.saldo    ?? state.pts;
  const ganados  = resumen?.ganados  ?? state.historial.filter(h => h.icon === "⭐").reduce((a, h) => a + (parseInt(h.desc.match(/\d+/)?.[0]) || 0), 0);
  const canjeados = resumen ? (historial.filter(m => m.tipoMovimiento === "descontados").length) : state.historial.filter(h => h.icon === "🎁").length;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="fw-bold mb-4">Mis Puntos</h4>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="bg-success rounded-3 p-4 text-white h-100">
            <div className="small fw-semibold opacity-75 mb-2">Saldo actual</div>
            <div className="fw-bold lh-1" style={{ fontSize: 30 }}>{saldo.toLocaleString()}</div>
            <div className="opacity-75 mt-2" style={{ fontSize: 12 }}>puntos disponibles</div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="bg-success-subtle rounded-3 p-4 text-success h-100">
            <div className="small fw-semibold opacity-75 mb-2">Total ganado</div>
            <div className="fw-bold lh-1" style={{ fontSize: 30 }}>{ganados.toLocaleString()}</div>
            <div className="opacity-75 mt-2" style={{ fontSize: 12 }}>puntos acumulados</div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="rounded-3 p-4 h-100" style={{ background: "#fef9c3", color: "#c79a0f" }}>
            <div className="small fw-semibold opacity-75 mb-2">Canjes realizados</div>
            <div className="fw-bold lh-1" style={{ fontSize: 30 }}>{canjeados}</div>
            <div className="opacity-75 mt-2" style={{ fontSize: 12 }}>recompensas</div>
          </div>
        </div>
      </div>

      {/* Historial */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="fw-bold mb-3" style={{ fontSize: 15 }}>📋 Historial de movimientos</div>

          {historial.length === 0 && state.historial.length === 0 ? (
            <div className="text-center text-muted small py-3">Sin movimientos aún</div>
          ) : (
            (historial.length > 0 ? historial : state.historial).map((h, i) => {
              // Normaliza tanto formato backend como local
              const desc   = h.descripcion ?? h.desc ?? `Movimiento de puntos`;
              const tiempo = h.fechaMovimiento ?? h.tiempo ?? "";
              const pts    = h.puntos ?? 0;
              const tipo   = h.tipoMovimiento;
              const icon   = tipo === "ganados" ? "⭐" : tipo === "descontados" ? "🎁" : h.icon ?? "♻️";

              return (
                <div key={h.idMovimientoPunto ?? h.id ?? i} className="d-flex align-items-center gap-3 py-3 border-bottom">
                  <div className="bg-success-subtle rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 38, height: 38, fontSize: 18 }}>
                    {icon}
                  </div>
                  <div className="flex-fill">
                    <div className="fw-bold small">{desc}</div>
                    {pts !== 0 && (
                      <div className={`small ${tipo === "ganados" ? "text-success" : "text-danger"}`}>
                        {tipo === "ganados" ? "+" : "-"}{Math.abs(pts)} puntos
                      </div>
                    )}
                  </div>
                  <div className="text-muted" style={{ fontSize: 12 }}>{tiempo}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
