# 🌿 EcoRecicla — Recicla y gana

App web de reciclaje con dashboard, clasificador IA, mapa de puntos, recompensas y más.

## 🚀 Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en modo desarrollo
npm start
```

La app abre en [http://localhost:3000](http://localhost:3000)

## 🏗️ Build para producción

```bash
npm run build
```

## 📁 Estructura

```
src/
├── App.js                  # Componente raíz, reducer global, routing
├── index.js                # Entry point
├── index.css               # Estilos globales
├── constants/
│   └── data.js             # Datos, constantes y estado inicial
└── components/
    ├── Sidebar.jsx
    ├── Topbar.jsx
    ├── ToastContainer.jsx
    ├── Dashboard.jsx
    ├── Entregas.jsx
    ├── ClasificadorIA.jsx   # Usa API de Anthropic (requiere proxy o key)
    ├── Recompensas.jsx
    ├── MisPuntos.jsx
    ├── Mapa.jsx
    ├── ImpactoEco.jsx
    ├── Usuarios.jsx
    └── Perfil.jsx
```

## ⚙️ Dependencias principales

| Paquete | Versión |
|---|---|
| react | ^18.3.1 |
| react-dom | ^18.3.1 |
| react-scripts | 5.0.1 |
| bootstrap | ^5.3.3 |
| bootstrap-icons | ^1.11.3 |

## 🤖 Clasificador IA

El componente `ClasificadorIA` llama directamente a `https://api.anthropic.com/v1/messages`.
En producción configura un proxy backend para no exponer la API key en el frontend.

## 📝 Notas

- Sin backend — el estado vive en memoria (useReducer)
- Los datos se reinician al recargar la página
- Para persistencia agrega localStorage o un backend propio
