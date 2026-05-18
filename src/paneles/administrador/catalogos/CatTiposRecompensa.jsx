import { useState, useEffect } from "react";
import CrudCatalogo from "./CrudCatalogo";
import {
  getTiposRecompensas,
  crearTiposRecompensa,
  actualizarTiposRecompensa,
  eliminarTiposRecompensa,
} from "../../../services/api";

const CAMPOS = [
  { key: "nombre",      label: "Tipo de recompensa", placeholder: "Ej: Descuento" },
  { key: "descripcion", label: "Descripción",         placeholder: "Describe el tipo", type: "textarea", fullWidth: true },
];

export default function CatTiposRecompensa() {
  const [datos, setDatos]       = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getTiposRecompensas()
      .then(res => setDatos(res.tiposRecompensas ?? res.tipos ?? res))
      .finally(() => setCargando(false));
  }, []);

  const onGuardar = async (item) => {
    if (item.id) {
      await actualizarTiposRecompensa(item.id, { nombre: item.nombre, descripcion: item.descripcion });
      setDatos(prev => prev.map(d => d.id === item.id ? { ...d, ...item } : d));
    } else {
      const data = await crearTiposRecompensa({ nombre: item.nombre, descripcion: item.descripcion });
      const nuevo = data.tipoRecompensa ?? data.tipo ?? data;
      setDatos(prev => [...prev, {
        id:          nuevo.idTipoRecompensa ?? nuevo.id ?? Date.now(),
        nombre:      item.nombre,
        descripcion: item.descripcion ?? "",
      }]);
    }
  };

  const onEliminar = async (id) => {
    await eliminarTiposRecompensa(id);
    setDatos(prev => prev.filter(d => d.id !== id));
  };

  if (cargando) return <p className="p-4 text-muted">Cargando tipos de recompensas...</p>;

  return (
    <CrudCatalogo
      titulo="Tipos de recompensa"
      icono="bi-tag-fill"
      campos={CAMPOS}
      datos={datos}
      idKey="id"
      onGuardar={onGuardar}
      onEliminar={onEliminar}
    />
  );
}