// src/components/catalogos/CatEstadosUsuarios.jsx
import CrudCatalogo from "./CrudCatalogo";

const CAMPOS = [
  { key: "nombre",      label: "Nombre del estado", placeholder: "Ej: Activo" },
  { key: "descripcion", label: "Descripción",        placeholder: "Describe el estado", type: "textarea", fullWidth: true },
];

const DATOS_INICIALES = [
  { id: 1, nombre: "Activo",      descripcion: "Usuario habilitado para usar la plataforma" },
  { id: 2, nombre: "Inactivo",    descripcion: "Usuario deshabilitado temporalmente" },
  { id: 3, nombre: "Suspendido",  descripcion: "Usuario suspendido por mal uso" },
  { id: 4, nombre: "Pendiente",   descripcion: "Usuario en espera de verificación de cuenta" },
  { id: 5, nombre: "Eliminado",   descripcion: "Usuario dado de baja definitivamente" },
];

export default function CatEstadosUsuarios() {
  return (
    <CrudCatalogo
      titulo="Estados de usuarios"
      icono="bi-person-check-fill"
      campos={CAMPOS}
      datos={DATOS_INICIALES}
    />
  );
}