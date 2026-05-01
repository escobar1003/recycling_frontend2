import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
// 🔧 CUANDO BACKEND TE DÉ EL ENDPOINT, CÁMBIALO AQUÍ:
const API_URL = "https://tu-backend.com/api/materiales";
// ─────────────────────────────────────────────

const ZONAS     = ["Norte", "Sur", "Centro", "Oriente", "Occidente"];
const UNIDADES  = ["kg", "g", "tonelada", "unidad"];
const CATEGORIAS = ["Plástico", "Vidrio", "Metal", "Papel y Cartón", "Orgánico", "Electrónico", "Textil"];

const MATERIAL_EMOJIS = {
  "Plástico":        { emoji: "🧴", bg: "#e3f2fd", color: "#1565c0" },
  "Vidrio":          { emoji: "🫙", bg: "#e8f5e9", color: "#2e7d32" },
  "Metal":           { emoji: "🥫", bg: "#fce4ec", color: "#880e4f" },
  "Papel y Cartón":  { emoji: "📦", bg: "#fff3e0", color: "#e65100" },
  "Orgánico":        { emoji: "🌿", bg: "#f1f8e9", color: "#33691e" },
  "Electrónico":     { emoji: "💻", bg: "#ede7f6", color: "#4527a0" },
  "Textil":          { emoji: "🧵", bg: "#fce4ec", color: "#880e4f" },
};

const EMPTY_FORM = {
  nombre: "", categoria: "", descripcion: "",
  peso_minimo: "", peso_maximo: "", unidad: "kg",
  zona: "", puntos_por_kg: "", activo: true,
};

const MOCK_MATERIALES = [
  { id: 1, nombre: "Botella PET",     categoria: "Plástico",       descripcion: "Botellas plásticas tipo PET limpias",       peso_minimo: 0.1,  peso_maximo: 50,  unidad: "kg", zona: "Centro",    puntos_por_kg: 30, activo: true  },
  { id: 2, nombre: "Cartón corrugado",categoria: "Papel y Cartón", descripcion: "Cajas de cartón corrugado aplastadas",       peso_minimo: 0.5,  peso_maximo: 200, unidad: "kg", zona: "Norte",     puntos_por_kg: 20, activo: true  },
  { id: 3, nombre: "Vidrio blanco",   categoria: "Vidrio",         descripcion: "Botellas y frascos de vidrio sin tapa",      peso_minimo: 0.2,  peso_maximo: 100, unidad: "kg", zona: "Centro",    puntos_por_kg: 25, activo: true  },
  { id: 4, nombre: "Lata aluminio",   categoria: "Metal",          descripcion: "Latas de bebidas de aluminio comprimidas",   peso_minimo: 0.1,  peso_maximo: 30,  unidad: "kg", zona: "Sur",       puntos_por_kg: 40, activo: true  },
  { id: 5, nombre: "Periódico",       categoria: "Papel y Cartón", descripcion: "Periódicos y revistas sin plastificar",      peso_minimo: 1.0,  peso_maximo: 100, unidad: "kg", zona: "Oriente",   puntos_por_kg: 15, activo: false },
  { id: 6, nombre: "Chatarra hierro", categoria: "Metal",          descripcion: "Piezas metálicas de hierro sin pintura",     peso_minimo: 1.0,  peso_maximo: 500, unidad: "kg", zona: "Occidente", puntos_por_kg: 35, activo: true  },
];

