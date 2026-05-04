import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarse } from "../services/api";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [terminos, setTerminos] = useState(false);
  const [origen, setOrigen] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validar = async () => {
    setError("");
    if (nombre.trim() === "") return setError("Nombre requerido");
    if (usuario.trim() === "") return setError("Usuario requerido");
    if (correo.trim() === "") return setError("Correo requerido");
    if (password.trim() === "") return setError("Contraseña requerida");
    if (confirmar.trim() === "") return setError("Confirmación requerida");

    if (!correo.includes("@") || !correo.includes(".com")) {
      return setError("Correo inválido");
    }

    if (password !== confirmar) {
      return setError("La contraseña no coincide");
    }

    if (!terminos) {
      return setError("Debes aceptar términos y condiciones");
    }

    if (origen.trim() === "") {
      return setError("Selecciona cómo te enteraste de nosotros");
    }

    setLoading(true);
    try {
      await registrarse({
        nombre:   nombre.trim(),
        correo:   correo.trim(),
        password: password,
        telefono: undefined,
      });
      navigate("/");
    } catch (err) {
      setError(err.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">

        {/* ESTE ES EL LADO ISQUIERDO  */}
        <div className="col-md-6 bg-light d-flex justify-content-center align-items-center p-5">
          <img
            src="/src/assets/imagenes/eco.png"
            alt="EcoRecicla"
            className="img-fluid"
          />
        </div>

        {/* LADO DERECHO*/}
        <div className="col-md-6 d-flex justify-content-center align-items-center">

          <div className="w-100 p-4">

            <ul className="bg-white text-dark p-3 rounded list-unstyled">

              <div className="text-center mb-2">
                <div className="d-inline-flex justify-content-center align-items-center rounded-circle bg-success bg-opacity-10 p-4">
                  <i className="bi bi-person fs-2 text-success"></i>
                </div>
                <div>
                  <i className="bi bi-leaf-fill text-success"></i>
                </div>
              </div>

              <h1 className="text-center text-dark">Crear cuenta</h1>
              <h2 className="text-center fw-light text-success fs-5">
                Es rápido y fácil
              </h2>

              <br />

              {error && (
                <div className="alert alert-danger py-2 text-center">{error}</div>
              )}

              {/* NOMBRE Y EL USUARIO */}
              <div className="d-flex justify-content-center gap-2">

                <li className="mb-2 w-50">
                  <label className="form-label text-dark">Nombre completo</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      className="form-control"
                      placeholder="Ingresa tu nombre completo"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                </li>

                <li className="mb-2 w-50">
                  <label className="form-label text-dark">Nombre de usuario</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-at"></i>
                    </span>
                    <input
                      className="form-control"
                      placeholder="elige tu nombre de usuario"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                    />
                  </div>
                </li>

              </div>

              {/* GMAIL PA VALIDAR  */}
              <li className="mb-2">
                <label className="form-label text-dark">Correo electrónico</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    className="form-control"
                    placeholder="correo electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </div>
              </li>

              {/* CONTRASEÑA Y CONFIRMARLA  */}
              <div className="d-flex justify-content-center gap-2">

                <li className="mb-2 w-50">
                  <label className="form-label text-dark">contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      className="form-control"
                      placeholder="crea una contraseña"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </li>

                <li className="mb-2 w-50">
                  <label className="form-label text-dark">confirmar contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      className="form-control"
                      placeholder="confirma tu contraseña"
                      type="password"
                      value={confirmar}
                      onChange={(e) => setConfirmar(e.target.value)}
                    />
                  </div>
                </li>

              </div>

              {/* CÓMO TE ENTERASTE  DE NOSOTROS */}
              <li className="mb-2">
                <label className="form-label text-dark">
                  ¿Cómo te enteraste de nosotros?
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-globe"></i>
                  </span>
                  <select
                    className="form-select"
                    value={origen}
                    onChange={(e) => setOrigen(e.target.value)}
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="redes">Redes sociales</option>
                    <option value="amigo">Amigo o familiar</option>
                    <option value="google">Google</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </li>

              {/* TERMINOS */}
              <li className="mb-2">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  checked={terminos}
                  onChange={(e) => setTerminos(e.target.checked)}
                />
                <span className="text-dark">
                  Acepto los términos y condiciones y la política de privacidad
                </span>
              </li>

            </ul>

            <div className="d-flex flex-column align-items-center">

              <button
                className="btn btn-warning text-white rounded-pill px-5 py-2 w-50"
                onClick={validar}
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Creando...</>
                ) : (
                  <>CREAR CUENTA <i className="bi bi-leaf-fill ms-2 text-white"></i></>
                )}
              </button>

              <br />

              <div className="d-flex align-items-center my-3 w-100">
                <div className="flex-grow-1 border-top border-2 border-dark"></div>
                <span className="px-3 fw-semibold text-dark">
                  O continúa con
                </span>
                <div className="flex-grow-1 border-top border-2 border-dark"></div>
              </div>

            </div>

            {/* GOOGLE FACEBOOK */}
            <div className="d-flex justify-content-center align-items-center gap-3">

              <button className="btn btn-light text-dark rounded-pill px-4 py-2">
                <i className="bi bi-google me-2 text-danger"></i>
                Google
              </button>

              <button className="btn btn-light text-dark rounded-pill px-4 py-2">
                <i className="bi bi-facebook me-2 text-primary"></i>
                Facebook
              </button>

            </div>

            <br />

            <div className="d-flex justify-content-center align-items-center gap-2">
              <span className="fw-light text-secondary">
                ¿ya tienes cuenta?
              </span>

              <a href="/login" className="text-decoration-none fw-bold text-success">
                Inicia sesión
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;
