import { G, GL, Y } from "../constants/data";

export default function Topbar({ pts, setView }) {
  return (
    <header className="eco-topbar">
      {/* Marca */}
      <div style={{ minWidth: 140 }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: G, letterSpacing: "-.3px" }}>
          Recycling Points
        </div>
        <div style={{ fontSize: 11, color: "#9ca3af" }}>Recicla y gana</div>
      </div>

      {/* Avatar + saludo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 38, height: 38, borderRadius: "50%",
            background: GL, border: `2px solid ${G}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 13, color: G, flexShrink: 0,
          }}
        >
          AG
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1f2937" }}>¡Hola, Ana! 🌿</div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>Reciclador comprometido</div>
        </div>
      </div>

      {/* Buscador */}
      <div style={{ flex: 1, maxWidth: 400, position: "relative" }}>
        <span
          style={{
            position: "absolute", left: 11, top: "50%",
            transform: "translateY(-50%)", fontSize: 14, color: "#9ca3af",
          }}
        >
          🔍
        </span>
        <input
          type="text"
          placeholder="Buscar..."
          style={{
            width: "100%", padding: "8px 12px 8px 34px",
            border: "1px solid #e5e7eb", borderRadius: 24,
            fontSize: 13, background: "#f9fafb", outline: "none",
          }}
        />
      </div>

      {/* Acciones derecha */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        {/* Puntos */}
        <div
          style={{
            background: GL, borderRadius: 20, padding: "5px 14px",
            fontSize: 13, fontWeight: 700, color: G,
            display: "flex", alignItems: "center", gap: 5,
          }}
        >
          ⭐ <span>{pts.toLocaleString()}</span> pts
        </div>

        {/* Notificaciones */}
        <button
          style={{
            width: 38, height: 38, borderRadius: 10,
            border: "1px solid #e5e7eb", background: "#fff",
            fontSize: 17, position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          🔔
          <span
            style={{
              position: "absolute", top: -4, right: -4,
              background: Y, color: "#1f2937",
              fontSize: 9, fontWeight: 800,
              width: 17, height: 17, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid #fff",
            }}
          >
            3
          </span>
        </button>

        {/* Avatar perfil */}
        <div
          onClick={() => setView("perfil")}
          style={{
            width: 38, height: 38, borderRadius: "50%",
            background: GL, border: `2px solid ${G}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 13, color: G, cursor: "pointer",
          }}
          title="Mi perfil"
        >
          AG
        </div>
      </div>
    </header>
  );
}
