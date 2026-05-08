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
  const [modalEntrega,      setModalEntrega]      = useState(false);
  const [mat,               setMat]               = useState(Object.keys(MAT_CFG)[0]);
  const [fecha,             setFecha]             = useState(new Date().toISOString().split("T")[0]);
  const [peso,              setPeso]              = useState("");
  const [puntos,            setPuntos]            = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState("");

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
    <div className="panel-page">

      {/* ── ENCABEZADO ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        <div>
          <h4 className="panel-title">
            <i className="bi bi-shop" style={{ color: "var(--verde)", marginRight: 8 }}></i>
            Encargados
          </h4>
          <span className="panel-subtitle">
            {encargados.length} encargado{encargados.length !== 1 ? "s" : ""} registrado{encargados.length !== 1 ? "s" : ""}
          </span>
        </div>
        {tab === "encargados" && (
          <button className="btn-panel primary" onClick={() => setModal(true)}>
            <i className="bi bi-person-badge"></i> Nuevo encargado
          </button>
        )}
        {tab === "entregas" && (
          <button className="btn-panel primary" onClick={() => setModalEntrega(true)}>
            <i className="bi bi-plus-lg"></i> Nueva entrega
          </button>
        )}
      </div>

      {/* ── TABS ── */}
      <div style={{ display: "flex", gap: 0, borderBottom: "2px solid var(--gris-borde)", marginBottom: 20 }}>
        {[
          { key: "encargados", icon: "bi-person-badge", label: "Gestión de encargados" },
          { key: "entregas",   icon: "bi-box-seam",     label: "Entregas" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "8px 16px",
              fontSize: "0.8rem", fontWeight: 600,
              color: tab === t.key ? "var(--verde)" : "var(--gris-texto)",
              borderBottom: tab === t.key ? "2px solid var(--verde)" : "2px solid transparent",
              marginBottom: -2,
              display: "flex", alignItems: "center", gap: 6,
              transition: "color 0.15s",
            }}
          >
            <i className={`bi ${t.icon}`}></i>{t.label}
          </button>
        ))}
      </div>

      {/* ════ TAB: ENCARGADOS ════ */}
      {tab === "encargados" && (
        <>
          <div style={{ marginBottom: 16 }}>
            <div className="search-box" style={{ maxWidth: 400 }}>
              <i className="bi bi-search"></i>
              <input
                placeholder="Buscar por nombre, correo, zona o punto..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>

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
        </>
      )}

      {/* ════ TAB: ENTREGAS ════ */}
      {tab === "entregas" && (
        <div className="panel-table-wrap">
          <table className="panel-table">
            <thead>
              <tr>
                {[
                  ["bi-recycle",      "Material"],
                  ["bi-geo-alt",      "Punto de entrega"],
                  ["bi-calendar",     "Fecha"],
                  ["bi-speedometer2", "Peso"],
                  ["bi-star",         "Puntos"],
                  ["bi-check-circle", "Estado"],
                ].map(([ic, h]) => (
                  <th key={h}>
                    <i className={`bi ${ic}`} style={{ marginRight: 4 }}></i>{h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.entregas.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "36px 0", color: "#aaa", fontSize: "0.82rem" }}>
                    <i className="bi bi-inbox" style={{ fontSize: "1.5rem", display: "block", marginBottom: 6, color: "#ccc" }}></i>
                    No hay entregas registradas
                  </td>
                </tr>
              ) : state.entregas.map(e => (
                <tr key={e.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <i className={`bi ${e.icon}`} style={{ color: "var(--verde)", fontSize: "1rem" }}></i>
                      <span style={{ fontWeight: 600 }}>{e.material}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--gris-texto)" }}>{e.punto}</td>
                  <td style={{ color: "var(--gris-texto)" }}>{e.fecha}</td>
                  <td style={{ fontWeight: 600 }}>{e.peso} kg</td>
                  <td>
                    <span className="panel-badge" style={{ background: "#fff8e1", color: "var(--mostaza)" }}>
                      +{e.pts} pts
                    </span>
                  </td>
                  <td>
                    <span
                      className="estado-dot"
                      style={{ color: e.estado === "Validada" ? "var(--verde)" : "#aaa" }}
                    >
                      <span className="dot" style={{ background: e.estado === "Validada" ? "var(--verde)" : "#ccc" }}></span>
                      {e.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ══ MODAL NUEVO ENCARGADO ══ */}
      {modal && (
        <div
          className="panel-modal-bg"
          onClick={ev => { if (ev.target === ev.currentTarget) cerrarModal(); }}
        >
          <div className="panel-modal">

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
                    <i className="bi bi-shop" style={{ color: "var(--verde)", marginRight: 6 }}></i>
                    Nuevo encargado
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--gris-texto)" }}>
                    Responsable de un punto de recolección
                  </div>
                </div>
              </div>
              <button className="btn-icon" onClick={cerrarModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="panel-modal-body">

              {/* Separador de sección */}
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                <i className="bi bi-person" style={{ marginRight: 4 }}></i>Información personal
              </div>

              <div className="panel-modal-grid">

                <div>
                  <label className="panel-label">Nombre completo *</label>
                  <input
                    className="panel-input"
                    value={form.nombre}
                    onChange={e => set("nombre", e.target.value)}
                    placeholder="Ej: María López"
                    style={errors.nombre ? { borderColor: "var(--rojo)" } : {}}
                  />
                  {errors.nombre && (
                    <span style={{ fontSize: "0.72rem", color: "var(--rojo)", marginTop: 2, display: "block" }}>
                      {errors.nombre}
                    </span>
                  )}
                </div>

                <div>
                  <label className="panel-label">Correo electrónico *</label>
                  <input
                    type="email"
                    className="panel-input"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                    placeholder="correo@ejemplo.com"
                    style={errors.email ? { borderColor: "var(--rojo)" } : {}}
                  />
                  {errors.email && (
                    <span style={{ fontSize: "0.72rem", color: "var(--rojo)", marginTop: 2, display: "block" }}>
                      {errors.email}
                    </span>
                  )}
                </div>

                <div>
                  <label className="panel-label">Teléfono</label>
                  <input
                    className="panel-input"
                    value={form.telefono}
                    onChange={e => set("telefono", e.target.value)}
                    placeholder="Ej: 300 123 4567"
                  />
                </div>

                <div>
                  <label className="panel-label">Zona</label>
                  <select className="panel-select" value={form.zona} onChange={e => set("zona", e.target.value)}>
                    <option value="">Sin zona</option>
                    {ZONAS.map(z => <option key={z}>{z}</option>)}
                  </select>
                </div>

                <div className="full">
                  <label className="panel-label">Punto de recolección asignado</label>
                  <select className="panel-select" value={form.puntoAsignado} onChange={e => set("puntoAsignado", e.target.value)}>
                    <option value="">Sin asignar</option>
                    {ALL_POINTS.map(p => <option key={p.id}>{p.name}</option>)}
                  </select>
                </div>

                {/* Info rol */}
                <div className="full">
                  <div style={{
                    background: "var(--verde-claro)", border: "1px solid var(--verde)",
                    borderRadius: 6, padding: "8px 12px",
                    fontSize: "0.78rem", fontWeight: 600, color: "var(--verde)",
                  }}>
                    <i className="bi bi-info-circle" style={{ marginRight: 6 }}></i>
                    {rolDesc["Encargado"]}
                  </div>
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
                        El encargado podrá gestionar su punto si está activo
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

            <div className="panel-modal-foot">
              <button className="btn-panel ghost" onClick={cerrarModal}>
                <i className="bi bi-x-lg"></i> Cancelar
              </button>
              <button className="btn-panel primary" onClick={guardar}>
                <i className="bi bi-shop"></i> Registrar encargado
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ══ MODAL NUEVA ENTREGA ══ */}
      {modalEntrega && (
        <div
          className="panel-modal-bg"
          onClick={ev => { if (ev.target === ev.currentTarget) setModalEntrega(false); }}
        >
          <div className="panel-modal sm">

            <div className="panel-modal-head">
              <span>
                <i className="bi bi-box-seam" style={{ color: "var(--verde)", marginRight: 6 }}></i>
                Nueva entrega
              </span>
              <button className="btn-icon" onClick={() => setModalEntrega(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="panel-modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              <div>
                <label className="panel-label">
                  <i className="bi bi-recycle" style={{ marginRight: 4 }}></i>Material
                </label>
                <select className="panel-select" value={mat} onChange={e => setMat(e.target.value)}>
                  {Object.keys(MAT_CFG).map(m => <option key={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="panel-label">
                  <i className="bi bi-geo-alt" style={{ marginRight: 4 }}></i>
                  Punto de entrega
                  {puntos.length === 0 && (
                    <span style={{ fontSize: "0.7rem", color: "var(--gris-texto)", marginLeft: 4 }}>(cargando...)</span>
                  )}
                </label>
                <select
                  className="panel-select"
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

              <div>
                <label className="panel-label">
                  <i className="bi bi-calendar" style={{ marginRight: 4 }}></i>Fecha
                </label>
                <input
                  type="date"
                  className="panel-input"
                  value={fecha}
                  onChange={e => setFecha(e.target.value)}
                />
              </div>

              <div>
                <label className="panel-label">
                  <i className="bi bi-speedometer2" style={{ marginRight: 4 }}></i>Peso (kg)
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  <input
                    type="number"
                    className="panel-input"
                    value={peso}
                    onChange={e => setPeso(e.target.value)}
                    placeholder="Ej: 2.5"
                    min="0"
                    step="0.1"
                    style={{ borderRadius: "6px 0 0 6px" }}
                  />
                  <span style={{
                    padding: "6px 10px", background: "#f5f5f5",
                    border: "1px solid var(--gris-borde)", borderLeft: "none",
                    borderRadius: "0 6px 6px 0", fontSize: "0.82rem", color: "var(--gris-texto)",
                  }}>
                    kg
                  </span>
                </div>
              </div>

            </div>

            <div className="panel-modal-foot">
              <button className="btn-panel ghost" onClick={() => setModalEntrega(false)}>
                <i className="bi bi-x"></i> Cancelar
              </button>
              <button className="btn-panel primary" onClick={registrarEntrega}>
                <i className="bi bi-check-lg"></i> Registrar entrega
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}