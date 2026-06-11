# Simulacro E-Commerce

Este proyecto es una aplicación **e-commerce** desarrollada con **Next.js**. Incluye funcionalidades como catálogo de productos, carrito de compras, sistema de favoritos, autenticación de usuarios, internacionalización (i18n), integración con base de datos (MongoDB) y tareas programadas para el envío de correos electrónicos.

## Estructura del Proyecto

A continuación, se presenta la estructura de directorios principal de la aplicación, siguiendo la arquitectura de capas y el App Router de Next.js:

```text
.
├── public/                # Archivos estáticos e imágenes (SVG, ICO, etc.)
├── src/
│   ├── app/               # Rutas de la aplicación (App Router) y API Routes
│   │   ├── api/           # Endpoints de la API
│   │   ├── dashboard/     # Vistas del panel de control
│   │   ├── layout.tsx     # Layout principal
│   │   └── page.tsx       # Página de inicio (Catálogo)
│   ├── components/        # Componentes UI reutilizables (ej. ProductCard)
│   ├── lib/               # Utilidades, configuración de MongoDB y Autenticación
│   ├── models/            # Modelos de datos de Mongoose (Cart, Favorite, Product, Sale, User)
│   ├── services/          # Capa de servicios separada de las rutas (comunicación con DB)
│   └── types/             # Definiciones de tipos e interfaces de TypeScript
├── package.json           # Dependencias y scripts del proyecto
├── SIMULACRO_PRUEBA_DESEMPENO.md # Requisitos originales de la prueba
└── README.md              # Documentación del proyecto
```

---
