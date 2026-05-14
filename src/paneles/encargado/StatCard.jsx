// src/components/StatCard.jsx
export default function StatCard({ icon, label, value, sub, variant = "success" }) {
  const variants = {
    success: { iconBg: "bg-success", iconText: "text-white",  subText: "text-success"   },
    warning: { iconBg: "bg-warning", iconText: "text-dark",   subText: "text-warning"   },
    dark:    { iconBg: "bg-dark",    iconText: "text-warning", subText: "text-dark"      },
    light:   { iconBg: "bg-light",   iconText: "text-dark",   subText: "text-secondary" },
  };
  const v = variants[variant] || variants.success;

  return (
    <div className="card border border-2 border-dark rounded-3 h-100 shadow-sm">
      <div className="card-body d-flex align-items-center gap-3 py-3 px-3">
        <div
          className={`d-flex align-items-center justify-content-center rounded-3 border border-dark flex-shrink-0 ${v.iconBg} ${v.iconText}`}
          style={{ width: 46, height: 46 }}
        >
          <i className={`bi ${icon} fs-4`} />
        </div>
        <div>
          <div className="fw-black text-dark lh-1" style={{ fontSize: 22 }}>{value}</div>
          <div className="text-secondary fw-semibold" style={{ fontSize: 11 }}>{label}</div>
          {sub && (
            <div className={`fw-bold ${v.subText}`} style={{ fontSize: 10, marginTop: 2 }}>{sub}</div>
          )}
        </div>
      </div>
    </div>
  );
}