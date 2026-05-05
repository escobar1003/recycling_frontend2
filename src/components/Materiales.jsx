import { useState, useEffect } from "react";

const API_URL = "https://tu-backend.com/api/materiales";

const ZONAS     = ["Norte", "Sur", "Centro", "Oriente", "Occidente"];
const UNIDADES  = ["kg", "g", "tonelada", "unidad"];
const CATEGORIAS = ["Plastico", "Vidrio", "Metal", "Papel y Carton", "Organico", "Electronico", "Textil"];

const EMPTY_FORM = {
  nombre: "", categoria: "", descripcion: "",
  peso_minimo: "", peso_maximo: "", unidad: "kg",
  zona: "", puntos_por_kg: "", activo: true,
};

const MOCK_MATERIALES = [
  { id: 1, nombre: "Botella PET",      categoria: "Plastico",       descripcion: "Botellas plasticas tipo PET limpias",     peso_minimo: 0.1, peso_maximo: 50,  unidad: "kg", zona: "Centro",    puntos_por_kg: 30, activo: true  },
  { id: 2, nombre: "Carton corrugado", categoria: "Papel y Carton", descripcion: "Cajas de carton corrugado aplastadas",    peso_minimo: 0.5, peso_maximo: 200, unidad: "kg", zona: "Norte",     puntos_por_kg: 20, activo: true  },
  { id: 3, nombre: "Vidrio blanco",    categoria: "Vidrio",         descripcion: "Botellas y frascos de vidrio sin tapa",   peso_minimo: 0.2, peso_maximo: 100, unidad: "kg", zona: "Centro",    puntos_por_kg: 25, activo: true  },
  { id: 4, nombre: "Lata aluminio",    categoria: "Metal",          descripcion: "Latas de bebidas de aluminio comprimidas",peso_minimo: 0.1, peso_maximo: 30,  unidad: "kg", zona: "Sur",       puntos_por_kg: 40, activo: true  },
  { id: 5, nombre: "Periodico",        categoria: "Papel y Carton", descripcion: "Periodicos y revistas sin plastificar",   peso_minimo: 1.0, peso_maximo: 100, unidad: "kg", zona: "Oriente",   puntos_por_kg: 15, activo: false },
  { id: 6, nombre: "Chatarra hierro",  categoria: "Metal",          descripcion: "Piezas metalicas de hierro sin pintura",  peso_minimo: 1.0, peso_maximo: 500, unidad: "kg", zona: "Occidente", puntos_por_kg: 35, activo: true  },
];

