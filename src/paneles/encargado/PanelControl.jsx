// src/paneles/encargado/PanelControl.jsx
import { useState } from "react";

// ── Datos mock ─────────────────────────────────────────────────────────────
const ENTREGAS_INIT = [
  { id: 1, usuario: "Elena Santacruz", av: "ES", material: "Plástico",    kg: 3.2, hora: "08:14", prioridad: "alta"   },
  { id: 2, usuario: "Carlos Muñoz",    av: "CM", material: "Cartón",      kg: 7.5, hora: "08:45", prioridad: "normal" },
  { id: 3, usuario: "Laura Pérez",     av: "LP", material: "Vidrio",      kg: 2.1, hora: "09:02", prioridad: "normal" },
  { id: 4, usuario: "Andrés Torres",   av: "AT", material: "Metal",       kg: 5.0, hora: "09:30", prioridad: "alta"   },
  { id: 5, usuario: "María Gómez",     av: "MG", material: "Electrónico", kg: 1.4, hora: "09:55", prioridad: "baja"   },
];

const ALERTAS_INIT = [
  { id: 1, icon: "bi-exclamation-triangle-fill", color: "#dc3545", msg: "Stock de 'Entrada Cine' bajo (3 unidades)"         },
  { id: 2, icon: "bi-clock-fill",                color: "#ffc107", msg: "4 entregas sin procesar hace más de 30 min"        },
  { id: 3, icon: "bi-gift-fill",                 color: "#198754", msg: "Laura Pérez tiene 2100 pts sin canjear"            },
  { id: 4, icon: "bi-exclamation-triangle-fill", color: "#dc3545", msg: "Stock de 'Descuento Transporte' bajo (5 unidades)" },
];

const USUARIOS_ACTIVOS = [
  { id: 1, nombre: "Elena Santacruz", av: "ES", entregas: 4, pts: 1240 },
  { id: 2, nombre: "Laura Pérez",     av: "LP", entregas: 7, pts: 2100 },
  { id: 3, nombre: "Carlos Muñoz",    av: "CM", entregas: 3, pts: 870  },
];

const USUARIOS_MOCK = [
  { id: 1, nombre: "Elena Santacruz", av: "ES" },
  { id: 2, nombre: "Carlos Muñoz",    av: "CM" },
  { id: 3, nombre: "Laura Pérez",     av: "LP" },
  { id: 4, nombre: "Andrés Torres",   av: "AT" },
  { id: 5, nombre: "María Gómez",     av: "MG" },
];

const MATERIALES = ["Plástico", "Cartón", "Vidrio", "Metal", "Electrónico", "Papel", "Orgánico", "Textil"];

const FORM_INIT = { usuario: "", material: "", kg: "", prioridad: "normal", observacion: "" };

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

function StatCard({ icon, label, value, sub, iconColor = "#ffc107" }) {
  return (
    <div className="card border border-2 border-dark rounded-3 shadow-sm h-100" style={{ background: "#212529" }}>
      <div className="card-body p-3">
        <i className={`bi ${icon} mb-2 d-block`} style={{ fontSize: 24, color: iconColor }} />
        <div className="fw-black lh-1 mb-1" style={{ fontSize: 28, color: iconColor }}>{value}</div>
        <div className="fw-bold text-white" style={{ fontSize: 13 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "#adb5bd" }}>{sub}</div>}
      </div>
    </div>
  );
}

const prioColor = {
  alta:   { bg: "#dc3545", text: "white",  label: "Alta"   },
  normal: { bg: "#ffc107", text: "#000",   label: "Normal" },
  baja:   { bg: "#198754", text: "white",  label: "Baja"   },
};

