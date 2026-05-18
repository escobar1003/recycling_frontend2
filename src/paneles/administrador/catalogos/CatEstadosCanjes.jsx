import { useState, useEffect } from "react";
import CrudCatalogo from "./CrudCatalogo";
import {
  getEstadosCanjes,
  crearEstadosCanjes,
  actualizarEstadosCanjes,
  eliminarEstadosCanjes,
} from "../../../services/api";  

const CAMPOS = [
  { key: "nombre",      label: "Nombre del estado", placeholder: "Ej: Solicitado" },
  { key: "descripcion", label: "Descripción",        placeholder: "Describe el estado", type: "textarea", fullWidth: true },
];



export default function CatEstadosCanjes() {
  const [datos, setDatos]       = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getEstadosCanjes()
      .then(res => setDatos(res.estadosCanjes ?? res.estados ?? res))
      .finally(() => setCargando(false));
  }, []);

  const onGuardar = async (item) => {
    if (item.id) {
      await actualizarEstadosCanjes(item.id, { nombre: item.nombre, descripcion: item.descripcion });
      setDatos(prev => prev.map(d => d.id === item.id ? { ...d, ...item } : d));
    } else {
      const data = await crearEstadosCanjes({ nombre: item.nombre, descripcion: item.descripcion });
      const nuevo = data.estadoCanje ?? data.estado ?? data;
      setDatos(prev => [...prev, {
        id:          nuevo.idEstadoCanje ?? nuevo.id ?? Date.now(),
        nombre:      item.nombre,
        descripcion: item.descripcion ?? "",
      }]);
    }
  };

  const onEliminar = async (id) => {
    await eliminarEstadosCanjes(id);
    setDatos(prev => prev.filter(d => d.id !== id));
  };

if (cargando) return <p className="p-4 text-muted">Cargando estados de canjes...</p>;

  return (
    <CrudCatalogo
      titulo="Estados de canjes"
      icono="bi-arrow-left-right"
      campos={CAMPOS}
      datos={datos}
      idKey="id"
      onGuardar={onGuardar}
      onEliminar={onEliminar}
    />
  );
}
