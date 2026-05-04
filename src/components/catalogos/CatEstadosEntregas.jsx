// src/components/catalogos/CatEstadosEntregas.jsx
import CrudCatalogo from "./CrudCatalogo";

const CAMPOS = [
  { key: "nombre",      label: "Nombre del estado", placeholder: "Ej: Pendiente" },
  { key: "descripcion", label: "Descripción",        placeholder: "Describe el estado", type: "textarea", fullWidth: true },
];

const DATOS_INICIALES = [
  { id: 1, nombre: "Pendiente",   descripcion: "Entrega registrada, en espera de revisión" },
  { id: 2, nombre: "En proceso",  descripcion: "Entrega siendo procesada por el encargado" },
  { id: 3, nombre: "Completada",  descripcion: "Entrega finalizada y puntos asignados" },
  { id: 4, nombre: "Rechazada",   descripcion: "Entrega no aceptada por incumplir requisitos" },
  { id: 5, nombre: "Cancelada",   descripcion: "Entrega cancelada por el usuario" },
];

export default function CatEstadosEntregas() {
  return (
    <CrudCatalogo
      titulo="Estados de entregas"
      icono="bi-box-seam-fill"
      campos={CAMPOS}
      datos={DATOS_INICIALES}
    />
  );
}