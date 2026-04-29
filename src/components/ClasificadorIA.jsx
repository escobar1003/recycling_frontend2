import { useState, useRef } from "react";

const MAT_ICONS = {
  "Plástico (PET)": "🧴",
  "Cartón": "📦",
  "Vidrio": "🍾",
  "Aluminio": "🥫",
  "Papel": "📄",
  "Tetrapack": "🧃",
  "Electrónicos": "💻",
  "Metal": "🔩",
  "Orgánico": "🍃",
  "Tela": "👕",
  "Mixto": "🗑️",
};

export default function ClasificadorIA({ state, dispatch, showToast }) {
  const [preview, setPreview] = useState(null);
  const [b64, setB64]         = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef               = useRef();

  const handleFile = (file) => {
    if (!file?.type.startsWith("image/")) {
      showToast("❌ Solo imágenes", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
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
          messages: [
            {
              role: "user",
              content: [
                { type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } },
                { type: "text", text: "Clasifica este residuo." },
              ],
            },
          ],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((c) => c.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      const icon = MAT_ICONS[parsed.material] || "♻️";
      const r = {
        id: Date.now(),
        material: parsed.material,
        confianza: parsed.confianza,
        caneca: parsed.caneca,
        fecha: new Date().toISOString().split("T")[0],
        icon,
      };
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

  const confBg = result
    ? result.confianza > 85
      ? "bg-success"
      : result.confianza > 60
      ? "bg-warning"
      : "bg-danger"
    : "bg-success";

  return (
    <div className="container-fluid px-0">
      <h4 className="fw-bold mb-4">🤖 Clasificador IA de residuos</h4>

      <div className="row g-3">
        {/* ── Zona de carga ── */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">

              {/* Drop zone */}
              <div
                className={`border border-2 rounded-3 text-center p-4 ${
                  dragging ? "border-success bg-success-subtle" : "border-secondary-subtle bg-light"
                }`}
                style={{ borderStyle: "dashed", cursor: "pointer" }}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              >
                <div className="fs-1 mb-2">📷</div>
                <div className="fw-semibold text-secondary small">Arrastra o haz clic</div>
                <div className="text-muted" style={{ fontSize: 12 }}>JPG, PNG, WEBP — máx. 5MB</div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                <button
                  className="btn btn-success btn-sm rounded-3 mt-3"
                  onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                >
                  Seleccionar imagen
                </button>
              </div>

              {/* Preview */}
              {preview && (
                <div className="mt-3">
                  <img
                    src={preview}
                    alt="preview"
                    className="img-fluid rounded-3 border mb-2"
                    style={{ maxHeight: 200, objectFit: "contain", width: "100%" }}
                  />
                  <button
                    className="btn btn-success w-100 rounded-3"
                    onClick={clasificar}
                    disabled={loading}
                  >
                    {loading ? "⏳ Analizando..." : "🔍 Clasificar residuo"}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ── Resultado + historial ── */}
        <div className="col-md-8 d-flex flex-column gap-3">

          {/* Resultado */}
          <div className="card shadow-sm flex-fill">
            <div
              className="card-body d-flex align-items-center justify-content-center"
              style={{ minHeight: 220 }}
            >
              {loading ? (
                /* Loading */
                <div className="text-center py-4">
                  <div className="spinner-border text-success mb-3" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="small text-muted mb-0">Analizando con IA...</p>
                </div>
              ) : result ? (
                /* Resultado */
                <div className="w-100">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="fs-1">{result.icon}</div>
                    <div>
                      <span className="badge bg-success fs-6 px-3 py-2">{result.material}</span>
                      <div className="mt-2">
                        <span
                          className={`badge px-3 py-1 ${
                            result.reciclable
                              ? "bg-success-subtle text-success"
                              : "bg-danger-subtle text-danger"
                          }`}
                        >
                          {result.reciclable ? "✅ Reciclable" : "❌ No reciclable"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de confianza */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1 small text-secondary">
                      <span>Confianza</span>
                      <strong>{result.confianza}%</strong>
                    </div>
                    <div className="progress" style={{ height: 8, borderRadius: 4 }}>
                      <div
                        className={`progress-bar ${confBg}`}
                        role="progressbar"
                        style={{ width: `${result.confianza}%`, transition: "width .6s" }}
                        aria-valuenow={result.confianza}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  </div>

                  {/* Info cards */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-2">
                        <div className="text-muted" style={{ fontSize: 11 }}>Caneca recomendada</div>
                        <div className="fw-bold text-success small">🗑️ {result.caneca}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-2">
                        <div className="text-muted" style={{ fontSize: 11 }}>Material</div>
                        <div className="fw-bold small">{result.material}</div>
                      </div>
                    </div>
                  </div>

                  {result.descripcion && (
                    <div className="alert alert-success py-2 small mb-2">
                      🌿 {result.descripcion}
                    </div>
                  )}
                  {result.consejo && (
                    <div className="alert alert-warning py-2 small mb-0">
                      💡 {result.consejo}
                    </div>
                  )}
                </div>
              ) : (
                /* Vacío */
                <div className="text-center py-4 text-muted">
                  <div className="fs-1 mb-2">🔍</div>
                  <p className="small mb-0">Sube una imagen para analizar el residuo</p>
                </div>
              )}
            </div>
          </div>

          {/* Historial */}
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="fw-bold small mb-3">🕐 Historial de clasificaciones</div>

              {state.iaHist.length === 0 ? (
                <div className="text-center text-muted small py-2">Sin clasificaciones</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {state.iaHist.slice(0, 5).map((h) => (
                    <li
                      key={h.id}
                      className="list-group-item d-flex align-items-center gap-2 px-0 py-2"
                    >
                      <span className="fs-4">{h.icon}</span>
                      <div className="flex-fill">
                        <div className="fw-bold small">{h.material}</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>
                          {h.caneca} · {h.fecha}
                        </div>
                      </div>
                      <span
                        className={`badge rounded-pill ${
                          h.confianza > 85 ? "bg-success" : "bg-warning text-dark"
                        }`}
                      >
                        {h.confianza}%
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}