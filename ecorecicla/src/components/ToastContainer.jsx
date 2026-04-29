import { useEffect } from "react";
import { G, Y, YD } from "../constants/data";

// ── Toast individual ──────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  const bg = type === "error" ? "#991b1b" : type === "warning" ? YD : G;

  return (
    <div
      className="tin"
      style={{
        background: bg, color: "#fff",
        padding: "10px 18px", borderRadius: 10,
        fontSize: 13, fontWeight: 700,
        boxShadow: "0 4px 16px rgba(0,0,0,.18)",
        maxWidth: 280,
      }}
    >
      {msg}
    </div>
  );
}

// ── Contenedor de toasts ──────────────────────────────────────────────────────
export default function ToastContainer({ toasts, remove }) {
  return (
    <div
      style={{
        position: "fixed", bottom: 24, right: 24,
        zIndex: 9999, display: "flex", flexDirection: "column", gap: 8,
      }}
    >
      {toasts.map(t => (
        <Toast key={t.id} msg={t.msg} type={t.type} onDone={() => remove(t.id)} />
      ))}
    </div>
  );
}
