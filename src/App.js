import { useReducer, useCallback, useState } from "react";
import { INITIAL_STATE } from "./constants/data";

import Sidebar        from "./components/Sidebar";
import Topbar         from "./components/Topbar";
import ToastContainer from "./components/ToastContainer";
import Dashboard      from "./components/Dashboard";
import Entregas       from "./components/Entregas";
import ClasificadorIA from "./components/ClasificadorIA";
import Recompensas    from "./components/Recompensas";
import MisPuntos      from "./components/MisPuntos";
import Mapa           from "./components/Mapa";
import ImpactoEco     from "./components/ImpactoEco";
import Usuarios       from "./components/Usuarios";
import Perfil         from "./components/Perfil";

// ── Reducer ───────────────────────────────────────────────────────────────────
function reducer(state, { type, payload }) {
  switch (type) {
    case "ADD_ENTREGA":
      return { ...state, entregas: [payload, ...state.entregas] };
    case "ADD_HISTORIAL":
      return { ...state, historial: [payload, ...state.historial] };
    case "ADD_PTS":
      return { ...state, pts: state.pts + payload };
    case "ADD_IA_HIST":
      return { ...state, iaHist: [payload, ...state.iaHist] };
    case "SET_IA_RESULT":
      return { ...state, iaResult: payload };
    case "ADD_USER":
      return { ...state, usuarios: [...state.usuarios, payload] };
    case "TOGGLE_USER":
      return { ...state, usuarios: state.usuarios.map(u => u.id === payload ? { ...u, activo: !u.activo } : u) };
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
  const remove = useCallback(id => setToasts(t => t.filter(x => x.id !== id)), []);
  return { toasts, showToast, remove };
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [view, setView]   = useState("dashboard");
  const { toasts, showToast, remove } = useToast();

  const shared = { state, dispatch, showToast, setView };

  const pages = {
    dashboard:  <Dashboard   {...shared} />,
    entregas:   <Entregas    {...shared} />,
    ia:         <ClasificadorIA {...shared} />,
    recompensas:<Recompensas {...shared} />,
    puntos:     <MisPuntos   state={state} />,
    mapa:       <Mapa        showToast={showToast} />,
    eco:        <ImpactoEco  state={state} />,
    usuarios:   <Usuarios    {...shared} />,
    perfil:     <Perfil      state={state} showToast={showToast} />,
  };

  return (
    <div className="app-shell">
      <Sidebar view={view} setView={setView} />
      <div className="main-content">
        <Topbar pts={state.pts} setView={setView} />
        <div className="page-area">
          {pages[view] || pages.dashboard}
        </div>
      </div>
      <ToastContainer toasts={toasts} remove={remove} />
    </div>
  );
}
//dfsf
