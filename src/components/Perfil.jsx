import { useState, useEffect } from "react";
import { getPerfil, actualizarPerfil, cambiarPassword } from "../services/api";
import { RolBadge } from "./UserShared";

export default function Perfil({ state, showToast, user }) {
  const [editMode,    setEditMode]    = useState(false);
  const [form,        setForm]        = useState({ nombre: "", correo: "", telefono: "" });
  const [saved,       setSaved]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [pwModal,     setPwModal]     = useState(false);
  const [pwForm,      setPwForm]      = useState({ actual: "", nuevo: "", confirmar: "" });
  const [pwLoading,   setPwLoading]   = useState(false);

  useEffect(() => {
    getPerfil()
      .then(data => {
        setSaved(data);
        setForm({ nombre: data.nombre, correo: data.correo, telefono: data.telefono ?? "" });
      })
      .catch(() => {
        // Fallback a datos del login
        if (user) {
          const fallback = { nombre: user.nombre, correo: user.correo, telefono: user.telefono ?? "", rol: user.rol, fechaRegistro: "" };
          setSaved(fallback);
          setForm({ nombre: fallback.nombre, correo: fallback.correo, telefono: fallback.telefono });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const totalEntregas = state.entregas.length;
  const totalKg       = state.entregas.reduce((a, e) => a + (e.peso ?? 0), 0);

  const guardar = async () => {
    if (!form.nombre.trim()) { showToast("El nombre es obligatorio", "error"); return; }
    try {
      const resp = await actualizarPerfil({ nombre: form.nombre.trim(), telefono: form.telefono.trim() });
      setSaved(s => ({ ...s, nombre: form.nombre.trim(), telefono: form.telefono.trim(), ...resp.usuario }));
      setEditMode(false);
      showToast("Perfil actualizado correctamente");
    } catch (err) {
      showToast("Error al actualizar: " + err.message, "error");
    }
  };

  const cancelar = () => {
    setForm({ nombre: saved.nombre, correo: saved.correo, telefono: saved.telefono ?? "" });
    setEditMode(false);
  };

  const handleCambiarPassword = async () => {
    if (!pwForm.actual || !pwForm.nuevo) { showToast("Completa todos los campos", "error"); return; }
    if (pwForm.nuevo !== pwForm.confirmar) { showToast("Las contraseñas no coinciden", "error"); return; }
    setPwLoading(true);
    try {
      await cambiarPassword(pwForm.actual, pwForm.nuevo);
      showToast("Contraseña actualizada correctamente");
      setPwModal(false);
      setPwForm({ actual: "", nuevo: "", confirmar: "" });
    } catch (err) {
      showToast("Error: " + err.message, "error");
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-success"></div></div>;
  }

  if (!saved) return null;

  const initials = saved.nombre?.trim().split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("") || "?";

  return (
    <div className="container-fluid py-2">
      <h4 className="fw-bold mb-4 text-dark">
        <i className="bi bi-person-circle text-success me-2"></i>Mi Perfil
      </h4>

      <div className="row g-3">
        {/* Tarjeta principal */}
        <div className="col-md-4">
          <div className="card shadow-sm border text-center">
            <div className="card-body">
              <div className="rounded-circle bg-success d-flex align-items-center justify-content-center fw-bold text-white mx-auto mb-3 fs-2"
                style={{ width: 96, height: 96 }}>
                {initials}
              </div>
              <div className="fw-bold fs-4 text-dark mb-1">{saved.nombre}</div>
              <div className="text-muted small mb-3">{saved.correo}</div>
              <div className="mb-3"><RolBadge rol={saved.rol} /></div>

              <ul className="list-group list-group-flush text-start mb-4">
                {[
                  ["bi-telephone-fill", "Teléfono",       saved.telefono || "—"],
                  ["bi-calendar-check", "Miembro desde",  saved.fechaRegistro ? new Date(saved.fechaRegistro).toLocaleDateString("es-CO") : "—"],
                  ["bi-shield-check",   "Estado",         saved.estado || "Activo"],
                ].map(([ic, lb, val]) => (
                  <li key={lb} className="list-group-item px-0 border-0 small d-flex gap-2 align-items-center">
                    <i className={`bi ${ic} text-success`}></i>
                    <span className="text-muted">{lb}:</span>
                    <span className="fw-semibold text-dark">{val}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`btn w-100 fw-bold ${editMode ? "btn-outline-secondary" : "btn-success"}`}
                onClick={() => editMode ? cancelar() : setEditMode(true)}
              >
                <i className={`bi ${editMode ? "bi-x-lg" : "bi-pencil"} me-1`}></i>
                {editMode ? "Cancelar edición" : "Editar perfil"}
              </button>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="col-md-8 d-flex flex-column gap-3">
          {/* Estadísticas */}
          <div className="row g-3">
            {[
              { label: "Puntos acumulados",   value: `${state.pts.toLocaleString()} pts`, cls: "bg-success text-white" },
              { label: "Entregas realizadas", value: `${totalEntregas}`,                  cls: "bg-success-subtle text-success" },
              { label: "kg reciclados",       value: `${totalKg.toFixed(1)} kg`,          cls: "bg-warning-subtle text-warning-emphasis" },
            ].map(({ label, value, cls }) => (
              <div key={label} className="col-6">
                <div className={`rounded-3 p-3 h-100 ${cls}`}>
                  <div className="small opacity-75 mb-1">{label}</div>
                  <div className="fw-bold fs-4">{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Formulario */}
          <div className="card shadow-sm border">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="fw-bold text-dark">
                  <i className={`bi ${editMode ? "bi-pencil-square" : "bi-clipboard-check"} text-success me-1`}></i>
                  {editMode ? "Editar información" : "Información personal"}
                </div>
                {editMode && (
                  <button className="btn btn-success btn-sm fw-bold" onClick={guardar}>
                    <i className="bi bi-floppy me-1"></i>Guardar cambios
                  </button>
                )}
              </div>

              {editMode ? (
                <div className="row g-3">
                  {[
                    ["nombre",   "Nombre completo",   "text"],
                    ["telefono", "Teléfono",           "text"],
                  ].map(([key, label, type]) => (
                    <div key={key} className="col-md-6">
                      <label className="form-label fw-bold small text-muted">{label}</label>
                      <input
                        type={type}
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="form-control form-control-sm bg-light"
                      />
                    </div>
                  ))}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">Correo electrónico</label>
                    <input type="email" value={form.correo} disabled className="form-control form-control-sm bg-light" />
                    <small className="text-muted">El correo no se puede modificar</small>
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  {[
                    ["Nombre completo", saved.nombre],
                    ["Correo",          saved.correo],
                    ["Teléfono",        saved.telefono || "—"],
                    ["Rol",             saved.rol],
                  ].map(([lb, val]) => (
                    <div key={lb} className="col-md-6">
                      <div className="bg-light rounded-3 p-3">
                        <div className="text-muted small mb-1">{lb}</div>
                        <div className="fw-bold small">
                          {lb === "Rol" ? <RolBadge rol={val} /> : val}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Seguridad */}
          <div className="card shadow-sm border">
            <div className="card-body">
              <div className="fw-bold mb-3 text-dark">
                <i className="bi bi-shield-lock text-success me-1"></i>Seguridad
              </div>
              <div className="list-group">
                <button
                  className="list-group-item list-group-item-action d-flex align-items-center gap-3 border-bottom"
                  onClick={() => setPwModal(true)}
                >
                  <i className="bi bi-key-fill text-success fs-5"></i>
                  <div className="flex-fill text-start">
                    <div className="fw-bold small">Cambiar contraseña</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>Actualiza tu contraseña de acceso</div>
                  </div>
                  <i className="bi bi-chevron-right text-muted"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal cambiar contraseña */}
      {pwModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cambiar contraseña</h5>
                <button className="btn-close" onClick={() => setPwModal(false)}></button>
              </div>
              <div className="modal-body">
                {[
                  ["actual",    "Contraseña actual"],
                  ["nuevo",     "Nueva contraseña"],
                  ["confirmar", "Confirmar nueva contraseña"],
                ].map(([key, label]) => (
                  <div key={key} className="mb-3">
                    <label className="form-label small fw-bold">{label}</label>
                    <input
                      type="password"
                      className="form-control"
                      value={pwForm[key]}
                      onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setPwModal(false)}>Cancelar</button>
                <button className="btn btn-success" onClick={handleCambiarPassword} disabled={pwLoading}>
                  {pwLoading ? <span className="spinner-border spinner-border-sm me-1"></span> : null}
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
