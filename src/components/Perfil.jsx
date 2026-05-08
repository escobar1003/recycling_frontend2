import { useState, useEffect } from "react";
import { ADMIN_PROFILE } from "../constants/data";
import { RolBadge } from "./UserShared";

export default function Perfil({ state, showToast }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...ADMIN_PROFILE });

  const [saved, setSaved] = useState(() => {
    const fotoGuardada = localStorage.getItem("perfilFoto");
    return {
      ...ADMIN_PROFILE,
      foto: fotoGuardada || ADMIN_PROFILE.foto
    };
  });

  useEffect(() => {
    const handler = (e) => {
      localStorage.setItem("perfilFoto", e.detail);
      setSaved(prev => ({ ...prev, foto: e.detail }));
    };

    window.addEventListener("perfilFoto", handler);
    return () => window.removeEventListener("perfilFoto", handler);
  }, []);

  const totalEntregas = state.entregas.length;
  const totalKg = state.entregas.reduce((a, e) => a + e.peso, 0);
  const canjes = state.historial.filter(h => h.icon === "regalo").length;

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
      </h4>

      <div className="row g-3">

        <div className="col-md-4">
          <div className="card shadow-sm border text-center">
            <div className="card-body">

              <div
                className="rounded-circle bg-success d-flex align-items-center justify-content-center mx-auto mb-3 overflow-hidden position-relative"
                style={{ width: 96, height: 96, cursor: "pointer" }}
              >

                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="inputFoto"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const url = URL.createObjectURL(file);

                    setSaved(prev => ({ ...prev, foto: url }));

                    localStorage.setItem("perfilFoto", url);

                    window.dispatchEvent(
                      new CustomEvent("perfilFoto", { detail: url })
                    );
                  }}
                />

                <img
                  src={saved.foto || "https://via.placeholder.com/150"}
                  alt="perfil"
                  className="w-100 h-100 object-fit-cover"
                  onClick={() => document.getElementById("inputFoto").click()}
                />
              </div>

              <div className="fw-bold fs-4 text-dark mb-1">{saved.nombre}</div>
              <div className="text-muted small mb-3">{saved.email}</div>
              <div className="mb-3"><RolBadge rol={saved.rol} /></div>

              <div className="alert alert-success text-start small mb-3 py-2">
                <i className="bi bi-chat-quote me-1"></i>{saved.bio}
              </div>

              <ul className="list-group list-group-flush text-start mb-4">
                {[
                  ["bi-geo-alt-fill", "Ciudad", saved.ciudad],
                  ["bi-telephone-fill", "Telefono", saved.telefono],
                  ["bi-shop", "Punto", saved.punto],
                  ["bi-calendar-check", "Miembro desde", saved.fechaAlta],
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

        <div className="col-md-8 d-flex flex-column gap-3">

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
                    ["nombre", "Nombre completo", "text"],
                    ["email", "Correo electronico", "email"],
                    ["telefono", "Telefono", "text"],
                    ["ciudad", "Ciudad", "text"],
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
                    ["Correo", saved.email],
                    ["Telefono", saved.telefono],
                    ["Ciudad", saved.ciudad],
                    ["Zona asignada", saved.zona],
                    ["Punto asignado", saved.punto],
                    ["Rol", saved.rol],
                    ["Miembro desde", saved.fechaAlta],
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

        </div>
      </div>
    </div>
  );
}