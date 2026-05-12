import { useReducer, useCallback, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { INITIAL_STATE } from "./constants/data";
import { cerrarSesion } from "./services/api";

import "./styles/panel.css";

import Login from "./components/Login";
import Registro from "./components/Registro";
import ForgotPassword from "./components/RecuperarContraseña";
import LandingPage from "./components/LandingPage";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ToastContainer from "./components/ToastContainer";

import Dashboard from "./components/Dashboard";

import ClasificadorIA from "./components/ClasificadorIA";
import Recompensas from "./components/Recompensas";
import MisPuntos from "./components/MisPuntos";
import Mapa from "./components/Mapa";
import ImpactoEco from "./components/ImpactoEco";

import Usuarios from "./components/Usuarios";
import Administradores from "./components/Administradores";
import Aliados from "./components/Aliados";
import Encargados from "./components/Encargados";
import Materiales from "./components/Materiales";
import Perfil from "./components/Perfil";

import CatRoles from "./components/catalogos/CatRoles";
import CatEstadosPuntos from "./components/catalogos/CatEstadosPuntos";
import CatEstadosAliados from "./components/catalogos/CatEstadosAliados";
import CatEstadosCanjes from "./components/catalogos/CatEstadosCanjes";
import CatEstadosUsuarios from "./components/catalogos/CatEstadosUsuarios";
import CatEstadosRecompensas from "./components/catalogos/CatEstadosRecompensas";
import CatTiposRecompensa from "./components/catalogos/CatTiposRecompensa";

import CatEstadosMateriales from "./components/catalogos/CatEstadosMateriales";
import CatEstadosEntregas from "./components/catalogos/CatEstadosEntregas";

function reducer(state, { type, payload }) {
  switch (type) {

    // ── Entregas / puntos ──
    case "ADD_ENTREGA":
      return { ...state, entregas: [payload, ...state.entregas] };

    case "ADD_HISTORIAL":
      return { ...state, historial: [payload, ...state.historial] };

    case "ADD_PTS":
      return { ...state, pts: state.pts + payload };

    case "SET_PTS":
      return { ...state, pts: payload };

    case "ADD_IA_HIST":
      return { ...state, iaHist: [payload, ...state.iaHist] };

    case "SET_IA_RESULT":
      return { ...state, iaResult: payload };

    // ── Usuarios ──
    case "SET_USUARIOS":
      return { ...state, usuarios: payload };

    case "SET_ADMINS":
      return {
        ...state,
        usuarios: [
          ...state.usuarios.filter(u => u.rol !== "Admin"),
          ...payload,
        ],
      };

    case "ADD_USER":
      return {
        ...state,
        usuarios: [...state.usuarios, payload],
      };

    case "UPDATE_USER":
      return {
        ...state,
        usuarios: state.usuarios.map(u =>
          u.id === payload.id ? payload : u
        ),
      };

    case "TOGGLE_USER":
      return {
        ...state,
        usuarios: state.usuarios.map(u =>
          u.id === payload
            ? { ...u, activo: !u.activo }
            : u
        ),
      };

    case "DEL_USER":
      return {
        ...state,
        usuarios: state.usuarios.filter(u => u.id !== payload),
      };

    // ── Aliados ──
    case "SET_ALIADOS":
      return { ...state, aliados: payload };

    case "ADD_ALIADO":
      return {
        ...state,
        aliados: [...(state.aliados || []), payload],
      };

    case "TOGGLE_ALIADO":
      return {
        ...state,
        aliados: (state.aliados || []).map(u =>
          u.id === payload
            ? { ...u, activo: !u.activo }
            : u
        ),
      };

    case "DEL_ALIADO":
      return {
        ...state,
        aliados: (state.aliados || []).filter(
          u => u.id !== payload
        ),
      };

    // ── Encargados ──
    case "SET_ENCARGADOS":
      return { ...state, encargados: payload };

    case "ADD_ENCARGADO":
      return {
        ...state,
        encargados: [payload, ...(state.encargados || [])],
      };

    case "UPDATE_ENCARGADO":
      return {
        ...state,
        encargados: (state.encargados || []).map(u =>
          u.id === payload.id ? payload : u
        ),
      };

    case "TOGGLE_ENCARGADO":
      return {
        ...state,
        encargados: (state.encargados || []).map(u =>
          u.id === payload
            ? { ...u, activo: !u.activo }
            : u
        ),
      };

    case "DEL_ENCARGADO":
      return {
        ...state,
        encargados: (state.encargados || []).filter(
          u => u.id !== payload
        ),
      };

    default:
      return state;
  }
}

function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((msg, type = "success") => {
    const id = Date.now();

    setToasts(t => [
      ...t,
      { id, msg, type },
    ]);
  }, []);

  const remove = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    remove,
  };
}

