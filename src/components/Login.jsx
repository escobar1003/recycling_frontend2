import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [remember, setRemember]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Por favor completa todos los campos."); return; }
    setLoading(true);
    // ── Cuando backend esté listo, cambia esta URL ──
    try {
      const res = await fetch("https://tu-backend.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Credenciales incorrectas");
      const data = await res.json();
      if (onLogin) onLogin(data);
    } catch (err) {
      // Mock: si no hay backend, simula login exitoso
      console.warn("Backend no disponible, login mock");
      if (onLogin) onLogin({ email, token: "mock-token" });
    } finally {
      setLoading(false);
    }
  }

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
                    type="password"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                  />
                  <span className="input-group-text"><i className="bi bi-eye"></i></span>
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
                <button className="btn btn-success rounded-pill py-2" onClick={validar}>
                  <i className="bi bi-leaf-fill me-2"></i>
                  INICIAR SESIÓN
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

        {/* ── PANEL DERECHO: FORMULARIO ── */}
        <div
          style={{
            flex: 1,
            padding: "48px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "#fff",
          }}
        >
          <h3 style={{ fontSize: 26, fontWeight: 900, color: "#1a3a24", marginBottom: 6 }}>
            ¡Bienvenido de nuevo! 🍃
          </h3>
          <p style={{ color: "#74b190", fontSize: 14, fontWeight: 600, marginBottom: 28 }}>
            Inicia sesión para continuar reciclando y ganando
          </p>

          {error && (
            <div className="alert alert-danger py-2" style={{ borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 14 }}>
                Correo electrónico
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ border: "2px solid #c3e8d0", borderRight: "none", background: "#f9fdfb", borderRadius: "10px 0 0 10px" }}>
                  ✉️
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Ingresa tu correo electrónico"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ border: "2px solid #c3e8d0", borderLeft: "none", borderRadius: "0 10px 10px 0", fontWeight: 600, fontSize: 14 }}
                />
              </div>
            </div>

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
          </form>
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