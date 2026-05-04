import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3333/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Credenciales incorrectas");

      const data = await res.json();

      if (onLogin) onLogin(data);

    } catch (err) {
      console.warn("Backend no disponible, login mock");

      if (onLogin) {
        onLogin({ email, token: "mock-token" });
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">

        {/* IZQUIERDA - IMAGEN */}
        <div className="col-md-6 bg-light d-flex justify-content-center align-items-center p-5">
          <img
            src="/src/assets/imagenes/eco.png"
            alt="EcoRecicla"
            className="img-fluid"
          />
        </div>

        {/* DERECHA - FORMULARIO */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="w-100 p-4 mx-auto">

            <form
              onSubmit={handleSubmit}
              className="bg-white text-dark p-4 rounded shadow-sm"
            >

              <h1 className="text-center fw-bold fs-3">
                ¡Bienvenido de nuevo! 🌱
              </h1>

              <p className="text-center text-success small">
                Inicia sesión para continuar reciclando y ganando
              </p>

              <br />

              {error && (
                <div className="alert alert-danger text-center">
                  {error}
                </div>
              )}

              {/* EMAIL */}
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Ingresa tu correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* RECORDAR */}
              <div className="mb-3 d-flex justify-content-between">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                  />
                  <label className="form-check-label">
                    Recordarme
                  </label>
                </div>

                <span className="text-success small">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>

              {/* BOTÓN */}
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-success rounded-pill"
                  disabled={loading}
                >
                  {loading ? "Cargando..." : "INICIAR SESIÓN"}
                </button>
              </div>

              <br />

              {/* DIVISOR */}
              <div className="d-flex align-items-center my-3">
                <div className="flex-grow-1 border-top"></div>
                <span className="px-3 small text-muted">
                  o continúa con
                </span>
                <div className="flex-grow-1 border-top"></div>
              </div>

              {/* REDES */}
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-light border rounded-pill px-4">
                  <i className="bi bi-google me-2 text-danger"></i>
                  Google
                </button>
                <button className="btn btn-light border rounded-pill px-4">
                  <i className="bi bi-facebook me-2 text-primary"></i>
                  Facebook
                </button>
              </div>

              <br />

              {/* REGISTRO */}
              <div className="text-center">
                <span className="text-secondary">
                  ¿No tienes cuenta?
                </span>{" "}
                <span
                  className="fw-bold text-success"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/Registro")}
                >
                  Regístrate aquí
                </span>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}