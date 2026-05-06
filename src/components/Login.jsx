// src/components/Login.jsx
// Login de RecyclinPoints — navegación con React Router Dom
// Bootstrap 5 + emojis

import fondoReciclaje from "./imagenes/fondo_reciclaje.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
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
      const res = await fetch("https://tu-backend.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Credenciales incorrectas");
      const data = await res.json();
      if (onLogin) onLogin(data);
    } catch (err) {
      console.warn("Backend no disponible, login mock");
      if (onLogin) onLogin({ email, token: "mock-token" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#f4f8f4",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Nunito', 'Segoe UI', sans-serif", padding: "16px",
    }}>
      <div className="shadow-lg" style={{
        display: "flex", borderRadius: 24, overflow: "hidden",
        width: "100%", maxWidth: 900, minHeight: 560, background: "#fff",
      }}>

        {/* ── PANEL IZQUIERDO ── */}
        <div className="d-none d-md-flex" style={{
          flex: 1, background: "#f0f7f0", padding: "40px 36px 32px",
          flexDirection: "column", justifyContent: "space-between", minWidth: 0,
        }}>
          {/* Logo */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ fontSize: 32 }}>♻️</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#2d6a4f", lineHeight: 1 }}>Recycling Points</div>
              <div style={{ fontSize: 12, color: "#74b190", fontWeight: 600 }}>Recicla y gana</div>
            </div>
          </div>

          {/* Headline */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: "#1a3a24", lineHeight: 1.2, marginBottom: 12 }}>
              Cada acción cuenta 🍃
            </h2>
            <p style={{ color: "#4a7a5a", fontSize: 15, fontWeight: 500, maxWidth: 260 }}>
              Únete a la comunidad que cuida el planeta y gana recompensas.
            </p>

            {/* Imagen */}
            <div style={{ display: "flex", justifyContent: "center", margin: "24px 0 16px" }}>
              <img
                src={fondoReciclaje}
                alt="Ilustración de reciclaje"
                style={{
                  width: "100%", maxWidth: 280,
                  objectFit: "contain", borderRadius: 16,
                  filter: "drop-shadow(0 4px 16px rgba(45,106,79,0.15))",
                }}
              />
            </div>

            {/* Stat */}
            <div style={{
              background: "#fff", borderRadius: 16, padding: "14px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              boxShadow: "0 2px 12px #2d6a4f18",
            }}>
              <div>
                <div style={{ fontSize: 13, color: "#74b190", fontWeight: 700 }}>🍃 Juntos hemos reciclado</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#1a3a24" }}>
                  12,540 kg <span style={{ fontSize: 14, color: "#4a7a5a", fontWeight: 600 }}>de residuos</span>
                </div>
              </div>
              <span style={{ fontSize: 34 }}>🌍</span>
            </div>
          </div>

          {/* Footer íconos */}
          <div className="d-flex justify-content-between mt-3" style={{ gap: 8 }}>
            {[
              { icon: "🍃", text: "Reduce contaminación" },
              { icon: "♻️", text: "Recicla responsable" },
              { icon: "⭐", text: "Gana recompensas" },
            ].map(f => (
              <div key={f.text} style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 22 }}>{f.icon}</div>
                <div style={{ fontSize: 11, color: "#4a7a5a", fontWeight: 700, lineHeight: 1.3 }}>{f.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PANEL DERECHO: FORMULARIO ── */}
        <div style={{
          flex: 1, padding: "48px 40px",
          display: "flex", flexDirection: "column", justifyContent: "center", background: "#fff",
        }}>
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

            {/* Contraseña */}
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 14 }}>
                Contraseña
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ border: "2px solid #c3e8d0", borderRight: "none", background: "#f9fdfb", borderRadius: "10px 0 0 10px" }}>
                  🔒
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ border: "2px solid #c3e8d0", borderLeft: "none", borderRight: "none", fontWeight: 600, fontSize: 14 }}
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={() => setShowPass(v => !v)}
                  style={{ border: "2px solid #c3e8d0", borderLeft: "none", background: "#f9fdfb", cursor: "pointer", borderRadius: "0 10px 10px 0" }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Recordarme + ¿Olvidaste? */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  style={{ accentColor: "#2d6a4f" }}
                />
                <label className="form-check-label" htmlFor="remember" style={{ color: "#4a7a5a", fontWeight: 600, fontSize: 14 }}>
                  Recordarme
                </label>
              </div>

              {/* ── navega a /forgot ── */}
              <button
                type="button"
                onClick={() => navigate("/forgot")}
                style={{
                  background: "none", border: "none", padding: 0,
                  color: "#2d6a4f", fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón iniciar sesión */}
            <button
              type="submit"
              className="btn w-100 fw-bold text-white"
              disabled={loading}
              style={{
                background: loading ? "#74b190" : "linear-gradient(135deg, #2d6a4f, #1a3a24)",
                border: "none", borderRadius: 12, padding: "13px",
                fontSize: 16, letterSpacing: ".3px",
                boxShadow: "0 4px 16px #2d6a4f44", transition: "opacity .2s",
              }}
            >
              {loading ? "Iniciando sesión..." : "🍃 Iniciar sesión"}
            </button>
          </form>

          
          {/* ── navega a /Registro ── */}
          <p className="text-center mt-4 mb-0" style={{ color: "#9ab5a0", fontSize: 14, fontWeight: 600 }}>
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => navigate("/Registro")}
              style={{
                background: "none", border: "none", padding: 0,
                color: "#2d6a4f", fontWeight: 800, fontSize: 14,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}