import { useState } from "react";
import { ADMIN_PROFILE } from "../constants/data";
import { RolBadge } from "./UserShared";

export default function Perfil({ state, showToast }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm]         = useState({ ...ADMIN_PROFILE });
  const [saved, setSaved]       = useState({ ...ADMIN_PROFILE });

  const totalEntregas = state.entregas.length;
  const totalKg       = state.entregas.reduce((a, e) => a + e.peso, 0);
  const canjes        = state.historial.filter(h => h.icon === "regalo").length;

  const guardar = () => {
    if (!form.nombre.trim()) { showToast("El nombre es obligatorio", "error"); return; }
    setSaved({ ...form });
    setEditMode(false);
    showToast("Perfil actualizado correctamente");
  };

  const cancelar = () => { setForm({ ...saved }); setEditMode(false); };

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

              <div className="rounded-circle bg-success d-flex align-items-center justify-content-center fw-bold text-white mx-auto mb-3 fs-2" style={{width:96,height:96}}>
                {saved.av}
              </div>

              <div className="fw-bold fs-4 text-dark mb-1">{saved.nombre}</div>
              <div className="text-muted small mb-3">{saved.email}</div>
              <div className="mb-3"><RolBadge rol={saved.rol} /></div>

              <div className="alert alert-success text-start small mb-3 py-2">
                <i className="bi bi-chat-quote me-1"></i>{saved.bio}
              </div>

              <ul className="list-group list-group-flush text-start mb-4">
                {[
                  ["bi-geo-alt-fill",    "Ciudad",        saved.ciudad],
                  ["bi-telephone-fill",  "Telefono",      saved.telefono],
                  ["bi-shop",            "Punto",         saved.punto],
                  ["bi-calendar-check",  "Miembro desde", saved.fechaAlta],
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
                {editMode ? "Cancelar edicion" : "Editar perfil"}
              </button>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="col-md-8 d-flex flex-column gap-3">

          {/* Estadisticas */}
          <div className="row g-3">
            {[
              { label: "Puntos acumulados",   value: `${state.pts.toLocaleString()} pts`, cls: "bg-success text-white" },
              { label: "Entregas realizadas", value: `${totalEntregas}`,                  cls: "bg-success-subtle text-success" },
              { label: "kg reciclados",        value: `${totalKg.toFixed(1)} kg`,          cls: "bg-warning-subtle text-warning-emphasis" },
              { label: "Canjes realizados",   value: `${canjes}`,                          cls: "bg-light text-dark border" },
            ].map(({ label, value, cls }) => (
              <div key={label} className="col-6">
                <div className={`rounded-3 p-3 h-100 ${cls}`}>
                  <div className="small opacity-75 mb-1">{label}</div>
                  <div className="fw-bold fs-4">{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Formulario edicion / vista */}
          <div className="card shadow-sm border">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="fw-bold text-dark">
                  <i className={`bi ${editMode ? "bi-pencil-square" : "bi-clipboard-check"} text-success me-1`}></i>
                  {editMode ? "Editar informacion" : "Informacion personal"}
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
                    ["email",    "Correo electronico", "email"],
                    ["telefono", "Telefono",           "text"],
                    ["ciudad",   "Ciudad",             "text"],
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
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted">Biografia</label>
                    <textarea
                      value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                      className="form-control form-control-sm bg-light"
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  {[
                    ["Nombre completo", saved.nombre],
                    ["Correo",          saved.email],
                    ["Telefono",        saved.telefono],
                    ["Ciudad",          saved.ciudad],
                    ["Zona asignada",   saved.zona],
                    ["Punto asignado",  saved.punto],
                    ["Rol",             saved.rol],
                    ["Miembro desde",   saved.fechaAlta],
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
                  <div className="col-12">
                    <div className="bg-light rounded-3 p-3">
                      <div className="text-muted small mb-1">Biografia</div>
                      <div className="fw-semibold small">{saved.bio}</div>
                    </div>
                  </div>
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
                {[
                  { icon: "bi-key-fill",          title: "Cambiar contrasena",            desc: "Ultima actualizacion: hace 3 meses" },
                  { icon: "bi-phone",              title: "Autenticacion de dos factores", desc: "No habilitada" },
                  { icon: "bi-display",            title: "Sesiones activas",              desc: "1 dispositivo conectado" },
                ].map(({ icon, title, desc }) => (
                  <button
                    key={title}
                    className="list-group-item list-group-item-action d-flex align-items-center gap-3 border-bottom"
                    onClick={() => showToast("Funcionalidad proximamente", "warning")}
                  >
                    <i className={`bi ${icon} text-success fs-5`}></i>
                    <div className="flex-fill text-start">
                      <div className="fw-bold small">{title}</div>
                      <div className="text-muted" style={{fontSize:11}}>{desc}</div>
                    </div>
                    <i className="bi bi-chevron-right text-muted"></i>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}