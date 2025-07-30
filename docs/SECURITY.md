# Stratégie de Sécurité - NextintelBetterAuth

## Vue d'ensemble

NextintelBetterAuth implémente une stratégie de sécurité multicouche basée sur **Better Auth** avec **Drizzle ORM** et **PostgreSQL (Neon)**, suivant les meilleures pratiques de sécurité pour les applications Next.js modernes. Cette architecture garantit une protection robuste tout en maintenant une excellente expérience utilisateur.

## Couches de Protection

### 1. Middleware Next.js (Première couche)

**Fichier**: `src/middleware.ts`

```typescript
// Validation complète de session dans le middleware
const session = await auth.api.getSession({
  headers: request.headers,
});
```

**Avantages**:

- Protection au niveau de la requête
- Redirection immédiate pour les routes protégées
- Performance optimisée (pas de rendu inutile)

**Limitations**:

- Selon Better Auth, ne pas se fier uniquement au middleware
- Les cookies peuvent être manipulés côté client

### 2. Protection Côté Serveur (Deuxième couche)

**Fichier**: `src/components/auth/ServerProtectedRoute.tsx`

```typescript
// Validation de session côté serveur dans les Server Components
const session = await auth.api.getSession({
  headers: headers(),
});
```

**Avantages**:

- Validation sécurisée côté serveur
- Impossible à contourner depuis le client
- Conforme aux recommandations Better Auth

**Utilisation**:

```typescript
<ServerProtectedRoute locale={params.locale}>
  {/* Contenu protégé */}
</ServerProtectedRoute>
```

### 3. Protection Côté Client (Troisième couche)

**Fichier**: `src/components/auth/ProtectedRoute.tsx`

```typescript
// Protection réactive côté client
const { isAuthenticated, isLoading } = useAuth();
```

**Avantages**:

- Expérience utilisateur fluide
- Gestion des états de chargement
- Redirection automatique

**Utilisation**:

```typescript
<ProtectedRoute>
  {/* Interface utilisateur */}
</ProtectedRoute>
```

## Avertissements de Sécurité Adressés

### ⚠️ Avertissement 1: Configuration des Cookies

> "The getSessionCookie() function does not automatically reference the auth config specified in auth.ts"

**Solution**: Nous utilisons `auth.api.getSession()` au lieu de `getSessionCookie()` pour éviter les problèmes de configuration.

### ⚠️ Avertissement 2: Validation des Sessions

> "The getSessionCookie function only checks for the existence of a session cookie; it does not validate it"

**Solution**:

- Middleware: `auth.api.getSession()` avec validation complète
- Server Components: `auth.api.getSession()` avec validation côté serveur
- Jamais de simple vérification d'existence de cookie

## Architecture de Sécurité

```
Requête → Middleware → Server Component → Client Component
    ↓         ↓              ↓               ↓
  Validation  Validation   Validation    UX/Loading
  complète    serveur      serveur       States
```

## Meilleures Pratiques Implémentées

### ✅ Validation Multicouche

- Middleware pour les redirections rapides
- Server Components pour la sécurité
- Client Components pour l'UX

### ✅ Pas de Contournement Possible

- Impossible de manipuler les cookies pour bypasser
- Validation serveur obligatoire
- Redirection automatique si session invalide

### ✅ Performance Optimisée

- Middleware évite le rendu inutile
- Server Components évitent les requêtes client
- Client Components gèrent l'UX

### ✅ Expérience Utilisateur

- États de chargement appropriés
- Redirections fluides
- Messages d'erreur localisés

### ✅ **Sécurité du Changement d'Email** (NOUVEAU)

- **Vérification du mot de passe** : Confirmation d'identité obligatoire
- **Tokens sécurisés** : Générés avec `nanoid` (21 caractères)
- **Expiration automatique** : Tokens valides 24 heures maximum
- **Double notification** : Nouvelle et ancienne adresse informées
- **Validation stricte** : Schémas Zod côté client et serveur
- **Vérification d'unicité** : Empêche l'utilisation d'emails existants
- **Logs de sécurité** : Traçabilité complète pour audit
- **Middleware d'authentification** : `withValidationAndAuth` pour toutes les routes API

## Utilisation Recommandée

### Pour les Pages Protégées

```typescript
export default async function ProtectedPage({ params }: { params: { locale: string } }) {
  return (
    <ServerProtectedRoute locale={params.locale}>
      <ProtectedRoute>
        {/* Votre contenu ici */}
      </ProtectedRoute>
    </ServerProtectedRoute>
  );
}
```

### Pour les API Routes

```typescript
export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Logique protégée
}
```

### Pour les Server Actions

