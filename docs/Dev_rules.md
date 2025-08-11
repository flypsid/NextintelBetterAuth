## Tech Stack & Architecture Principles - NextintelBetterAuth

**NextintelBetterAuth** est un outil d'analyse IA moderne pour YouTube et les réseaux sociaux, construit avec Next.js 15, TypeScript, et Better Auth. Le projet implémente une architecture de sécurité multicouche avec validation Zod et internationalisation complète pour aider les créateurs de contenu à optimiser leurs performances.

### 🧱 Core Technologies (Projet Actuel)

- **Language**: TypeScript (`strict` mode enabled — avoid `any`, prefer `unknown` / `never`)
- **Frontend**: React 19.0.0 / Next.js 15.3.4 (`App Router` only)
- **UI Layer**: Radix UI + Tailwind CSS 4 (composants personnalisés)
- **Backend**: Next.js API Routes + TypeScript
- **Database**: **PostgreSQL** hosted on **Neon** avec **Drizzle ORM 0.44.3**

### 🔄 ORM Strategy (NextintelBetterAuth)

- **Drizzle ORM 0.44.3**: Choisi pour ce projet pour un contrôle maximal avec **Better Auth 1.3.2**
- **Provider**: PostgreSQL (`pg`) avec adaptateur Drizzle pour Better Auth
- **Migrations**: Gérées via `drizzle-kit 0.31.4`
- **Type Safety**: Schémas typés avec inférence automatique

**Justification**: Drizzle offre un contrôle précis des migrations et une intégration native avec Better Auth.

### 🎨 UI/UX Layer (NextintelBetterAuth)

- **Design System**: Radix UI primitives avec Tailwind CSS 4
- **Icons**: Tabler Icons React 3.34.0 + Lucide React 0.522.0
- **Animations**: Framer Motion 12.23.6
- **Themes**: next-themes 0.4.6 (dark/light mode)
- **Notifications**: Sonner 2.0.6
- **Drag & Drop**: @dnd-kit/core 6.3.1 (avec sortable et modifiers)

### 📧 Email & Communication (NextintelBetterAuth)

- **Email Provider**: Resend pour les emails transactionnels
- **Templates**: React Email pour les templates d'emails
- **Internationalisation**: Emails bilingues (FR/EN) avec détection automatique
- **Types d'emails**:
  - Vérification d'email (inscription)
  - Récupération de mot de passe
  - Changement d'email (vérification + notification)
  - Notification de changement de mot de passe
- **Sécurité**: Tokens avec expiration et validation Better Auth
- **Logo**: Intégration du logo NextintelBetterAuth dans tous les templates

### 📥 Validation & Schema Definition (NextintelBetterAuth)

- **Zod 3.25.76**: Obligatoire pour toute validation (formulaires, API, modèles)
- **Architecture**: Schémas partagés entre client et serveur (`src/lib/schemas/`)
- **Middlewares**: Validation automatique avec `withValidation`, `withAuth`, `withValidationAndAuth`
- **Traductions**: Support des messages d'erreur localisés via next-intl
- **Type Safety**: Inférence automatique des types TypeScript

### 🌍 Internationalization (NextintelBetterAuth)

- **next-intl 4.1.0**: Système i18n complet avec routing dynamique
- **Architecture**: Namespaces par fonctionnalité (auth, dashboard, etc.)
- **SSR**: Compatible avec App Router et Server Components
- **Validation**: Messages d'erreur Zod traduits automatiquement

**Usage Patterns**:

```tsx
// Server Components
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("auth");
  return <h1>{t("login.title")}</h1>;
}

// Client Components avec validation
const loginSchema = createLoginSchema(t);
```

### 👤 Gestion de Profil Utilisateur (NextintelBetterAuth)

- **Profil complet**: Nom, email, photo de profil
- **Upload d'avatar**: Gestion sécurisée des images de profil
- **Changement d'email**: Processus de vérification en deux étapes avec notification
- **Changement de mot de passe**: Avec notification de sécurité automatique
- **Validation en temps réel**: Schémas Zod pour tous les formulaires
- **Interface responsive**: Optimisée pour mobile et desktop
- **Gestion d'état**: Feedback utilisateur avec notifications toast

### 📊 Data & State Management (NextintelBetterAuth)

- **Tables**: @tanstack/react-table 8.21.3 pour les interfaces de données
- **Charts**: Recharts 2.15.4 pour les visualisations
- **State**: React hooks + Context API (pas de store global complexe)
- **Forms**: React Hook Form avec validation Zod intégrée
- **Fetching**: Fetch natif avec middlewares de validation

