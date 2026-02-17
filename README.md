# Inventory Manager

Sistema de gerenciamento de inventário com backend em Node.js e frontend em React.

---

## Estrutura do Projeto

```
projedata-test/
├── 1-documentation/       # Diagramas e documentação
├── 2-backend/             # API REST com Node.js + Prisma
└── 3-frontend/            # Interface com React + Vite
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
