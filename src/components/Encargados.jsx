import { useState, useEffect } from "react";
import { ZONAS, ALL_POINTS, MAT_CFG } from "../constants/data";
import { getRolCfg, Toggle, rolDesc, ModalDetalle, TablaUsuarios } from "./UserShared";
import {
  getEncargados,
  crearEncargado,
  actualizarEncargado,
  eliminarEncargado,
  getEntregasAdmin,
  actualizarEstadoEntregaAdmin,
} from "../services/api";

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
  const [loading,  setLoading]  = useState(true);

  // ── Estado entregas ──
  const [entregas,        setEntregas]        = useState([]);
  const [loadingEntregas, setLoadingEntregas] = useState(false);

  // ── Cargar encargados del backend ──
  useEffect(() => {
    getEncargados()
      .then(data => {
        const lista = (data.encargados ?? []).map(u => ({
          id:            u.idEncargado,
          nombre:        u.nombre,
          email:         u.correo,
          telefono:      u.telefono ?? "",
          rol:           "Encargado",
          zona:          u.zona ?? "",
          puntoAsignado: u.puntoAsignado ?? "",
          pts:           0,
          activo:        u.idEstado === 1,
          av:            (u.nombre ?? "").trim().split(" ").slice(0, 2)
                           .map(w => w[0]?.toUpperCase() ?? "").join(""),
          fechaAlta:     u.fechaRegistro
                           ? new Date(u.fechaRegistro).toLocaleDateString("es-CO")
                           : "—",
        }));
        dispatch({ type: "SET_ENCARGADOS", payload: lista });
      })
      .catch(() => showToast("No se pudieron cargar los encargados", "error"))
      .finally(() => setLoading(false));
  }, []);

  // ── Cargar entregas cuando se cambia al tab ──
  useEffect(() => {
    if (tab !== "entregas") return;
    setLoadingEntregas(true);
    getEntregasAdmin()
      .then(data => setEntregas(data.entregas ?? []))
      .catch(() => showToast("No se pudieron cargar las entregas", "error"))
      .finally(() => setLoadingEntregas(false));
  }, [tab]);

  // ── Helpers encargados ──
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };
  const encargados = state.encargados || [];

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.email.trim())  e.email  = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email))
                             e.email  = "Correo inválido (debe tener @ y dominio)";
    else if (encargados.some(u => u.email === form.email.trim()))
                             e.email  = "Este correo ya existe";
    if (!form.telefono.trim())   e.telefono = "El teléfono es obligatorio";
    else if (!/^\d{10}$/.test(form.telefono.trim()))
                             e.telefono = "El teléfono debe tener exactamente 10 dígitos";
    return e;
  };

  const guardar = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    try {
      const resp = await crearEncargado({
        nombre:        form.nombre.trim(),
        correo:        form.email.trim(),
        telefono:      form.telefono.trim() || undefined,
        zona:          form.zona || undefined,
        puntoAsignado: form.puntoAsignado || undefined,
      });
      const initials = form.nombre.trim().split(" ").slice(0, 2).map(w => w[0].toUpperCase()).join("");
      dispatch({
        type: "ADD_ENCARGADO",
        payload: {
          id:            resp.encargado?.idEncargado ?? Date.now(),
          nombre:        form.nombre.trim(),
          email:         form.email.trim(),
          telefono:      form.telefono.trim(),
          rol:           "Encargado",
          zona:          form.zona,
          puntoAsignado: form.puntoAsignado,
          pts:           0,
          activo:        true,
          av:            initials,
          fechaAlta:     new Date().toLocaleDateString("es-CO"),
        },
      });
      showToast(`Encargado "${form.nombre.trim()}" registrado`);
      setModal(false); setForm(EMPTY_FORM); setErrors({});
    } catch (err) {
      showToast("Error al registrar encargado: " + err.message, "error");
    }
  };

  const cerrarModal = () => { setModal(false); setForm(EMPTY_FORM); setErrors({}); };

  const handleToggle = async (id, nombre, estadoActual) => {
    try {
      await actualizarEncargado(id, { idEstado: estadoActual ? 2 : 1 });
      dispatch({ type: "TOGGLE_ENCARGADO", payload: id });
      showToast(
        estadoActual ? `${nombre} ha sido desactivado` : `${nombre} ha sido activado`,
        estadoActual ? "error" : "success"
      );
    } catch (err) {
      showToast("Error al cambiar estado: " + err.message, "error");
    }
  };

  const handleSave     = (u) => dispatch({ type: "UPDATE_ENCARGADO", payload: u });

  const handleEliminar = async (id) => {
    try {
      await eliminarEncargado(id);
      dispatch({ type: "DEL_ENCARGADO", payload: id });
      showToast("Encargado eliminado", "error");
      if (viewUser?.id === id) setViewUser(null);
    } catch (err) {
      showToast("Error al eliminar: " + err.message, "error");
    }
  };

  // ── Cambiar estado de una entrega ──
  const handleCambiarEstado = async (entrega) => {
    const nuevoEstado = entrega.idEstadoEntrega === 1 ? 2 : 1;
    try {
      await actualizarEstadoEntregaAdmin(entrega.idEntrega, nuevoEstado);
      setEntregas(prev =>
        prev.map(e =>
          e.idEntrega === entrega.idEntrega
            ? { ...e, idEstadoEntrega: nuevoEstado, estadoEntrega: { ...e.estadoEntrega, nombre: nuevoEstado === 2 ? "Validada" : "Pendiente" } }
            : e
        )
      );
      showToast(nuevoEstado === 2 ? "Entrega validada" : "Entrega marcada como pendiente", "success");
    } catch (err) {
      showToast("Error al cambiar estado: " + err.message, "error");
    }
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

          {loading && (
            <div className="text-center py-3 text-muted small">
              <div className="spinner-border spinner-border-sm text-success me-2"></div>
              Cargando encargados del servidor...
            </div>
          )}

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

            {loadingEntregas && (
              <div className="text-center py-4 text-muted small">
                <div className="spinner-border spinner-border-sm text-success me-2"></div>
                Cargando entregas...
              </div>
            )}

            {!loadingEntregas && (
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
                        ["bi-gear",         "Acción"],
                      ].map(([ic, h]) => (
                        <th key={h} className="ps-4 py-3 fw-semibold text-muted text-uppercase border-0" style={{ fontSize: 11 }}>
                          <i className={`bi ${ic} me-1`}></i>{h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entregas.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center text-muted py-5">
                          <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
                          <span className="small">No hay entregas registradas</span>
                        </td>
                      </tr>
                    ) : entregas.map(e => {
                      const estadoNombre = e.estadoEntrega?.nombre ?? "Pendiente";
                      const validada = estadoNombre === "Validada";
                      return (
                        <tr key={e.idEntrega}>
                          <td className="ps-4">
                            <span className="fw-semibold text-dark">
                              {e.detalles?.map(d => d.material?.nombre).join(", ") || "—"}
                            </span>
                          </td>
                          <td className="text-secondary">{e.puntoReciclaje?.nombre ?? "—"}</td>
                          <td className="text-secondary">
                            {e.fechaEntrega
                              ? new Date(e.fechaEntrega).toLocaleDateString("es-CO")
                              : "—"}
                          </td>
                          <td className="fw-semibold text-dark">{e.pesoTotal} kg</td>
                          <td>
                            <span className="badge rounded-pill fw-semibold"
                              style={{ background: "#facc15", color: "#111111", fontSize: 11 }}>
                              +{e.puntosTotales} pts
                            </span>
                          </td>
                          <td>
                            <span className="badge rounded-pill fw-normal"
                              style={{
                                fontSize: 10,
                                background: validada ? "#16a34a" : "#f3f4f6",
                                color:      validada ? "#fff"    : "#6b7280",
                              }}>
                              <i className={`bi ${validada ? "bi-check-circle" : "bi-clock"} me-1`}></i>
                              {estadoNombre}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm rounded-3 fw-semibold"
                              style={{
                                fontSize: 11,
                                background: validada ? "#f3f4f6" : "#16a34a",
                                color:      validada ? "#6b7280" : "#fff",
                                border: "none",
                              }}
                              onClick={() => handleCambiarEstado(e)}
                            >
                              {validada ? "Marcar pendiente" : "Validar"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
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
                    <label className="form-label fw-bold small text-secondary">Teléfono *</label>
                    <input value={form.telefono}
                      onChange={e => set("telefono", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Ej: 3001234567"
                      maxLength={10}
                      className={`form-control form-control-sm bg-light ${errors.telefono ? "is-invalid" : ""}`} />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
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

    </div>
  );
}