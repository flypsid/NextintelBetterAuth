# Implémentation du Changement d'Email Sécurisé

## Vue d'ensemble

Cette implémentation ajoute une fonctionnalité complète et sécurisée de changement d'adresse email à l'application NextintelBetterAuth. Le processus suit les meilleures pratiques de sécurité avec vérification en deux étapes et notifications de sécurité.

## Fonctionnalités Implémentées

### 1. Interface Utilisateur

- **Composant UserProfile.tsx** : Interface complète de gestion du profil
- **Formulaire de changement d'email** : Validation en temps réel avec Zod
- **État en attente** : Affichage du statut de vérification
- **Actions disponibles** : Annuler, renvoyer la vérification
- **Responsive design** : Optimisé pour mobile et desktop

### 2. Processus de Vérification

- **Vérification du mot de passe** : Confirmation de l'identité avant changement
- **Email de vérification** : Envoyé à la nouvelle adresse
- **Notification de sécurité** : Alerte envoyée à l'ancienne adresse
- **Expiration automatique** : Tokens valides 24 heures
- **Page de vérification** : `/verify-email-change` avec gestion d'état

### 3. API Routes Sécurisées

- **POST /api/user/email/change** : Demande de changement
- **POST /api/user/email/verify** : Vérification du token
- **POST /api/user/email/cancel** : Annulation du changement
- **POST /api/user/email/resend** : Renvoi de vérification

## Architecture Technique

### Base de Données

```sql
-- Nouveau champ ajouté à la table user
ALTER TABLE "user" ADD COLUMN "pending_email" text;
```

### Schémas de Validation

```typescript
// Schéma pour le changement d'email
const emailChangeSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
  currentPassword: z.string().min(1, "Current password is required"),
});

// Schéma pour la vérification
const verifyEmailChangeSchema = z.object({
  token: z.string().min(1, "Token is required"),
});
```

### Templates d'Email

#### 1. EmailChangeVerificationEmail.tsx

- **Objectif** : Vérification de la nouvelle adresse
- **Contenu** : Lien de vérification, instructions, expiration
- **Langues** : Français et anglais
- **Expiration** : 24 heures

#### 2. EmailChangeNotificationEmail.tsx

- **Objectif** : Notification de sécurité à l'ancienne adresse
- **Contenu** : Alerte de changement, recommandations de sécurité
- **Actions** : Lien vers le support si non autorisé
- **Langues** : Français et anglais

## Flux de Fonctionnement

### 1. Demande de Changement

1. L'utilisateur saisit la nouvelle adresse email
2. Confirmation du mot de passe actuel
3. Validation côté client et serveur (Zod)
4. Vérification que la nouvelle adresse n'est pas déjà utilisée
5. Génération d'un token de vérification unique
6. Stockage de l'email en attente dans `pending_email`
7. Envoi de l'email de vérification à la nouvelle adresse
8. Envoi de la notification de sécurité à l'ancienne adresse

### 2. Vérification

1. L'utilisateur clique sur le lien dans l'email
2. Redirection vers `/verify-email-change?token=...`
3. Validation du token côté serveur
4. Vérification de l'expiration (24h)
5. Mise à jour de l'email principal
6. Suppression de `pending_email`
7. Suppression du token de vérification
8. Redirection vers le profil avec confirmation

### 3. Annulation (Optionnelle)

1. L'utilisateur clique sur "Annuler le changement"
2. Suppression de `pending_email`
3. Suppression des tokens de vérification associés
4. Confirmation de l'annulation

### 4. Renvoi de Vérification (Optionnelle)

1. L'utilisateur clique sur "Renvoyer l'email"
2. Génération d'un nouveau token
3. Suppression de l'ancien token
4. Renvoi de l'email de vérification

## Sécurité

### Mesures de Protection

- **Vérification du mot de passe** : Confirmation d'identité obligatoire
- **Tokens sécurisés** : Générés avec `nanoid` (21 caractères)
- **Expiration automatique** : Tokens valides 24 heures maximum
- **Validation stricte** : Schémas Zod côté client et serveur
- **Middleware d'authentification** : `withValidationAndAuth`
- **Vérification d'unicité** : Empêche l'utilisation d'emails existants
- **Logs détaillés** : Traçabilité complète pour audit

### Notifications de Sécurité

- **Double notification** : Nouvelle et ancienne adresse informées
- **Recommandations** : Changement de mot de passe si non autorisé
- **Lien de support** : Contact direct en cas de problème
- **Détection de locale** : Emails dans la langue appropriée

## Internationalisation

### Messages Traduits

- **Interface utilisateur** : Tous les textes via next-intl
- **Templates d'email** : Versions française et anglaise
- **Messages d'erreur** : Validation Zod localisée
- **Notifications toast** : Feedback utilisateur traduit

