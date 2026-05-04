// src/components/catalogos/CatEstadosCanjes.jsx
import CrudCatalogo from "./CrudCatalogo";

const CAMPOS = [
  { key: "nombre",      label: "Nombre del estado", placeholder: "Ej: Solicitado" },
  { key: "descripcion", label: "Descripción",        placeholder: "Describe el estado", type: "textarea", fullWidth: true },
];

const DATOS_INICIALES = [
  { id: 1, nombre: "Solicitado",  descripcion: "Canje solicitado por el usuario" },
  { id: 2, nombre: "Aprobado",    descripcion: "Canje aprobado y en proceso de entrega" },
  { id: 3, nombre: "Entregado",   descripcion: "Recompensa entregada al usuario" },
  { id: 4, nombre: "Rechazado",   descripcion: "Canje rechazado por falta de puntos o stock" },
  { id: 5, nombre: "Cancelado",   descripcion: "Canje cancelado por el usuario" },
];

export default function CatEstadosCanjes() {
  return (
    <CrudCatalogo
      titulo="Estados de canjes"
      icono="bi-arrow-left-right"
      campos={CAMPOS}
      datos={DATOS_INICIALES}
    />
  );
}