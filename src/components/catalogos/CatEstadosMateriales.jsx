// src/components/catalogos/CatEstadosMateriales.jsx
import CrudCatalogo from "./CrudCatalogo";

const CAMPOS = [
  { key: "nombre",      label: "Nombre del estado", placeholder: "Ej: Reciclable" },
  { key: "descripcion", label: "Descripción",        placeholder: "Describe el estado", type: "textarea", fullWidth: true },
];

const DATOS_INICIALES = [
  { id: 1, nombre: "Reciclable",     descripcion: "Material apto para reciclaje" },
  { id: 2, nombre: "No reciclable",  descripcion: "Material que no puede reciclarse" },
  { id: 3, nombre: "Peligroso",      descripcion: "Material con manejo especial requerido" },
  { id: 4, nombre: "En revisión",    descripcion: "Material pendiente de clasificación" },
];

export default function CatEstadosMateriales() {
  return (
    <CrudCatalogo
      titulo="Estados de materiales"
      icono="bi-recycle"
      campos={CAMPOS}
      datos={DATOS_INICIALES}
    />
  );
}