export default function VistaMateriales() {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [busqueda, setBusqueda]     = useState("");
  const [filtroZona, setFiltroZona] = useState("todos");
  const [filtroCat, setFiltroCat]   = useState("todos");
  const [showModal, setShowModal]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  useEffect(() => { cargarMateriales(); }, []);

  async function cargarMateriales() {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error();
      setMateriales(await res.json());
    } catch {
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
      setMateriales(prev => prev.map(m => m.id === id ? { ...m, ...payload } : m));
    } catch {
      setMateriales(prev => prev.map(m => m.id === id ? { ...m, ...payload } : m));
    }
  }

  async function eliminarMaterial(id) {
    try { await fetch(`${API_URL}/${id}`, { method: "DELETE" }); } catch {}
    setMateriales(prev => prev.filter(m => m.id !== id));
  }

  function abrirNuevo()  { setEditItem(null); setForm(EMPTY_FORM); setShowModal(true); }
  function abrirEditar(m){ setEditItem(m);    setForm({ ...m });   setShowModal(true); }

  async function guardar() {
    if (!form.nombre || !form.categoria || !form.zona || !form.puntos_por_kg) {
      showToastMsg("Completa los campos obligatorios"); return;
    }
    setSaving(true);
    const payload = { ...form, peso_minimo: parseFloat(form.peso_minimo) || 0, peso_maximo: parseFloat(form.peso_maximo) || 0, puntos_por_kg: parseInt(form.puntos_por_kg) || 0 };
    if (editItem) { await editarMaterial(editItem.id, payload); showToastMsg("Material actualizado"); }
    else          { await crearMaterial(payload);               showToastMsg("Material creado correctamente"); }
    setSaving(false); setShowModal(false);
  }

  async function confirmarEliminar() {
    await eliminarMaterial(confirmDel.id);
    showToastMsg(`"${confirmDel.nombre}" eliminado`);
    setConfirmDel(null);
  }

  function showToastMsg(msg) { setToast(msg); setTimeout(() => setToast(null), 3000); }
  function setF(key, val)    { setForm(f => ({ ...f, [key]: val })); }

  const filtrados = materiales.filter(m => {
    const matchB = m.nombre.toLowerCase().includes(busqueda.toLowerCase()) || m.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    const matchZ = filtroZona === "todos" || m.zona === filtroZona;
    const matchC = filtroCat === "todos"  || m.categoria === filtroCat;
    return matchB && matchZ && matchC;
  });

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">

      {/* ── Header ── */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h5 className="fw-bold mb-0 text-dark">
            <i className="bi bi-recycle me-2 text-success"></i>Materiales
          </h5>
          <small className="text-muted">
            {materiales.length} material{materiales.length !== 1 ? "es" : ""} registrado{materiales.length !== 1 ? "s" : ""}
          </small>
        </div>
        <button
          className="btn btn-success btn-sm rounded-3 d-flex align-items-center gap-2 fw-semibold"
          style={{ fontSize: 12 }}
          onClick={abrirNuevo}
        >
          <i className="bi bi-plus-lg"></i>Nuevo material
        </button>
      </div>

      {/* ── Filtros por categoría ── */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {CATEGORIAS.map(cat => {
          const cnt = materiales.filter(m => m.categoria === cat).length;
          if (!cnt) return null;
          return (
            <button
              key={cat}
              className={`btn btn-sm fw-semibold border rounded-3 ${filtroCat === cat ? "btn-success text-white" : "btn-outline-success"}`}
              style={{ fontSize: 12 }}
              onClick={() => setFiltroCat(filtroCat === cat ? "todos" : cat)}
            >
              {cat}
              <span className="badge rounded-pill ms-1 fw-semibold"
                style={{ background: "#facc15", color: "#111111", fontSize: 10 }}>
                {cnt}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Barra de búsqueda y filtros ── */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <div className="input-group input-group-sm" style={{ maxWidth: 300 }}>
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-secondary"></i>
          </span>
          <input
            className="form-control border-start-0 rounded-end-3"
            placeholder="Buscar material..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <select
          className="form-select form-select-sm rounded-3"
          style={{ width: "auto", fontSize: 12 }}
          value={filtroZona}
          onChange={e => setFiltroZona(e.target.value)}
        >
          <option value="todos">Todas las zonas</option>
          {ZONAS.map(z => <option key={z}>{z}</option>)}
        </select>
        <select
          className="form-select form-select-sm rounded-3"
          style={{ width: "auto", fontSize: 12 }}
          value={filtroCat}
          onChange={e => setFiltroCat(e.target.value)}
        >
          <option value="todos">Todas las categorias</option>
          {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
        </select>
        <button
          className="btn btn-sm btn-outline-success rounded-3 fw-semibold d-flex align-items-center gap-1"
          style={{ fontSize: 12 }}
          onClick={cargarMateriales}
        >
          <i className="bi bi-arrow-clockwise"></i>Actualizar
        </button>
      </div>

      {/* ── Tabla ── */}
      <div className="card border rounded-3 shadow-none">
        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border text-success mb-2"></div>
            <br />
            <small className="fw-semibold">Cargando materiales...</small>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: 13 }}>
              <thead className="table-light border-bottom">
                <tr>
                  {[
                    ["bi-hash",           "ID"],
                    ["bi-recycle",        "Material"],
                    ["bi-tag",            "Categoria"],
                    ["bi-card-text",      "Descripcion"],
                    ["bi-arrow-down",     "Peso min."],
                    ["bi-arrow-up",       "Peso max."],
                    ["bi-rulers",         "Unidad"],
                    ["bi-geo-alt",        "Zona"],
                    ["bi-star",           "Pts/kg"],
                    ["bi-check-circle",   "Estado"],
                    ["bi-gear",           "Acciones"],
                  ].map(([ic, h]) => (
                    <th key={h}
                      className="ps-4 py-3 fw-semibold text-muted text-uppercase border-0"
                      style={{ fontSize: 11 }}
                    >
                      <i className={`bi ${ic} me-1`}></i>{h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center text-muted py-5">
                      <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
                      <span className="small">Sin resultados</span>
                    </td>
                  </tr>
                ) : filtrados.map(m => (
                  <tr key={m.id}>
                    <td className="ps-4 text-muted fw-semibold" style={{ fontSize: 12 }}>#{m.id}</td>
                    <td className="fw-bold text-dark">{m.nombre}</td>
                    <td>
                      <span className="badge rounded-pill fw-semibold"
                        style={{ background: "#dcfce7", color: "#16a34a", fontSize: 11, border: "1px solid #16a34a" }}>
                        {m.categoria}
                      </span>
                    </td>
                    <td className="text-secondary" style={{ fontSize: 12 }}>{m.descripcion}</td>
                    <td className="fw-semibold text-dark" style={{ fontSize: 12 }}>{m.peso_minimo} {m.unidad}</td>
                    <td className="fw-semibold text-dark" style={{ fontSize: 12 }}>{m.peso_maximo} {m.unidad}</td>
                    <td className="text-secondary" style={{ fontSize: 12 }}>{m.unidad}</td>
                    <td className="text-secondary" style={{ fontSize: 12 }}>
                      <i className="bi bi-geo-alt-fill text-success me-1"></i>{m.zona}
                    </td>
                    <td className="fw-bold text-success">
                      <i className="bi bi-star-fill text-warning me-1"></i>{m.puntos_por_kg}
                    </td>
                    <td>
                      {m.activo
                        ? <span className="badge rounded-pill fw-normal" style={{ fontSize: 10, background: "#16a34a", color: "#fff" }}>
                            <i className="bi bi-check-circle me-1"></i>Activo
                          </span>
                        : <span className="badge rounded-pill fw-normal" style={{ fontSize: 10, background: "#f3f4f6", color: "#6b7280" }}>
                            <i className="bi bi-x-circle me-1"></i>Inactivo
                          </span>}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm rounded-3 fw-semibold d-flex align-items-center gap-1"
                          style={{ fontSize: 11, padding: "4px 10px", background: "#dcfce7", color: "#16a34a", border: "none" }}
                          onClick={() => abrirEditar(m)}
                        >
                          <i className="bi bi-pencil-square"></i>Editar
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-3 d-flex align-items-center justify-content-center"
                          style={{ width: 30, height: 30, fontSize: 13, padding: 0 }}
                          onClick={() => setConfirmDel(m)}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ══ Modal nuevo / editar material ══ */}
      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.45)", zIndex: 9000 }}
          onClick={ev => { if (ev.target === ev.currentTarget) setShowModal(false); }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border shadow-lg">
              <div className="modal-header bg-success-subtle border-bottom">
                <h5 className="modal-title fw-bold mb-0 text-success">
                  <i className={`bi ${editItem ? "bi-pencil-square" : "bi-recycle"} me-2`}></i>
                  {editItem ? "Editar material" : "Nuevo material"}
                </h5>
                <button className="btn-close ms-auto" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Nombre del material *</label>
                    <input className="form-control form-control-sm bg-light" placeholder="Ej: Botella PET"
                      value={form.nombre} onChange={e => setF("nombre", e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Categoria *</label>
                    <select className="form-select form-select-sm bg-light"
                      value={form.categoria} onChange={e => setF("categoria", e.target.value)}>
                      <option value="">Selecciona categoria...</option>
                      {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-secondary">Descripcion</label>
                    <textarea className="form-control form-control-sm bg-light" rows={2}
                      placeholder="Describe el material..." value={form.descripcion}
                      onChange={e => setF("descripcion", e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold small text-secondary">Peso minimo</label>
                    <input type="number" className="form-control form-control-sm bg-light"
                      placeholder="0.1" min="0" step="0.1" value={form.peso_minimo}
                      onChange={e => setF("peso_minimo", e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold small text-secondary">Peso maximo</label>
                    <input type="number" className="form-control form-control-sm bg-light"
                      placeholder="100" min="0" step="0.1" value={form.peso_maximo}
                      onChange={e => setF("peso_maximo", e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold small text-secondary">Unidad</label>
                    <select className="form-select form-select-sm bg-light"
                      value={form.unidad} onChange={e => setF("unidad", e.target.value)}>
                      {UNIDADES.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold small text-secondary">Puntos por kg *</label>
                    <input type="number" className="form-control form-control-sm bg-light"
                      placeholder="30" min="0" value={form.puntos_por_kg}
                      onChange={e => setF("puntos_por_kg", e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Zona *</label>
                    <select className="form-select form-select-sm bg-light"
                      value={form.zona} onChange={e => setF("zona", e.target.value)}>
                      <option value="">Selecciona zona...</option>
                      {ZONAS.map(z => <option key={z}>{z}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6 d-flex align-items-end">
                    <div className="d-flex align-items-center gap-2">
                      <div className="form-check form-switch mb-0">
                        <input className="form-check-input" type="checkbox" id="activoMat"
                          checked={form.activo} onChange={e => setF("activo", e.target.checked)}
                          style={{ width: 40, height: 22, cursor: "pointer" }} />
                      </div>
                      <label className="form-check-label fw-bold small text-secondary" htmlFor="activoMat">
                        Material activo
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top gap-2">
                <button className="btn btn-outline-secondary flex-fill" onClick={() => setShowModal(false)}>
                  <i className="bi bi-x-lg me-1"></i>Cancelar
                </button>
                <button className="btn btn-success flex-fill fw-bold" disabled={saving} onClick={guardar}>
                  <i className={`bi ${editItem ? "bi-floppy" : "bi-recycle"} me-1`}></i>
                  {saving ? "Guardando..." : editItem ? "Actualizar" : "Crear material"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal confirmar eliminar ══ */}
      {confirmDel && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.45)", zIndex: 9000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border border-danger rounded-4">
              <div className="modal-body text-center p-4">
                <i className="bi bi-trash3 text-danger fs-1"></i>
                <h5 className="fw-bold mt-2 text-dark">Eliminar material</h5>
                <p className="text-muted small">
                  Vas a eliminar <strong>"{confirmDel.nombre}"</strong>. Esta accion no se puede deshacer.
                </p>
                <div className="d-flex gap-2 justify-content-center mt-3">
                  <button className="btn btn-outline-secondary flex-fill" onClick={() => setConfirmDel(null)}>
                    Cancelar
                  </button>
                  <button className="btn btn-danger flex-fill fw-bold" onClick={confirmarEliminar}>
                    <i className="bi bi-trash me-1"></i>Si, eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
          <div className="toast show bg-dark text-white rounded-3">
            <div className="toast-body fw-semibold" style={{ fontSize: 13 }}>
              <i className="bi bi-check2-circle text-success me-2"></i>{toast}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}