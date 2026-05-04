export default function Topbar({ navigate }) {
  return (
    <nav className="navbar bg-white border-bottom px-3 py-2" style={{ borderBottom: "2px solid #16a34a" }}>
      <div className="container-fluid gap-3">

        <a className="navbar-brand mb-0" href="#">
          <span className="fw-bold text-success fs-5">Recycling Points</span>
          <br />
          <small className="text-muted fw-normal" style={{ fontSize: 11 }}>Recicla y gana</small>
        </a>

        <div className="input-group flex-grow-1 mx-2" style={{ maxWidth: 400 }}>
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 bg-white"
            placeholder="Buscar..."
          />
        </div>

        <div className="position-relative">
          <button
            className="btn btn-white border"
            style={{ color: "#16a34a", borderColor: "#16a34a" }}
          >
            <i className="bi bi-bell-fill"></i>
          </button>
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill border border-white"
            style={{ background: "#facc15", color: "#111111", fontSize: 10 }}
          >
            3
          </span>
        </div>

        <div
          className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
          style={{ width: 38, height: 38, background: "#16a34a", fontSize: 14, cursor: "pointer" }}
          onClick={() => navigate("/perfil")}
          title="Mi perfil"
        >
          AG
        </div>

      </div>
    </nav>
  );
}