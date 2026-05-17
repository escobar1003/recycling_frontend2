import { useState, useEffect } from "react";
import CrudCatalogo from "./CrudCatalogo";
import {
  getEstadosPuntos,
  crearEstadosPunto,
  actualizarEstadosPunto,
  eliminarEstadosPunto,
} from "../../../services/api";// ajusta si el nombre exacto es diferente

const CAMPOS = [
  { key: "nombre",      label: "Nombre del estado", placeholder: "Ej: Activo" },
  { key: "descripcion", label: "Descripción",        placeholder: "Describe el estado", type: "textarea", fullWidth: true },
];

export default function CatEstadosPuntos({ showToast }) {
  const [datos, setDatos]     = useState([]);
  const [loading, setLoading] = useState(true);

  // ── CARGAR ──────────────────────────────────
  useEffect(() => {
    getEstadosPuntos()
      .then((data) => {
        const lista = (data.estadosPuntos ?? data.estados ?? data ?? []).map((e) => ({
          id:          e.idEstadoPunto ?? e.id,
          nombre:      e.nombre,
          descripcion: e.descripcion ?? "",
        }));
        setDatos(lista);
      })
      .catch(() => showToast?.("No se pudieron cargar los estados de puntos", "error"))
      .finally(() => setLoading(false));
  }, []);

  // ── GUARDAR (crear o editar) ─────────────────
  const handleGuardar = async (item) => {
    try {
      if (item.id) {
        // Editar
        const resp = await actualizarEstadosPunto(item.id, {
          nombre:      item.nombre,
          descripcion: item.descripcion,
        });
        setDatos((prev) =>
          prev.map((d) => (d.id === item.id ? { ...d, ...item } : d))
        );
        showToast?.("Estado actualizado");
      } else {
        // Crear
        const resp = await crearEstadosPunto({
          nombre:      item.nombre,
          descripcion: item.descripcion,
        });
        const nuevo = resp.estadoPunto ?? resp;
        setDatos((prev) => [
          ...prev,
          {
            id:          nuevo.idEstadoPunto ?? nuevo.id ?? Date.now(),
            nombre:      item.nombre,
            descripcion: item.descripcion,
          },
        ]);
        showToast?.("Estado creado");
      }
    } catch (err) {
      showToast?.("Error al guardar: " + err.message, "error");
    }
  };

  // ── ELIMINAR ────────────────────────────────
  const handleEliminar = async (id) => {
    try {
      await eliminarEstadosPunto(id);
      setDatos((prev) => prev.filter((d) => d.id !== id));
      showToast?.("Estado eliminado", "error");
    } catch (err) {
      showToast?.("Error al eliminar: " + err.message, "error");
    }
  };

  if (loading) return (
    <div className="text-center py-4 text-muted small">
      <div className="spinner-border spinner-border-sm text-success me-2" />
      Cargando estados de puntos...
    </div>
  );

  return (
    <CrudCatalogo
      titulo="Estados de puntos"
      icono="bi-geo-alt-fill"
      campos={CAMPOS}
      datos={datos}
      idKey="id"
      onGuardar={handleGuardar}
      onEliminar={handleEliminar}
    />
  );
}