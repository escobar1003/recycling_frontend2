// ── Colores principales ────────────────────────────────────────────────────────
export const G  = "#16a34a";   // verde primario
export const GL = "#dcfce7";   // verde claro (fondo)
export const GS = "#15803d";   // verde oscuro
export const Y  = "#fde047";   // amarillo
export const YD = "#ca8a04";   // amarillo oscuro

// ── Configuración de materiales ───────────────────────────────────────────────
export const MAT_CFG = {
  "Plástico (PET)": { pts: 30, icon: "🧴" },
  "Cartón":         { pts: 20, icon: "📦" },
  "Vidrio":         { pts: 25, icon: "🍶" },
  "Aluminio":       { pts: 40, icon: "🥤" },
  "Papel":          { pts: 15, icon: "📄" },
  "Tetrapack":      { pts: 18, icon: "🧃" },
  "Electrónicos":   { pts: 60, icon: "📱" },
  "Metal":          { pts: 35, icon: "⚙️"  },
  "Orgánico":       { pts: 10, icon: "🌿" },
  "Tela":           { pts: 22, icon: "👕" },
  "Mixto":          { pts: 12, icon: "♻️" },
};

// ── Iconos por material (para IA) ─────────────────────────────────────────────
export const MAT_ICONS = {
  "Plástico (PET)": "🧴",
  "Cartón":         "📦",
  "Vidrio":         "🍶",
  "Aluminio":       "🥤",
  "Papel":          "📄",
  "Tetrapack":      "🧃",
  "Electrónicos":   "📱",
  "Metal":          "⚙️",
  "Orgánico":       "🌿",
  "Tela":           "👕",
  "Mixto":          "♻️",
};

// ── Colores por material (para el mapa) ───────────────────────────────────────
export const MAT_COLORS = {
  "Plástico":    "#3b82f6",
  "Cartón":      "#92400e",
  "Vidrio":      "#6366f1",
  "Aluminio":    "#6b7280",
  "Papel":       "#d97706",
  "Tetrapack":   "#ec4899",
  "Electrónicos":"#ef4444",
  "Orgánico":    "#16a34a",
  "Metal":       "#374151",
  "Tela":        "#8b5cf6",
};

// ── Puntos de recolección ─────────────────────────────────────────────────────
export const ALL_POINTS = [
  { id: 1, name: "Punto Verde Centro",    address: "Cra 7 #45-12, Bogotá",    open: true,  hours: "Lun-Dom 7:00–19:00", phone: "601 234 5678", distance: "0.4 km", rating: 4.8, materials: ["Plástico","Cartón","Vidrio","Aluminio","Papel"] },
  { id: 2, name: "EcoPunto Norte",         address: "Av. 127 #15-30, Bogotá",  open: true,  hours: "Lun-Dom 8:00–18:00", phone: "601 345 6789", distance: "1.2 km", rating: 4.5, materials: ["Plástico","Papel","Cartón","Tetrapack"] },
  { id: 3, name: "EcoPunto Sur",           address: "Cll 40 Sur #20-11, Bogotá",open: false, hours: "Lun-Sáb 8:00–17:00", phone: "601 456 7890", distance: "1.8 km", rating: 4.2, materials: ["Vidrio","Metal","Electrónicos"] },
  { id: 4, name: "Supermercado Verde",     address: "Cra 15 #90-50, Bogotá",   open: true,  hours: "Lun-Dom 8:00–21:00", phone: "601 567 8901", distance: "2.1 km", rating: 4.6, materials: ["Plástico","Cartón","Papel","Tetrapack","Aluminio"] },
  { id: 5, name: "EcoStation Chapinero",   address: "Cll 67 #4-30, Bogotá",    open: true,  hours: "Lun-Vie 7:00–18:00", phone: "601 678 9012", distance: "2.5 km", rating: 4.3, materials: ["Electrónicos","Metal","Vidrio"] },
  { id: 6, name: "Punto Ambiental Suba",   address: "Cra 91 #140-22, Bogotá",  open: false, hours: "Mar-Sáb 9:00–17:00", phone: "601 789 0123", distance: "3.1 km", rating: 4.0, materials: ["Orgánico","Plástico","Papel"] },
];

// ── Roles ─────────────────────────────────────────────────────────────────────
export const ROLES_CFG = {
  "Admin":      { color: "#1e40af", bg: "#dbeafe", icon: "🛡️" },
  "Encargado":  { color: "#0f766e", bg: "#ccfbf1", icon: "🏪" },
  "Reciclador": { color: "#16a34a", bg: "#dcfce7", icon: "♻️" },
  "Validador":  { color: "#7c3aed", bg: "#ede9fe", icon: "✅" },
  "Empresa":    { color: "#c2410c", bg: "#ffedd5", icon: "🏢" },
};

export const ZONAS = ["Zona Norte","Zona Sur","Zona Centro","Zona Oriente","Zona Occidente","Zona Chapinero","Zona Suba","Zona Kennedy"];

