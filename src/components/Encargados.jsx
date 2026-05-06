import { useState, useEffect } from "react";
import { ZONAS, ALL_POINTS, MAT_CFG } from "../constants/data";
import { getRolCfg, Toggle, rolDesc, ModalDetalle, TablaUsuarios } from "./UserShared";
import { getPuntos } from "../services/api";

const EMPTY_FORM = {
  nombre: "", email: "", telefono: "",
  rol: "Encargado", zona: "", puntoAsignado: "", activo: true,
};

export default function Encargados({ state, dispatch, showToast }) {
  const [tab, setTab] = useState("encargados");

  // ── Estado gestión encargados ──
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [errors,   setErrors]   = useState({});
  const [search,   setSearch]   = useState("");
  const [viewUser, setViewUser] = useState(null);

  // ── Estado entregas ──
  const [modalEntrega,       setModalEntrega]       = useState(false);
  const [mat,                setMat]                = useState(Object.keys(MAT_CFG)[0]);
  const [fecha,              setFecha]              = useState(new Date().toISOString().split("T")[0]);
  const [peso,               setPeso]               = useState("");
  const [puntos,             setPuntos]             = useState([]);
  const [puntoSeleccionado,  setPuntoSeleccionado]  = useState("");

  useEffect(() => {
    getPuntos()
      .then(data => {
        setPuntos(data);
        if (data.length > 0) setPuntoSeleccionado(data[0].nombre);
      })
      .catch(() => showToast("No se cargaron los puntos del servidor", "error"));
  }, []);

  // ── Helpers encargados ──
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };
  const encargados = state.usuarios.filter(u => u.rol === "Encargado");

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.email.trim())  e.email  = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido";
    else if (state.usuarios.some(u => u.email === form.email.trim())) e.email = "Este correo ya existe";
    return e;
  };

  const guardar = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const initials = form.nombre.trim().split(" ").slice(0, 2).map(w => w[0].toUpperCase()).join("");
    dispatch({
      type: "ADD_USER",
      payload: {
        id: Date.now(), nombre: form.nombre.trim(), email: form.email.trim(),
        telefono: form.telefono.trim(), rol: "Encargado",
        zona: form.zona, puntoAsignado: form.puntoAsignado,
        pts: 0, activo: form.activo, av: initials,
        fechaAlta: new Date().toLocaleDateString("es-CO"),
      },
    });
    showToast(`Encargado "${form.nombre.trim()}" registrado`);
    setModal(false); setForm(EMPTY_FORM); setErrors({});
  };

  const cerrarModal    = () => { setModal(false); setForm(EMPTY_FORM); setErrors({}); };
  const handleToggle   = (id, nombre, estadoActual) => {
    dispatch({ type: "TOGGLE_USER", payload: id });
    showToast(
      estadoActual ? `${nombre} ha sido desactivado` : `${nombre} ha sido activado`,
      estadoActual ? "error" : "success"
    );
  };
  const handleSave     = (u) => dispatch({ type: "UPDATE_USER", payload: u });
  const handleEliminar = (id) => {
    dispatch({ type: "DEL_USER", payload: id });
    showToast("Encargado eliminado", "error");
    if (viewUser?.id === id) setViewUser(null);
  };

  const filtered = encargados.filter(u => {
    const q = search.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.zona || "").toLowerCase().includes(q) ||
      (u.puntoAsignado || "").toLowerCase().includes(q)
    );
  });

  const avatarPreview = form.nombre.trim().split(" ").slice(0, 2)
    .map(w => w[0]?.toUpperCase() || "").join("") || "?";

  // ── Helper entregas ──
  const registrarEntrega = () => {
    const p = parseFloat(peso);
    if (!p || p <= 0) { showToast("Ingresa un peso válido", "error"); return; }
    const cfg = MAT_CFG[mat] || { pts: 20, icon: "bi-recycle" };
    const pts = Math.round(p * cfg.pts);
    dispatch({
      type: "ADD_ENTREGA",
      payload: {
        id: Date.now(), material: mat, icon: cfg.icon,
        punto: puntoSeleccionado, fecha, peso: p, pts, estado: "Pendiente",
      },
    });
    dispatch({
      type: "ADD_HISTORIAL",
      payload: {
        id: Date.now(), desc: `Ganaste ${pts} puntos`,
        sub: `Entrega de ${mat}`, tiempo: "Ahora", icon: "bi-star-fill",
      },
    });
    dispatch({ type: "ADD_PTS", payload: pts });
    showToast(`Entrega registrada — +${pts} pts`);
    setModalEntrega(false); setPeso("");
  };

  return (
    <div className="container-fluid px-0">

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold mb-0 text-dark">
            <i className="bi bi-shop me-2 text-success"></i>Encargados
          </h5>
          <small className="text-muted">
            {encargados.length} encargado{encargados.length !== 1 ? "s" : ""} registrado{encargados.length !== 1 ? "s" : ""}
          </small>
        </div>

        {tab === "encargados" && (
          <button
            className="btn btn-success btn-sm rounded-3 d-flex align-items-center gap-2"
            onClick={() => setModal(true)}
          >
            <i className="bi bi-person-badge"></i>Nuevo encargado
          </button>
        )}
        {tab === "entregas" && (
          <button
            className="btn btn-sm rounded-3 d-flex align-items-center gap-2 fw-semibold"
            style={{ background: "#16a34a", color: "#fff", fontSize: 12 }}
            onClick={() => setModalEntrega(true)}
          >
            <i className="bi bi-plus-lg"></i>Nueva entrega
          </button>
        )}
      </div>

      {/* ── Tabs ── */}
      <ul className="nav nav-tabs mb-4" style={{ borderBottom: "2px solid #e5e7eb" }}>
        {[
          { key: "encargados", icon: "bi-person-badge", label: "Gestión de encargados" },
          { key: "entregas",   icon: "bi-box-seam",     label: "Entregas" },
        ].map(t => (
          <li key={t.key} className="nav-item">
            <button
              className={`nav-link d-flex align-items-center gap-2 fw-semibold border-0 bg-transparent ${
                tab === t.key ? "active text-success border-bottom border-success" : "text-secondary"
              }`}
              style={{
                fontSize: 13,
                borderBottom: tab === t.key ? "2px solid #16a34a" : "2px solid transparent",
                marginBottom: -2,
              }}
              onClick={() => setTab(t.key)}
            >
              <i className={`bi ${t.icon}`}></i>{t.label}
            </button>
          </li>
        ))}
      </ul>

      {/* ════════════════ TAB: ENCARGADOS ════════════════ */}
      {tab === "encargados" && (
        <>
          <div className="mb-3">
            <div className="input-group input-group-sm" style={{ maxWidth: 400 }}>
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-secondary"></i>
              </span>
              <input
                className="form-control border-start-0 rounded-end-3"
                placeholder="Buscar por nombre, correo, zona o punto..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="card border rounded-3 shadow-none">
            <div className="card-body p-0">
              <TablaUsuarios
                lista={filtered}
                onToggle={handleToggle}
                onVer={setViewUser}
                onEliminar={handleEliminar}
              />
            </div>
          </div>

          <ModalDetalle
            user={viewUser}
            onClose={() => setViewUser(null)}
            onSave={handleSave}
            showToast={showToast}
          />
        </>
      )}

      {/* ════════════════ TAB: ENTREGAS ════════════════ */}
      {tab === "entregas" && (
        <div className="card border-0 rounded-3 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: 13 }}>
                <thead className="table-light border-bottom">
                  <tr>
                    {[
                      ["bi-recycle",      "Material"],
                      ["bi-geo-alt",      "Punto de entrega"],
                      ["bi-calendar",     "Fecha"],
                      ["bi-speedometer2", "Peso"],
                      ["bi-star",         "Puntos"],
                      ["bi-check-circle", "Estado"],
                    ].map(([ic, h]) => (
                      <th key={h} className="ps-4 py-3 fw-semibold text-muted text-uppercase border-0" style={{ fontSize: 11 }}>
                        <i className={`bi ${ic} me-1`}></i>{h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {state.entregas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-5">
                        <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
                        <span className="small">No hay entregas registradas</span>
                      </td>
                    </tr>
                  ) : state.entregas.map(e => (
                    <tr key={e.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-2">
                          <i className={`bi ${e.icon}`} style={{ color: "#16a34a", fontSize: 16 }}></i>
                          <span className="fw-semibold text-dark">{e.material}</span>
                        </div>
                      </td>
                      <td className="text-secondary">{e.punto}</td>
                      <td className="text-secondary">{e.fecha}</td>
                      <td className="fw-semibold text-dark">{e.peso} kg</td>
                      <td>
                        <span className="badge rounded-pill fw-semibold"
                          style={{ background: "#facc15", color: "#111111", fontSize: 11 }}>
                          +{e.pts} pts
                        </span>
                      </td>
                      <td>
                        <span className="badge rounded-pill fw-normal"
                          style={{
                            fontSize: 10,
                            background: e.estado === "Validada" ? "#16a34a" : "#f3f4f6",
                            color:      e.estado === "Validada" ? "#fff"    : "#6b7280",
                          }}>
                          <i className={`bi ${e.estado === "Validada" ? "bi-check-circle" : "bi-clock"} me-1`}></i>
                          {e.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal nuevo encargado ══ */}
      {modal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.45)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border shadow-lg">
              <div className="modal-header bg-success-subtle border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-white border border-success d-flex align-items-center justify-content-center fw-bold text-success flex-shrink-0 fs-5 p-3">
                    {avatarPreview}
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold mb-0 text-success">
                      <i className="bi bi-shop me-1"></i> Nuevo encargado
                    </h5>
                    <div className="small text-success opacity-75 mt-1">Responsable de un punto de recolección</div>
                  </div>
                </div>
                <button type="button" className="btn-close ms-auto" onClick={cerrarModal} />
              </div>

              <div className="modal-body">
                <p className="text-uppercase fw-bold text-muted mb-2 small">
                  <i className="bi bi-person me-1"></i>Información personal
                </p>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Nombre completo *</label>
                    <input value={form.nombre} onChange={e => set("nombre", e.target.value)}
                      placeholder="Ej: María López"
                      className={`form-control form-control-sm bg-light ${errors.nombre ? "is-invalid" : ""}`} />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Correo electrónico *</label>
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className={`form-control form-control-sm bg-light ${errors.email ? "is-invalid" : ""}`} />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Teléfono</label>
                    <input value={form.telefono} onChange={e => set("telefono", e.target.value)}
                      placeholder="Ej: 300 123 4567"
                      className="form-control form-control-sm bg-light" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Zona</label>
                    <select value={form.zona} onChange={e => set("zona", e.target.value)}
                      className="form-select form-select-sm bg-light">
                      <option value="">Sin zona</option>
                      {ZONAS.map(z => <option key={z}>{z}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-secondary">Punto de recolección asignado</label>
                    <select value={form.puntoAsignado} onChange={e => set("puntoAsignado", e.target.value)}
                      className="form-select form-select-sm bg-light">
                      <option value="">Sin asignar</option>
                      {ALL_POINTS.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="alert alert-success small fw-semibold mb-3">
                  <i className="bi bi-info-circle me-1"></i> {rolDesc["Encargado"]}
                </div>

                <div className="d-flex align-items-center justify-content-between p-3 rounded bg-light border">
                  <div>
                    <div className="fw-bold small">Estado inicial</div>
                    <div className="text-muted small">El encargado podrá gestionar su punto si está activo</div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`small fw-semibold ${form.activo ? "text-success" : "text-secondary"}`}>
                      {form.activo ? "Activo" : "Inactivo"}
                    </span>
                    <Toggle checked={form.activo} onChange={v => set("activo", v)} />
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top gap-2">
                <button className="btn btn-outline-secondary flex-fill" onClick={cerrarModal}>
                  <i className="bi bi-x-lg me-1"></i>Cancelar
                </button>
                <button className="btn btn-success flex-fill fw-bold" onClick={guardar}>
                  <i className="bi bi-shop me-1"></i>Registrar encargado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal nueva entrega ══ */}
      {modalEntrega && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.4)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h6 className="modal-title fw-bold text-dark">
                  <i className="bi bi-box-seam me-2" style={{ color: "#16a34a" }}></i>Nueva entrega
                </h6>
                <button type="button" className="btn-close" onClick={() => setModalEntrega(false)} />
              </div>

              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">
                    <i className="bi bi-recycle me-1 text-secondary"></i>Material
                  </label>
                  <select className="form-select form-select-sm rounded-3" value={mat} onChange={e => setMat(e.target.value)}>
                    {Object.keys(MAT_CFG).map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">
                    <i className="bi bi-geo-alt me-1 text-secondary"></i>Punto de entrega
                    {puntos.length === 0 && (
                      <span className="text-muted fw-normal ms-1" style={{ fontSize: 11 }}>(cargando...)</span>
                    )}
                  </label>
                  <select
                    className="form-select form-select-sm rounded-3"
                    value={puntoSeleccionado}
                    onChange={e => setPuntoSeleccionado(e.target.value)}
                    disabled={puntos.length === 0}
                  >
                    {puntos.length === 0
                      ? <option>Cargando puntos...</option>
                      : puntos.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)
                    }
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">
                    <i className="bi bi-calendar me-1 text-secondary"></i>Fecha
                  </label>
                  <input type="date" className="form-control form-control-sm rounded-3"
                    value={fecha} onChange={e => setFecha(e.target.value)} />
                </div>

                <div className="mb-1">
                  <label className="form-label small fw-semibold text-dark">
                    <i className="bi bi-speedometer2 me-1 text-secondary"></i>Peso (kg)
                  </label>
                  <div className="input-group input-group-sm">
                    <input type="number" className="form-control rounded-start-3"
                      value={peso} onChange={e => setPeso(e.target.value)}
                      placeholder="Ej: 2.5" min="0" step="0.1" />
                    <span className="input-group-text rounded-end-3 text-muted">kg</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top gap-2">
                <button className="btn btn-sm rounded-3 flex-fill fw-semibold"
                  style={{ background: "#f3f4f6", color: "#111111", border: "1px solid #e5e7eb", fontSize: 12 }}
                  onClick={() => setModalEntrega(false)}>
                  <i className="bi bi-x me-1"></i>Cancelar
                </button>
                <button className="btn btn-sm rounded-3 flex-fill fw-semibold"
                  style={{ background: "#16a34a", color: "#fff", border: "none", fontSize: 12 }}
                  onClick={registrarEntrega}>
                  <i className="bi bi-check-lg me-1"></i>Registrar entrega
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}