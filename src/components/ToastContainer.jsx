import { useEffect } from "react";

// ── Toast individual ──────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  const bgClass =
    type === "error"   ? "bg-danger"  :
    type === "warning" ? "bg-warning" :
    "bg-success";

  const textClass = type === "warning" ? "text-dark" : "text-white";

  return (
    <div
      className={`${bgClass} ${textClass} rounded-3 px-3 py-2 fw-bold shadow`}
      style={{ fontSize: 13, maxWidth: 280 }}
    >
      {msg}
    </div>
  );
}

// ── Contenedor de toasts ──────────────────────────────────────────────────────
export default function ToastContainer({ toasts, remove }) {
  return (
    <div
      className="position-fixed bottom-0 end-0 p-4 d-flex flex-column gap-2"
      style={{ zIndex: 9999 }}
    >
      {toasts.map(t => (
        <Toast key={t.id} msg={t.msg} type={t.type} onDone={() => remove(t.id)} />
      ))}
    </div>
  );
}