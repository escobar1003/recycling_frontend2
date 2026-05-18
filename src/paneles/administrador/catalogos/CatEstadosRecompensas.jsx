import { useState, useEffect } from "react";
import CrudCatalogo from "./CrudCatalogo";
import {
  getEstadosRecompensas,
  crearEstadosRecompensa,
  actualizarEstadosRecompensa,
  eliminarEstadosRecompensa,
} from "../../../services/api";

const CAMPOS = [
  { key: "nombre",      label: "Nombre del estado", placeholder: "Ej: Disponible" },
  { key: "descripcion", label: "Descripción",        placeholder: "Describe el estado", type: "textarea", fullWidth: true },
];



export default function CatEstadosRecompensas() {
  const [datos, setDatos]       = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getEstadosRecompensas()
      .then(res => setDatos(res.estadosRecompensas ?? res.estados ?? res))
      .finally(() => setCargando(false));
  }, []);

  const onGuardar = async (item) => {
    if (item.id) {
      await actualizarEstadosRecompensa(item.id, { nombre: item.nombre, descripcion: item.descripcion });
      setDatos(prev => prev.map(d => d.id === item.id ? { ...d, ...item } : d));
    } else {
      const data = await crearEstadosRecompensa({ nombre: item.nombre, descripcion: item.descripcion });
      const nuevo = data.estadoRecompensa ?? data.estado ?? data;
      setDatos(prev => [...prev, {
        id:          nuevo.idEstadoRecompensa ?? nuevo.id ?? Date.now(),
        nombre:      item.nombre,
        descripcion: item.descripcion ?? "",
      }]);
    }
  };

  const onEliminar = async (id) => {
    await eliminarEstadosRecompensa(id);
    setDatos(prev => prev.filter(d => d.id !== id));
  };

  if (cargando) return <p className="p-4 text-muted">Cargando estados de recompensas...</p>;

  return (
    <CrudCatalogo
      titulo="Estados de recompensas"
      icono="bi-gift-fill"
      campos={CAMPOS}
      datos={datos}
      idKey="id"
      onGuardar={onGuardar}
      onEliminar={onEliminar}
    />
  );
}