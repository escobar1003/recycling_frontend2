import { useState, useEffect } from "react";
import CrudCatalogo from "./CrudCatalogo";
import {
  getEstadosUsuarios,
  crearEstadosUsuario,
  actualizarEstadosUsuario,
  eliminarEstadosUsuario,
} from "../../../services/api";

const CAMPOS = [
  { key: "nombre",      label: "Nombre del estado", placeholder: "Ej: Activo" },
  { key: "descripcion", label: "Descripción",        placeholder: "Describe el estado", type: "textarea", fullWidth: true },
];

export default function CatEstadosUsuarios() {
  const [datos, setDatos]       = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getEstadosUsuarios()
      .then(res => setDatos(res.estadosUsuarios ?? res.estados ?? res))
      .finally(() => setCargando(false));
  }, []);

  const onGuardar = async (item) => {
    if (item.id) {
      await actualizarEstadosUsuario(item.id, { nombre: item.nombre, descripcion: item.descripcion });
      setDatos(prev => prev.map(d => d.id === item.id ? { ...d, ...item } : d));
    } else {
      const data = await crearEstadosUsuario({ nombre: item.nombre, descripcion: item.descripcion });
      const nuevo = data.estadoUsuario ?? data.estado ?? data;
      setDatos(prev => [...prev, {
        id:          nuevo.idEstadoUsuario ?? nuevo.id ?? Date.now(),
        nombre:      item.nombre,
        descripcion: item.descripcion ?? "",
      }]);
    }
  };

  const onEliminar = async (id) => {
    await eliminarEstadosUsuario(id);
    setDatos(prev => prev.filter(d => d.id !== id));
  };

  if (cargando) return <p className="p-4 text-muted">Cargando estados de usuarios...</p>;

  return (
    <CrudCatalogo
      titulo="Estados de usuarios"
      icono="bi-person-check-fill"
      campos={CAMPOS}
      datos={datos}
      idKey="id"
      onGuardar={onGuardar}
      onEliminar={onEliminar}
    />
  );
}