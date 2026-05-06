// src/components/Forgotpassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3333/api/auth/recuperar-password";

async function apiFetch(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || "Error en el servidor");
  return data;
}

function Stepper({ paso }) {
  const pasos = [{ num: 1, label: "Correo" }, { num: 2, label: "Nueva clave" }];
  return (
    <div className="d-flex align-items-center justify-content-center mb-4">
      {pasos.map((p, i) => {
        const done = p.num < paso, activo = p.num === paso;
        return (
          <div key={p.num} className="d-flex align-items-center">
            <div className="d-flex flex-column align-items-center" style={{ gap: 4 }}>
              <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 34, height: 34, fontSize: 14,
                  background: done || activo ? "#2d6a4f" : "#e2f5ea",
                  color: done || activo ? "#fff" : "#9ab5a0",
                  boxShadow: activo ? "0 2px 10px #2d6a4f44" : "none" }}>
                {done ? <i className="bi bi-check-lg" /> : p.num}
              </div>
              <span className="fw-bold" style={{ fontSize: 11, color: activo ? "#2d6a4f" : "#9ab5a0" }}>
                {p.label}
              </span>
            </div>
            {i < pasos.length - 1 && (
              <div style={{ width: 48, height: 2, margin: "0 6px", marginBottom: 18,
                background: done ? "#2d6a4f" : "#c3e8d0" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Forgotpassword() {
  const navigate = useNavigate();
  const [paso,    setPaso]    = useState(1);
  const [correo,  setCorreo]  = useState("");
  const [codigo,  setCodigo]  = useState("");
  const [pass1,   setPass1]   = useState("");
  const [pass2,   setPass2]   = useState("");
  const [showP1,  setShowP1]  = useState(false);
  const [showP2,  setShowP2]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [info,    setInfo]    = useState("");

  function reset() { setError(""); setInfo(""); }

  // Paso 1 — solicitar código
  async function handleSolicitar(e) {
    e.preventDefault(); reset();
    if (!correo) return setError("Ingresa tu correo electrónico.");
    setLoading(true);
    try {
      const data = await apiFetch(`${API}/solicitar`, { correo });
      setInfo(data.codigo
        ? `Código enviado. (Desarrollo: ${data.codigo})`
        : "Código enviado a tu correo.");
      setPaso(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Paso 2 — restablecer con código + nueva contraseña
  async function handleRestablecer(e) {
    e.preventDefault(); reset();
    if (!codigo)      return setError("Ingresa el código recibido.");
    if (!pass1)       return setError("Ingresa la nueva contraseña.");
    if (pass1.length < 6) return setError("La contraseña debe tener mínimo 6 caracteres.");
    if (pass1 !== pass2)  return setError("Las contraseñas no coinciden.");
    setLoading(true);
    try {
      const data = await apiFetch(`${API}/restablecer`, {
        correo, codigo, nuevaPassword: pass1,
      });
      setInfo(data.mensaje);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "#f0f7f0", padding: 16, fontFamily: "'Nunito','Segoe UI',sans-serif" }}>
      <div className="bg-white shadow-lg w-100"
        style={{ maxWidth: 440, borderRadius: 20, padding: "40px 36px 32px" }}>

        {/* Cabecera */}
        <div className="text-center mb-3">
          <i className="bi bi-shield-lock" style={{ fontSize: 48, color: "#2d6a4f" }} />
          <h4 className="fw-black mt-2 mb-1" style={{ color: "#1a3a24" }}>Recuperar contraseña</h4>
          <p className="mb-0 fw-semibold" style={{ fontSize: 13, color: "#4a7a5a" }}>
            Sigue los pasos para restablecer tu acceso
          </p>
        </div>

        <Stepper paso={paso} />

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2" style={{ borderRadius: 10, fontSize: 13 }}>
            <i className="bi bi-exclamation-triangle-fill" />{error}
          </div>
        )}
        {info && (
          <div className="alert alert-success d-flex align-items-center gap-2 py-2" style={{ borderRadius: 10, fontSize: 13 }}>
            <i className="bi bi-check-circle-fill" />{info}
          </div>
        )}

        {/* PASO 1 — Correo */}
        {paso === 1 && (
          <form onSubmit={handleSolicitar}>
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>
                Correo electrónico
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ border: "2px solid #c3e8d0", borderRight: "none", background: "#f9fdfb" }}>
                  <i className="bi bi-envelope" style={{ color: "#2d6a4f" }} />
                </span>
                <input type="email" className="form-control fw-semibold"
                  placeholder="usuario@correo.com" value={correo}
                  onChange={e => setCorreo(e.target.value)}
                  style={{ border: "2px solid #c3e8d0", borderLeft: "none", fontSize: 14 }} />
              </div>
              <div className="form-text" style={{ color: "#9ab5a0" }}>
                Te enviaremos un código de 6 dígitos.
              </div>
            </div>
            <button type="submit" className="btn w-100 fw-bold text-white" disabled={loading}
              style={{ background: loading ? "#74b190" : "linear-gradient(135deg,#2d6a4f,#1a3a24)",
                border: "none", borderRadius: 10, padding: "12px", fontSize: 15,
                boxShadow: "0 4px 14px #2d6a4f33" }}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" />Enviando...</>
                : <><i className="bi bi-send me-2" />Enviar código</>}
            </button>
          </form>
        )}

        {/* PASO 2 — Código + nueva contraseña */}
        {paso === 2 && (
          <form onSubmit={handleRestablecer}>
            {/* Código */}
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>
                Código de verificación
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ border: "2px solid #c3e8d0", borderRight: "none", background: "#f9fdfb" }}>
                  <i className="bi bi-key" style={{ color: "#2d6a4f" }} />
                </span>
                <input type="text" className="form-control fw-bold text-center"
                  placeholder="_ _ _ _ _ _" maxLength={6} value={codigo}
                  onChange={e => setCodigo(e.target.value.replace(/\D/g, ""))}
                  style={{ border: "2px solid #c3e8d0", borderLeft: "none", fontSize: 22, letterSpacing: 8 }} />
              </div>
              <div className="form-text" style={{ color: "#9ab5a0" }}>
                Código enviado a <strong>{correo}</strong>. Expira en 15 minutos.
              </div>
            </div>

            {/* Nueva contraseña */}
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>
                Nueva contraseña
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ border: "2px solid #c3e8d0", borderRight: "none", background: "#f9fdfb" }}>
                  <i className="bi bi-lock" style={{ color: "#2d6a4f" }} />
                </span>
                <input type={showP1 ? "text" : "password"} className="form-control fw-semibold"
                  placeholder="Mínimo 6 caracteres" value={pass1}
                  onChange={e => setPass1(e.target.value)}
                  style={{ border: "2px solid #c3e8d0", borderLeft: "none", borderRight: "none", fontSize: 14 }} />
                <button type="button" className="input-group-text" onClick={() => setShowP1(v => !v)}
                  style={{ border: "2px solid #c3e8d0", borderLeft: "none", background: "#f9fdfb", cursor: "pointer" }}>
                  <i className={`bi ${showP1 ? "bi-eye-slash" : "bi-eye"}`} style={{ color: "#2d6a4f" }} />
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className="mb-1">
              <label className="form-label fw-bold" style={{ color: "#2d6a4f", fontSize: 13 }}>
                Confirmar contraseña
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ border: "2px solid #c3e8d0", borderRight: "none", background: "#f9fdfb" }}>
                  <i className="bi bi-lock-fill" style={{ color: "#2d6a4f" }} />
                </span>
                <input type={showP2 ? "text" : "password"} className="form-control fw-semibold"
                  placeholder="Repite la contraseña" value={pass2}
                  onChange={e => setPass2(e.target.value)}
                  style={{ border: `2px solid ${pass2 && pass1 !== pass2 ? "#dc3545" : "#c3e8d0"}`,
                    borderLeft: "none", borderRight: "none", fontSize: 14 }} />
                <button type="button" className="input-group-text" onClick={() => setShowP2(v => !v)}
                  style={{ border: `2px solid ${pass2 && pass1 !== pass2 ? "#dc3545" : "#c3e8d0"}`,
                    borderLeft: "none", background: "#f9fdfb", cursor: "pointer" }}>
                  <i className={`bi ${showP2 ? "bi-eye-slash" : "bi-eye"}`} style={{ color: "#2d6a4f" }} />
                </button>
              </div>
            </div>

            {pass2 && (
              <div className="form-text fw-bold mb-3" style={{ color: pass1 === pass2 ? "#198754" : "#dc3545" }}>
                <i className={`bi ${pass1 === pass2 ? "bi-check-circle" : "bi-x-circle"} me-1`} />
                {pass1 === pass2 ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
              </div>
            )}

            <button type="submit" className="btn w-100 fw-bold text-white mt-2" disabled={loading}
              style={{ background: loading ? "#74b190" : "linear-gradient(135deg,#2d6a4f,#1a3a24)",
                border: "none", borderRadius: 10, padding: "12px", fontSize: 15,
                boxShadow: "0 4px 14px #2d6a4f33" }}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
                : <><i className="bi bi-shield-check me-2" />Restablecer contraseña</>}
            </button>

            <button type="button" className="btn btn-link w-100 fw-semibold mt-1"
              style={{ color: "#4a7a5a", fontSize: 13 }}
              onClick={() => { reset(); setPaso(1); }}>
              <i className="bi bi-arrow-left me-1" />Cambiar correo o reenviar código
            </button>
          </form>
        )}

        <hr style={{ borderColor: "#e2f5ea", margin: "24px 0 16px" }} />
        <div className="text-center">
          <button type="button" className="btn btn-link fw-semibold"
            style={{ color: "#9ab5a0", fontSize: 13 }} onClick={() => navigate("/")}>
            <i className="bi bi-arrow-left me-1" />Volver al inicio de sesión
          </button>
        </div>

      </div>
    </div>
  );
}