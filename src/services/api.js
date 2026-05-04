const BASE_URL = "http://localhost:3333/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.mensaje || `Error ${res.status}`);
  }

  return res.json();
}

//
// 🔐 AUTH
//

export const login = (data) =>
  request("/auth/iniciar-sesion", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const register = (data) =>
  request("/auth/registrarse", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const logout = () =>
  request("/auth/cerrar-sesion", {
    method: "DELETE",
  });

//
// 👤 USUARIOS (ADMIN)
//

export const getUsuarios = () =>
  request("/admin/usuarios");

export const getUsuarioById = (id) =>
  request(`/admin/usuarios/${id}`);

export const actualizarUsuario = (id, data) =>
  request(`/admin/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const eliminarUsuario = (id) =>
  request(`/admin/usuarios/${id}`, {
    method: "DELETE",
  });

//
// 🏪 ALIADOS
//

export const getAliados = () =>
  request("/admin/aliados");

export const getAliadoById = (id) =>
  request(`/admin/aliados/${id}`);

export const crearAliado = (data) =>
  request("/admin/aliados", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const actualizarAliado = (id, data) =>
  request(`/admin/aliados/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const eliminarAliado = (id) =>
  request(`/admin/aliados/${id}`, {
    method: "DELETE",
  });

//
// ♻️ MATERIALES
//

export const getMateriales = () =>
  request("/admin/materiales");

export const getMaterialById = (id) =>
  request(`/admin/materiales/${id}`);

export const crearMaterial = (data) =>
  request("/admin/materiales", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const actualizarMaterial = (id, data) =>
  request(`/admin/materiales/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const eliminarMaterial = (id) =>
  request(`/admin/materiales/${id}`, {
    method: "DELETE",
  });

//
// 🎁 RECOMPENSAS
//

export const getRecompensas = () =>
  request("/admin/recompensas");

export const getRecompensaById = (id) =>
  request(`/admin/recompensas/${id}`);

export const crearRecompensa = (data) =>
  request("/admin/recompensas", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const actualizarRecompensa = (id, data) =>
  request(`/admin/recompensas/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const eliminarRecompensa = (id) =>
  request(`/admin/recompensas/${id}`, {
    method: "DELETE",
  });