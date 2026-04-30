const BASE_URL = 'http://localhost:3333';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.mensaje || `Error ${res.status}`);
  }
  return res.json();
}

// Trae todos los usuarios del backend
export async function getUsuarios() {
  return request('/api/usuarios');
}

// Trae los puntos de reciclaje
export async function getPuntos() {
  return request('/api/puntos');
}

// Crea un usuario nuevo
export async function crearUsuario(datos) {
  return request('/api/usuarios', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

// Activa o desactiva un usuario
export async function cambiarEstadoUsuario(id, esta_activo) {
  return request(`/api/usuarios/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ esta_activo }),
  });
}