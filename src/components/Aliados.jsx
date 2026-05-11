import { useState, useEffect } from "react";
import { ZONAS, ALL_POINTS } from "../constants/data";
import { getRolCfg, Toggle, rolDesc, ModalDetalle, TablaUsuarios } from "./UserShared";
import { getAliados, crearAliado, actualizarAliado, eliminarAliado } from "../services/api";

const EMPTY_FORM = {
  nombre: "", email: "", telefono: "",
  nombreEntidad: "", rol: "Afiliado",
  zona: "", activo: true,
};

export default function Aliados({ state, dispatch, showToast }) {
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [errors,   setErrors]   = useState({});
  const [search,   setSearch]   = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getAliados()
      .then(data => {
        const lista = (data.aliados ?? []).map(u => ({
          id:            u.idAliado,
          nombre:        u.nombre,
          nombreEntidad: u.nombreEntidad ?? u.entidad ?? "",
          email:         u.correo,
          telefono:      u.telefono ?? "",
          rol:           "Afiliado",
          zona:          u.zona ?? "",
          pts:           0,
          activo:        u.estadoAliado?.idEstadoAliado === 1,
          av:            (u.nombre ?? "").trim().split(" ").slice(0, 2)
                           .map(w => w[0]?.toUpperCase() ?? "").join(""),
          fechaAlta:     u.fechaRegistro
                           ? new Date(u.fechaRegistro).toLocaleDateString("es-CO")
                           : "—",
        }));
        dispatch({ type: "SET_ALIADOS", payload: lista });
      })
      .catch(() => showToast("No se pudieron cargar los supermercados", "error"))
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const aliados = state.aliados || [];

  const validate = () => {
    const e = {};
    if (!form.nombre.trim())        e.nombre        = "El nombre del contacto es obligatorio";
    if (!form.nombreEntidad.trim()) e.nombreEntidad  = "El nombre del supermercado es obligatorio";
    if (!form.email.trim())         e.email         = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = "Correo inválido (debe tener @ y dominio)";
    else if (state.usuarios.some(u => u.email === form.email.trim())) e.email = "Este correo ya existe";
    if (form.telefono.trim() && !/^\d{10}$/.test(form.telefono.trim()))
      e.telefono = "El teléfono debe tener exactamente 10 dígitos";
    return e;
  };

  const guardar = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    try {
      const resp = await crearAliado({
        nombre:        form.nombre.trim(),
        nombreEntidad: form.nombreEntidad.trim(),
        correo:        form.email.trim(),
        password:      "Temporal123!",
        telefono:      form.telefono.trim() || undefined,
        zona:          form.zona || undefined,
      });
      const initials = form.nombre.trim().split(" ").slice(0, 2).map(w => w[0].toUpperCase()).join("");
      dispatch({
        type: "ADD_ALIADO",
        payload: {
          id:            resp.aliado?.idAliado ?? resp.usuario?.idUsuario ?? Date.now(),
          nombre:        form.nombre.trim(),
          nombreEntidad: form.nombreEntidad.trim(),
          email:         form.email.trim(),
          telefono:      form.telefono.trim(),
          rol:           "Afiliado",
          zona:          form.zona,
          pts:           0,
          activo:        true,
          av:            initials,
          fechaAlta:     new Date().toLocaleDateString("es-CO"),
        },
      });
      showToast(`Supermercado "${form.nombreEntidad.trim()}" registrado`);
      setModal(false); setForm(EMPTY_FORM); setErrors({});
    } catch (err) {
      showToast("Error al registrar supermercado: " + err.message, "error");
    }
  };

  const cerrarModal = () => { setModal(false); setForm(EMPTY_FORM); setErrors({}); };

  const handleToggle = async (id, nombre, estadoActual) => {
    try {
      await actualizarAliado(id, { idEstadoAliado: estadoActual ? 2 : 1 });
      dispatch({ type: "TOGGLE_ALIADO", payload: id });
      showToast(
        estadoActual ? `${nombre} desactivado` : `${nombre} activado`,
        estadoActual ? "error" : "success"
      );
    } catch (err) {
      showToast("Error al cambiar estado: " + err.message, "error");
    }
  };

  const handleSave = (u) => dispatch({ type: "UPDATE_USER", payload: u });

  const handleEliminar = async (id) => {
    try {
      await eliminarAliado(id);
      dispatch({ type: "DEL_ALIADO", payload: id });
      showToast("Supermercado eliminado", "error");
      if (viewUser?.id === id) setViewUser(null);
    } catch (err) {
      showToast("Error al eliminar: " + err.message, "error");
    }
  };

  const filtered = aliados.filter(u => {
    const q = search.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.nombreEntidad || "").toLowerCase().includes(q) ||
      (u.zona || "").toLowerCase().includes(q)
    );
  });

  const avatarPreview = form.nombre.trim().split(" ").slice(0, 2)
    .map(w => w[0]?.toUpperCase() || "").join("") || "?";

  return (
    <div className="container-fluid px-0">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-0 text-dark">
            <i className="bi bi-shop me-2 text-success"></i>
            Gestión de supermercados
          </h5>
          <small className="text-muted">
            {aliados.length} supermercado{aliados.length !== 1 ? "s" : ""} registrado{aliados.length !== 1 ? "s" : ""}
          </small>
        </div>
        <button
          className="btn btn-success btn-sm rounded-3 d-flex align-items-center gap-2"
          onClick={() => setModal(true)}
        >
          <i className="bi bi-shop"></i>
          Nuevo supermercado
        </button>
      </div>

      <div className="mb-3">
        <div className="input-group input-group-sm" style={{ maxWidth: 420 }}>
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-secondary"></i>
          </span>
          <input
            className="form-control border-start-0 rounded-end-3"
            placeholder="Buscar por nombre, entidad, correo o zona..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-3 text-muted small">
          <div className="spinner-border spinner-border-sm text-success me-2"></div>
          Cargando supermercados del servidor...
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

      {modal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.4)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow">

              <div className="modal-header border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold bg-light border text-dark"
                    style={{ width: 44, height: 44, fontSize: 15 }}
                  >
                    {avatarPreview}
                  </div>
                  <div>
                    <h6 className="modal-title fw-bold mb-0 text-dark">
                      <i className="bi bi-shop me-2 text-success"></i>
                      Nuevo supermercado
                    </h6>
                    <small className="text-muted">Registra un supermercado como punto de acopio</small>
                  </div>
                </div>
                <button type="button" className="btn-close ms-auto" onClick={cerrarModal} />
              </div>

              <div className="modal-body p-4">

                <p className="small fw-semibold text-muted text-uppercase mb-2" style={{ letterSpacing: 1 }}>
                  <i className="bi bi-building me-1"></i>Datos del supermercado
                </p>
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-dark">
                      <i className="bi bi-shop me-1 text-secondary"></i>Nombre del supermercado *
                    </label>
                    <input
                      value={form.nombreEntidad}
                      onChange={e => set("nombreEntidad", e.target.value)}
                      placeholder="Ej: Supermercado La 14"
                      className={`form-control form-control-sm rounded-3 ${errors.nombreEntidad ? "is-invalid" : ""}`}
                    />
                    {errors.nombreEntidad && <div className="invalid-feedback">{errors.nombreEntidad}</div>}
                  </div>
                </div>

                <p className="small fw-semibold text-muted text-uppercase mb-2" style={{ letterSpacing: 1 }}>
                  <i className="bi bi-person me-1"></i>Datos del contacto
                </p>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      <i className="bi bi-person me-1 text-secondary"></i>Nombre del contacto *
                    </label>
                    <input
                      value={form.nombre}
                      onChange={e => set("nombre", e.target.value)}
                      placeholder="Ej: Carlos Ruiz"
                      className={`form-control form-control-sm rounded-3 ${errors.nombre ? "is-invalid" : ""}`}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      <i className="bi bi-envelope me-1 text-secondary"></i>Correo electrónico *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      placeholder="correo@supermercado.com"
                      className={`form-control form-control-sm rounded-3 ${errors.email ? "is-invalid" : ""}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      <i className="bi bi-telephone me-1 text-secondary"></i>Teléfono
                    </label>
                    <input
                      value={form.telefono}
                      onChange={e => set("telefono", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Ej: 3001234567"
                      maxLength={10}
                      className={`form-control form-control-sm rounded-3 ${errors.telefono ? "is-invalid" : ""}`}
                    />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      <i className="bi bi-geo-alt me-1 text-secondary"></i>Zona
                    </label>
                    <select
                      value={form.zona}
                      onChange={e => set("zona", e.target.value)}
                      className="form-select form-select-sm rounded-3"
                    >
                      <option value="">Sin zona</option>
                      {ZONAS.map(z => <option key={z}>{z}</option>)}
                    </select>
                  </div>

                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light border">
                      <div>
                        <div className="small fw-semibold text-dark">Estado inicial</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>El supermercado podrá operar si está activo</div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge rounded-pill ${form.activo ? "bg-success" : "bg-secondary"}`}>
                          {form.activo ? "Activo" : "Inactivo"}
                        </span>
                        <Toggle checked={form.activo} onChange={v => set("activo", v)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top gap-2">
                <button className="btn btn-outline-secondary btn-sm rounded-3 flex-fill" onClick={cerrarModal}>
                  <i className="bi bi-x me-1"></i>Cancelar
                </button>
                <button className="btn btn-success btn-sm rounded-3 flex-fill" onClick={guardar}>
                  <i className="bi bi-check-lg me-1"></i>Registrar supermercado
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}