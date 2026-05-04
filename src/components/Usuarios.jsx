import { useState, useEffect } from "react";
import { ALL_POINTS, ZONAS } from "../constants/data";
import { getRolCfg, Toggle, rolDesc, ModalDetalle, TablaUsuarios } from "./UserShared";
import { getUsuarios, crearUsuario, cambiarEstadoUsuario } from "../services/api";

const EMPTY_FORM = {
  nombre: "", email: "", telefono: "",
  rol: "Usuario", zona: "", puntoAsignado: "", activo: true,
};

export default function Usuarios({ state, dispatch, showToast }) {
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [errors,   setErrors]   = useState({});
  const [search,   setSearch]   = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getUsuarios()
      .then(data => {
        dispatch({ type: "SET_USUARIOS", payload: data });
      })
      .catch(() => {
        showToast("No se pudieron cargar los usuarios del servidor", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const usuarios = state.usuarios.filter(u => u.rol === "Usuario");

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.email.trim())  e.email  = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo invalido";
    else if (state.usuarios.some(u => u.email === form.email.trim())) e.email = "Este correo ya existe";
    return e;
  };

  const guardar = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    try {
      const nuevo = await crearUsuario({
        nombre_completo: form.nombre.trim(),
        correo:          form.email.trim(),
        rol:             "Usuario",
      });

      const initials = form.nombre.trim().split(" ").slice(0, 2).map(w => w[0].toUpperCase()).join("");
      dispatch({
        type: "ADD_USER",
        payload: {
          id:            nuevo.id ?? Date.now(),
          nombre:        form.nombre.trim(),
          email:         form.email.trim(),
          telefono:      form.telefono.trim(),
          rol:           "Usuario",
          zona:          form.zona,
          puntoAsignado: form.puntoAsignado,
          pts:           0,
          activo:        form.activo,
          av:            initials,
          fechaAlta:     new Date().toLocaleDateString("es-CO"),
        },
      });

      showToast(`Usuario "${form.nombre.trim()}" registrado`);
      setModal(false); setForm(EMPTY_FORM); setErrors({});
    } catch (err) {
      showToast("Error al registrar: " + err.message, "error");
    }
  };

  const cerrarModal = () => { setModal(false); setForm(EMPTY_FORM); setErrors({}); };

  const handleToggle = async (id, nombre, estadoActual) => {
    try {
      await cambiarEstadoUsuario(id, !estadoActual);
      dispatch({ type: "TOGGLE_USER", payload: id });
      showToast(
        estadoActual ? `${nombre} ha sido desactivado` : `${nombre} ha sido activado`,
        estadoActual ? "error" : "success"
      );
    } catch (err) {
      showToast("Error al cambiar estado: " + err.message, "error");
    }
  };

  const handleSave = (updatedUser) => {
    dispatch({ type: "UPDATE_USER", payload: updatedUser });
  };

  const handleEliminar = (id) => {
    dispatch({ type: "DEL_USER", payload: id });
    showToast("Usuario eliminado", "error");
    if (viewUser?.id === id) setViewUser(null);
  };

  const filtered = usuarios.filter(u => {
    const q = search.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.zona || "").toLowerCase().includes(q)
    );
  });

  const avatarPreview = form.nombre.trim().split(" ").slice(0, 2)
    .map(w => w[0]?.toUpperCase() || "").join("") || "?";

  const cfg = getRolCfg("Usuario");

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">
          <i className="bi bi-recycle me-2 text-success"></i>Gestion de usuarios
        </h4>
        <button className="btn btn-success" onClick={() => setModal(true)}>
          <i className="bi bi-person-plus me-1"></i> Nuevo usuario
        </button>
      </div>

      {/* Buscador */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <div className="input-group w-auto">
          <span className="input-group-text bg-white">
            <i className="bi bi-search"></i>
          </span>
          <input
            className="form-control"
            placeholder="Buscar por nombre, correo o zona..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Indicador de carga */}
      {loading && (
        <div className="text-center py-3 text-muted small">
          <div className="spinner-border spinner-border-sm text-success me-2"></div>
          Cargando usuarios del servidor...
        </div>
      )}

      {/* Tabla */}
      <TablaUsuarios
        lista={filtered}
        onToggle={handleToggle}
        onVer={setViewUser}
        onEliminar={handleEliminar}
      />

      {/* Modal editar */}
      <ModalDetalle
        user={viewUser}
        onClose={() => setViewUser(null)}
        onSave={handleSave}
        showToast={showToast}
      />

      {/* Modal nuevo usuario */}
      {modal && (
        <div className="modal d-block" style={{background:"rgba(0,0,0,.45)",zIndex:9000}}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border shadow-lg">

              <div className="modal-header border-bottom">
                <div>
                  <h5 className="modal-title fw-bold text-success">
                    <i className="bi bi-recycle me-1"></i> Nuevo usuario
                  </h5>
                  <div className="text-muted small">Registra un nuevo usuario reciclador.</div>
                </div>
                <button type="button" className="btn-close" onClick={cerrarModal} />
              </div>

              <div className="modal-body">
                <div className="text-center mb-3">
                  <div className="rounded-circle bg-success-subtle border border-success d-flex align-items-center justify-content-center fw-bold text-success mx-auto fs-4 p-3">
                    {avatarPreview}
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Nombre completo *</label>
                    <input
                      value={form.nombre} onChange={e => set("nombre", e.target.value)}
                      placeholder="Ej: Carlos Ruiz"
                      className={`form-control form-control-sm bg-light ${errors.nombre ? "is-invalid" : ""}`}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Correo electronico *</label>
                    <input
                      type="email" value={form.email} onChange={e => set("email", e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className={`form-control form-control-sm bg-light ${errors.email ? "is-invalid" : ""}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Telefono</label>
                    <input
                      value={form.telefono} onChange={e => set("telefono", e.target.value)}
                      placeholder="Ej: 300 123 4567"
                      className="form-control form-control-sm bg-light"
                    />
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
                    <label className="form-label fw-bold small text-secondary">Punto asignado</label>
                    <select value={form.puntoAsignado} onChange={e => set("puntoAsignado", e.target.value)}
                      className="form-select form-select-sm bg-light">
                      <option value="">Sin asignar</option>
                      {ALL_POINTS.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <div className="alert alert-success small fw-semibold mb-0">
                      <i className="bi bi-info-circle me-1"></i> {rolDesc["Usuario"]}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between p-3 rounded bg-light border">
                      <div>
                        <div className="fw-bold small">Estado inicial</div>
                        <div className="text-muted small">El usuario podra acceder de inmediato si esta activo</div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`small fw-semibold ${form.activo ? "text-success" : "text-secondary"}`}>
                          {form.activo ? "Activo" : "Inactivo"}
                        </span>
                        <Toggle checked={form.activo} onChange={v => set("activo", v)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top gap-2">
                <button className="btn btn-outline-secondary flex-fill" onClick={cerrarModal}>
                  <i className="bi bi-x-lg me-1"></i> Cancelar
                </button>
                <button className="btn btn-success flex-fill fw-bold" onClick={guardar}>
                  <i className="bi bi-check2-circle me-1"></i> Registrar usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}