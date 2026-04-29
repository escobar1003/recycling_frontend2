import { useState, useRef } from "react";
import { G, GL, Y, MAT_ICONS } from "../constants/data";

export default function ClasificadorIA({ state, dispatch, showToast }) {
  const [preview, setPreview] = useState(null);
  const [b64, setB64]         = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const fileRef               = useRef();
  const dropRef               = useRef();

  const handleFile = (file) => {
    if (!file?.type.startsWith("image/")) { showToast("❌ Solo imágenes", "error"); return; }
    const reader = new FileReader();
    reader.onload = e => {
      setB64(e.target.result.split(",")[1]);
      setPreview(e.target.result);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const clasificar = async () => {
    if (!b64) { showToast("❌ Sube una imagen primero", "error"); return; }
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Eres un experto clasificador de residuos. Analiza la imagen y responde SOLO con JSON válido sin markdown:
{"material":"Plástico (PET)|Cartón|Vidrio|Aluminio|Papel|Tetrapack|Electrónicos|Metal|Orgánico|Tela|Mixto","confianza":0-100,"caneca":"nombre caneca","descripcion":"máx 80 chars","reciclable":true,"consejo":"máx 80 chars"}`,
          messages: [{ role: "user", content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } },
            { type: "text", text: "Clasifica este residuo." },
          ]}],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      const icon = MAT_ICONS[parsed.material] || "♻️";
      const r = { id: Date.now(), material: parsed.material, confianza: parsed.confianza, caneca: parsed.caneca, fecha: new Date().toISOString().split("T")[0], icon };
      setResult({ ...parsed, icon });
      dispatch({ type: "ADD_IA_HIST",   payload: r });
      dispatch({ type: "SET_IA_RESULT", payload: r });
      showToast(`🤖 ${parsed.material} (${parsed.confianza}%)`);
    } catch {
      showToast("❌ Error al clasificar", "error");
    } finally {
      setLoading(false);
    }
  };

  const confColor = result ? (result.confianza > 85 ? G : result.confianza > 60 ? Y : "#ef4444") : G;

  return (
    <div>
      <h4 className="page-title">🤖 Clasificador IA de residuos</h4>

      <div className="row g-3">
        {/* ── Zona de carga ──────────────────────────────────────────────────── */}
        <div className="col-md-4">
          <div className="eco-card">
            <div
              ref={dropRef}
              className="rounded-3 text-center p-4"
              style={{ border: "2px dashed #d1d5db", cursor: "pointer", background: "#f9fafb" }}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); dropRef.current.style.borderColor = G; dropRef.current.style.background = GL; }}
              onDragLeave={() => { dropRef.current.style.borderColor = "#d1d5db"; dropRef.current.style.background = "#f9fafb"; }}
              onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
            >
              <div style={{ fontSize: 44, marginBottom: 10 }}>📷</div>
              <div style={{ fontWeight: 700, color: "#4b5563", fontSize: 14 }}>Arrastra o haz clic</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>JPG, PNG, WEBP — máx. 5MB</div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
              <button className="btn btn-eco-primary btn-sm rounded-3 mt-3" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>
                Seleccionar imagen
              </button>
            </div>

            {preview && (
              <div className="mt-3">
                <img src={preview} alt="preview" className="img-fluid rounded-3 border" style={{ maxHeight: 200, objectFit: "contain", width: "100%" }} />
                <button className="btn btn-eco-primary w-100 rounded-3 mt-2" onClick={clasificar} disabled={loading}>
                  {loading ? "⏳ Analizando..." : "🔍 Clasificar residuo"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Resultado + historial ──────────────────────────────────────────── */}
        <div className="col-md-8 d-flex flex-column gap-3">
          {/* Resultado */}
          <div className="eco-card flex-fill d-flex align-items-center justify-content-center" style={{ minHeight: 200 }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spin" style={{ width: 40, height: 40, border: `3px solid ${GL}`, borderTopColor: G, borderRadius: "50%", margin: "0 auto 12px" }} />
                <p style={{ fontSize: 14, color: "#6b7280" }}>Analizando con IA...</p>
              </div>
            ) : result ? (
              <div className="w-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{ fontSize: 52 }}>{result.icon}</div>
                  <div>
                    <span className="eco-badge eco-badge-success">{result.material}</span>
                    <div className="mt-2">
                      <span className="eco-badge" style={{ background: result.reciclable ? "#dcfce7" : "#fee2e2", color: result.reciclable ? "#166534" : "#991b1b" }}>
                        {result.reciclable ? "✅ Reciclable" : "❌ No reciclable"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: 12, color: "#4b5563" }}>
                    <span>Confianza</span><strong>{result.confianza}%</strong>
                  </div>
                  <div className="progress" style={{ height: 8, borderRadius: 4 }}>
                    <div className="progress-bar" style={{ width: `${result.confianza}%`, background: confColor, transition: "width .6s" }} />
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>Caneca recomendada</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: G }}>🗑️ {result.caneca}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>Material</div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{result.material}</div>
                    </div>
                  </div>
                </div>

                {result.descripcion && (
                  <div style={{ background: GL, borderRadius: 8, padding: "10px 12px", fontSize: 12, color: G, marginBottom: 8 }}>🌿 {result.descripcion}</div>
                )}
                {result.consejo && (
                  <div style={{ background: "#fef9c3", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#854d0e" }}>💡 {result.consejo}</div>
                )}
              </div>
            ) : (
              <div className="text-center py-5" style={{ color: "#9ca3af" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>🔍</div>
                <p style={{ fontSize: 14 }}>Sube una imagen para analizar el residuo</p>
              </div>
            )}
          </div>

          {/* Historial IA */}
          <div className="eco-card">
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🕐 Historial de clasificaciones</div>
            {state.iaHist.length === 0 ? (
              <div className="text-center" style={{ color: "#9ca3af", fontSize: 13, padding: "12px 0" }}>Sin clasificaciones</div>
            ) : state.iaHist.slice(0, 5).map(h => (
              <div key={h.id} className="d-flex align-items-center gap-2 py-2 border-bottom">
                <span style={{ fontSize: 22 }}>{h.icon}</span>
                <div className="flex-fill">
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{h.material}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{h.caneca} · {h.fecha}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: h.confianza > 85 ? G : "#c79a0f" }}>{h.confianza}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
