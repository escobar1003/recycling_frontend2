import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { iniciarSesion } from "../services/api";
import fondoReciclaje from '../components/imagenes/fondo_reciclaje.png'

const ROLES = [
  { value: "usuario",      label: "Usuario",        icon: "bi-person-fill"       },
  { value: "administrador",label: "Administrador",  icon: "bi-shield-lock-fill"  },
  { value: "encargado",    label: "Encargado",      icon: "bi-shop"              },
  { value: "supermercado", label: "Supermercado",   icon: "bi-bag-fill"          },
];

// ─────────────────────────────────────────────
// FORMULARIO DE LOGIN
// ─────────────────────────────────────────────
function LoginForm({ onLogin }) {
  const [correo,     setCorreo]     = useState("");
  const [contraseña, setContraseña] = useState("");
  const [rol,        setRol]        = useState("usuario");
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [showPass,   setShowPass]   = useState(false);
  const [remember,   setRemember]   = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  const navigate = useNavigate();

  const rolActual = ROLES.find(r => r.value === rol);

  const validar = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (correo.trim() === "" || contraseña.trim() === "") {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!correo.includes("@") || !correo.includes(".")) {
      setError("Correo electrónico inválido");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await iniciarSesion(correo.trim(), contraseña);
      const usuario = data.usuario ?? data;

      localStorage.setItem("usuario", JSON.stringify(usuario));
      sessionStorage.setItem("user", JSON.stringify(usuario));

      if (onLogin) onLogin({ ...usuario, rolSeleccionado: rol });

      // Redirigir según rol seleccionado
      if (rol === "encargado") {
        navigate("/encargado/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") validar();
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">

        {/* ── PANEL IZQUIERDO: imagen de fondo ── */}
        <div
          className="col-md-6 p-0"
          style={{
            backgroundImage: `url(${fondoReciclaje})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
          }}
        />

        {/* ── PANEL DERECHO: formulario ── */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="w-100 p-4 mx-auto">
            <form
              className="bg-white text-dark p-4 rounded shadow-sm"
              onSubmit={validar}
              noValidate
            >
              <h1 className="text-center text-dark fw-bold fs-3">
                ¡Bienvenido de nuevo! <i className="bi bi-leaf-fill text-success"></i>
              </h1>

              <h2 className="text-center fw-light text-success fs-6">
                Inicia sesión para continuar reciclando y ganando
              </h2>

              <br />

              {error && (
                <div className="alert alert-danger py-2 text-center">{error}</div>
              )}

              {/* ── Selector de rol ── */}
              <div className="mb-3">
                <label className="form-label">Iniciar sesión como</label>
                <div className="dropdown">
                  <button
                    type="button"
                    className="btn btn-outline-success w-100 d-flex align-items-center justify-content-between"
                    onClick={() => setDropOpen(o => !o)}
                  >
                    <span>
                      <i className={`bi ${rolActual.icon} me-2`}></i>
                      {rolActual.label}
                    </span>
                    <i className={`bi bi-chevron-${dropOpen ? "up" : "down"}`}></i>
                  </button>

                  {dropOpen && (
                    <ul
                      className="dropdown-menu show w-100 shadow-sm border-0"
                      style={{ zIndex: 1000 }}
                    >
                      {ROLES.map(r => (
                        <li key={r.value}>
                          <button
                            type="button"
                            className={`dropdown-item d-flex align-items-center gap-2 py-2 ${rol === r.value ? "active bg-success" : ""}`}
                            onClick={() => { setRol(r.value); setDropOpen(false); }}
                          >
                            <i className={`bi ${r.icon}`}></i>
                            {r.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Ingresa tu correo electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    className="form-control"
                    placeholder="Ingresa tu contraseña"
                    type={showPass ? "text" : "password"}
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type="button"
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPass((s) => !s)}
                  >
                    <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>

              {/* Recordarme + ¿Olvidaste? */}
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="remember">
                    Recordarme
                  </label>
                </div>

                <button
                  type="button"
                  className="btn btn-link p-0 text-success small text-decoration-none"
                  onClick={() => navigate("/forgot")}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón iniciar sesión */}
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-success rounded-pill py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Entrando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-leaf-fill me-2"></i>INICIAR SESIÓN
                    </>
                  )}
                </button>
              </div>

              <br />

              <div className="text-center">
                <span className="text-secondary">¿No tienes cuenta?</span>{" "}
                <button
                  type="button"
                  className="btn btn-link p-0 fw-bold text-success text-decoration-none"
                  onClick={() => navigate("/Registro")}
                >
                  Regístrate aquí
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FORMULARIO DE REGISTRO
// ─────────────────────────────────────────────
function RegistroForm() {
  const [nombre,   setNombre]   = useState("");
  const [usuario,  setUsuario]  = useState("");
  const [correo,   setCorreo]   = useState("");
  const [password, setPassword] = useState("");
  const [confirmar,setConfirmar]= useState("");
  const [terminos, setTerminos] = useState(false);
  const [origen,   setOrigen]   = useState("");
  const [error,    setError]    = useState("");
  const navigate = useNavigate();

  const validar = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");

    if (nombre.trim() === "")    return setError("Nombre requerido");
    if (usuario.trim() === "")   return setError("Usuario requerido");
    if (correo.trim() === "")    return setError("Correo requerido");
    if (password.trim() === "")  return setError("Contraseña requerida");
    if (confirmar.trim() === "") return setError("Confirmación requerida");
    if (password !== confirmar)  return setError("Las contraseñas no coinciden");
    if (!terminos)               return setError("Debes aceptar términos y condiciones");
    if (origen.trim() === "")    return setError("Selecciona cómo te enteraste de nosotros");

    alert("¡Cuenta creada correctamente!");
    navigate("/");
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <div className="col-md-6 bg-light d-flex justify-content-center align-items-center p-5">
          <img src="/src/assets/imagenes/eco.png" alt="EcoRecicla" className="img-fluid" />
        </div>

        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="w-100 p-4">
            <form className="bg-white text-dark p-3 rounded" onSubmit={validar} noValidate>

              <div className="text-center mb-2">
                <div className="d-inline-flex justify-content-center align-items-center rounded-circle bg-success bg-opacity-10 p-4">
                  <i className="bi bi-person fs-2 text-success"></i>
                </div>
              </div>

              <h1 className="text-center text-dark">Crear cuenta</h1>
              <h2 className="text-center fw-light text-success fs-5">Es rápido y fácil</h2>
              <br />

              {error && (
                <div className="alert alert-danger py-2 text-center">{error}</div>
              )}

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────
export default function Login({ onLogin }) {
  return (
    <Routes>
      <Route path="/"         element={<LoginForm onLogin={onLogin} />} />
      <Route path="/Registro" element={<RegistroForm />} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  );
}