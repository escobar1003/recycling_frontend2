import { useState, useEffect } from "react";
import { ALL_POINTS, ZONAS } from "../constants/data";
import { getRolCfg, Toggle, rolDesc, ModalDetalle, TablaUsuarios } from "./UserShared";

import {
  getUsuarios,
  eliminarUsuario,
  actualizarUsuario,
  register
} from '../services/api';


const EMPTY_FORM = {
  nombre: "", correo: "", telefono: "",
  rol: "Usuario", zona: "", puntoAsignado: "", activo: true,
};

export default function Usuarios({ state, dispatch, showToast }) {
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [errors,   setErrors]   = useState({});
  const [search,   setSearch]   = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [loading,  setLoading]  = useState(true); // ← nuevo

  // ── Cargar usuarios del backend al abrir la pantalla ─────────────────────
  useEffect(() => {
  const cargar = async () => {
    try {
      // 1. Primero intenta cargar desde localStorage
      const cache = localStorage.getItem("usuarios");

      if (cache) {
        dispatch({
          type: "SET_USUARIOS",
          payload: JSON.parse(cache),
        });
      }

      // 2. Luego fuerza actualización desde backend
      const data = await getUsuarios();

      const usuariosBackend = data.usuarios || [];

      dispatch({
        type: "SET_USUARIOS",
        payload: usuariosBackend,
      });

      // 3. Guardar en localStorage
      localStorage.setItem("usuarios", JSON.stringify(usuariosBackend));

    } catch (error) {
      console.error("Error getUsuarios:", error);

      showToast(
        "⚠️ Error cargando usuarios. Revisa token o backend",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  cargar();
}, []);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const usuarios = (state?.usuarios || []).filter(
  u => (u?.rol || "").toLowerCase() === "usuario"
);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.correo.trim())  e.correo  = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) e.correo = "Correo inválido";
    else if (state.usuarios.some(u => u.correo === form.correo.trim())) e.correo = "Este correo ya existe";
    return e;
  };

  // ── Guardar: llama al backend y luego actualiza el estado local ───────────
  const guardar = async () => {
  const e = validate();
  if (Object.keys(e).length) { setErrors(e); return; }

  try {
    const nuevo = await register({
      nombre_completo: form.nombre.trim(),
      correo: form.correo.trim(),
      password: form.password?.trim() || "123456",
      telefono: form.telefono?.trim() || ""
    });

    const initials = form.nombre
      .trim()
      .split(" ")
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join("");

    dispatch({
      type: "ADD_USER",
      payload: {
        id: nuevo.id ?? Date.now(),
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
        rol: "Usuario",
        zona: form.zona,
        puntoAsignado: form.puntoAsignado,
        pts: 0,
        activo: form.activo,
        av: initials,
        fechaAlta: new Date().toLocaleDateString("es-CO"),
      },
    });

    showToast(`✅ Usuario "${form.nombre.trim()}" registrado`);
    setModal(false);
    setForm(EMPTY_FORM);
    setErrors({});
  } catch (err) {
    showToast("❌ Error al registrar: " + err.message, "error");
  }
};

  const cerrarModal = () => { setModal(false); setForm(EMPTY_FORM); setErrors({}); };

  // ── Toggle: llama al backend y luego actualiza el estado local ────────────
  const handleToggle = async (id, nombre, estadoActual) => {
    try {
      await actualizarUsuario(id, { esta_activo: !estadoActual });
      dispatch({ type: "TOGGLE_USER", payload: id });
      showToast(
        estadoActual
          ? `🔴 ${nombre} ha sido desactivado`
          : `🟢 ${nombre} ha sido activado`,
        estadoActual ? "error" : "success"
      );
    } catch (err) {
      showToast("❌ Error al cambiar estado: " + err.message, "error");
    }
  };

  const handleSave = async (updatedUser) => {
  try {
    await actualizarUsuario(updatedUser.id, updatedUser);

    const updated = (state?.usuarios || []).map(u =>
      u.id === updatedUser.id ? updatedUser : u
    );

    dispatch({
      type: "SET_USUARIOS",
      payload: updated
    });

    localStorage.setItem("usuarios", JSON.stringify(updated));

    setViewUser(null);

  } catch (err) {
    showToast("❌ Error actualizando usuario", "error");
  }
};

  const handleEliminar = async (id) => {
  try {
    await eliminarUsuario(id);

    const updated = (state?.usuarios || []).filter(u => u.id !== id);

    dispatch({
      type: "SET_USUARIOS",
      payload: updated
    });

    localStorage.setItem("usuarios", JSON.stringify(updated));

    showToast("🗑️ Usuario eliminado", "success");

    if (viewUser?.id === id) setViewUser(null);

  } catch (err) {
    showToast("❌ Error eliminando usuario", "error");
  }
};

  const filtered = (usuarios || []).filter(u => {
    const q = search.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.correo.toLowerCase().includes(q) ||
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
        <h4 className="fw-bold m-0">♻️ Gestión de usuarios</h4>
        <button className="btn btn-success rounded-3" onClick={() => setModal(true)}>
          <i className="bi bi-person-plus me-1"></i> Nuevo usuario
        </button>
      </div>

      {/* Buscador */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <div className="input-group" style={{ maxWidth: 340 }}>
          <span className="input-group-text bg-white border-end-0 rounded-start-3">🔍</span>
          <input
            className="form-control border-start-0 rounded-end-3"
            placeholder="Buscar por nombre, correo o zona..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: 13 }}
          />
        </div>
      </div>

      {/* Indicador de carga */}
      {loading && (
        <div className="text-center py-3" style={{ color: "#9ca3af", fontSize: 13 }}>
          ⏳ Cargando usuarios del servidor...
        </div>
      )}

      {/* Tabla */}
      <TablaUsuarios
        lista={filtered || []}
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
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.45)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg p-2"
              style={{ maxHeight: "90vh", overflowY: "auto" }}>
              <div className="modal-header border-0">
                <div>
                  <h5 className="modal-title fw-bold" style={{ color: cfg.color }}>♻️ Nuevo usuario</h5>
                  <div className="text-muted" style={{ fontSize: 12 }}>Registra un nuevo usuario reciclador.</div>
                </div>
                <button type="button" className="btn-close" onClick={cerrarModal} />
              </div>

              <div className="modal-body">
                <div className="text-center mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto"
                    style={{ width: 56, height: 56, fontSize: 18, background: cfg.bg, color: cfg.color, border: `2px solid ${cfg.color}` }}
                  >{avatarPreview}</div>
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
                    <label className="form-label fw-bold small text-secondary">Correo electrónico *</label>
                    <input
                      type="correo" value={form.correo} onChange={e => set("correo", e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className={`form-control form-control-sm bg-light ${errors.correo ? "is-invalid" : ""}`}
                    />
                    {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Teléfono</label>
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
                    <div className="rounded-3 p-3 small fw-semibold"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.icon} {rolDesc["Usuario"]}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light">
                      <div>
                        <div className="fw-bold small">Estado inicial</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>El usuario podrá acceder de inmediato si está activo</div>
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

              <div className="modal-footer border-0 gap-2">
                <button className="btn btn-secondary rounded-3 flex-fill" onClick={cerrarModal}>Cancelar</button>
                <button className="btn btn-success rounded-3 flex-fill" onClick={guardar}>✅ Registrar usuario</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}