### Détection de Locale

```typescript
// Fonction de détection automatique
function getLocaleFromRequest(request: NextRequest): "en" | "fr" {
  const pathname = new URL(request.url).pathname;
  return pathname.startsWith("/fr") ? "fr" : "en";
}
```

### Routes Localisées

- **Français** : `/fr/tableau-de-bord/profil`
- **Anglais** : `/en/dashboard/profile`
- **Vérification** : `/fr/verifier-changement-email` et `/en/verify-email-change`

## Gestion d'Erreurs

### Côté Client

- **Validation en temps réel** : Feedback immédiat sur les champs
- **Messages d'erreur** : Affichage contextuel sous chaque champ
- **États de chargement** : Indicateurs visuels pendant les requêtes
- **Notifications toast** : Confirmation des actions réussies/échouées

### Côté Serveur

- **Validation Zod** : Schémas stricts pour tous les inputs
- **Gestion des exceptions** : Try-catch avec logs détaillés
- **Codes de statut HTTP** : Réponses appropriées (400, 401, 500)
- **Messages d'erreur** : Informatifs sans révéler de détails sensibles

### Cas d'Erreur Gérés

- **Token invalide ou expiré** : Message explicite avec option de renvoi
- **Email déjà utilisé** : Vérification avant création du token
- **Mot de passe incorrect** : Validation via Better Auth
- **Erreurs réseau** : Retry automatique et feedback utilisateur
- **Erreurs d'envoi d'email** : Logs détaillés pour debugging

## Tests et Validation

### Scénarios Testés

- ✅ Changement d'email avec vérification réussie
- ✅ Annulation de changement d'email
- ✅ Renvoi d'email de vérification
- ✅ Gestion des tokens expirés
- ✅ Validation des formulaires
- ✅ Redirection correcte après vérification (FR/EN)
- ✅ Notifications de sécurité
- ✅ Gestion des erreurs réseau

### Commandes de Validation

```bash
# Vérification TypeScript
npx tsc --noEmit

# Linting
npm run lint

# Build de production
npm run build
```

## Fichiers Créés/Modifiés

### Nouveaux Fichiers

- `src/components/emails/EmailChangeVerificationEmail.tsx`
- `src/components/emails/EmailChangeNotificationEmail.tsx`
- `src/components/auth/EmailChangeVerificationHandler.tsx`
- `src/app/[locale]/(auth)/verify-email-change/page.tsx`
- `src/app/api/user/email/change/route.ts`
- `src/app/api/user/email/verify/route.ts`
- `src/app/api/user/email/cancel/route.ts`
- `src/app/api/user/email/resend/route.ts`

### Fichiers Modifiés

- `src/components/dashboard/UserProfile.tsx` - Interface complète
- `src/lib/email.ts` - Nouvelles fonctions d'envoi
- `src/db/schema.ts` - Ajout du champ `pending_email`
- `messages/en.json` - Nouvelles traductions anglaises
- `messages/fr.json` - Nouvelles traductions françaises
- `migrations/0001_flashy_mimic.sql` - Migration base de données

## Améliorations Futures

### Fonctionnalités Potentielles

- **Historique des changements** : Log des modifications d'email
- **Authentification à deux facteurs** : Sécurité renforcée
- **Notification par SMS** : Alternative à l'email
- **Délai de grâce** : Période d'annulation après changement
- **Limitation de fréquence** : Prévention des abus

### Optimisations

- **Cache des templates** : Amélioration des performances
- **Queue d'emails** : Gestion asynchrone des envois
- **Monitoring** : Métriques de succès/échec
- **Tests automatisés** : Suite de tests E2E

## Configuration Requise

### Variables d'Environnement

```env
# Email (Resend)
RESEND_API_KEY=re_...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Base de données
DATABASE_URL=postgresql://...

# Better Auth
BETTER_AUTH_SECRET=32-char-secret
BETTER_AUTH_URL=http://localhost:3000
```

### Dépendances

- `@react-email/components` - Templates d'email
- `resend` - Service d'envoi d'email
- `nanoid` - Génération de tokens sécurisés
- `zod` - Validation des schémas
- `next-intl` - Internationalisation
- `sonner` - Notifications toast

## Conclusion

L'implémentation du changement d'email sécurisé suit les meilleures pratiques de sécurité et d'expérience utilisateur. Le processus en deux étapes avec double notification garantit la sécurité tout en maintenant une interface intuitive et accessible.

La solution est entièrement internationalisée, robuste face aux erreurs, et s'intègre parfaitement dans l'architecture existante de NextintelBetterAuth basée sur Better Auth et Drizzle ORM.