### 📐 Architecture & Design Patterns (NextintelBetterAuth)

- **Structure**: App Router avec organisation par fonctionnalité

  ```
  src/
  ├── app/[locale]/(auth)/     # Pages d'authentification
  ├── components/auth/         # Composants d'auth réutilisables
  ├── lib/schemas/            # Schémas Zod partagés
  ├── lib/middleware/         # Middlewares de validation
  ├── hooks/                  # Custom hooks (useAuth, etc.)
  └── db/                     # Schémas et configuration DB
  ```

- **API Layer**: Next.js API Routes avec middlewares de validation
  - **Better Auth**: Endpoints centralisés (`/api/auth/[...all]`)
  - **Protected APIs**: Validation + authentification obligatoires
  - **Type Safety**: Schémas Zod pour input/output

- **Error Handling**:
  - Validation Zod avec messages traduits
  - Middlewares d'erreur standardisés
  - Logging structuré pour le debugging

- **State Management**:
  - **Local state**: React hooks (useState, useReducer)
  - **Auth state**: Custom hook `useAuth` avec Context
  - **Server state**: Pas de cache complexe, fetch direct

- **Hooks**: Logique métier encapsulée (`useAuth`, validation forms)

### ⚙️ DX & Quality Standards (NextintelBetterAuth)

- **Linting**: ESLint 9 avec config Next.js
- **Type Checking**: TypeScript 5 en mode strict
- **Styling**: Tailwind CSS 4 avec PostCSS
- **Dev Tools**:
  - `tsx 4.20.3` pour l'exécution TypeScript
  - `drizzle-kit 0.31.4` pour les migrations
  - Next.js Turbopack pour le dev rapide

- **Build Process**:

  ```bash
  npm run lint     # ESLint + type checking
  npx tsc --noEmit # Vérification TypeScript
  npm run build    # Build Next.js optimisé
  ```

- **Database Workflow**:
  ```bash
  npx drizzle-kit generate  # Générer migrations
  npx drizzle-kit migrate   # Appliquer migrations
  npx drizzle-kit studio   # Interface admin DB
  ```

---

## 🎯 Règles de Développement Spécifiques - NextintelBetterAuth

### 🚫 Interdictions

- **Jamais de serveur de développement automatique**: Ne pas lancer `npm run dev` sans demande explicite
- **Pas de technologies non utilisées**: Ne pas suggérer Prisma, tRPC, Zustand, etc.
- **Pas de modifications d'architecture**: Respecter Better Auth + Drizzle + Next.js App Router
- **Pas de secrets en dur**: Toujours utiliser les variables d'environnement

### ✅ Obligations

- **Validation Zod**: Obligatoire pour tous les inputs/outputs
- **Middlewares**: Utiliser `withAuth`, `withValidation`, `withValidationAndAuth`
- **Type Safety**: TypeScript strict, pas de `any`
- **i18n**: Tous les textes utilisateur via next-intl
- **Documentation**: Mettre à jour les docs lors des changements
- **Clés de traduction**: **TOUJOURS** vérifier l'existence des clés dans `messages/en.json` et `messages/fr.json` avant d'en créer de nouvelles. Réutiliser les clés existantes et éviter les doublons

### 🌍 Règles de Traduction (i18n)

- **Vérification obligatoire**: Avant de créer une nouvelle clé de traduction, **TOUJOURS** vérifier si elle existe déjà dans :
  - `messages/en.json`
  - `messages/fr.json`
- **Réutilisation**: Privilégier la réutilisation des clés existantes plutôt que la création de doublons
- **Recherche**: Utiliser la recherche de code pour identifier les clés similaires (ex: `login`, `email`, `password`, `save`, `cancel`)
- **Contexte**: Adapter les clés existantes au contexte si nécessaire plutôt que créer des variantes
- **Nommage**: Respecter la hiérarchie existante (ex: `Auth.validation.emailInvalid` plutôt que créer une nouvelle structure)
- **Cohérence**: Maintenir la cohérence terminologique à travers l'application

### 🔧 Workflow de Développement

1. **Avant modification**: Consulter `docs/SECURITY.md` et `docs/VALIDATION_ARCHITECTURE.md`
2. **Traductions**: Vérifier les clés existantes dans les fichiers de traduction
3. **Validation**: Créer/utiliser schémas Zod partagés
4. **API**: Utiliser les middlewares de validation existants
5. **Auth**: Respecter l'architecture multicouche
6. **Tests**: Vérifier TypeScript + ESLint
7. **Documentation**: Mettre à jour si nécessaire