export default function App() {

  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [state, dispatch] = useReducer(
    reducer,
    INITIAL_STATE
  );

  const {
    toasts,
    showToast,
    remove,
  } = useToast();

  const handleLogin = (usuarioData) => {
    localStorage.setItem(
      "user",
      JSON.stringify(usuarioData)
    );

    setUser(usuarioData);

    navigate("/dashboard");
  };

  const handleLogout = async () => {

    try {
      await cerrarSesion();
    } catch (_) {}

    localStorage.removeItem("user");

    setUser(null);

    navigate("/");
  };

  // ───────── RUTAS PÚBLICAS ─────────
  if (!user) {
    return (
      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />

        <Route
          path="/registro"
          element={<Registro />}
        />

        <Route
          path="/forgot"
          element={<ForgotPassword />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    );
  }

  const shared = {
    state,
    dispatch,
    showToast,
    navigate,
    user,
  };

  // ───────── RUTAS PRIVADAS ─────────
  return (
    <div className="app-shell">

      <Sidebar
        user={user}
        onLogout={handleLogout}
      />

      <div className="main-content">

        <Topbar
          pts={state.pts}
          navigate={navigate}
          user={user}
          onLogout={handleLogout}
        />

        <div className="page-area">

          <Routes>

            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            <Route
              path="/dashboard"
              element={<Dashboard {...shared} />}
            />

            <Route
              path="/usuarios"
              element={<Usuarios {...shared} />}
            />

            <Route
              path="/administradores"
              element={<Administradores {...shared} />}
            />

            <Route
              path="/aliados"
              element={<Aliados {...shared} />}
            />

            <Route
              path="/encargados"
              element={<Encargados {...shared} />}
            />

            <Route
              path="/materiales"
              element={<Materiales {...shared} />}
            />

            <Route
              path="/ia"
              element={<ClasificadorIA {...shared} />}
            />

            <Route
              path="/recompensas"
              element={<Recompensas {...shared} />}
            />

            <Route
              path="/puntos"
              element={<MisPuntos state={state} />}
            />

            <Route
              path="/mapa"
              element={<Mapa showToast={showToast} />}
            />

            <Route
              path="/eco"
              element={<ImpactoEco state={state} />}
            />

            <Route
              path="/perfil"
              element={
                <Perfil
                  state={state}
                  showToast={showToast}
                  user={user}
                />
              }
            />

            {/* ── Catálogos ── */}

            <Route
              path="/catalogos/roles"
              element={<CatRoles {...shared} />}
            />

            <Route
              path="/catalogos/estados-puntos"
              element={<CatEstadosPuntos {...shared} />}
            />

            <Route
              path="/catalogos/estados-materiales"
              element={<CatEstadosMateriales {...shared} />}
            />

            <Route
              path="/catalogos/estados-entregas"
              element={<CatEstadosEntregas {...shared} />}
            />

            <Route
              path="/catalogos/estados-aliados"
              element={<CatEstadosAliados {...shared} />}
            />

            <Route
              path="/catalogos/estados-canjes"
              element={<CatEstadosCanjes {...shared} />}
            />

            <Route
              path="/catalogos/estados-usuarios"
              element={<CatEstadosUsuarios {...shared} />}
            />

            <Route
              path="/catalogos/estados-recompensas"
              element={<CatEstadosRecompensas {...shared} />}
            />

            <Route
              path="/catalogos/tipos-recompensa"
              element={<CatTiposRecompensa {...shared} />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

          </Routes>

        </div>
      </div>

      <ToastContainer
        toasts={toasts}
        remove={remove}
      />

    </div>
  );
}