```typescript
export async function protectedAction() {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Action protégée
}
```

## Configuration Better Auth

**Fichier**: `src/lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // ✅ Activé pour sécurité renforcée
    autoSignInAfterVerification: true, // ✅ UX améliorée
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // Envoi d'email via Resend avec détection de locale
      await sendVerificationEmail(user.email, url, request);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [nextCookies()], // Essentiel pour Next.js
});
```

### Schéma de Base de Données Sécurisé

**Fichier**: `src/db/schema.ts`

Le schéma utilise les meilleures pratiques de sécurité :

- ✅ **Clés primaires** : UUID/text pour éviter l'énumération
- ✅ **Contraintes de référence** : CASCADE pour la cohérence
- ✅ **Timestamps** : Traçabilité complète des actions
- ✅ **Tokens uniques** : Prévention des collisions
- ✅ **Expiration des sessions** : Sécurité temporelle

````

## Variables d'Environnement Requises

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@host/database

# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxx

# OAuth Providers (optionnel)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# Application
NEXT_PUBLIC_URL=http://localhost:3000
NODE_ENV=development|production
````

### Sécurité des Variables d'Environnement

- ✅ **BETTER_AUTH_SECRET**: Minimum 32 caractères, généré aléatoirement
- ✅ **DATABASE_URL**: Connexion sécurisée SSL vers Neon
- ✅ **RESEND_API_KEY**: Clé API sécurisée pour l'envoi d'emails
- ✅ **OAuth Secrets**: Clés client/secret pour Google et Discord
- ✅ **Jamais de secrets** dans le code source ou les commits
- ✅ Utilisation de `.env.local` pour le développement
- ✅ Variables d'environnement chiffrées en production
- ✅ **Rotation régulière** des clés API et secrets

## Stack Technologique Sécurisé

### Technologies Principales

- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: TypeScript (mode strict)
- **Authentification**: Better Auth 1.3.2
- **Base de données**: PostgreSQL (Neon) + Drizzle ORM 0.44.3
- **Validation**: Zod 3.25.76
- **UI**: Radix UI + Tailwind CSS 4
- **Internationalisation**: next-intl 4.1.0
- **État**: React hooks + Context API
- **Animations**: Framer Motion 12.23.6

### Sécurité par Couche

#### Frontend (React/Next.js)

- ✅ **CSR Protection**: Validation Zod côté client
- ✅ **XSS Prevention**: Sanitisation automatique React
- ✅ **CSRF Protection**: Tokens CSRF intégrés
- ✅ **Type Safety**: TypeScript strict mode

#### Backend (API Routes)

- ✅ **Input Validation**: Middlewares Zod obligatoires
- ✅ **Authentication**: Better Auth session validation
- ✅ **SQL Injection**: Drizzle ORM avec requêtes préparées
- ✅ **Rate Limiting**: À implémenter selon les besoins

#### Base de Données (PostgreSQL/Neon)

- ✅ **Connexion SSL**: Chiffrement en transit
- ✅ **Credentials**: Variables d'environnement sécurisées
- ✅ **Migrations**: Contrôle de version avec Drizzle Kit
- ✅ **Backup**: Gestion automatique par Neon

## Tests de Sécurité

### Scénarios à Tester

1. **Accès sans session**: Redirection vers login
2. **Session expirée**: Redirection automatique
3. **Cookie manipulé**: Validation côté serveur échoue
4. **Navigation directe**: Middleware bloque l'accès
5. **Injection SQL**: Tests avec Drizzle ORM
6. **XSS**: Validation des inputs utilisateur
7. **CSRF**: Vérification des tokens

### Commandes de Test

```bash
# Vérification TypeScript
npx tsc --noEmit

# Lint et formatage
npm run lint

# Audit de sécurité des dépendances
npm audit
npm audit fix

# Tests de validation Zod
npm run test:validation

# Tests d'authentification
npm run test:auth
```

### Tests de Pénétration Recommandés

```bash
# Test des endpoints d'authentification
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test de validation des données
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=INVALID_TOKEN" \
  -d '{"name":"<script>alert('XSS')</script>"}'

# Test d'accès non autorisé
curl -X GET http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json"
```

## Maintenance

### Mise à Jour Better Auth

1. Vérifier les breaking changes
2. Mettre à jour les schémas de base de données
3. Tester tous les flux d'authentification
4. Vérifier les nouvelles recommandations de sécurité

### Monitoring

- Surveiller les tentatives d'accès non autorisées
- Logs des redirections de sécurité
- Métriques de performance du middleware

Cette stratégie multicouche garantit une sécurité robuste tout en maintenant une excellente expérience utilisateur.
