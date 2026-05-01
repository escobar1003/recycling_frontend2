import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
// 🔧 CUANDO BACKEND TE DÉ EL ENDPOINT, CÁMBIALO AQUÍ:
const API_URL = "https://tu-backend.com/api/aliados";
// ─────────────────────────────────────────────

const ZONAS = ["Norte", "Sur", "Centro", "Oriente", "Occidente"];
const TIPOS = ["Punto Verde", "EcoPunto", "Supermercado", "Centro Comercial", "Empresa"];

const EMPTY_FORM = {
  nombre: "", tipo: "", direccion: "", zona: "",
  telefono: "", email: "", responsable: "", activo: true,
};

// Datos mock mientras llega el backend
const MOCK_ALIADOS = [
  { id: 1, nombre: "Punto Verde Centro",    tipo: "Punto Verde",     direccion: "Cra 7 #12-34",    zona: "Centro",    telefono: "3001234567", email: "centro@eco.com",    responsable: "Carlos M.", activo: true  },
  { id: 2, nombre: "EcoPunto Norte",        tipo: "EcoPunto",        direccion: "Av 19 #45-67",    zona: "Norte",     telefono: "3017654321", email: "norte@eco.com",     responsable: "Laura P.",  activo: true  },
  { id: 3, nombre: "Supermercado Verde",    tipo: "Supermercado",    direccion: "Cll 80 #23-11",   zona: "Norte",     telefono: "3025551234", email: "verde@super.com",   responsable: "Andrés R.", activo: true  },
  { id: 4, nombre: "EcoPunto Sur",          tipo: "EcoPunto",        direccion: "Cra 50 #5-90",    zona: "Sur",       telefono: "3039871234", email: "sur@eco.com",       responsable: "María T.",  activo: false },
  { id: 5, nombre: "Centro Comercial Eco",  tipo: "Centro Comercial",direccion: "Cll 100 #15-20",  zona: "Norte",     telefono: "3011112222", email: "cc@eco.com",        responsable: "Sofía L.",  activo: true  },
];

