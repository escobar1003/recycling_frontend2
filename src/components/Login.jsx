import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { iniciarSesion } from "../services/api";
import fondoReciclaje from "./imagenes/fondo_reciclaje.png";

// ─────────────────────────────────────────────
// FORMULARIO DE LOGIN
// ─────────────────────────────────────────────
function LoginForm({ onLogin }) {
  const [correo, setCorreo]       = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [remember, setRemember]   = useState(false);
  const navigate = useNavigate();

  const validar = async (e) => {
    // Soporta llamada desde form onSubmit o desde click en botón
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
      if (onLogin) onLogin(data.usuario ?? data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") validar(); };

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
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Entrando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-leaf-fill me-2"></i>INICIAR SESIÓN
                    </>
                  )}
                </button>
              </div>

              <div className="d-flex align-items-center my-3">
                <div className="flex-grow-1 border-top"></div>
                <span className="px-3 text-secondary small">o continúa con</span>
                <div className="flex-grow-1 border-top"></div>
              </div>

              


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
  const [nombre, setNombre]       = useState("");
  const [usuario, setUsuario]     = useState("");
  const [correo, setCorreo]       = useState("");
  const [password, setPassword]   = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [terminos, setTerminos]   = useState(false);
  const [origen, setOrigen]       = useState("");
  const [error, setError]         = useState("");
  const navigate = useNavigate();

  const validar = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");

    if (nombre.trim() === "")   return setError("Nombre requerido");
    if (usuario.trim() === "")  return setError("Usuario requerido");
    if (correo.trim() === "")   return setError("Correo requerido");
    if (password.trim() === "") return setError("Contraseña requerida");
    if (confirmar.trim() === "") return setError("Confirmación requerida");
    if (!correo.includes("@") || !correo.includes(".com")) return setError("Correo inválido");
    if (password !== confirmar) return setError("Las contraseñas no coinciden");
    if (!terminos)              return setError("Debes aceptar términos y condiciones");
    if (origen.trim() === "")   return setError("Selecciona cómo te enteraste de nosotros");

    alert("¡Cuenta creada correctamente!");
    navigate("/");
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">

        {/* ── PANEL IZQUIERDO: imagen ── */}
        <div className="col-md-6 bg-light d-flex justify-content-center align-items-center p-5">
          <img src="/src/assets/imagenes/eco.png" alt="EcoRecicla" className="img-fluid" />
        </div>

        {/* ── PANEL DERECHO: formulario ── */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="w-100 p-4">

            <form
              className="bg-white text-dark p-3 rounded"
              onSubmit={validar}
              noValidate
            >
              {/* Ícono superior */}
              <div className="text-center mb-2">
                <div className="d-inline-flex justify-content-center align-items-center rounded-circle bg-success bg-opacity-10 p-4">
                  <i className="bi bi-person fs-2 text-success"></i>
                </div>
                <div><i className="bi bi-leaf-fill text-success"></i></div>
              </div>

              <h1 className="text-center text-dark">Crear cuenta</h1>
              <h2 className="text-center fw-light text-success fs-5">Es rápido y fácil</h2>

              <br />

              {error && (
                <div className="alert alert-danger py-2 text-center">{error}</div>
              )}

              {/* Nombre + Usuario */}
              <div className="d-flex justify-content-center gap-2">
                <div className="mb-2 w-50">
                  <label className="form-label text-dark">Nombre completo</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-person"></i></span>
                    <input
                      className="form-control"
                      placeholder="Ingresa tu nombre completo"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-2 w-50">
                  <label className="form-label text-dark">Nombre de usuario</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-at"></i></span>
                    <input
                      className="form-control"
                      placeholder="Elige tu nombre de usuario"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Correo */}
              <div className="mb-2">
                <label className="form-label text-dark">Correo electrónico</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </div>
              </div>

              {/* Contraseña + Confirmar */}
              <div className="d-flex justify-content-center gap-2">
                <div className="mb-2 w-50">
                  <label className="form-label text-dark">Contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input
                      className="form-control"
                      placeholder="Crea una contraseña"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-2 w-50">
                  <label className="form-label text-dark">Confirmar contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input
                      className="form-control"
                      placeholder="Confirma tu contraseña"
                      type="password"
                      value={confirmar}
                      onChange={(e) => setConfirmar(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* ¿Cómo te enteraste? */}
              <div className="mb-2">
                <label className="form-label text-dark">¿Cómo te enteraste de nosotros?</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-globe"></i></span>
                  <select
                    className="form-select"
                    value={origen}
                    onChange={(e) => setOrigen(e.target.value)}
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="redes">Redes sociales</option>
                    <option value="amigo">Amigo o familiar</option>
                    <option value="google">Google</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              {/* Términos */}
              <div className="mb-3">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="terminos"
                  checked={terminos}
                  onChange={(e) => setTerminos(e.target.checked)}
                />
                <label className="text-dark" htmlFor="terminos">
                  Acepto los términos y condiciones y la política de privacidad
                </label>
              </div>

              {/* Botón crear cuenta */}
              <div className="d-flex flex-column align-items-center">
                <button
                  type="submit"
                  className="btn btn-warning text-white rounded-pill px-5 py-2 w-50"
                >
                  CREAR CUENTA <i className="bi bi-leaf-fill ms-2 text-white"></i>
                </button>
              </div>
            </form>

            <div className="d-flex align-items-center my-3 w-100">
              <div className="flex-grow-1 border-top border-2 border-dark"></div>
              <span className="px-3 fw-semibold text-dark">O continúa con</span>
              <div className="flex-grow-1 border-top border-2 border-dark"></div>
            </div>

            <div className="d-flex justify-content-center align-items-center gap-3">
              <button type="button" className="btn btn-light text-dark rounded-pill px-4 py-2">
                <i className="bi bi-google me-2 text-danger"></i>Google
              </button>
              <button type="button" className="btn btn-light text-dark rounded-pill px-4 py-2">
                <i className="bi bi-facebook me-2 text-primary"></i>Facebook
              </button>
            </div>

            <br />

            <div className="d-flex justify-content-center align-items-center gap-2">
              <span className="fw-light text-secondary">¿Ya tienes cuenta?</span>
              <button
                type="button"
                className="btn btn-link p-0 fw-bold text-success text-decoration-none"
                onClick={() => navigate("/")}
              >
                Inicia sesión
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EXPORT PRINCIPAL
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