export default function VistaMateriales() {
  const [materiales, setMateriales]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [busqueda, setBusqueda]       = useState("");
  const [filtroZona, setFiltroZona]   = useState("todos");
  const [filtroCat, setFiltroCat]     = useState("todos");
  const [showModal, setShowModal]     = useState(false);
  const [editItem, setEditItem]       = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState(null);
  const [confirmDel, setConfirmDel]   = useState(null);

  useEffect(() => { cargarMateriales(); }, []);

  async function cargarMateriales() {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMateriales(data);
    } catch {
      console.warn("Backend no disponible, usando datos mock");
      setMateriales(MOCK_MATERIALES);
    } finally {
      setLoading(false);
    }
  }

  async function crearMaterial(payload) {
    try {
      const res = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      const nuevo = await res.json();
      setMateriales(prev => [nuevo, ...prev]);
    } catch {
      setMateriales(prev => [{ ...payload, id: Date.now() }, ...prev]);
    }
  }

  async function editarMaterial(id, payload) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setMateriales(prev => prev.map(m => m.id === id ? updated : m));
    } catch {
      setMateriales(prev => prev.map(m => m.id === id ? { ...m, ...payload } : m));
    }
  }

  async function eliminarMaterial(id) {
    try { await fetch(`${API_URL}/${id}`, { method: "DELETE" }); } catch {}
    setMateriales(prev => prev.filter(m => m.id !== id));
  }

  function abrirNuevo() { setEditItem(null); setForm(EMPTY_FORM); setShowModal(true); }
  function abrirEditar(m) { setEditItem(m); setForm({ ...m }); setShowModal(true); }

  async function guardar() {
    if (!form.nombre || !form.categoria || !form.zona || !form.puntos_por_kg) {
      showToastMsg("⚠️ Completa los campos obligatorios"); return;
    }
    setSaving(true);
    const payload = { ...form, peso_minimo: parseFloat(form.peso_minimo) || 0, peso_maximo: parseFloat(form.peso_maximo) || 0, puntos_por_kg: parseInt(form.puntos_por_kg) || 0 };
    if (editItem) { await editarMaterial(editItem.id, payload); showToastMsg("✅ Material actualizado"); }
    else          { await crearMaterial(payload);               showToastMsg("🎉 Material creado correctamente"); }
    setSaving(false); setShowModal(false);
  }

  async function confirmarEliminar() {
    await eliminarMaterial(confirmDel.id);
    showToastMsg(`🗑️ "${confirmDel.nombre}" eliminado`);
    setConfirmDel(null);
  }

  function showToastMsg(msg) { setToast(msg); setTimeout(() => setToast(null), 3000); }
  function setF(key, val) { setForm(f => ({ ...f, [key]: val })); }

  const filtrados = materiales.filter(m => {
    const matchB = m.nombre.toLowerCase().includes(busqueda.toLowerCase()) || m.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    const matchZ = filtroZona === "todos" || m.zona === filtroZona;
    const matchC = filtroCat === "todos" || m.categoria === filtroCat;
    return matchB && matchZ && matchC;
  });

  return (
    <div style={{ fontFamily: "'Nunito','Segoe UI',sans-serif", padding: "24px 20px", background: "#f0faf4", minHeight: "100vh" }}>

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: "#1a3a24" }}>♻️ Materiales</h4>
          <small style={{ color: "#7dc49a", fontWeight: 600 }}>{materiales.length} materiales registrados</small>
        </div>
        <button className="btn text-white fw-bold"
          style={{ background: "linear-gradient(135deg,#2db55d,#1a7a3e)", border: "none", borderRadius: 10, padding: "9px 20px" }}
          onClick={abrirNuevo}>
          + Nuevo material
        </button>
      </div>

      {/* Cards resumen por categoría */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {CATEGORIAS.map(cat => {
          const cnt = materiales.filter(m => m.categoria === cat).length;
          if (!cnt) return null;
          const meta = MATERIAL_EMOJIS[cat] || { emoji: "♻️", bg: "#e8f5e9", color: "#2d6a4f" };
          return (
            <div key={cat} className="d-flex align-items-center gap-2"
              style={{ background: meta.bg, border: `2px solid ${meta.color}33`, borderRadius: 12, padding: "6px 14px", cursor: "pointer" }}
              onClick={() => setFiltroCat(filtroCat === cat ? "todos" : cat)}>
              <span style={{ fontSize: 18 }}>{meta.emoji}</span>
              <div>
                <div style={{ fontSize: 11, color: meta.color, fontWeight: 800 }}>{cat}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1a3a24", lineHeight: 1 }}>{cnt}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <input className="form-control" style={{ maxWidth: 260, borderRadius: 10, border: "2px solid #c3e8d0", fontWeight: 600, fontSize: 14 }}
          placeholder="🔍 Buscar material..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        <select className="form-select" style={{ maxWidth: 180, borderRadius: 10, border: "2px solid #c3e8d0", fontWeight: 600, fontSize: 14 }}
          value={filtroZona} onChange={e => setFiltroZona(e.target.value)}>
          <option value="todos">📍 Todas las zonas</option>
          {ZONAS.map(z => <option key={z}>{z}</option>)}
        </select>
        <select className="form-select" style={{ maxWidth: 200, borderRadius: 10, border: "2px solid #c3e8d0", fontWeight: 600, fontSize: 14 }}
          value={filtroCat} onChange={e => setFiltroCat(e.target.value)}>
          <option value="todos">♻️ Todas las categorías</option>
          {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
        </select>
        <button className="btn btn-sm fw-bold"
          style={{ border: "2px solid #c3e8d0", borderRadius: 10, color: "#2d6a4f", background: "#fff", fontSize: 13 }}
          onClick={cargarMateriales}>🔄 Actualizar</button>
      </div>

      {/* Tabla */}
      <div className="card shadow-sm" style={{ borderRadius: 18, border: "2px solid #e2f5ea", overflow: "hidden" }}>
        {loading ? (
          <div className="text-center py-5" style={{ color: "#7dc49a", fontWeight: 700 }}>
            <div className="spinner-border text-success mb-2" /><br />Cargando materiales...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table mb-0">
              <thead style={{ background: "#f0faf4", borderBottom: "2px solid #e2f5ea", fontSize: 12, color: "#7dc49a", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".7px" }}>
                <tr>
                  <th className="py-3 ps-3">ID</th>
                  <th>Material</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Peso mín.</th>
                  <th>Peso máx.</th>
                  <th>Unidad</th>
                  <th>Zona</th>
                  <th>Pts/kg</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr><td colSpan={11} className="text-center py-5 fw-bold" style={{ color: "#9ab5a0" }}>Sin resultados 🌿</td></tr>
                ) : filtrados.map(m => {
                  const meta = MATERIAL_EMOJIS[m.categoria] || { emoji: "♻️", bg: "#e8f5e9", color: "#2d6a4f" };
                  return (
                    <tr key={m.id}
                      onMouseEnter={e => e.currentTarget.style.background = "#f7fdf9"}
                      onMouseLeave={e => e.currentTarget.style.background = ""}>
                      <td className="align-middle ps-3" style={{ color: "#9ab5a0", fontWeight: 700, fontSize: 13 }}>#{m.id}</td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center gap-2">
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{meta.emoji}</div>
                          <span style={{ fontWeight: 700, color: "#1a3a24" }}>{m.nombre}</span>
                        </div>
                      </td>
                      <td className="align-middle">
                        <span style={{ background: meta.bg, color: meta.color, border: `1.5px solid ${meta.color}44`, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>
                          {m.categoria}
                        </span>
                      </td>
                      <td className="align-middle" style={{ color: "#4a7a5a", fontSize: 13, maxWidth: 200 }}>{m.descripcion}</td>
                      <td className="align-middle" style={{ color: "#4a7a5a", fontWeight: 700, fontSize: 13 }}>{m.peso_minimo} {m.unidad}</td>
                      <td className="align-middle" style={{ color: "#4a7a5a", fontWeight: 700, fontSize: 13 }}>{m.peso_maximo} {m.unidad}</td>
                      <td className="align-middle" style={{ color: "#8aab97", fontSize: 13, fontWeight: 600 }}>{m.unidad}</td>
                      <td className="align-middle" style={{ color: "#4a7a5a", fontSize: 13, fontWeight: 600 }}>📍 {m.zona}</td>
                      <td className="align-middle" style={{ color: "#2db55d", fontWeight: 800 }}>⭐ {m.puntos_por_kg}</td>
                      <td className="align-middle">
                        <span style={{ background: m.activo ? "#e8f5e9" : "#fce4ec", color: m.activo ? "#2db55d" : "#e74c3c", border: `1.5px solid ${m.activo ? "#a8e6c0" : "#f48fb1"}`, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 800 }}>
                          {m.activo ? "✅ Activo" : "❌ Inactivo"}
                        </span>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm fw-bold" style={{ borderRadius: 8, border: "2px solid #c3e8d0", background: "#fff", color: "#2d6a4f", fontSize: 12 }} onClick={() => abrirEditar(m)}>✏️ Editar</button>
                          <button className="btn btn-sm fw-bold" style={{ borderRadius: 8, border: "2px solid #f48fb1", background: "#fff", color: "#e74c3c", fontSize: 12 }} onClick={() => setConfirmDel(m)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CREAR/EDITAR */}
      {showModal && (
        <div className="modal d-block" style={{ background: "#00000055" }} onClick={ev => { if (ev.target === ev.currentTarget) setShowModal(false); }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: 20, border: "2px solid #e2f5ea" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: "#1a3a24" }}>
                  {editItem ? "✏️ Editar material" : "♻️ Nuevo material"}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {/* Nombre */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>Nombre del material *</label>
                    <input className="form-control" style={{ border: "2px solid #c3e8d0", borderRadius: 10 }}
                      placeholder="Ej: Botella PET" value={form.nombre} onChange={e => setF("nombre", e.target.value)} />
                  </div>
                  {/* Categoría */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>Categoría *</label>
                    <select className="form-select" style={{ border: "2px solid #c3e8d0", borderRadius: 10 }}
                      value={form.categoria} onChange={e => setF("categoria", e.target.value)}>
                      <option value="">Selecciona categoría…</option>
                      {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Descripción */}
                  <div className="col-12">
                    <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>Descripción</label>
                    <textarea className="form-control" rows={2} style={{ border: "2px solid #c3e8d0", borderRadius: 10 }}
                      placeholder="Describe el material, condiciones, etc."
                      value={form.descripcion} onChange={e => setF("descripcion", e.target.value)} />
                  </div>
                  {/* Peso mín */}
                  <div className="col-md-3">
                    <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>Peso mínimo</label>
                    <input type="number" className="form-control" style={{ border: "2px solid #c3e8d0", borderRadius: 10 }}
                      placeholder="0.1" min="0" step="0.1" value={form.peso_minimo} onChange={e => setF("peso_minimo", e.target.value)} />
                  </div>
                  {/* Peso máx */}
                  <div className="col-md-3">
                    <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>Peso máximo</label>
                    <input type="number" className="form-control" style={{ border: "2px solid #c3e8d0", borderRadius: 10 }}
                      placeholder="100" min="0" step="0.1" value={form.peso_maximo} onChange={e => setF("peso_maximo", e.target.value)} />
                  </div>
                  {/* Unidad */}
                  <div className="col-md-3">
                    <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>Unidad</label>
                    <select className="form-select" style={{ border: "2px solid #c3e8d0", borderRadius: 10 }}
                      value={form.unidad} onChange={e => setF("unidad", e.target.value)}>
                      {UNIDADES.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  {/* Puntos/kg */}
                  <div className="col-md-3">
                    <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>Puntos por kg *</label>
                    <input type="number" className="form-control" style={{ border: "2px solid #c3e8d0", borderRadius: 10 }}
                      placeholder="Ej: 30" min="0" value={form.puntos_por_kg} onChange={e => setF("puntos_por_kg", e.target.value)} />
                  </div>
                  {/* Zona */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>Zona *</label>
                    <select className="form-select" style={{ border: "2px solid #c3e8d0", borderRadius: 10 }}
                      value={form.zona} onChange={e => setF("zona", e.target.value)}>
                      <option value="">Selecciona zona…</option>
                      {ZONAS.map(z => <option key={z}>{z}</option>)}
                    </select>
                  </div>
                  {/* Activo */}
                  <div className="col-md-6 d-flex align-items-end">
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="activoMat"
                        checked={form.activo} onChange={e => setF("activo", e.target.checked)} />
                      <label className="form-check-label fw-bold" htmlFor="activoMat" style={{ color: "#2d6a4f" }}>Material activo</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn fw-bold" style={{ border: "2px solid #c3e8d0", borderRadius: 10, color: "#4a7a5a" }} onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn text-white fw-bold" disabled={saving}
                  style={{ background: "linear-gradient(135deg,#2db55d,#1a7a3e)", border: "none", borderRadius: 10 }}
                  onClick={guardar}>
                  {saving ? "Guardando..." : editItem ? "💾 Actualizar" : "♻️ Crear material"}
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
                <h5 className="fw-bold mt-2" style={{ color: "#1a3a24" }}>¿Eliminar material?</h5>
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
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "#1a3a24", color: "#a8e6c0", borderRadius: 12, padding: "12px 20px", fontWeight: 700, fontSize: 14, zIndex: 9999, boxShadow: "0 8px 30px #0004" }}>
          {toast}
        </div>
      )}
    </div>
  );
}