### 📁 Structure de Fichiers à Respecter

```
src/
├── app/[locale]/               # Pages avec i18n
│   ├── (auth)/                # Groupe d'auth
│   └── api/                   # API Routes
├── components/
│   ├── auth/                  # Composants d'authentification
│   └── ui/                    # Composants UI réutilisables
├── lib/
│   ├── schemas/               # Schémas Zod partagés
│   ├── middleware/            # Middlewares de validation
│   └── auth.ts               # Configuration Better Auth
├── hooks/                     # Custom hooks
├── db/
│   ├── schema.ts             # Schémas Drizzle
│   └── drizzle.ts            # Configuration DB
docs/                          # Documentation projet
└── .trae/rules/              # Règles de développement
```

### 🎨 Standards UI/UX

- **Design System**: Radix UI + Tailwind CSS 4 uniquement
- **Icons**: Tabler Icons ou Lucide React
- **Animations**: Framer Motion pour les transitions
- **Responsive**: Mobile-first avec Tailwind
- **Accessibilité**: Radix UI garantit les standards WCAG

### 🔍 Debugging et Monitoring

- **Logs**: Console.error pour les erreurs serveur
- **Validation**: Messages d'erreur Zod traduits
- **Auth**: Logs des tentatives d'accès non autorisées
- **Performance**: Monitoring des requêtes DB

---

## 🔗 Model Context Protocol (MCP) Setup (NextintelBetterAuth)

### Context7 MCP — Documentation Access

- **Purpose**: Accès centralisé à la documentation du projet
- **Usage**: Navigation et recherche dans les fichiers de documentation
- **Files**: `docs/SECURITY.md`, `docs/VALIDATION_ARCHITECTURE.md`, `.trae/rules/user_rules.md`
- **Security**: Lecture seule, pas d'accès aux secrets

### 🧠 Agent Guidelines (NextintelBetterAuth)

- **Documentation**: Toujours consulter les docs avant modifications
- **Architecture**: Respecter les patterns établis (Better Auth + Drizzle)
- **Validation**: Utiliser les middlewares existants
- **Security**: Suivre les pratiques définies dans `SECURITY.md`
- **Types**: Maintenir la type safety avec TypeScript strict

---

## 🔐 Authentication (Better Auth) - Configuration NextintelBetterAuth

### Configuration Actuelle

**Fichier**: `src/lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
  sendForgotPasswordEmail,
  sendVerificationEmail,
  getLocaleFromRequest,
} from "@/lib/email";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }, request) => {
      const locale = getLocaleFromRequest(request);
      await sendForgotPasswordEmail({
        to: user.email,
        userName: user.name || user.email.split("@")[0],
        resetUrl: url,
        locale,
      });
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }, request) => {
      const locale = getLocaleFromRequest(request);
      await sendVerificationEmail({
        to: user.email,
        userName: user.name || user.email.split("@")[0],
        verificationUrl: url,
        locale,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [nextCookies()],
});
```

### Schéma de Base de Données (Drizzle)

**Fichier**: `src/db/schema.ts`

Tables Better Auth implémentées :

- ✅ `user` - Utilisateurs avec email/password
- ✅ `session` - Sessions avec expiration et métadonnées
- ✅ `account` - Comptes liés (OAuth futur)
- ✅ `verification` - Tokens de vérification

### Architecture de Sécurité Multicouche

1. **Middleware** (`src/middleware.ts`)
   - Validation de session au niveau requête
   - Redirection automatique si non authentifié

2. **Server Components** (`src/components/auth/ServerProtectedRoute.tsx`)
   - Validation côté serveur obligatoire
   - Protection contre la manipulation client

3. **Client Components** (`src/components/auth/ProtectedRoute.tsx`)
   - UX fluide avec états de chargement
   - Hook `useAuth` pour l'état global

### Middlewares de Validation

**Fichier**: `src/lib/middleware/validation.ts`

- `withAuth`: Protection des API routes
- `withValidation`: Validation Zod des inputs
- `withValidationAndAuth`: Combinaison des deux

### Endpoints Centralisés

**Fichier**: `src/app/api/auth/[...all]/route.ts`

Tous les endpoints Better Auth gérés automatiquement :

