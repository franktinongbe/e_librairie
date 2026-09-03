# Next.js App - Starter

Scaffold minimal pour démarrer un projet Next.js avec TypeScript, linting, sécurité basique, Docker et CI.

Commands:

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run format
```

Fichiers importants:
- `.env.example`: variables d'environnement
- `middleware.ts`: headers de sécurité et rate-limiter (dev uniquement)
- `next.config.js`: configuration des headers
- `Dockerfile`, `docker-compose.yml`: containers


# 📚 Next.js Stock & E-Library Management System

Une application web full-stack moderne de gestion de stock, de réservations et de ventes d'articles/documents, développée avec **Next.js**, **Prisma**, **TypeScript**, et **Supabase (PostgreSQL)**.

---

## 🚀 Fonctionnalités Principales

* **Authentification & Rôles** : Inscription, connexion sécurisée (JWT, bcrypt), gestion des rôles (`ADMIN`, `GESTIONNAIRE`, `VENDEUR`, `RESPONSABLE`).
* **Gestion du Catalogue & Stock** : Suivi des documents, catégories, fournisseurs et mouvements de stock (entrées, sorties, ajustements).
* **Tunnel de Vente & Facturation** : Panier, passage de commande, génération de factures et historique d'achats.
* **Réservations de Documents** : Système de réservation temporaire de documents avec expiration automatisée.
* **Espace d'Administration** : Dashboard dédié pour superviser les stocks, fournisseurs, mouvements et factures.
* **Sécurité & Résilience** : Limiteur de débit (*Rate Limiting*), validation des données et conteneurisation Docker.

---

## 🛠️ Stack Technique

* **Framework Frontend / Backend** : Next.js 13 (Pages Router), React, TypeScript
* **Style** : Tailwind CSS, PostCSS
* **Base de Données & ORM** : PostgreSQL (Supabase), Prisma ORM
* **Authentification & Sécurité** : JWT, `bcryptjs`, Rate Limiter
* **Emails & PDF** : Nodemailer (templates d'emails), génération de factures
* **Tests & Outils** : Jest, Docker, Docker Compose

---

## 📂 Architecture du Projet

```text
nextjs-app/
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
├── middleware.ts
├── next.config.js
├── tailwind.config.cjs
├── tsconfig.json
│
├── prisma/
│   ├── schema.prisma          # Schéma de base de données (modèles & relations)
│   └── migrations/            # Historique des migrations PostgreSQL
│
├── scripts/
│   ├── clean-reservations.js  # Tâche de nettoyage des réservations expirées
│   └── create-admin.js        # Script d'initialisation du compte Administrateur
│
├── src/
│   ├── components/            # Composants UI (Navbar, Sidebar, Layout, Cards, Inputs)
│   ├── lib/                   # Utilitaires (Prisma client, Auth, Mailer, Rate Limiter)
│   ├── styles/                # Styles globaux (Tailwind CSS)
│   ├── types/                 # Types TypeScript personnalisés
│   │
│   └── pages/
│       ├── _app.tsx           # Wrapper d'application Next.js
│       ├── index.tsx          # Page d'accueil
│       ├── catalog.tsx        # Catalogue des documents
│       ├── cart.tsx           # Panier d'achat
│       ├── checkout.tsx       # Validation de commande
│       ├── dashboard.tsx      # Tableau de bord utilisateur
│       │
│       ├── admin/             # Espace d'administration
│       │   ├── index.tsx
│       │   ├── documents.tsx
│       │   ├── invoices.tsx
│       │   ├── movements.tsx
│       │   └── suppliers.tsx
│       │
│       └── api/               # API Routes (Endpoints Backend)
│           ├── auth/          # Authentication (login, register, me)
│           ├── categories/    # Enpoints Catégories
│           ├── documents/     # Endpoints Documents
│           ├── invoices/      # Endpoints Factures
│           ├── movements/     # Endpoints Mouvements de stock
│           ├── reservations/  # Endpoints Réservations
│           ├── sales/         # Endpoints Ventes
│           └── suppliers/     # Endpoints Fournisseurs
│
└── tests/                     # Tests unitaires et d'intégration (Jest)