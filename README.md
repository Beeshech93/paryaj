# NEW BRAND — Plataforma de Casino Online, Sportsbook y Juegos Digitales

Plataforma integral, modular y de alto rendimiento para entretenimiento regulado, con arquitectura desacoplada para los mercados de **México (MX)** y **Haití (HT)** en **Español (ES)** y **Francés (FR)**.

> ⚠️ **Cumplimiento y Regulación:** La operación con dinero real está deshabilitada por defecto (`REAL_MONEY_ENABLED=false`). Todas las billeteras, cupones, tiradas y apuestas operan en modo demostración/simulado con contabilidad de doble partida inmutable hasta contar con la debida autorización de las autoridades regulatorias competentes en cada jurisdicción.

---

## 🏛️ Arquitectura del Sistema

```
paryaj/
├── apps/
│   ├── api/                   # Backend NestJS (REST API, Swagger, Auth, Ledger, Compliance)
│   │   ├── src/
│   │   │   ├── common/        # Filtros, interceptores, guards y decoradores
│   │   │   ├── config/        # Configuración tipada del entorno
│   │   │   ├── health/        # Endpoint de salud y diagnóstico (/api/health)
│   │   │   ├── app.module.ts  # Módulo raíz de NestJS
│   │   │   └── main.ts        # Punto de entrada con Swagger y CORS
│   │   └── test/              # Pruebas unitarias y E2E
│   │
│   └── web/                   # Frontend Next.js (App Router, Tailwind CSS, TypeScript)
│       ├── src/
│       │   ├── app/           # Rutas, layouts y páginas
│       │   ├── components/    # Componentes UI reutilizables
│       │   ├── lib/           # Utilidades y clientes de API
│       │   └── types/         # Definiciones TypeScript compartidas
│       └── public/            # Assets estáticos y logos
│
├── package.json               # Monorepo configurado con npm workspaces
├── .env.example               # Plantilla de variables de entorno
└── .gitignore                 # Exclusiones de Git
```

---

## 🚀 Pila Tecnológica

- **Frontend:** Next.js (App Router), React 19 / 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** NestJS, TypeScript, Swagger/OpenAPI, Class Validator, Terminus.
- **Base de Datos & ORM:** PostgreSQL + Prisma ORM + Redis (Cache / Rate Limiting).
- **Autenticación:** Supabase Auth + RBAC granular + MFA para administradores.
- **Infraestructura:** Vercel (Web), Render (API), Supabase (PostgreSQL & Auth).

---

## 🛠️ Comandos de Desarrollo

```bash
# Instalar dependencias del monorepo
npm install

# Iniciar servidor backend NestJS (http://localhost:4000)
npm run dev:api

# Iniciar aplicación frontend Next.js (http://localhost:3000)
npm run dev:web

# Ejecutar pruebas automatizadas
npm run test
```

---

## 🩺 Endpoints Clave

- **Health Check:** `GET http://localhost:4000/api/health`
- **Swagger Docs:** `http://localhost:4000/api/docs`