export default function VistaAliados() {
  const [aliados, setAliados]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [busqueda, setBusqueda]     = useState("");
  const [filtroZona, setFiltroZona] = useState("todos");
  const [showModal, setShowModal]   = useState(false);
  const [editItem, setEditItem]     = useState(null); // null = nuevo
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  // ── FETCH: cargar aliados ──
  useEffect(() => {
    cargarAliados();
  }, []);

  async function cargarAliados() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al cargar aliados");
      const data = await res.json();
      setAliados(data);
    } catch (e) {
      // Si no hay backend aún, usa mock
      console.warn("Backend no disponible, usando datos mock:", e.message);
      setAliados(MOCK_ALIADOS);
    } finally {
      setLoading(false);
    }
  }

  // ── FETCH: crear aliado ──
  async function crearAliado(payload) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al crear aliado");
      const nuevo = await res.json();
      setAliados(prev => [nuevo, ...prev]);
    } catch {
      // Mock fallback
      const nuevo = { ...payload, id: Date.now() };
      setAliados(prev => [nuevo, ...prev]);
    }
  }

  // ── FETCH: editar aliado ──
  async function editarAliado(id, payload) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al editar aliado");
      const updated = await res.json();
      setAliados(prev => prev.map(a => a.id === id ? updated : a));
    } catch {
      setAliados(prev => prev.map(a => a.id === id ? { ...a, ...payload } : a));
    }
  }

  // ── FETCH: eliminar aliado ──
  async function eliminarAliado(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
    } catch {
      // continúa con mock
    }
    setAliados(prev => prev.filter(a => a.id !== id));
  }

  // ── Handlers ──
  function abrirNuevo() {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function abrirEditar(aliado) {
    setEditItem(aliado);
    setForm({ ...aliado });
    setShowModal(true);
  }

  async function guardar() {
    if (!form.nombre || !form.tipo || !form.direccion || !form.zona) {
      showToastMsg("⚠️ Completa los campos obligatorios");
      return;
    }
    setSaving(true);
    if (editItem) {
      await editarAliado(editItem.id, form);
      showToastMsg("✅ Aliado actualizado correctamente");
    } else {
      await crearAliado(form);
      showToastMsg("🎉 Aliado creado correctamente");
    }
    setSaving(false);
    setShowModal(false);
  }

  async function confirmarEliminar() {
    await eliminarAliado(confirmDel.id);
    showToastMsg(`🗑️ "${confirmDel.nombre}" eliminado`);
    setConfirmDel(null);
  }

  function showToastMsg(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // ── Filtrado ──
  const filtrados = aliados.filter(a => {
    const matchBusq = a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                      a.responsable?.toLowerCase().includes(busqueda.toLowerCase()) ||
                      a.direccion?.toLowerCase().includes(busqueda.toLowerCase());
    const matchZona = filtroZona === "todos" || a.zona === filtroZona;
    return matchBusq && matchZona;
  });

  // ── Render ──
  return (
    <div style={{ fontFamily: "'Nunito','Segoe UI',sans-serif", padding: "24px 20px", background: "#f0faf4", minHeight: "100vh" }}>

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: "#1a3a24" }}>🤝 Aliados</h4>
          <small style={{ color: "#7dc49a", fontWeight: 600 }}>{aliados.length} puntos registrados</small>
        </div>
        <button className="btn text-white fw-bold"
          style={{ background: "linear-gradient(135deg,#2db55d,#1a7a3e)", border: "none", borderRadius: 10, padding: "9px 20px" }}
          onClick={abrirNuevo}>
          + Nuevo aliado
        </button>
      </div>

      {/* Búsqueda + filtro zona */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <input
          className="form-control"
          style={{ maxWidth: 280, borderRadius: 10, border: "2px solid #c3e8d0", fontWeight: 600, fontSize: 14 }}
          placeholder="🔍 Buscar aliado..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <select
          className="form-select"
          style={{ maxWidth: 180, borderRadius: 10, border: "2px solid #c3e8d0", fontWeight: 600, fontSize: 14 }}
          value={filtroZona}
          onChange={e => setFiltroZona(e.target.value)}>
          <option value="todos">📍 Todas las zonas</option>
          {ZONAS.map(z => <option key={z}>{z}</option>)}
        </select>
        <button className="btn btn-sm fw-bold"
          style={{ border: "2px solid #c3e8d0", borderRadius: 10, color: "#2d6a4f", background: "#fff", fontSize: 13 }}
          onClick={cargarAliados}>
          🔄 Actualizar
        </button>
      </div>

      {/* Tabla */}
      <div className="card shadow-sm" style={{ borderRadius: 18, border: "2px solid #e2f5ea", overflow: "hidden" }}>
        {loading ? (
          <div className="text-center py-5" style={{ color: "#7dc49a", fontWeight: 700 }}>
            <div className="spinner-border text-success mb-2" /><br />Cargando aliados...
          </div>
        ) : error ? (
          <div className="text-center py-5 text-danger fw-bold">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table mb-0">
              <thead style={{ background: "#f0faf4", borderBottom: "2px solid #e2f5ea", fontSize: 12, color: "#7dc49a", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".7px" }}>
                <tr>
                  <th className="py-3 ps-3">ID</th>
                  <th>Nombre del punto</th>
                  <th>Tipo</th>
                  <th>Dirección</th>
                  <th>Zona</th>
                  <th>Responsable</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-5 fw-bold" style={{ color: "#9ab5a0" }}>Sin resultados 🌿</td></tr>
                ) : filtrados.map(a => (
                  <tr key={a.id}
                    onMouseEnter={e => e.currentTarget.style.background = "#f7fdf9"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td className="align-middle ps-3" style={{ color: "#9ab5a0", fontWeight: 700, fontSize: 13 }}>#{a.id}</td>
                    <td className="align-middle fw-bold" style={{ color: "#1a3a24" }}>{a.nombre}</td>
                    <td className="align-middle">
                      <span style={{ background: "#e8f5e9", color: "#2d6a4f", border: "1.5px solid #a8e6c0", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>
                        {a.tipo}
                      </span>
                    </td>
                    <td className="align-middle" style={{ color: "#4a7a5a", fontSize: 13 }}>📍 {a.direccion}</td>
                    <td className="align-middle" style={{ color: "#4a7a5a", fontSize: 13, fontWeight: 600 }}>{a.zona}</td>
                    <td className="align-middle" style={{ color: "#4a7a5a", fontSize: 13 }}>{a.responsable}</td>
                    <td className="align-middle" style={{ color: "#4a7a5a", fontSize: 13 }}>{a.telefono}</td>
                    <td className="align-middle">
                      <span style={{
                        background: a.activo ? "#e8f5e9" : "#fce4ec",
                        color: a.activo ? "#2db55d" : "#e74c3c",
                        border: `1.5px solid ${a.activo ? "#a8e6c0" : "#f48fb1"}`,
                        borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 800
                      }}>
                        {a.activo ? "✅ Activo" : "❌ Inactivo"}
                      </span>
                    </td>
                    <td className="align-middle">
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm fw-bold"
                          style={{ borderRadius: 8, border: "2px solid #c3e8d0", background: "#fff", color: "#2d6a4f", fontSize: 12 }}
                          onClick={() => abrirEditar(a)}>✏️ Editar</button>
                        <button className="btn btn-sm fw-bold"
                          style={{ borderRadius: 8, border: "2px solid #f48fb1", background: "#fff", color: "#e74c3c", fontSize: 12 }}
                          onClick={() => setConfirmDel(a)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="d-flex gap-3 mt-3 flex-wrap">
        {["Norte","Sur","Centro","Oriente","Occidente"].map(z => {
          const cnt = aliados.filter(a => a.zona === z).length;
          return cnt > 0 ? (
            <span key={z} style={{ background: "#fff", border: "2px solid #e2f5ea", borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 700, color: "#4a7a5a" }}>
              📍 {z}: {cnt}
            </span>
          ) : null;
        })}
      </div>

      {/* MODAL CREAR/EDITAR */}
      {showModal && (
        <div className="modal d-block" style={{ background: "#00000055" }} onClick={ev => { if (ev.target === ev.currentTarget) setShowModal(false); }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: 20, border: "2px solid #e2f5ea" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: "#1a3a24" }}>
                  {editItem ? "✏️ Editar aliado" : "🤝 Nuevo aliado"}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {/* Nombre */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>Nombre del punto *</label>
                    <input className="form-control" style={{ border: "2px solid #c3e8d0", borderRadius: 10 }}
                      placeholder="Ej: Punto Verde Centro"
                      value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
                  </div>
                  {/* Tipo */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>Tipo *</label>
                    <select className="form-select" style={{ border: "2px solid #c3e8d0", borderRadius: 10 }}
                      value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                      <option value="">Selecciona tipo…</option>
                      {TIPOS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  {/* Dirección */}
                  <div className="col-md-8">
                    <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>Dirección *</label>
                    <input className="form-control" style={{ border: "2px solid #c3e8d0", borderRadius: 10 }}
                      placeholder="Ej: Cra 7 #12-34"
                      value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} />
                  </div>
                  {/* Zona */}
                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>Zona *</label>
                    <select className="form-select" style={{ border: "2px solid #c3e8d0", borderRadius: 10 }}
                      value={form.zona} onChange={e => setForm(f => ({ ...f, zona: e.target.value }))}>
                      <option value="">Selecciona zona…</option>
                      {ZONAS.map(z => <option key={z}>{z}</option>)}
                    </select>
                  </div>
                  {/* Responsable */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>Responsable</label>
                    <input className="form-control" style={{ border: "2px solid #c3e8d0", borderRadius: 10 }}
                      placeholder="Nombre del responsable"
                      value={form.responsable} onChange={e => setForm(f => ({ ...f, responsable: e.target.value }))} />
                  </div>
                  {/* Teléfono */}
                  <div className="col-md-3">
                    <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>Teléfono</label>
                    <input className="form-control" style={{ border: "2px solid #c3e8d0", borderRadius: 10 }}
                      placeholder="300 000 0000"
                      value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} />
                  </div>
                  {/* Email */}
                  <div className="col-md-3">
                    <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>Email</label>
                    <input type="email" className="form-control" style={{ border: "2px solid #c3e8d0", borderRadius: 10 }}
                      placeholder="correo@ejemplo.com"
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  {/* Activo */}
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="activoCheck"
                        checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} />
                      <label className="form-check-label fw-bold" htmlFor="activoCheck" style={{ color: "#2d6a4f" }}>
                        Punto activo
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn fw-bold" style={{ border: "2px solid #c3e8d0", borderRadius: 10, color: "#4a7a5a" }} onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn text-white fw-bold" disabled={saving}
                  style={{ background: "linear-gradient(135deg,#2db55d,#1a7a3e)", border: "none", borderRadius: 10 }}
                  onClick={guardar}>
                  {saving ? "Guardando..." : editItem ? "💾 Actualizar" : "🤝 Crear aliado"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINAR */}
      {confirmDel && (
        <div className="modal d-block" style={{ background: "#00000055" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 20, border: "2px solid #fce4ec" }}>
              <div className="modal-body text-center p-4">
                <div style={{ fontSize: 48 }}>🗑️</div>
                <h5 className="fw-bold mt-2" style={{ color: "#1a3a24" }}>¿Eliminar aliado?</h5>
                <p style={{ color: "#4a7a5a" }}>Vas a eliminar <strong>"{confirmDel.nombre}"</strong>. Esta acción no se puede deshacer.</p>
                <div className="d-flex gap-2 justify-content-center mt-3">
                  <button className="btn fw-bold" style={{ border: "2px solid #c3e8d0", borderRadius: 10, color: "#4a7a5a" }} onClick={() => setConfirmDel(null)}>Cancelar</button>
                  <button className="btn text-white fw-bold" style={{ background: "#e74c3c", border: "none", borderRadius: 10 }} onClick={confirmarEliminar}>Sí, eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "#1a3a24", color: "#a8e6c0", borderRadius: 12, padding: "12px 20px", fontWeight: 700, fontSize: 14, zIndex: 9999, boxShadow: "0 8px 30px #0004", animation: "fadeIn .3s ease" }}>
          {toast}
        </div>
      )}
    </div>
  );
}