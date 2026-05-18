import { useState, useEffect } from "react";
import CrudCatalogo from "./CrudCatalogo";
import {
  getEstadosAliados,
  crearEstadosAliado,
  actualizarEstadosAliado,
  eliminarEstadosAliado,
} from "../../../services/api";

const CAMPOS = [
  { key: "nombre",      label: "Nombre del estado", placeholder: "Ej: Activo" },
  { key: "descripcion", label: "Descripción",        placeholder: "Describe el estado", type: "textarea", fullWidth: true },
];

export default function CatEstadosAliados() {
  const [datos, setDatos]       = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getEstadosAliados()
      .then(res => setDatos(res.estadosAliados ?? res.estados ?? res))
      .finally(() => setCargando(false));
  }, []);

  const onGuardar = async (item) => {
    if (item.id) {
      await actualizarEstadosAliado(item.id, { nombre: item.nombre, descripcion: item.descripcion });
      setDatos(prev => prev.map(d => d.id === item.id ? { ...d, ...item } : d));
    } else {
      const data = await crearEstadosAliado({ nombre: item.nombre, descripcion: item.descripcion });
      const nuevo = data.estadoAliado ?? data.estado ?? data;
      setDatos(prev => [...prev, {
        id:          nuevo.idEstadoAliado ?? nuevo.id ?? Date.now(),
        nombre:      item.nombre,
        descripcion: item.descripcion ?? "",
      }]);
    }
  };

  const onEliminar = async (id) => {
    await eliminarEstadosAliado(id);
    setDatos(prev => prev.filter(d => d.id !== id));
  };

  if (cargando) return <p className="p-4 text-muted">Cargando estados de aliados...</p>;

  return (
    <CrudCatalogo
      titulo="Estados de aliados"
      icono="bi-handshake-fill"
      campos={CAMPOS}
      datos={datos}
      idKey="id"
      onGuardar={onGuardar}
      onEliminar={onEliminar}
    />
  );
}