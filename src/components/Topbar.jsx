export default function Topbar({ pts, setView }) {
  return (
    <nav className="navbar navbar-light bg-white border-bottom px-3 py-2">
      <div className="container-fluid gap-3">

        <a className="navbar-brand mb-0" href="#">
          <span className="fw-bold text-success">Recycling Points</span>
          <br />
          <small className="text-muted fw-normal">Recicla y gana</small>
        </a>

        <div className="d-flex align-items-center gap-2">
          <div className="rounded-circle bg-success-subtle border border-success d-flex align-items-center justify-content-center fw-bold text-success p-3">
            AG
          </div>
          <div>
            <p className="mb-0 fw-bold text-dark">¡Hola, Ana!</p>
            <p className="mb-0 text-muted small">Reciclador comprometido</p>
          </div>
        </div>

        <div className="input-group flex-grow-1 mx-2 w-25">
          <span className="input-group-text bg-light border">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input type="text" className="form-control bg-light" placeholder="Buscar..." />
        </div>

        <span className="badge bg-success-subtle text-success border border-success rounded-pill px-3 py-2 fs-6 fw-bold">
          <i className="bi bi-star-fill text-warning me-1"></i>
          {pts.toLocaleString()} pts
        </span>

        <div className="position-relative">
          <button className="btn btn-outline-secondary">
            <i className="bi bi-bell"></i>
          </button>
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark border border-white">
            3
          </span>
        </div>

        <div
          className="rounded-circle bg-success-subtle border border-success d-flex align-items-center justify-content-center fw-bold text-success p-3"
          role="button"
          onClick={() => setView("perfil")}
          title="Mi perfil"
        >
          AG
        </div>

      </div>
    </nav>
  );
}