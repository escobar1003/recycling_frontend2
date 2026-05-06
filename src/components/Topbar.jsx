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
        </div>

        <div className="position-relative d-inline-block">
          <div className="d-flex align-items-start justify-content-end gap-2">
            
            <div className="position-relative d-inline-block">
              <div className="d-flex align-items-start justify-content-end gap-2">
                
                <div
                  className="rounded-circle bg-success-subtle border border-success d-flex align-items-center justify-content-center fw-bold text-success p-3"
                  role="button"
                  onClick={() => setView("perfil")}
                  title="Mi perfil"
                >
                  AG
                </div>

                <div className="position-relative">
                  <button className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-3">
                    <i className="bi bi-bell"></i>
                  </button>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark border border-white">
                    3
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </nav>
  );
}