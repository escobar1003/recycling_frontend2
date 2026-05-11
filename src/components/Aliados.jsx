import { useState } from "react";
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
    if (!form.nombre.trim())        e.nombre       = "El nombre del contacto es obligatorio";
    if (!form.nombreEntidad.trim()) e.nombreEntidad = "El nombre del supermercado es obligatorio";
    if (!form.email.trim())         e.email        = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido (Ej: correo@ejemplo.com)";
    else if (state.usuarios.some(u => u.email === form.email.trim())) e.email = "Este correo ya existe";
    if (form.telefono.trim() && !/^\d{10}$/.test(form.telefono.replace(/\s/g, "")))
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
    <div className="panel-page">

      {/* ── ENCABEZADO ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        <div>
          <h4 className="panel-title">
            <i className="bi bi-handshake" style={{ color: "var(--verde)", marginRight: 8 }}></i>
            Gestión de aliados
          </h4>
          <span className="panel-subtitle">
            {aliados.length} aliado{aliados.length !== 1 ? "s" : ""} registrado{aliados.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button className="btn-panel primary" onClick={() => setModal(true)}>
          <i className="bi bi-shop"></i> Nuevo aliado
        </button>
      </div>

      {/* ── BUSCADOR ── */}
      <div style={{ marginBottom: 16 }}>
        <div className="search-box" style={{ maxWidth: 420 }}>
          <i className="bi bi-search"></i>
          <input
            placeholder="Buscar por nombre, entidad, correo o zona..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* ── TABLA ── */}
      <div className="panel-table-wrap">
        <TablaUsuarios
          lista={filtered}
          onToggle={handleToggle}
          onVer={setViewUser}
          onEliminar={handleEliminar}
        />
      </div>

      <ModalDetalle
        user={viewUser}
        onClose={() => setViewUser(null)}
        onSave={handleSave}
        showToast={showToast}
      />

      {/* ── MODAL NUEVO ALIADO ── */}
      {modal && (
        <div
          className="panel-modal-bg"
          onClick={ev => { if (ev.target === ev.currentTarget) cerrarModal(); }}
        >
          <div className="panel-modal">

            {/* Header */}
            <div className="panel-modal-head">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "var(--verde-claro)", border: "1px solid var(--gris-borde)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "0.9rem", color: "var(--verde)", flexShrink: 0,
                }}>
                  {avatarPreview}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--negro)" }}>
                    <i className="bi bi-handshake" style={{ color: "var(--verde)", marginRight: 6 }}></i>
                    Nuevo aliado
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--gris-texto)" }}>
                    Registra una empresa u organización aliada
                  </div>
                </div>
              </div>
              <button className="btn-icon" onClick={cerrarModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Body */}
            <div className="panel-modal-body">

              {/* Sección entidad */}
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                <i className="bi bi-building" style={{ marginRight: 4 }}></i>Datos de la entidad
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="panel-label">
                  <i className="bi bi-shop" style={{ marginRight: 4 }}></i>Nombre de la entidad *
                </label>
                <input
                  className="panel-input"
                  value={form.nombreEntidad}
                  onChange={e => set("nombreEntidad", e.target.value)}
                  placeholder="Ej: Supermercado La 14"
                  style={errors.nombreEntidad ? { borderColor: "var(--rojo)" } : {}}
                />
                {errors.nombreEntidad && (
                  <span style={{ fontSize: "0.72rem", color: "var(--rojo)", marginTop: 2, display: "block" }}>
                    {errors.nombreEntidad}
                  </span>
                )}
              </div>

              {/* Separador sección contacto */}
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                <i className="bi bi-person" style={{ marginRight: 4 }}></i>Datos del contacto
              </div>

              <div className="panel-modal-grid">

                <div>
                  <label className="panel-label">
                    <i className="bi bi-person" style={{ marginRight: 4 }}></i>Nombre del contacto *
                  </label>
                  <input
                    className="panel-input"
                    value={form.nombre}
                    onChange={e => set("nombre", e.target.value)}
                    placeholder="Ej: Carlos Ruiz"
                    style={errors.nombre ? { borderColor: "var(--rojo)" } : {}}
                  />
                  {errors.nombre && (
                    <span style={{ fontSize: "0.72rem", color: "var(--rojo)", marginTop: 2, display: "block" }}>
                      {errors.nombre}
                    </span>
                  )}
                </div>

                <div>
                  <label className="panel-label">
                    <i className="bi bi-envelope" style={{ marginRight: 4 }}></i>Correo electrónico *
                  </label>
                  <input
                    type="email"
                    className="panel-input"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                    placeholder="correo@empresa.com"
                    style={errors.email ? { borderColor: "var(--rojo)" } : {}}
                  />
                  {errors.email && (
                    <span style={{ fontSize: "0.72rem", color: "var(--rojo)", marginTop: 2, display: "block" }}>
                      {errors.email}
                    </span>
                  )}
                </div>

                <div>
                  <label className="panel-label">
                    <i className="bi bi-telephone" style={{ marginRight: 4 }}></i>Teléfono
                  </label>
                  <input
                    className="panel-input"
                    value={form.telefono}
                    onChange={e => set("telefono", e.target.value)}
                    placeholder="Ej: 300 123 4567"
                  />
                </div>

                <div>
                  <label className="panel-label">
                    <i className="bi bi-geo-alt" style={{ marginRight: 4 }}></i>Zona
                  </label>
                  <select className="panel-select" value={form.zona} onChange={e => set("zona", e.target.value)}>
                    <option value="">Sin zona</option>
                    {ZONAS.map(z => <option key={z}>{z}</option>)}
                  </select>
                </div>

                {/* Toggle estado */}
                <div className="full">
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 14px", borderRadius: 6,
                    background: "#fafafa", border: "1px solid var(--gris-borde)",
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--negro)" }}>Estado inicial</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--gris-texto)" }}>
                        El aliado podrá operar si está activo
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        fontSize: "0.78rem", fontWeight: 600,
                        color: form.activo ? "var(--verde)" : "var(--gris-texto)",
                      }}>
                        {form.activo ? "Activo" : "Inactivo"}
                      </span>
                      <Toggle checked={form.activo} onChange={v => set("activo", v)} />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="panel-modal-foot">
              <button className="btn-panel ghost" onClick={cerrarModal}>
                <i className="bi bi-x"></i> Cancelar
              </button>
              <button className="btn-panel primary" onClick={guardar}>
                <i className="bi bi-check-lg"></i> Registrar aliado
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}