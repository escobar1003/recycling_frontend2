// src/components/catalogos/CatRoles.jsx
import CrudCatalogo from "./CrudCatalogo";

const CAMPOS = [
  { key: "nombre",      label: "Nombre del rol",  placeholder: "Ej: Administrador" },
  { key: "descripcion", label: "Descripción",      placeholder: "Describe el rol", type: "textarea", fullWidth: true },
];

const DATOS_INICIALES = [
  { id: 1, nombre: "Administrador",  descripcion: "Acceso total al sistema" },
  { id: 2, nombre: "Encargado",      descripcion: "Gestión de puntos de reciclaje" },
  { id: 3, nombre: "Usuario",        descripcion: "Usuario final de la plataforma" },
  { id: 4, nombre: "Aliado",         descripcion: "Empresa o entidad aliada" },
];

export default function CatRoles(props) {
  return (
    <CrudCatalogo
      titulo="Roles"
      icono="bi-key-fill"
      campos={CAMPOS}
      datos={DATOS_INICIALES}
    />
  );
}