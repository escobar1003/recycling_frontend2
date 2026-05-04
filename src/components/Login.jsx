// src/components/Login.jsx
// Login de EcoRecicla — fiel al diseño de la imagen
// Bootstrap 5 + Bootstrap Icons + emojis
import fondoReciclaje from "./imagenes/fondo_reciclaje.png"; // 👈 agrega esta línea


import { useState } from "react";

export default function Login({ onLogin }) {
  const [correo, setCorreo]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [remember, setRemember]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  async function handleSubmit(e) {
  e.preventDefault();
  setError("");

  if (!correo || !password) {
    setError("Por favor completa todos los campos.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:3333/api/auth/iniciar-sesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correo: correo,
        password: password
      }),
    });

    const data = await res.json();

    // 🔥 AQUÍ SÍ existe data
    localStorage.setItem("token", data.token);

    if (onLogin) onLogin(data);

  } catch (err) {
    setError("Error al iniciar sesión");
  } finally {
    setLoading(false);
  }
}

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f8f4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
        padding: "16px",
      }}
    >
      {/* Tarjeta contenedor dividida en dos */}
      <div
        className="shadow-lg"
        style={{
          display: "flex",
          borderRadius: 24,
          overflow: "hidden",
          width: "100%",
          maxWidth: 900,
          minHeight: 560,
          background: "#fff",
        }}
      >
        {/* ── PANEL IZQUIERDO ── */}
        <div
          style={{
            flex: 1,
            background: "#f0f7f0",
            padding: "40px 36px 32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minWidth: 0,
          }}
          className="d-none d-md-flex"
        >
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

            {/* Ilustración SVG — cubo reciclaje con planta */}
            {/* Imagen de fondo reciclaje */}
<div style={{ display: "flex", justifyContent: "center", margin: "24px 0 16px" }}>
  <img
    src={fondoReciclaje}
    alt="Ilustración de reciclaje"
    style={{
      width: "100%",
      maxWidth: 280,
      objectFit: "contain",
      borderRadius: 16,
      filter: "drop-shadow(0 4px 16px rgba(45,106,79,0.15))",
    }}
  />
</div>

            {/* Stat */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 2px 12px #2d6a4f18",
              }}
            >
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
            {/* correo */}
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 14 }}>
                Correo electrónico
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ border: "2px solid #c3e8d0", borderRight: "none", background: "#f9fdfb", borderRadius: "10px 0 0 10px" }}>
                  ✉️
                </span>
                <input
                  type="correo"
                  className="form-control"
                  placeholder="Ingresa tu correo electrónico"
                  value={correo}
                  onChange={e => setCorreo(e.target.value)}
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
              <a href="#" style={{ color: "#2d6a4f", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón iniciar sesión */}
            <button
              type="submit"
              className="btn w-100 fw-bold text-white"
              disabled={loading}
              style={{
                background: loading ? "#74b190" : "linear-gradient(135deg, #2d6a4f, #1a3a24)",
                border: "none",
                borderRadius: 12,
                padding: "13px",
                fontSize: 16,
                letterSpacing: ".3px",
                boxShadow: "0 4px 16px #2d6a4f44",
                transition: "opacity .2s",
              }}
            >
              {loading ? "Iniciando sesión..." : "🍃 Iniciar sesión"}
            </button>
          </form>

          {/* Separador */}
          <div className="d-flex align-items-center gap-2 my-4">
            <hr style={{ flex: 1, borderColor: "#e2f5ea" }} />
            <span style={{ color: "#9ab5a0", fontSize: 13, fontWeight: 600 }}>o continúa con</span>
            <hr style={{ flex: 1, borderColor: "#e2f5ea" }} />
          </div>

          {/* Social buttons */}
          <div className="d-flex gap-3">
            <button
              className="btn fw-bold d-flex align-items-center justify-content-center gap-2"
              style={{ flex: 1, border: "2px solid #e2e8f0", borderRadius: 12, padding: "11px", fontSize: 14, color: "#374151", background: "#fff" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button
              className="btn fw-bold d-flex align-items-center justify-content-center gap-2"
              style={{ flex: 1, border: "2px solid #e2e8f0", borderRadius: 12, padding: "11px", fontSize: 14, color: "#374151", background: "#fff" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          {/* Registro */}
          <p className="text-center mt-4 mb-0" style={{ color: "#9ab5a0", fontSize: 14, fontWeight: 600 }}>
            ¿No tienes cuenta?{" "}
            <a href="#" style={{ color: "#2d6a4f", fontWeight: 800, textDecoration: "none" }}>
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}