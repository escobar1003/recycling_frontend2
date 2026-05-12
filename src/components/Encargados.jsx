import { useEffect, useState } from "react";
import {
  getEncargados,
  crearEncargado,
  actualizarEncargado,
  eliminarEncargado,
  getEntregasAdmin,
  actualizarEstadoEntregaAdmin,
} from "../services/api";

const EMPTY_FORM = {
  nombre: "",
  email: "",
  telefono: "",
  rol: "Encargado",
  zona: "",
  puntoAsignado: "",
  activo: true,
};

export default function Encargados({
  state,
  dispatch,
  showToast,
}) {

  // =========================
  // STATES
  // =========================
  const [tab, setTab] = useState("encargados");
  const [modal, setModal] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const [search, setSearch] = useState("");

  const [viewUser, setViewUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [entregas, setEntregas] = useState([]);
  const [loadingEntregas, setLoadingEntregas] =
    useState(false);

  // =========================
  // CARGAR ENCARGADOS
  // =========================
  useEffect(() => {
    getEncargados()
      .then((data) => {

        const lista = (data.encargados ?? []).map(
          (u) => ({
            id: u.idEncargado,

            nombre: u.nombre || "",

            email: u.correo || "",

            telefono: u.telefono || "",

            rol: "Encargado",

            zona: u.zona || "",

            puntoAsignado:
              u.puntoAsignado || "",

            pts: 0,

            activo: u.idEstado === 1,

            av: (u.nombre || "")
              .trim()
              .split(" ")
              .slice(0, 2)
              .map(
                (w) =>
                  w?.[0]?.toUpperCase() || ""
              )
              .join(""),

            fechaAlta: u.fechaRegistro
              ? new Date(
                  u.fechaRegistro
                ).toLocaleDateString("es-CO")
              : "—",
          })
        );

        dispatch({
          type: "SET_ENCARGADOS",
          payload: lista,
        });
      })

      .catch((err) => {
        console.log(err);

        showToast(
          "No se pudieron cargar los encargados",
          "error"
        );
      })

      .finally(() => {
        setLoading(false);
      });

  }, []);

  // =========================
  // CARGAR ENTREGAS
  // =========================
  useEffect(() => {

    if (tab !== "entregas") return;

    setLoadingEntregas(true);

    getEntregasAdmin()

      .then((data) => {
        setEntregas(data.entregas || []);
      })

      .catch(() => {
        showToast(
          "No se pudieron cargar las entregas",
          "error"
        );
      })

      .finally(() => {
        setLoadingEntregas(false);
      });

  }, [tab]);

  // =========================
  // HELPERS
  // =========================
  const encargados = state?.encargados || [];

  const set = (key, value) => {

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  // =========================
  // VALIDAR
  // =========================
  const validate = () => {

    const e = {};

    if (!form.nombre?.trim()) {
      e.nombre = "El nombre es obligatorio";
    }

    if (!form.email?.trim()) {

      e.email = "El correo es obligatorio";

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
        form.email
      )
    ) {

      e.email = "Correo inválido";

    } else if (
      encargados.some(
        (u) =>
          u.email === form.email.trim()
      )
    ) {

      e.email = "Este correo ya existe";
    }

    if (!form.telefono?.trim()) {

      e.telefono =
        "El teléfono es obligatorio";

    } else if (
      !/^\d{10}$/.test(
        form.telefono.trim()
      )
    ) {

      e.telefono =
        "El teléfono debe tener 10 dígitos";
    }

    return e;
  };

  // =========================
  // GUARDAR
  // =========================
  const guardar = async () => {

    const e = validate();

    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    try {

      const resp = await crearEncargado({
        nombre: form.nombre.trim(),
        correo: form.email.trim(),
        telefono: form.telefono.trim(),
        zona: form.zona,
        puntoAsignado:
          form.puntoAsignado,
      });

      dispatch({
        type: "ADD_ENCARGADO",

        payload: {
          id:
            resp?.encargado?.idEncargado ||
            Date.now(),

          nombre: form.nombre,

          email: form.email,

          telefono: form.telefono,

          rol: "Encargado",

          zona: form.zona,

          puntoAsignado:
            form.puntoAsignado,

          activo: true,

          pts: 0,

          av: form.nombre
            .split(" ")
            .slice(0, 2)
            .map(
              (w) =>
                w?.[0]?.toUpperCase() || ""
            )
            .join(""),

          fechaAlta:
            new Date().toLocaleDateString(
              "es-CO"
            ),
        },
      });

      showToast(
        "Encargado creado correctamente"
      );

      setModal(false);

      setForm(EMPTY_FORM);

      setErrors({});

    } catch (err) {

      showToast(
        err.message,
        "error"
      );
    }
  };

  // =========================
  // ELIMINAR
  // =========================
  const handleEliminar = async (id) => {

    try {

      await eliminarEncargado(id);

      dispatch({
        type: "DEL_ENCARGADO",
        payload: id,
      });

      showToast(
        "Encargado eliminado"
      );

    } catch (err) {

      showToast(
        err.message,
        "error"
      );
    }
  };

  // =========================
  // TOGGLE
  // =========================
  const handleToggle = async (
    id,
    nombre,
    estadoActual
  ) => {

    try {

      await actualizarEncargado(id, {
        idEstado: estadoActual ? 2 : 1,
      });

      dispatch({
        type: "TOGGLE_ENCARGADO",
        payload: id,
      });

      showToast(
        estadoActual
          ? "Encargado desactivado"
          : "Encargado activado"
      );

    } catch (err) {

      showToast(
        err.message,
        "error"
      );
    }
  };

  // =========================
  // FILTRO
  // =========================
  const filtered = encargados.filter(
    (u) => {

      const q = search.toLowerCase();

      return (
        (u.nombre || "")
          .toLowerCase()
          .includes(q) ||

        (u.email || "")
          .toLowerCase()
          .includes(q) ||

        (u.zona || "")
          .toLowerCase()
          .includes(q)
      );
    }
  );

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="p-4">
        Cargando encargados...
      </div>
    );
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div className="panel-page">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >

        <div>
          <h2>Encargados</h2>

          <p>
            {filtered.length} registrados
          </p>
        </div>

        <button
          className="btn-panel primary"
          onClick={() => setModal(true)}
        >
          Nuevo encargado
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="input-panel"
        style={{
          marginBottom: 20,
          width: "100%",
        }}
      />

      <div className="table-responsive">

        <table className="table">

          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Zona</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((u) => (
              <tr key={u.id}>

                <td>{u.nombre}</td>

                <td>{u.email}</td>

                <td>{u.telefono}</td>

                <td>{u.zona}</td>

                <td>
                  {u.activo
                    ? "Activo"
                    : "Inactivo"}
                </td>

                <td>

                  <button
                    onClick={() =>
                      handleToggle(
                        u.id,
                        u.nombre,
                        u.activo
                      )
                    }
                  >
                    Toggle
                  </button>

                  <button
                    onClick={() =>
                      handleEliminar(u.id)
                    }
                  >
                    Eliminar
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}