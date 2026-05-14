// src/components/Av.jsx
export default function Av({ text, size = 36, bg = "#198754", color = "#fff", style = {} }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: size * 0.38,
        flexShrink: 0,
        border: "2px solid #000",
        ...style,
      }}
    >
      {text}
    </div>
  );
}

