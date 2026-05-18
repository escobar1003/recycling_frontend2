import { useState, useEffect } from "react";
import CrudCatalogo from "./CrudCatalogo";
import {
  getEstadosEntregas,
  crearEstadosEntrega,
  actualizarEstadosEntrega,
  eliminarEstadosEntrega,
} from "../../../services/api";

const CAMPOS = [
  { key: "nombre",      label: "Nombre del estado", placeholder: "Ej: Pendiente" },
  { key: "descripcion", label: "Descripción",        placeholder: "Describe el estado", type: "textarea", fullWidth: true },
];

export default function CatEstadosEntregas() {
  const [datos, setDatos]       = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getEstadosEntregas()
      .then(res => setDatos(res.estadosEntregas ?? res.estados ?? res))
      .finally(() => setCargando(false));
  }, []);

  const onGuardar = async (item) => {
    if (item.id) {
      await actualizarEstadosEntrega(item.id, { nombre: item.nombre, descripcion: item.descripcion });
      setDatos(prev => prev.map(d => d.id === item.id ? { ...d, ...item } : d));
    } else {
      const data = await crearEstadosEntrega({ nombre: item.nombre, descripcion: item.descripcion });
      const nuevo = data.estadoEntrega ?? data.estado ?? data;
      setDatos(prev => [...prev, {
        id:          nuevo.idEstadoEntrega ?? nuevo.id ?? Date.now(),
        nombre:      item.nombre,
        descripcion: item.descripcion ?? "",
      }]);
    }
  };

  const onEliminar = async (id) => {
    await eliminarEstadosEntrega(id);
    setDatos(prev => prev.filter(d => d.id !== id));
  };

  if (cargando) return <p className="p-4 text-muted">Cargando estados de entregas...</p>;

  return (
    <CrudCatalogo
      titulo="Estados de entregas"
      icono="bi-box-seam-fill"
      campos={CAMPOS}
      datos={datos}
      idKey="id"
      onGuardar={onGuardar}
      onEliminar={onEliminar}
    />
  );
}