// ══════════════════════════════════════════════════════════════════════════
export default function PanelControl() {
  const [entregas, setEntregas]   = useState(ENTREGAS_INIT);
  const [alertas,  setAlertas]    = useState(ALERTAS_INIT);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm]           = useState(FORM_INIT);
  const [formError, setFormError] = useState("");
  const [toast, setToast]         = useState(null);

  // ── Toast helper ──────────────────────────────────────────────────────
  const showToast = (msg, tipo = "success") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Procesar entrega ──────────────────────────────────────────────────
  const procesarEntrega = (id) => {
    setEntregas(prev => prev.filter(e => e.id !== id));
    showToast("Entrega procesada correctamente");
  };

  // ── Cambiar prioridad ─────────────────────────────────────────────────
  const cambiarPrioridad = (id, nuevaPrio) => {
    setEntregas(prev => prev.map(e => e.id === id ? { ...e, prioridad: nuevaPrio } : e));
  };

  // ── Cerrar alerta ─────────────────────────────────────────────────────
  const cerrarAlerta = (id) => setAlertas(prev => prev.filter(a => a.id !== id));

  // ── Agregar entrega ───────────────────────────────────────────────────
  const handleAgregar = () => {
    if (!form.usuario || !form.material || !form.kg) {
      setFormError("Por favor completa usuario, material y kilogramos.");
      return;
    }
    if (isNaN(form.kg) || Number(form.kg) <= 0) {
      setFormError("Los kilogramos deben ser un número mayor a 0.");
      return;
    }

    const usuario = USUARIOS_MOCK.find(u => u.nombre === form.usuario);
    const nueva = {
      id:        Date.now(),
      usuario:   form.usuario,
      av:        usuario?.av || form.usuario.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
      material:  form.material,
      kg:        parseFloat(form.kg),
      hora:      new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      prioridad: form.prioridad,
      observacion: form.observacion,
    };

    setEntregas(prev => [nueva, ...prev]);
    setForm(FORM_INIT);
    setFormError("");
    setMostrarForm(false);
    showToast("Entrega registrada exitosamente");
  };

  const handleFormChange = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setFormError("");
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div style={{ position: "relative" }}>

      {/* ── Toast ── */}
      {toast && (
        <div
          className="position-fixed d-flex align-items-center gap-2 px-3 py-2 rounded-3 border border-2 border-dark shadow-lg fw-bold"
          style={{ bottom: 24, right: 24, zIndex: 9999, background: toast.tipo === "success" ? "#198754" : "#dc3545", color: "white", fontSize: 13 }}
        >
          <i className={`bi ${toast.tipo === "success" ? "bi-check-circle-fill" : "bi-x-circle-fill"}`} />
          {toast.msg}
        </div>
      )}

      {/* ── KPIs ── */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <StatCard icon="bi-people-fill"   label="Usuarios hoy"        value={12}             sub="en este punto" iconColor="#ffc107" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard icon="bi-box-seam-fill" label="Entregas pendientes" value={entregas.length} sub="sin procesar" iconColor="#dc3545" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard icon="bi-gift-fill"     label="Canjes hoy"          value={5}              sub="completados"   iconColor="#198754" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard icon="bi-star-fill"     label="Puntos entregados"   value="3.2k"           sub="esta semana"   iconColor="#ffc107" />
        </div>
      </div>

      <div className="row g-4">

        {/* ── Columna principal ── */}
        <div className="col-lg-8 d-flex flex-column gap-4">

          {/* ── Formulario nueva entrega ── */}
          <div className="card border border-2 border-dark rounded-3 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="fw-black text-dark" style={{ fontSize: 15 }}>
                  <i className="bi bi-plus-circle-fill text-warning me-2" />
                  Registrar nueva entrega
                </div>
                <button
                  className={`btn fw-bold border-2 d-flex align-items-center gap-2 ${mostrarForm ? "btn-dark border-warning text-warning" : "btn-warning border-dark text-dark"}`}
                  style={{ fontSize: 12 }}
                  onClick={() => { setMostrarForm(v => !v); setFormError(""); setForm(FORM_INIT); }}
                >
                  <i className={`bi ${mostrarForm ? "bi-dash-lg" : "bi-plus-lg"}`} />
                  {mostrarForm ? "Cancelar" : "Nueva entrega"}
                </button>
              </div>

              {mostrarForm && (
                <div className="mt-3 pt-3 border-top border-dark">
                  <div className="row g-3">

                    {/* Usuario */}
                    <div className="col-md-6">
                      <label className="fw-bold text-dark mb-1 d-block" style={{ fontSize: 12 }}>
                        <i className="bi bi-person-fill text-warning me-1" /> Usuario reciclador *
                      </label>
                      <select
                        className="form-select border-dark border-2 fw-semibold"
                        style={{ fontSize: 13 }}
                        value={form.usuario}
                        onChange={e => handleFormChange("usuario", e.target.value)}
                      >
                        <option value="">Seleccionar usuario...</option>
                        {USUARIOS_MOCK.map(u => (
                          <option key={u.id} value={u.nombre}>{u.nombre}</option>
                        ))}
                      </select>
                    </div>

                    {/* Material */}
                    <div className="col-md-6">
                      <label className="fw-bold text-dark mb-1 d-block" style={{ fontSize: 12 }}>
                        <i className="bi bi-recycle text-success me-1" /> Material *
                      </label>
                      <select
                        className="form-select border-dark border-2 fw-semibold"
                        style={{ fontSize: 13 }}
                        value={form.material}
                        onChange={e => handleFormChange("material", e.target.value)}
                      >
                        <option value="">Seleccionar material...</option>
                        {MATERIALES.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Kilogramos */}
                    <div className="col-md-4">
                      <label className="fw-bold text-dark mb-1 d-block" style={{ fontSize: 12 }}>
                        <i className="bi bi-speedometer2 text-warning me-1" /> Kilogramos *
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        className="form-control border-dark border-2 fw-semibold"
                        style={{ fontSize: 13 }}
                        placeholder="Ej: 3.5"
                        value={form.kg}
                        onChange={e => handleFormChange("kg", e.target.value)}
                      />
                    </div>

                    {/* Prioridad */}
                    <div className="col-md-8">
                      <label className="fw-bold text-dark mb-1 d-block" style={{ fontSize: 12 }}>
                        <i className="bi bi-flag-fill text-warning me-1" /> Urgencia / Prioridad
                      </label>
                      <div className="d-flex gap-2">
                        {["alta", "normal", "baja"].map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => handleFormChange("prioridad", p)}
                            className={`btn flex-grow-1 fw-bold border-2 ${form.prioridad === p ? "border-dark" : "border-dark opacity-50"}`}
                            style={{
                              fontSize: 12,
                              backgroundColor: form.prioridad === p ? prioColor[p].bg : "white",
                              color: form.prioridad === p ? prioColor[p].text : "#212529",
                            }}
                          >
                            <i className={`bi bi-circle-fill me-1`} style={{ fontSize: 8 }} />
                            {prioColor[p].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Observación */}
                    <div className="col-12">
                      <label className="fw-bold text-dark mb-1 d-block" style={{ fontSize: 12 }}>
                        <i className="bi bi-chat-left-text-fill text-warning me-1" /> Observación (opcional)
                      </label>
                      <textarea
                        className="form-control border-dark border-2"
                        style={{ fontSize: 13, resize: "none" }}
                        rows={2}
                        placeholder="Ej: Material en mal estado, requiere revisión..."
                        value={form.observacion}
                        onChange={e => handleFormChange("observacion", e.target.value)}
                      />
                    </div>

                    {/* Error */}
                    {formError && (
                      <div className="col-12">
                        <div className="alert alert-danger border border-2 border-dark py-2 d-flex align-items-center gap-2 mb-0">
                          <i className="bi bi-exclamation-triangle-fill" />
                          <span style={{ fontSize: 13 }}>{formError}</span>
                        </div>
                      </div>
                    )}

                    {/* Botón */}
                    <div className="col-12">
                      <button
                        className="btn btn-dark border border-2 border-warning fw-black d-flex align-items-center gap-2 px-4"
                        style={{ fontSize: 13 }}
                        onClick={handleAgregar}
                      >
                        <i className="bi bi-plus-circle-fill text-warning" /> Registrar entrega
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Lista entregas pendientes ── */}
          <div className="card border border-2 border-dark rounded-3 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="fw-black text-dark" style={{ fontSize: 15 }}>
                  <i className="bi bi-box-seam-fill text-warning me-2" />
                  Entregas pendientes
                </div>
                {entregas.length > 0 && (
                  <span className="badge bg-danger border border-dark fw-bold" style={{ fontSize: 11 }}>
                    {entregas.length} sin atender
                  </span>
                )}
              </div>

              {entregas.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: 42 }} />
                  <div className="fw-black text-dark mt-2" style={{ fontSize: 15 }}>¡Todo al día!</div>
                  <div className="text-secondary" style={{ fontSize: 12 }}>No hay entregas pendientes</div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {entregas.map(e => (
                    <div
                      key={e.id}
                      className="rounded-2 border border-2 border-dark bg-white overflow-hidden"
                    >
                      {/* Fila principal */}
                      <div className="d-flex align-items-center gap-3 p-2">
                        <Av text={e.av} size={38} bg="#ffc107" color="#000" />
                        <div className="flex-grow-1">
                          <div className="fw-bold text-dark" style={{ fontSize: 13 }}>{e.usuario}</div>
                          <div className="text-secondary" style={{ fontSize: 11 }}>
                            <i className="bi bi-recycle me-1 text-success" />
                            {e.material} · {e.kg} kg · {e.hora}
                          </div>
                          {e.observacion && (
                            <div className="text-secondary fst-italic" style={{ fontSize: 10 }}>
                              <i className="bi bi-chat-left-text me-1" />{e.observacion}
                            </div>
                          )}
                        </div>
                        <button
                          className="btn btn-dark border border-2 border-warning fw-bold d-flex align-items-center gap-1"
                          style={{ fontSize: 11, padding: "5px 12px", whiteSpace: "nowrap" }}
                          onClick={() => procesarEntrega(e.id)}
                        >
                          <i className="bi bi-check2 text-warning" /> Procesar
                        </button>
                      </div>

                      {/* Fila de prioridad */}
                      <div
                        className="d-flex align-items-center gap-2 px-3 py-2 border-top border-dark"
                        style={{ background: "#f8f9fa" }}
                      >
                        <i className="bi bi-flag-fill text-warning" style={{ fontSize: 11 }} />
                        <span className="fw-bold text-dark" style={{ fontSize: 11 }}>Urgencia:</span>
                        <div className="d-flex gap-1">
                          {["alta", "normal", "baja"].map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => cambiarPrioridad(e.id, p)}
                              className="btn fw-bold border border-2 border-dark"
                              style={{
                                fontSize: 10,
                                padding: "2px 10px",
                                backgroundColor: e.prioridad === p ? prioColor[p].bg : "white",
                                color: e.prioridad === p ? prioColor[p].text : "#212529",
                              }}
                            >
                              {prioColor[p].label}
                            </button>
                          ))}
                        </div>
                        <span
                          className="ms-auto badge border border-dark fw-bold"
                          style={{
                            backgroundColor: prioColor[e.prioridad].bg,
                            color: prioColor[e.prioridad].text,
                            fontSize: 10,
                          }}
                        >
                          {prioColor[e.prioridad].label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ── Columna derecha ── */}
        <div className="col-lg-4 d-flex flex-column gap-4">

          {/* Alertas */}
          <div className="card border border-2 border-dark rounded-3 shadow-sm">
            <div className="card-body p-3">
              <div className="fw-black text-dark mb-3" style={{ fontSize: 15 }}>
                <i className="bi bi-bell-fill text-warning me-2" />
                Alertas del punto
                {alertas.length > 0 && (
                  <span className="badge bg-dark border border-warning text-warning fw-bold ms-2" style={{ fontSize: 10 }}>
                    {alertas.length}
                  </span>
                )}
              </div>
              {alertas.length === 0 ? (
                <div className="text-center py-3 text-secondary" style={{ fontSize: 13 }}>
                  <i className="bi bi-check-circle-fill text-success me-2" />Sin alertas activas
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {alertas.map(a => (
                    <div key={a.id} className="d-flex align-items-start gap-2 p-2 rounded-2 border border-dark bg-white">
                      <i className={`bi ${a.icon} flex-shrink-0 mt-1`} style={{ color: a.color, fontSize: 13 }} />
                      <span className="flex-grow-1 text-dark" style={{ fontSize: 12 }}>{a.msg}</span>
                      <button className="btn p-0 border-0 bg-transparent" onClick={() => cerrarAlerta(a.id)}>
                        <i className="bi bi-x-lg text-secondary" style={{ fontSize: 12 }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Usuarios más activos */}
          <div className="card border border-2 border-dark rounded-3 shadow-sm">
            <div className="card-body p-3">
              <div className="fw-black text-dark mb-3" style={{ fontSize: 15 }}>
                <i className="bi bi-trophy-fill text-warning me-2" />
                Usuarios más activos
              </div>
              <div className="d-flex flex-column gap-2">
                {USUARIOS_ACTIVOS.map((u, i) => (
                  <div key={u.id} className="d-flex align-items-center gap-2 p-2 rounded-2 border border-dark bg-white">
                    <span
                      className="fw-black d-flex align-items-center justify-content-center rounded-circle border border-2 border-dark flex-shrink-0"
                      style={{ width: 24, height: 24, fontSize: 11, background: i === 0 ? "#ffc107" : "#f8f9fa" }}
                    >
                      {i + 1}
                    </span>
                    <Av text={u.av} size={32} bg="#212529" color="#ffc107" />
                    <div className="flex-grow-1">
                      <div className="fw-bold text-dark" style={{ fontSize: 12 }}>{u.nombre}</div>
                      <div className="text-secondary" style={{ fontSize: 10 }}>
                        {u.entregas} entregas · {u.pts} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen rápido del turno */}
          <div className="card border border-2 border-dark rounded-3 shadow-sm" style={{ background: "#212529" }}>
            <div className="card-body p-3">
              <div className="fw-black text-warning mb-3" style={{ fontSize: 15 }}>
                <i className="bi bi-clock-history me-2" />
                Resumen del turno
              </div>
              <div className="d-flex flex-column gap-2">
                {[
                  { icon: "bi-box-seam-fill",  color: "#ffc107", label: "Entregas procesadas", value: 8  },
                  { icon: "bi-recycle",         color: "#198754", label: "Kg recolectados",     value: "47.3 kg" },
                  { icon: "bi-gift-fill",       color: "#0d6efd", label: "Canjes realizados",   value: 5  },
                  { icon: "bi-star-fill",       color: "#ffc107", label: "Puntos entregados",   value: 620 },
                ].map((item, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <i className={`bi ${item.icon}`} style={{ color: item.color, fontSize: 13 }} />
                      <span className="text-white" style={{ fontSize: 12 }}>{item.label}</span>
                    </div>
                    <span className="fw-black text-warning" style={{ fontSize: 13 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}