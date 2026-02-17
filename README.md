# Inventory Manager

Sistema de gerenciamento de inventário com backend em Node.js e frontend em React.

---

Link do projeto em produção: [Clique aqui para acessar](https://inventory-manager-chi-eight.vercel.app)

---

## Estrutura do Projeto

```
projedata-test
├─ 1-documentation # Diagramas e documentação
│  └─ class-diagram.png
├─ 2-backend # API REST com Node.js + Prisma
│  ├─ index.js
│  ├─ package-lock.json
│  ├─ package.json
│  └─ prisma
│     ├─ client.js
│     ├─ migrations
│     │  ├─ 20260216162555_init_db
│     │  │  └─ migration.sql
│     │  └─ migration_lock.toml
│     └─ schema.prisma
├─ 3-frontend  # Interface com React + Vite
│  └─ Inventory-Management
│     ├─ eslint.config.js
│     ├─ index.html
│     ├─ package-lock.json
│     ├─ package.json
│     ├─ postcss.config.js
│     ├─ public
│     ├─ README.md
│     ├─ src
│     │  ├─ App.jsx
│     │  ├─ assets
│     │  ├─ components
│     │  │  ├─ Composition.jsx
│     │  │  ├─ Material.jsx
│     │  │  ├─ Product.jsx
│     │  │  └─ Production.jsx
│     │  ├─ index.css
│     │  ├─ main.jsx
│     │  └─ services
│     │     └─ api.js
│     └─ vite.config.js
└─ README.md

```
---

## Como Rodar

### Backend

```bash
cd 2-backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd 3-frontend/Inventory-Management
npm install
npm run dev
```

---

## Tecnologias

- **Backend:** Node.js, Prisma ORM
- **Frontend:** React, Vite, TailwindCSS
- **Banco de dados:** SQL (via Prisma Migrations)

---

## Diagrama de Classes

Disponível em `1-documentation/class-diagram.png`.