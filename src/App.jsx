import { useReducer, useCallback, useState } from "react";
import { INITIAL_STATE } from "./constants/data";

import Sidebar           from "./components/Sidebar";
import Topbar            from "./components/Topbar";
import ToastContainer    from "./components/ToastContainer";
import Dashboard         from "./components/Dashboard";
import Entregas          from "./components/Entregas";
import ClasificadorIA    from "./components/ClasificadorIA";
import Recompensas       from "./components/Recompensas";
import MisPuntos         from "./components/MisPuntos";
import Mapa              from "./components/Mapa";
import ImpactoEco        from "./components/ImpactoEco";
import Usuarios          from "./components/Usuarios";
import Administradores   from "./components/Administradores";
import Afiliados         from "./components/Afiliados";
import Perfil            from "./components/Perfil";

// ── Reducer ───────────────────────────────────────────────────────────────────
function reducer(state, { type, payload }) {
  switch (type) {

    // ── Entregas ──────────────────────────────────────────────────────────────
    case "ADD_ENTREGA":
      return { ...state, entregas: [payload, ...state.entregas] };
    case "EDIT_ENTREGA":
      return { ...state, entregas: state.entregas.map(e => e.id === payload.id ? { ...e, ...payload } : e) };
    case "DELETE_ENTREGA":
      return { ...state, entregas: state.entregas.filter(e => e.id !== payload) };
    case "TOGGLE_ESTADO_ENTREGA":
      return { ...state, entregas: state.entregas.map(e => e.id === payload.id ? { ...e, estado: payload.estado } : e) };

    // ── Historial / Puntos ────────────────────────────────────────────────────
    case "ADD_HISTORIAL":
      return { ...state, historial: [payload, ...state.historial] };
    case "ADD_PTS":
      return { ...state, pts: state.pts + payload };

    // ── IA ────────────────────────────────────────────────────────────────────
    case "ADD_IA_HIST":
      return { ...state, iaHist: [payload, ...state.iaHist] };
    case "SET_IA_RESULT":
      return { ...state, iaResult: payload };

    // ── Usuarios ──────────────────────────────────────────────────────────────
    case "ADD_USER":
      return { ...state, usuarios: [...state.usuarios, payload] };
    case "TOGGLE_USER":
      return { ...state, usuarios: state.usuarios.map(u => u.id === payload ? { ...u, activo: !u.activo } : u) };
    case "DEL_USER":
      return { ...state, usuarios: state.usuarios.filter(u => u.id !== payload) };

    // ── Recompensas ───────────────────────────────────────────────────────────
    case "ADD_REWARD":
      return { ...state, rewards: [...state.rewards, payload] };
    case "EDIT_REWARD":
      return { ...state, rewards: state.rewards.map(r => r.id === payload.id ? { ...r, ...payload } : r) };
    case "DELETE_REWARD":
      return { ...state, rewards: state.rewards.filter(r => r.id !== payload) };
    case "TOGGLE_ACTIVO_REWARD":
      return { ...state, rewards: state.rewards.map(r => r.id === payload ? { ...r, activo: !r.activo } : r) };

    default:
      return state;
  }
}

// ── Toast hook ────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
  }, []);
  const remove = useCallback(
    id => setToasts(t => t.filter(x => x.id !== id)),
    []
  );
  return { toasts, showToast, remove };
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [view, setView]   = useState("dashboard");
  const { toasts, showToast, remove } = useToast();

  const shared = { state, dispatch, showToast, setView };

  const pages = {
    dashboard:   <Dashboard      {...shared} />,
    entregas:    <Entregas       {...shared} />,
    ia:          <ClasificadorIA {...shared} />,
    recompensas: <Recompensas    {...shared} />,
    puntos:      <MisPuntos      state={state} />,
    mapa:        <Mapa           showToast={showToast} />,
    eco:         <ImpactoEco     state={state} />,
    usuarios:    <Usuarios       {...shared} />,
    admins:      <Administradores {...shared} />,
    afiliados:   <Afiliados      {...shared} />,
    perfil:      <Perfil         state={state} showToast={showToast} />,
  };

  return (
    <div className="app-shell">
      <Sidebar view={view} setView={setView} />
      <div className="main-content">
        <Topbar pts={state.pts} setView={setView} />
        <div className="page-area">
          {pages[view] ?? pages.dashboard}
        </div>
      </div>
      <ToastContainer toasts={toasts} remove={remove} />
    </div>
  );
}