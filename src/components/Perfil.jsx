import { useState } from "react";
import { ADMIN_PROFILE } from "../constants/data";
import { RolBadge } from "./UserShared";

export default function Perfil({ state, showToast }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm]         = useState({ ...ADMIN_PROFILE });
  const [saved, setSaved]       = useState({ ...ADMIN_PROFILE });

  const guardar = () => {
    if (!form.nombre.trim()) { showToast("El nombre es obligatorio", "error"); return; }
    setSaved({ ...form });
    setEditMode(false);
    showToast("Perfil actualizado correctamente");
  };

  const cancelar = () => { setForm({ ...saved }); setEditMode(false); };

  return (
    <div className="container-fluid px-0">

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold mb-0 text-dark">
            <i className="bi bi-person-circle me-2 text-success"></i>Mi Perfil
          </h5>
          <small className="text-muted">Información y configuración de tu cuenta</small>
        </div>
        <button
          className={`btn btn-sm rounded-3 fw-semibold ${editMode ? "btn-outline-secondary" : "btn-success"}`}
          onClick={() => editMode ? cancelar() : setEditMode(true)}
        >
          <i className={`bi ${editMode ? "bi-x-lg" : "bi-pencil"} me-1`}></i>
          {editMode ? "Cancelar" : "Editar perfil"}
        </button>
      </div>

      <div className="row g-3">

        {/* ── Tarjeta lateral ── */}
        <div className="col-md-3">
          <div className="card border rounded-3 shadow-none text-center">
            <div className="card-body py-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white mx-auto mb-3"
                style={{ width: 72, height: 72, background: "#16a34a", fontSize: 22 }}
              >
                {saved.av}
              </div>
              <div className="fw-bold text-dark mb-1" style={{ fontSize: 15 }}>{saved.nombre}</div>
              <div className="text-muted mb-2" style={{ fontSize: 12 }}>{saved.email}</div>
              <div className="mb-3"><RolBadge rol={saved.rol} /></div>

              <ul className="list-unstyled text-start mb-0">
                {[
                  ["bi-geo-alt-fill",   "Ciudad",        saved.ciudad],
                  ["bi-telephone-fill", "Teléfono",      saved.telefono],
                  ["bi-shop",           "Punto",         saved.punto],
                  ["bi-calendar-check", "Miembro desde", saved.fechaAlta],
                ].map(([ic, lb, val]) => (
                  <li key={lb} className="d-flex align-items-start gap-2 py-2 border-bottom" style={{ fontSize: 12 }}>
                    <i className={`bi ${ic} text-success mt-1`} style={{ fontSize: 12 }}></i>
                    <div>
                      <div className="text-muted" style={{ fontSize: 10 }}>{lb}</div>
                      <div className="fw-semibold text-dark">{val}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Panel derecho ── */}
        <div className="col-md-9 d-flex flex-column gap-3">

          {/* Información personal */}
          <div className="card border rounded-3 shadow-none">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <p className="text-uppercase fw-bold text-muted mb-0 small">
                  <i className={`bi ${editMode ? "bi-pencil-square" : "bi-clipboard-check"} me-1 text-success`}></i>
                  {editMode ? "Editar información" : "Información personal"}
                </p>
                {editMode && (
                  <button className="btn btn-success btn-sm fw-semibold rounded-3" onClick={guardar}>
                    <i className="bi bi-floppy me-1"></i>Guardar cambios
                  </button>
                )}
              </div>

              {editMode ? (
                <div className="row g-3">
                  {[
                    ["nombre",   "Nombre completo",    "text"],
                    ["email",    "Correo electrónico", "email"],
                    ["telefono", "Teléfono",           "text"],
                    ["ciudad",   "Ciudad",             "text"],
                  ].map(([key, label, type]) => (
                    <div key={key} className="col-md-6">
                      <label className="form-label fw-bold small text-secondary">{label}</label>
                      <input
                        type={type}
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="form-control form-control-sm bg-light"
                      />
                    </div>
                  ))}
                  <div className="col-12">
                    <label className="form-label fw-bold small text-secondary">Biografía</label>
                    <textarea
                      value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                      className="form-control form-control-sm bg-light"
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div className="row g-2">
                  {[
                    ["Nombre completo", saved.nombre],
                    ["Correo",          saved.email],
                    ["Teléfono",        saved.telefono],
                    ["Ciudad",          saved.ciudad],
                    ["Zona asignada",   saved.zona],
                    ["Punto asignado",  saved.punto],
                    ["Rol",             saved.rol],
                    ["Miembro desde",   saved.fechaAlta],
                  ].map(([lb, val]) => (
                    <div key={lb} className="col-md-6 col-lg-3">
                      <div className="bg-light rounded-3 p-2">
                        <div className="text-muted mb-1" style={{ fontSize: 10 }}>{lb}</div>
                        <div className="fw-semibold" style={{ fontSize: 12 }}>
                          {lb === "Rol" ? <RolBadge rol={val} /> : val}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="col-12">
                    <div className="bg-light rounded-3 p-2">
                      <div className="text-muted mb-1" style={{ fontSize: 10 }}>Biografía</div>
                      <div className="fw-semibold" style={{ fontSize: 12 }}>{saved.bio}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Seguridad */}
          <div className="card border rounded-3 shadow-none">
            <div className="card-body">
              <p className="text-uppercase fw-bold text-muted mb-3 small">
                <i className="bi bi-shield-lock me-1 text-success"></i>Seguridad
              </p>
              <div className="d-flex flex-column gap-1">
                {[
                  { icon: "bi-key-fill",  title: "Cambiar contraseña",           desc: "Última actualización: hace 3 meses" },
                  { icon: "bi-phone",     title: "Autenticación de dos factores", desc: "No habilitada" },
                  { icon: "bi-display",   title: "Sesiones activas",              desc: "1 dispositivo conectado" },
                ].map(({ icon, title, desc }) => (
                  <button
                    key={title}
                    className="btn btn-light border rounded-3 d-flex align-items-center gap-3 text-start w-100 py-2 px-3"
                    style={{ fontSize: 12 }}
                    onClick={() => showToast("Funcionalidad próximamente", "warning")}
                  >
                    <i className={`bi ${icon} text-success`} style={{ fontSize: 14, width: 18 }}></i>
                    <div className="flex-fill">
                      <div className="fw-semibold text-dark">{title}</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>{desc}</div>
                    </div>
                    <i className="bi bi-chevron-right text-muted" style={{ fontSize: 11 }}></i>
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