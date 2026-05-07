import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ pts, setView }) {
  const [foto, setFoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔥 Cargar imagen guardada al recargar
    const savedFoto = localStorage.getItem("perfilFoto");
    if (savedFoto) setFoto(savedFoto);

    // 🔥 Escuchar cambios desde Perfil
    const handler = (e) => {
      setFoto(e.detail);
      localStorage.setItem("perfilFoto", e.detail);
    };

    window.addEventListener("perfilFoto", handler);
    return () => window.removeEventListener("perfilFoto", handler);
  }, []);

  return (
    <nav className="navbar navbar-light bg-white border-bottom px-3 py-2">
      <div className="container-fluid gap-3">

        <a className="navbar-brand mb-0" href="#">
          <span className="fw-bold text-success">Recycling Points</span>
          <br />
          <small className="text-muted fw-normal">Recicla y gana</small>
        </a>

        <div className="d-flex align-items-center gap-2"></div>

        <div className="position-relative d-inline-block">
          <div className="d-flex align-items-center justify-content-end gap-2">

            {/* PERFIL */}
            <div
              className="rounded-circle bg-success-subtle border border-success d-flex align-items-center justify-content-center fw-bold text-success"
              role="button"
              onClick={() => navigate("/perfil")}
              title="Mi perfil"
              style={{ width: 42, height: 42 }}
            >
              {foto ? (
                <img
                  src={foto}
                  alt="perfil"
                  className="rounded-circle"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                "AG"
              )}
            </div>

            {/* NOTIFICACIONES */}
            <div className="position-relative">
              <button
                className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 42, height: 42 }}
              >
                <i className="bi bi-bell"></i>
              </button>

              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark border border-white">
                3
              </span>
            </div>

          </div>
        </div>

      </div>
    </nav>
  );
}