- `/api/auth/sign-in` - Connexion email/password
- `/api/auth/sign-up` - Inscription avec vérification email
- `/api/auth/sign-out` - Déconnexion
- `/api/auth/session` - Validation de session
- `/api/auth/verify-email` - Vérification d'email avec connexion auto
- `/api/auth/forgot-password` - Demande de récupération
- `/api/auth/reset-password` - Réinitialisation de mot de passe
- `/api/auth/sign-in/google` - Authentification Google OAuth
- `/api/auth/sign-in/discord` - Authentification Discord OAuth
- `/api/auth/callback/google` - Callback Google OAuth
- `/api/auth/callback/discord` - Callback Discord OAuth

### Variables d'Environnement Requises

```env
# Better Auth
BETTER_AUTH_SECRET=your-32-char-secret
BETTER_AUTH_URL=http://localhost:3000

# Application
NEXT_PUBLIC_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@host/db

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

### Bonnes Pratiques Implémentées

- ✅ **Type Safety**: Types Better Auth + Drizzle
- ✅ **Validation**: Schémas Zod partagés
- ✅ **Sécurité**: Validation multicouche obligatoire
- ✅ **UX**: États de chargement et redirections
- ✅ **i18n**: Messages d'erreur traduits
- ✅ **Performance**: Middleware optimisé
- ✅ **Email Verification**: Vérification d'email obligatoire avec connexion automatique
- ✅ **Password Reset**: Récupération de mot de passe avec emails bilingues
- ✅ **Email Change**: Changement d'email sécurisé avec double vérification
- ✅ **Security Notifications**: Notifications automatiques pour changements de compte
- ✅ **Social Auth**: Fournisseurs Google et Discord configurés
- ✅ **Locale Detection**: Détection automatique de la langue pour les emails
- ✅ **Email Templates**: Templates Resend bilingues (FR/EN) avec logo NextintelBetterAuth
- ✅ **Profile Management**: Gestion complète du profil utilisateur avec upload d'avatar

### 📧 Système d'Email (Resend)

**Fichier**: `src/lib/email.ts`

**Fonctionnalités**:

- **Provider**: Resend pour l'envoi d'emails transactionnels
- **Templates**: Emails bilingues (FR/EN) avec détection automatique de locale
- **Types d'emails**:
  - Vérification d'email (inscription)
  - Récupération de mot de passe
  - Changement d'email (vérification + notification à l'ancienne adresse)
  - Notification de changement de mot de passe
- **Sécurité**: Validation des tokens avec expiration (1 heure)
- **UX**: Connexion automatique après vérification d'email
- **Design**: Logo NextintelBetterAuth intégré dans tous les templates
- **URLs**: Utilisation de NEXT_PUBLIC_URL pour les liens de support

**Templates disponibles**:

- `src/components/emails/EmailVerificationEmail.tsx` - Email de vérification d'inscription
- `src/components/emails/ForgotPasswordEmail.tsx` - Email de récupération de mot de passe
- `src/components/emails/EmailChangeVerificationEmail.tsx` - Email de vérification de changement d'email
- `src/components/emails/EmailChangeNotificationEmail.tsx` - Notification de changement d'email
- `src/components/emails/PasswordChangeNotificationEmail.tsx` - Notification de changement de mot de passe

**Configuration**:

```typescript
// Détection automatique de locale depuis la requête
const locale = getLocaleFromRequest(request);

// Envoi d'email avec template bilingue
await sendVerificationEmail({
  to: user.email,
  userName: user.name || user.email.split("@")[0],
  verificationUrl: url,
  locale, // 'fr' ou 'en'
});
```

---

# Development Rules

## Command Suggestions

### Prohibited Commands

- **npm run dev**: Ne jamais suggérer automatiquement cette commande
  - Suggérer uniquement si explicitement demandé par l'utilisateur
  - Cela évite les démarrages non désirés du serveur de développement
- **npm start**: Ne pas suggérer automatiquement
- **yarn dev**: Ne pas suggérer automatiquement
- **pnpm dev**: Ne pas suggérer automatiquement

### Allowed Commands

Les commandes suivantes peuvent être suggérées automatiquement quand pertinentes :

- `npx tsc --noEmit` (Vérification des types TypeScript)
- `npm run build` (Build de production)
- `npm run lint` (Linting du code)
- `npm test` (Exécution des tests)
- `npm audit` (Audit de sécurité)
- `npm install` (Installation des dépendances)
- `npm ci` (Installation propre des dépendances)

## Justification

- L'utilisateur préfère contrôler quand le serveur de développement est lancé
- Évite les processus en arrière-plan non désirés
- Améliore l'expérience utilisateur en évitant les propositions répétitives

## Application

Cette règle s'applique à tous les assistants IA travaillant sur ce projet.
