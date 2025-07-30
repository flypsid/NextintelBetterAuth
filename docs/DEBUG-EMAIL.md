# Configuration Email - NextintelBetterAuth

## État Actuel

✅ **Système d'email fonctionnel** avec Better Auth et Resend
✅ **Vérification d'email** activée avec connexion automatique
✅ **Détection de locale améliorée** pour les emails multilingues
✅ **Gestion d'erreurs robuste** avec logs détaillés

## Configuration Actuelle

### Variables d'Environnement Requises

```env
# Email Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key_here

# Better Auth Configuration
BETTER_AUTH_SECRET=your-32-character-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://username:password@host/database
```

### Fonctionnalités Implémentées

- **Vérification d'email** : `requireEmailVerification: true`
- **Connexion automatique** : `autoSignInAfterVerification: true`
- **Emails bilingues** : Détection automatique de la locale
- **Domaine vérifié** : `noreply@deff-fondation.com`
- **Expiration des tokens** : 1 heure pour sécurité optimale

## Détection de Locale Améliorée

La fonction `getLocaleFromRequest` dans `src/lib/email.ts` détecte automatiquement la langue de l'utilisateur :

1. **Paramètre callbackURL** : Extrait la locale du paramètre de redirection
2. **Chemin de l'URL** : Analyse le premier segment du chemin
3. **Header Referer** : Solution de repli basée sur la page de provenance
4. **Défaut** : Anglais si aucune locale détectée

```typescript
export function getLocaleFromRequest(request?: Request): "en" | "fr" {
  // Logique de détection multicouche
  // Voir src/lib/email.ts pour l'implémentation complète
}
```

## Flux d'Authentification

### Inscription avec Vérification

1. **Inscription** : L'utilisateur s'inscrit via `/register`
2. **Email automatique** : Envoi immédiat de l'email de vérification
3. **Redirection** : Vers `/verify-email` avec instructions
4. **Vérification** : Clic sur le lien dans l'email
5. **Connexion automatique** : L'utilisateur est connecté après vérification
6. **Redirection finale** : Vers le tableau de bord

### Gestion des Erreurs

- **Logs détaillés** : Chaque étape est loggée pour le debugging
- **Gestion gracieuse** : Les erreurs d'email n'empêchent pas l'inscription
- **Retry automatique** : Possibilité de renvoyer l'email de vérification
- **Expiration sécurisée** : Tokens valides 1 heure seulement

## Middleware et Routes

Le middleware `src/middleware.ts` gère spécialement la route `/verify-email` :

```typescript
// Traitement spécial pour verify-email - permet l'accès même avec session active
const isVerifyEmailRoute = request.nextUrl.pathname.includes("/verify-email");

// Redirection vers dashboard si route d'auth avec session (sauf verify-email)
if (isAuthRoute && session && !isVerifyEmailRoute) {
  // Redirection vers dashboard
}
```

## Dépannage

### Vérification des Logs

Recherchez ces messages dans la console :

✅ **Succès** :

- `"Better Auth: Attempting to send verification email for user:"`
- `"Starting email verification send process:"`
- `"Email HTML rendered successfully"`
- `"Verification email sent successfully:"`

❌ **Erreurs** :

- `"Resend API error:"`
- `"Better Auth: Failed to send verification email"`
- `"Error parsing URL in getLocaleFromRequest:"`

### Tests Recommandés

```bash
# Vérification TypeScript
npx tsc --noEmit

# Test de l'inscription
# 1. Aller sur /register
# 2. Créer un compte
# 3. Vérifier les logs
# 4. Vérifier la réception de l'email
# 5. Cliquer sur le lien de vérification
```

### Configuration Resend

- **Domaine vérifié** : `deff-fondation.com` (temporaire)
- **Expéditeur** : `noreply@deff-fondation.com`
- **Limite** : 100 emails/jour (plan gratuit)
- **Templates** : Bilingues (français/anglais)

## Prochaines Améliorations

- [ ] Migration vers domaine `NextintelBetterAuth.app` vérifié
- [ ] Ajout de templates email personnalisés
- [ ] Monitoring des taux de délivrabilité
- [ ] Support de langues supplémentaires
