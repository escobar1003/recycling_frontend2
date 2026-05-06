import { useState, useEffect } from "react";
import { getMateriales, crearMaterial, actualizarMaterial, eliminarMaterial } from "../services/api";

const COLORES_CANECA = ["Verde", "Negro", "Blanco"];
const CATEGORIAS = ["Plastico", "Vidrio", "Metal", "Papel y Carton", "Organico", "Electronico", "Textil"];

const EMPTY_FORM = {
  nombre: "", categoria: "", descripcion: "",
  color: "", puntos_por_kg: "", activo: true,
  supermercado: "", kilos_minimos: "",
};

export default function VistaMateriales() {
  const [materiales, setMateriales] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [busqueda,   setBusqueda]   = useState("");
  const [filtroZona, setFiltroZona] = useState("todos");
  const [filtroCat,  setFiltroCat]  = useState("todos");
  const [showModal,  setShowModal]  = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  useEffect(() => { cargarMateriales(); }, []);

  async function cargarMateriales() {
    setLoading(true);
    try {
      const data = await getMateriales();
      const lista = Array.isArray(data) ? data : data.materiales ?? data.data ?? [];
      setMateriales(lista);
    } catch (err) {
      showToastMsg("Error al cargar: " + err.message);
      setMateriales([]);
    } finally {
      setLoading(false);
    }
  }

  async function guardar() {
    if (!form.nombre || !form.puntos_por_kg) {
      showToastMsg("Completa los campos obligatorios"); return;
    }
    setSaving(true);
    const payload = {
      nombre:                form.nombre,
      descripcion:           form.descripcion        || null,
      tipoResiduo:           form.categoria          || null,
      colorCaneca:           form.color              || null,
      indicacionDisposicion: form.supermercado        || null,
      puntosPorKg:           parseFloat(form.puntos_por_kg) || 0,
      kilosMinimos:          parseFloat(form.kilos_minimos) || null,
      idEstadoMaterial:      form.activo ? 1 : 2,
    };
    try {
      if (editItem) {
        await actualizarMaterial(editItem.idMaterial, payload);
        showToastMsg("Material actualizado ✓");
      } else {
        await crearMaterial(payload);
        showToastMsg("Material creado ✓");
      }
      setShowModal(false);
      cargarMateriales();
    } catch (err) {
      showToastMsg("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function confirmarEliminar() {
    try {
      await eliminarMaterial(confirmDel.idMaterial);
      showToastMsg(`"${confirmDel.nombre}" eliminado`);
      setConfirmDel(null);
      cargarMateriales();
    } catch (err) {
      showToastMsg("Error: " + err.message);
    }
  }

  function abrirNuevo()   { setEditItem(null); setForm(EMPTY_FORM); setShowModal(true); }
  function abrirEditar(m) {
    setEditItem(m);
    setForm({
      nombre:        m.nombre                 ?? "",
      categoria:     m.tipoResiduo            ?? "",
      descripcion:   m.descripcion            ?? "",
      color:         m.colorCaneca            ?? "",
      puntos_por_kg: m.puntosPorKg            ?? "",
      activo:        m.idEstadoMaterial === 1,
      supermercado:  m.indicacionDisposicion  ?? "",
      kilos_minimos: m.kilosMinimos           ?? "",
    });
    setShowModal(true);
  }

  function showToastMsg(msg) { setToast(msg); setTimeout(() => setToast(null), 3500); }
  function setF(key, val)    { setForm(f => ({ ...f, [key]: val })); }

  const filtrados = materiales.filter(m => {
    const matchB = m.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || m.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    const matchZ = filtroZona === "todos" || m.colorCaneca === filtroZona;
    const matchC = filtroCat  === "todos" || m.tipoResiduo === filtroCat;
    return matchB && matchZ && matchC;
  });

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">

      {/* Encabezado */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-bold text-dark">Materiales</h4>
          <small className="text-success fw-semibold">{materiales.length} materiales registrados</small>
        </div>
        <button className="btn btn-success fw-bold" onClick={abrirNuevo}>
          <i className="bi bi-plus-lg me-1"></i> Nuevo material
        </button>
      </div>

      {/* Búsqueda y filtros */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <div className="input-group w-auto">
          <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
          <input className="form-control" placeholder="Buscar material..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <select className="form-select w-auto" value={filtroZona} onChange={e => setFiltroZona(e.target.value)}>
          <option value="todos">Todas las canecas</option>
          {COLORES_CANECA.map(z => <option key={z}>{z}</option>)}
        </select>
        <select className="form-select w-auto" value={filtroCat} onChange={e => setFiltroCat(e.target.value)}>
          <option value="todos">Todas las categorias</option>
          {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
        </select>
        <button className="btn btn-outline-success fw-bold" onClick={cargarMateriales}>
          <i className="bi bi-arrow-clockwise me-1"></i> Actualizar
        </button>
      </div>

      {/* Tabla */}
      <div className="card border shadow-sm">
        {loading ? (
          <div className="text-center py-5 text-success fw-bold">
            <div className="spinner-border text-success mb-2"></div><br />Cargando materiales...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr className="text-uppercase small text-muted">
                  <th>ID</th>
                  <th>Material</th>
                  <th>Tipo residuo</th>
                  <th>Descripcion</th>
                  <th>Color caneca</th>
                  <th>Puntos/kg & Mín.</th>
                  <th>Estado</th>
                  <th>Supermercado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-5 fw-bold text-muted">Sin resultados</td></tr>
                ) : filtrados.map(m => (
                  <tr key={m.idMaterial}>
                    <td className="text-muted fw-semibold small align-middle">#{m.idMaterial}</td>
                    <td className="align-middle fw-bold text-dark">{m.nombre}</td>
                    <td className="align-middle">
                      {m.tipoResiduo
                        ? <span className="badge bg-success-subtle text-success border border-success">{m.tipoResiduo}</span>
                        : <span className="text-muted">—</span>}
                    </td>
                    <td className="align-middle small text-muted">{m.descripcion || "—"}</td>
                    <td className="align-middle small">
                      {m.colorCaneca
                        ? <><i className="bi bi-geo-alt-fill text-success me-1"></i>{m.colorCaneca}</>
                        : "—"}
                    </td>
                    <td className="align-middle">
                      <div className="fw-bold text-success">
                        <i className="bi bi-star-fill text-warning me-1"></i>{m.puntosPorKg}
                      </div>
                      <div className="small text-muted">
                        <i className="bi bi-box-seam me-1"></i>
                        {m.kilosMinimos ? `${m.kilosMinimos} kg mín.` : "Sin mín."}
                      </div>
                    </td>
                    <td className="align-middle">
                      {m.idEstadoMaterial === 1
                        ? <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>Activo</span>
                        : <span className="badge bg-danger"><i className="bi bi-x-circle me-1"></i>Inactivo</span>}
                    </td>
                    <td className="align-middle small text-muted">{m.indicacionDisposicion || "—"}</td>
                    <td className="align-middle">
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-success" onClick={() => abrirEditar(m)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirmDel(m)}>
                          <i className="bi bi-trash"></i>
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

      {/* Modal crear / editar */}
      {showModal && (
        <div className="modal d-block" style={{ background: "#00000055" }} onClick={ev => { if (ev.target === ev.currentTarget) setShowModal(false); }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-dark">
                  <i className={`bi ${editItem ? "bi-pencil-square" : "bi-recycle"} me-2 text-success`}></i>
                  {editItem ? "Editar material" : "Nuevo material"}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-success">Nombre *</label>
                    <input className="form-control" placeholder="Ej: Botella PET" value={form.nombre} onChange={e => setF("nombre", e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-success">Tipo de residuo</label>
                    <select className="form-select" value={form.categoria} onChange={e => setF("categoria", e.target.value)}>
                      <option value="">Selecciona tipo...</option>
                      {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-success">Descripcion</label>
                    <textarea className="form-control" rows={2} placeholder="Describe el material..." value={form.descripcion} onChange={e => setF("descripcion", e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-success">Puntos por kg *</label>
                    <input type="number" className="form-control" placeholder="30" min="0" value={form.puntos_por_kg} onChange={e => setF("puntos_por_kg", e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-success">Color caneca / Zona</label>
                    <select className="form-select" value={form.color} onChange={e => setF("color", e.target.value)}>
                      <option value="">Selecciona...</option>
                      {COLORES_CANECA.map(z => <option key={z}>{z}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-success">
                      <i className="bi bi-shop me-1"></i>Supermercado
                    </label>
                    <input
                      className="form-control"
                      placeholder="Ej: Éxito, Jumbo, Carulla..."
                      value={form.supermercado}
                      onChange={e => setF("supermercado", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-success">
                      <i className="bi bi-boxes me-1"></i>Kilos mínimos
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Ej: 0.5"
                        min="0"
                        step="0.1"
                        value={form.kilos_minimos}
                        onChange={e => setF("kilos_minimos", e.target.value)}
                      />
                      <span className="input-group-text text-muted">kg</span>
                    </div>
                  </div>
                  <div className="col-md-6 d-flex align-items-center">
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="activoMat" checked={form.activo} onChange={e => setF("activo", e.target.checked)} />
                      <label className="form-check-label fw-bold text-success" htmlFor="activoMat">Material activo</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top">
                <button className="btn btn-outline-secondary fw-bold" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-success fw-bold" disabled={saving} onClick={guardar}>
                  <i className={`bi ${editItem ? "bi-floppy" : "bi-recycle"} me-1`}></i>
                  {saving ? "Guardando..." : editItem ? "Actualizar" : "Crear material"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminar */}
      {confirmDel && (
        <div className="modal d-block" style={{ background: "#00000055" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border border-danger">
              <div className="modal-body text-center p-4">
                <i className="bi bi-trash3 text-danger fs-1"></i>
                <h5 className="fw-bold mt-2 text-dark">Eliminar material</h5>
                <p className="text-muted">Vas a eliminar <strong>"{confirmDel.nombre}"</strong>. Esta accion no se puede deshacer.</p>
                <div className="d-flex gap-2 justify-content-center mt-3">
                  <button className="btn btn-outline-secondary fw-bold" onClick={() => setConfirmDel(null)}>Cancelar</button>
                  <button className="btn btn-danger fw-bold" onClick={confirmarEliminar}>
                    <i className="bi bi-trash me-1"></i> Si, eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
          <div className="toast show bg-dark text-success fw-bold">
            <div className="toast-body">
              <i className="bi bi-check2-circle me-2"></i>{toast}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}