// ── Perfil admin ──────────────────────────────────────────────────────────────
export const ADMIN_PROFILE = {
  nombre:    "Ana García",
  email:     "ana.garcia@ecorecicla.co",
  telefono:  "300 987 6543",
  ciudad:    "Bogotá, Colombia",
  zona:      "Zona Centro",
  punto:     "Punto Verde Centro",
  rol:       "Admin",
  fechaAlta: "12 de enero, 2024",
  bio:       "Apasionada por el medio ambiente. Llevo más de 2 años reciclando activamente y ayudando a mi comunidad.",
  av:        "AG",
};

// ── Recompensas ───────────────────────────────────────────────────────────────
export const REWARDS = [
  { id: 1, titulo: "Café gratis",         empresa: "Juan Valdez",       pts: 500,  icon: "☕", color: "#854d0e" },
  { id: 2, titulo: "10% descuento",       empresa: "Éxito Supermercado",pts: 1000, icon: "🛒", color: "#16a34a" },
  { id: 3, titulo: "Entrada cine",        empresa: "Cinépolis",          pts: 2000, icon: "🎬", color: "#7c3aed" },
  { id: 4, titulo: "Transporte gratis",   empresa: "TransMilenio",       pts: 800,  icon: "🚌", color: "#0f766e" },
  { id: 5, titulo: "Descuento farmacia",  empresa: "Farmatodo",          pts: 1200, icon: "💊", color: "#1e40af" },
  { id: 6, titulo: "Bono restaurante",    empresa: "Crepes & Waffles",   pts: 1500, icon: "🥞", color: "#c2410c" },
];

// ── Datos gráfica dashboard ────────────────────────────────────────────────────
export const CHART_DATA = [
  { label: "Lun", val: 2.1, pts: 63,  hi: false },
  { label: "Mar", val: 3.5, pts: 105, hi: false },
  { label: "Mié", val: 1.8, pts: 54,  hi: false },
  { label: "Jue", val: 4.2, pts: 126, hi: true  },
  { label: "Vie", val: 2.9, pts: 87,  hi: false },
  { label: "Sáb", val: 5.1, pts: 153, hi: false },
  { label: "Dom", val: 3.3, pts: 99,  hi: false },
];

// ── Estado inicial de la app ───────────────────────────────────────────────────
export const INITIAL_STATE = {
  pts: 3250,
  entregas: [
    { id: 1, material: "Plástico (PET)", icon: "🧴", punto: "Punto Verde Centro",   fecha: "2025-07-10", peso: 2.5, pts: 75,  estado: "Validada"  },
    { id: 2, material: "Cartón",         icon: "📦", punto: "EcoPunto Norte",        fecha: "2025-07-08", peso: 3.0, pts: 60,  estado: "Pendiente" },
    { id: 3, material: "Vidrio",         icon: "🍶", punto: "Supermercado Verde",    fecha: "2025-07-05", peso: 1.5, pts: 37,  estado: "Validada"  },
    { id: 4, material: "Aluminio",       icon: "🥤", punto: "Punto Verde Centro",   fecha: "2025-07-01", peso: 0.8, pts: 32,  estado: "Validada"  },
  ],
  historial: [
    { id: 1, desc: "Ganaste 75 puntos",  sub: "Entrega de Plástico",  tiempo: "Hace 2 días",  icon: "⭐" },
    { id: 2, desc: "Ganaste 60 puntos",  sub: "Entrega de Cartón",    tiempo: "Hace 4 días",  icon: "⭐" },
    { id: 3, desc: "Canje realizado",    sub: "Café gratis",          tiempo: "Hace 1 semana",icon: "🎁" },
    { id: 4, desc: "Ganaste 37 puntos",  sub: "Entrega de Vidrio",    tiempo: "Hace 1 semana",icon: "⭐" },
  ],
  iaHist: [],
  iaResult: null,
  usuarios: [
    { id: 1, nombre: "Ana García",     email: "ana@ecorecicla.co",    telefono: "300 987 6543", rol: "Admin",      zona: "Zona Centro",   puntoAsignado: "Punto Verde Centro", pts: 3250, activo: true,  av: "AG", fechaAlta: "12/01/2024" },
    { id: 2, nombre: "Carlos Ruiz",    email: "carlos@ecorecicla.co", telefono: "310 123 4567", rol: "Reciclador", zona: "Zona Norte",    puntoAsignado: "EcoPunto Norte",     pts: 1800, activo: true,  av: "CR", fechaAlta: "03/03/2024" },
    { id: 3, nombre: "María López",    email: "maria@ecorecicla.co",  telefono: "320 234 5678", rol: "Encargado",  zona: "Zona Sur",      puntoAsignado: "EcoPunto Sur",       pts: 900,  activo: false, av: "ML", fechaAlta: "18/05/2024" },
    { id: 4, nombre: "Pedro Vásquez",  email: "pedro@ecorecicla.co",  telefono: "315 345 6789", rol: "Validador",  zona: "Zona Oriente",  puntoAsignado: "",                   pts: 450,  activo: true,  av: "PV", fechaAlta: "22/06/2024" },
    { id: 5, nombre: "EcoTienda SAS",  email: "eco@tienda.co",        telefono: "601 456 7890", rol: "Empresa",    zona: "",              puntoAsignado: "",                   pts: 0,    activo: true,  av: "ET", fechaAlta: "01/07/2024" },
  ],
};
