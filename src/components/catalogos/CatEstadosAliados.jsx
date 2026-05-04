// src/components/catalogos/CatEstadosAliados.jsx
import CrudCatalogo from "./CrudCatalogo";

const CAMPOS = [
  { key: "nombre",      label: "Nombre del estado", placeholder: "Ej: Activo" },
  { key: "descripcion", label: "Descripción",        placeholder: "Describe el estado", type: "textarea", fullWidth: true },
];

const DATOS_INICIALES = [
  { id: 1, nombre: "Activo",      descripcion: "Aliado habilitado en la plataforma" },
  { id: 2, nombre: "Inactivo",    descripcion: "Aliado deshabilitado temporalmente" },
  { id: 3, nombre: "Pendiente",   descripcion: "Aliado en proceso de verificación" },
  { id: 4, nombre: "Suspendido",  descripcion: "Aliado suspendido por incumplimiento" },
];

export default function CatEstadosAliados() {
  return (
    <CrudCatalogo
      titulo="Estados de aliados"
      icono="bi-handshake-fill"
      campos={CAMPOS}
      datos={DATOS_INICIALES}
    />
  );
}