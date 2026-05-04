import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { iniciarSesion } from "../services/api";

function LoginForm({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const validar = async () => {
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
      onLogin(data.usuario);
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

        <div className="col-md-6 bg-light d-flex justify-content-center align-items-center p-5">
          <img src="/src/assets/imagenes/eco.png" alt="EcoRecicla" className="img-fluid" />
        </div>

        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="w-100 p-4 mx-auto">
            <ul className="bg-white text-dark p-4 rounded shadow-sm list-unstyled">

              <h1 className="text-center text-dark fw-bold fs-3">
                ¡Bienvenido de nuevo! <i className="bi bi-leaf-fill text-success"></i>
              </h1>
              <h2 className="text-center fw-light text-success fs-6">
                iniciar sesion para continuar reciclando y ganando
              </h2>

              <br />

              {error && (
                <div className="alert alert-danger py-2 text-center">{error}</div>
              )}

              <li className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                  <input
                    className="form-control"
                    placeholder="Ingresa tu correo electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </li>

              <li className="mb-3">
                <label className="form-label">Contraseña</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock"></i></span>
                  <input
                    className="form-control"
                    placeholder="Ingresa tu contraseña"
                    type={showPass ? "text" : "password"}
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <span
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPass(s => !s)}
                  >
                    <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </span>
                </div>
              </li>

              <li className="mb-3 d-flex justify-content-between align-items-center">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">recordarme</label>
                </div>
                <span className="text-success small">¿Olvidaste tu contraseña?</span>
              </li>

              <div className="d-grid">
                <button
                  className="btn btn-success rounded-pill py-2"
                  onClick={validar}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Entrando...</>
                  ) : (
                    <><i className="bi bi-leaf-fill me-2"></i>INICIAR SESIÓN</>
                  )}
                </button>
              </div>

              <br />

              <div className="d-flex align-items-center my-3">
                <div className="flex-grow-1 border-top"></div>
                <span className="px-3 text-secondary small">o continúa con</span>
                <div className="flex-grow-1 border-top"></div>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-light border rounded-pill px-4">
                  <i className="bi bi-google me-2 text-danger"></i>Google
                </button>
                <button className="btn btn-light border rounded-pill px-4">
                  <i className="bi bi-facebook me-2 text-primary"></i>Facebook
                </button>
              </div>

              <br />

              <div className="text-center">
                <span className="text-secondary">¿no tienes cuenta?</span>{" "}
                <span
                  className="fw-bold text-success text-decoration-none"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/Registro")}
                >
                  Regístrate aquí
                </span>
              </div>

            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegistroForm() {
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [terminos, setTerminos] = useState(false);
  const [origen, setOrigen] = useState("");
  const navigate = useNavigate();

  const validar = () => {
    if (nombre.trim() === "") return alert("Nombre requerido");
    if (usuario.trim() === "") return alert("Usuario requerido");
    if (correo.trim() === "") return alert("Correo requerido");
    if (password.trim() === "") return alert("Contraseña requerida");
    if (confirmar.trim() === "") return alert("Confirmación requerida");
    if (!correo.includes("@") || !correo.includes(".com")) return alert("Correo inválido");
    if (password !== confirmar) return alert("La contraseña no coincide");
    if (!terminos) return alert("Debes aceptar términos y condiciones");
    if (origen.trim() === "") return alert("Selecciona cómo te enteraste de nosotros");
    alert("Creación de cuenta correcta");
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">

        <div className="col-md-6 bg-light d-flex justify-content-center align-items-center p-5">
          <img src="/src/assets/imagenes/eco.png" alt="EcoRecicla" className="img-fluid" />
        </div>

        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="w-100 p-4">
            <ul className="bg-white text-dark p-3 rounded list-unstyled">

              <div className="text-center mb-2">
                <div className="d-inline-flex justify-content-center align-items-center rounded-circle bg-success bg-opacity-10 p-4">
                  <i className="bi bi-person fs-2 text-success"></i>
                </div>
                <div><i className="bi bi-leaf-fill text-success"></i></div>
              </div>

              <h1 className="text-center text-dark">Crear cuenta</h1>
              <h2 className="text-center fw-light text-success fs-5">Es rápido y fácil</h2>

              <br />

              <div className="d-flex justify-content-center gap-2">
                <li className="mb-2 w-50">
                  <label className="form-label text-dark">Nombre completo</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-person"></i></span>
                    <input className="form-control" placeholder="Ingresa tu nombre completo"
                      value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  </div>
                </li>
                <li className="mb-2 w-50">
                  <label className="form-label text-dark">Nombre de usuario</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-at"></i></span>
                    <input className="form-control" placeholder="elige tu nombre de usuario"
                      value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                  </div>
                </li>
              </div>

              <li className="mb-2">
                <label className="form-label text-dark">Correo electrónico</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                  <input className="form-control" placeholder="correo electrónico"
                    value={correo} onChange={(e) => setCorreo(e.target.value)} />
                </div>
              </li>

              <div className="d-flex justify-content-center gap-2">
                <li className="mb-2 w-50">
                  <label className="form-label text-dark">Contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input className="form-control" placeholder="crea una contraseña" type="password"
                      value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </li>
                <li className="mb-2 w-50">
                  <label className="form-label text-dark">Confirmar contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input className="form-control" placeholder="confirma tu contraseña" type="password"
                      value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
                  </div>
                </li>
              </div>

              <li className="mb-2">
                <label className="form-label text-dark">¿Cómo te enteraste de nosotros?</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-globe"></i></span>
                  <select className="form-select" value={origen} onChange={(e) => setOrigen(e.target.value)}>
                    <option value="">Selecciona una opción</option>
                    <option value="redes">Redes sociales</option>
                    <option value="amigo">Amigo o familiar</option>
                    <option value="google">Google</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </li>

              <li className="mb-2">
                <input className="form-check-input me-2" type="checkbox"
                  checked={terminos} onChange={(e) => setTerminos(e.target.checked)} />
                <span className="text-dark">Acepto los términos y condiciones y la política de privacidad</span>
              </li>

            </ul>

            <div className="d-flex flex-column align-items-center">
              <button className="btn btn-warning text-white rounded-pill px-5 py-2 w-50" onClick={validar}>
                CREAR CUENTA <i className="bi bi-leaf-fill ms-2 text-white"></i>
              </button>

              <br />

              <div className="d-flex align-items-center my-3 w-100">
                <div className="flex-grow-1 border-top border-2 border-dark"></div>
                <span className="px-3 fw-semibold text-dark">O continúa con</span>
                <div className="flex-grow-1 border-top border-2 border-dark"></div>
              </div>
            </div>

            <div className="d-flex justify-content-center align-items-center gap-3">
              <button className="btn btn-light text-dark rounded-pill px-4 py-2">
                <i className="bi bi-google me-2 text-danger"></i>Google
              </button>
              <button className="btn btn-light text-dark rounded-pill px-4 py-2">
                <i className="bi bi-facebook me-2 text-primary"></i>Facebook
              </button>
            </div>

            <br />

            <div className="d-flex justify-content-center align-items-center gap-2">
              <span className="fw-light text-secondary">¿ya tienes cuenta?</span>
              <span
                className="text-decoration-none fw-bold text-success"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Inicia sesión
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login({ onLogin }) {
  return (
    <Routes>
      <Route path="/"         element={<LoginForm onLogin={onLogin} />} />
      <Route path="/Registro" element={<RegistroForm />} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  );
}
