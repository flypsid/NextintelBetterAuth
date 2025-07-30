# Architecture de Validation - Zod + Better Auth

## Vue d'ensemble

Cette documentation décrit l'architecture de validation mise en place pour sécuriser l'application avec des schémas Zod partagés entre le client et le serveur.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │  Shared Schemas │    │  Server Side    │
│                 │    │                 │    │                 │
│ ✅ UX Validation│◄──►│  Zod Schemas    │◄──►│ ✅ Security     │
│ ✅ Translations │    │  Type Safety    │    │ ✅ Validation   │
│ ✅ Real-time    │    │  Single Source  │    │ ✅ Protection   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Structure des fichiers

```
src/
├── lib/
│   ├── schemas/
│   │   └── auth.ts              # Schémas d'authentification partagés
│   └── middleware/
│       └── validation.ts        # Middlewares de validation
├── app/
│   └── api/
│       ├── auth/
│       │   └── [...all]/route.ts # Handler centralisé Better Auth
│       └── user/
│           └── profile/route.ts # Exemple API protégée
└── components/
    └── auth/
        ├── LoginForm.tsx        # Utilise schémas partagés
        ├── RegisterForm.tsx     # Utilise schémas partagés
        └── ForgotPasswordForm.tsx
```

## 🔒 Schémas de Validation

### Fichier: `src/lib/schemas/auth.ts`

```typescript
// Schémas de base (serveur)
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// **NOUVEAU** : Schémas pour le changement d'email
export const emailChangeSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
  currentPassword: z.string().min(1, "Current password is required"),
});

export const verifyEmailChangeSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

// Schémas avec traductions (client)
export const createLoginSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t("validation.emailInvalid")),
  password: z.string().min(1, t("validation.passwordRequired")),
});

export const createEmailChangeSchema = (t: (key: string) => string) => z.object({
  newEmail: z.string().email(t("validation.emailInvalid")),
  currentPassword: z.string().min(1, t("validation.passwordRequired")),
});
```

**Avantages:**
- ✅ Single source of truth
- ✅ Type safety partagée
- ✅ Validation côté client ET serveur
- ✅ Support des traductions

## 🛡️ Middlewares de Validation

### Fichier: `src/lib/middleware/validation.ts`

#### 1. `withValidation`
Valide le body de la requête avec un schéma Zod.

```typescript
export const POST = withValidation(loginSchema, async (request, validatedData) => {
  // validatedData est typé et validé
  return NextResponse.json({ success: true });
});
```

#### 2. `withAuth`
Vérifie l'authentification de l'utilisateur.

```typescript
export const GET = withAuth(async (request, session) => {
  // session est garantie valide
  return NextResponse.json({ user: session.user });
});
```

#### 3. `withValidationAndAuth`
Combine validation et authentification.

```typescript
export const PUT = withValidationAndAuth(
  updateProfileSchema,
  async (request, validatedData, session) => {
    // Les deux sont validés
    return NextResponse.json({ success: true });
  }
);
```

## 🔄 Flux de Validation

### Côté Client (UX)
1. L'utilisateur saisit des données
2. Validation en temps réel avec `createLoginSchema(t)`
3. Affichage des erreurs traduites
4. Envoi vers l'API si valide

### Côté Serveur (Sécurité)
1. Réception de la requête
2. Validation avec `loginSchema` (sans traductions)
3. Rejet si invalide (400 Bad Request)
4. Traitement si valide

## 📋 Exemples d'utilisation

### 1. Composant Client

```typescript
// LoginForm.tsx
import { createLoginSchema } from "@/lib/schemas/auth";

const loginSchema = createLoginSchema(t);
const validatedData = loginSchema.parse(formData);
```

### 2. Handler Better Auth Centralisé

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const { GET, POST } = toNextJsHandler(auth);
export { GET, POST };
```

**Note**: Better Auth gère automatiquement la validation des schémas pour tous les endpoints d'authentification (`/api/auth/sign-in`, `/api/auth/sign-up`, `/api/auth/forget-password`, etc.).

### 3. API Route Protégée

```typescript
// app/api/user/profile/route.ts
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

// Schéma pour la mise à jour du profil
const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
});

### 4. **NOUVEAU** : API Routes de Changement d'Email

```typescript
// app/api/user/email/change/route.ts
import { emailChangeSchema } from "@/lib/schemas/auth";

// POST - Demander un changement d'email
export const POST = withValidationAndAuth(
  emailChangeSchema,
  async (request, validatedData, session, user) => {
    const { newEmail, currentPassword } = validatedData;
    
    // Vérification du mot de passe actuel
    const isValidPassword = await auth.api.verifyPassword({
      password: currentPassword,
      userId: user.id,
    });
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid current password" },
        { status: 400 }
      );
    }
    
    // Génération du token et envoi des emails
    // ...
  }
);

// app/api/user/email/verify/route.ts
import { verifyEmailChangeSchema } from "@/lib/schemas/auth";

// POST - Vérifier le changement d'email
export const POST = withValidation(
  verifyEmailChangeSchema,
  async (request, validatedData) => {
    const { token } = validatedData;
    
    // Validation du token et mise à jour de l'email
    // ...
  }
);

// GET - Récupérer le profil utilisateur
export const GET = withAuth(async (request, session, user) => {
  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

// PUT - Mettre à jour le profil utilisateur avec base de données
export const PUT = withValidationAndAuth(
  updateProfileSchema,
  async (request, validatedData, session, currentUser) => {
    // Préparer les données à mettre à jour
    const updateData = {
      updatedAt: new Date(),
      ...(validatedData.name && { name: validatedData.name }),
      ...(validatedData.email && { email: validatedData.email }),
    };

    // Mettre à jour la base de données avec Drizzle ORM
    const [updatedUser] = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, currentUser.id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  }
);```

## ✅ Avantages de cette Architecture

1. **Sécurité renforcée**: Validation obligatoire côté serveur
2. **DRY Principle**: Schémas partagés, pas de duplication
3. **Type Safety**: Types TypeScript automatiques
4. **Maintenabilité**: Modifications centralisées
5. **Performance**: Validation rapide côté client
6. **UX**: Messages d'erreur traduits
7. **Évolutivité**: Facile d'ajouter de nouveaux schémas

## 🚨 Bonnes Pratiques

### ✅ À faire
- Toujours valider côté serveur
- Utiliser les schémas partagés
- Gérer les erreurs de validation
- Loguer les erreurs serveur
- Utiliser les middlewares fournis

### ❌ À éviter
- Se fier uniquement à la validation client
- Dupliquer les schémas
- Ignorer les erreurs de validation
- Exposer les détails d'erreur en production

## 🔄 Migration vers Better Auth centralisé

1. ✅ Créer les schémas partagés
2. ✅ Supprimer les routes d'authentification manuelles
3. ✅ Configurer le handler centralisé Better Auth
4. ✅ Mettre à jour les composants client
5. ✅ Créer les middlewares de validation pour les APIs protégées
6. ✅ Tester tous les flux d'authentification

## 🧪 Tests

```bash
# Tester l'authentification avec Better Auth
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Tester l'inscription
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Tester la récupération du profil (nécessite une session)
curl -X GET http://localhost:3000/api/user/profile \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN"

# Tester la mise à jour du profil
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -d '{"name":"Nouveau Nom","email":"nouveau@example.com"}'

# Réponse attendue: 200 OK avec session ou erreur de validation Better Auth
```

## 📚 Ressources

- [Zod Documentation](https://zod.dev/)
- [Better Auth Documentation](https://www.better-auth.com/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)