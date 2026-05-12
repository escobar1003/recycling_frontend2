import { useEffect } from "react";
import { ZONAS, ALL_POINTS } from "../constants/data";
import { Toggle, rolDesc, ModalDetalle, TablaUsuarios } from "./UserShared";
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

  // Gestión encargados
  tab,
  setTab,
  modal,
  setModal,
  form,
  setForm,
  errors,
  setErrors,
  search,
  setSearch,
  viewUser,
  setViewUser,
  loading,
  setLoading,

  // Entregas
  entregas,
  setEntregas,
  loadingEntregas,
  setLoadingEntregas,
}) {

  // ─────────────────────────────
  // CARGAR ENCARGADOS
  // ─────────────────────────────
  useEffect(() => {
    getEncargados()
      .then((data) => {
        const lista = (data.encargados ?? []).map((u) => ({
          id: u.idEncargado,
          nombre: u.nombre,
          email: u.correo,
          telefono: u.telefono ?? "",
          rol: "Encargado",
          zona: u.zona ?? "",
          puntoAsignado: u.puntoAsignado ?? "",
          pts: 0,
          activo: u.idEstado === 1,

          av: (u.nombre ?? "")
            .trim()
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0]?.toUpperCase() ?? "")
            .join(""),

          fechaAlta: u.fechaRegistro
            ? new Date(u.fechaRegistro).toLocaleDateString("es-CO")
            : "—",
        }));

        dispatch({
          type: "SET_ENCARGADOS",
          payload: lista,
        });
      })
      .catch(() => {
        showToast("No se pudieron cargar los encargados", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ─────────────────────────────
  // CARGAR ENTREGAS
  // ─────────────────────────────
  useEffect(() => {
    if (tab !== "entregas") return;

    setLoadingEntregas(true);

    getEntregasAdmin()
      .then((data) => {
        setEntregas(data.entregas ?? []);
      })
      .catch(() => {
        showToast("No se pudieron cargar las entregas", "error");
      })
      .finally(() => {
        setLoadingEntregas(false);
      });
  }, [tab]);

  // ─────────────────────────────
  // HELPERS
  // ─────────────────────────────
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

  const encargados = state.encargados || [];

  // ─────────────────────────────
  // VALIDAR FORMULARIO
  // ─────────────────────────────
  const validate = () => {
    const e = {};

    if (!form.nombre.trim()) {
      e.nombre = "El nombre es obligatorio";
    }

    if (!form.email.trim()) {
      e.email = "El correo es obligatorio";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)
    ) {
      e.email = "Correo inválido";
    } else if (
      encargados.some(
        (u) => u.email === form.email.trim()
      )
    ) {
      e.email = "Este correo ya existe";
    }

    if (!form.telefono.trim()) {
      e.telefono = "El teléfono es obligatorio";
    } else if (
      !/^\d{10}$/.test(form.telefono.trim())
    ) {
      e.telefono =
        "El teléfono debe tener exactamente 10 dígitos";
    }

    return e;
  };

  // ─────────────────────────────
  // GUARDAR ENCARGADO
  // ─────────────────────────────
  const guardar = async () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {
      const resp = await crearEncargado({
        nombre: form.nombre.trim(),
        correo: form.email.trim(),
        telefono: form.telefono.trim(),
        zona: form.zona || undefined,
        puntoAsignado:
          form.puntoAsignado || undefined,
      });

      const initials = form.nombre
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("");

      dispatch({
        type: "ADD_ENCARGADO",
        payload: {
          id:
            resp.encargado?.idEncargado ??
            Date.now(),

          nombre: form.nombre.trim(),
          email: form.email.trim(),
          telefono: form.telefono.trim(),
          rol: "Encargado",
          zona: form.zona,
          puntoAsignado: form.puntoAsignado,
          pts: 0,
          activo: true,
          av: initials,

          fechaAlta:
            new Date().toLocaleDateString("es-CO"),
        },
      });

      showToast(
        `Encargado "${form.nombre.trim()}" registrado`
      );

      setModal(false);
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      showToast(
        "Error al registrar encargado: " +
          err.message,
        "error"
      );
    }
  };

  // ─────────────────────────────
  // CERRAR MODAL
  // ─────────────────────────────
  const cerrarModal = () => {
    setModal(false);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  // ─────────────────────────────
  // ACTIVAR / DESACTIVAR
  // ─────────────────────────────
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
          ? `${nombre} ha sido desactivado`
          : `${nombre} ha sido activado`,
        estadoActual ? "error" : "success"
      );
    } catch (err) {
      showToast(
        "Error al cambiar estado: " +
          err.message,
        "error"
      );
    }
  };

  // ─────────────────────────────
  // GUARDAR CAMBIOS
  // ─────────────────────────────
  const handleSave = (u) => {
    dispatch({
      type: "UPDATE_ENCARGADO",
      payload: u,
    });
  };

  // ─────────────────────────────
  // ELIMINAR
  // ─────────────────────────────
  const handleEliminar = async (id) => {
    try {
      await eliminarEncargado(id);

      dispatch({
        type: "DEL_ENCARGADO",
        payload: id,
      });

      showToast(
        "Encargado eliminado",
        "error"
      );

      if (viewUser?.id === id) {
        setViewUser(null);
      }
    } catch (err) {
      showToast(
        "Error al eliminar: " + err.message,
        "error"
      );
    }
  };

  // ─────────────────────────────
  // CAMBIAR ESTADO ENTREGA
  // ─────────────────────────────
  const handleCambiarEstado = async (
    entrega
  ) => {

    const nuevoEstado =
      entrega.idEstadoEntrega === 1
        ? 2
        : 1;

    try {
      await actualizarEstadoEntregaAdmin(
        entrega.idEntrega,
        nuevoEstado
      );

      setEntregas((prev) =>
        prev.map((e) =>
          e.idEntrega === entrega.idEntrega
            ? {
                ...e,
                idEstadoEntrega: nuevoEstado,

                estadoEntrega: {
                  ...e.estadoEntrega,
                  nombre:
                    nuevoEstado === 2
                      ? "Validada"
                      : "Pendiente",
                },
              }
            : e
        )
      );

      showToast(
        nuevoEstado === 2
          ? "Entrega validada"
          : "Entrega marcada como pendiente",
        "success"
      );
    } catch (err) {
      showToast(
        "Error al cambiar estado: " +
          err.message,
        "error"
      );
    }
  };

  // ─────────────────────────────
  // FILTRAR
  // ─────────────────────────────
  const filtered = encargados.filter((u) => {
    const q = search.toLowerCase();

    return (
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.zona || "")
        .toLowerCase()
        .includes(q) ||
      (u.puntoAsignado || "")
        .toLowerCase()
        .includes(q)
    );
  });

  // ─────────────────────────────
  // AVATAR
  // ─────────────────────────────
  const avatarPreview =
    form.nombre
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || "")
      .join("") || "?";

  return (
    <div className="panel-page">

      {/* ENCABEZADO */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <div>
          <h4 className="panel-title">
            <i
              className="bi bi-shop"
              style={{
                color: "var(--verde)",
                marginRight: 8,
              }}
            ></i>

            Encargados
          </h4>

          <span className="panel-subtitle">
            {encargados.length} encargado
            {encargados.length !== 1 ? "s" : ""}
            {" "}registrado
            {encargados.length !== 1 ? "s" : ""}
          </span>
        </div>

        {tab === "encargados" && (
          <button
            className="btn-panel primary"
            onClick={() => setModal(true)}
          >
            <i className="bi bi-person-badge"></i>

            Nuevo encargado
          </button>
        )}
      </div>

    </div>
  );
}