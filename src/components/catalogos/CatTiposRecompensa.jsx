// src/components/catalogos/CatTiposRecompensa.jsx
import CrudCatalogo from "./CrudCatalogo";

const CAMPOS = [
  { key: "nombre",      label: "Tipo de recompensa", placeholder: "Ej: Descuento" },
  { key: "descripcion", label: "Descripción",         placeholder: "Describe el tipo", type: "textarea", fullWidth: true },
];

const DATOS_INICIALES = [
  { id: 1, nombre: "Descuento",        descripcion: "Porcentaje de descuento en productos aliados" },
  { id: 2, nombre: "Producto físico",  descripcion: "Artículo físico entregado al usuario" },
  { id: 3, nombre: "Vale digital",     descripcion: "Cupón o código digital canjeable" },
  { id: 4, nombre: "Experiencia",      descripcion: "Actividad o evento especial para el usuario" },
  { id: 5, nombre: "Donación",         descripcion: "Puntos convertidos en donación a causa ambiental" },
];

export default function CatTiposRecompensa() {
  return (
    <CrudCatalogo
      titulo="Tipos de recompensa"
      icono="bi-tag-fill"
      campos={CAMPOS}
      datos={DATOS_INICIALES}
    />
  );
}