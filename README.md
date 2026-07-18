# 💳 Plateforme de Paiement Backend - NestJS PoC

Backend **NestJS** pour une plateforme de paiement avec authentification JWT, gestion multi-alias de paiement (bancaire/mobile money) et traitement de transactions sécurisé.

---

## 📋 Fonctionnalités Principales

- 🔐 **Authentification JWT** - Connexion par email ou téléphone
- 👥 **Gestion Utilisateurs** - Inscription/profil sécurisé
- 🏷️ **Alias de Paiement** - Multiples identités (BANK/MOBILE_MONEY) par utilisateur
- 💰 **Paiements** - Initiation, suivi (PENDING/COMPLETED/CANCELLED), historique
- 🛡️ **Sécurité** - Validation propriété, contraintes uniques, gestion erreurs

---

## 🏗️ Stack & Architecture

| Composant | Détails |
|-----------|---------|
| **Framework** | NestJS 11.0 + TypeScript |
| **Base de Données** | SQLite + Prisma ORM |
| **Auth** | JWT + Passport.js |
| **Validation** | class-validator, class-transformer |
| **Tests** | Jest + Supertest |

### Structure

```
src/
├── auth/           # JWT, login/register
├── user/           # Gestion utilisateurs (CRUD)
├── alias/          # Alias de paiement (BANK/MOBILE_MONEY)
├── paiement/       # Traitement paiements, historique
├── prisma/         # Service ORM
└── main.ts         # Entry point
```

### Modèle de Données

```
User (id, email, phoneNumber, password, timestamps)
  ├── Alias[] (aliasCode, accountType, paymentIdentifier)
  │   ├── sentPayments[] (Payment)
  │   └── receivedPayments[] (Payment)
  
Payment (id, amount, status, senderAliasId, receiverAliasId, timestamps)
```

---

## 🚀 Installation & Démarrage

### Installation
```bash
git clone https://github.com/RAYANEBIO/Proof_Of_Concept.git
cd Proof_Of_Concept
npm install
cp .env.exemple .env
npx prisma generate
```

### Variables d'Environnement (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=MaCleSecreteSuperSecureEtTresLongue123!
PORT=3000
```

### Exécution
```bash
npm run start:dev      # Mode développement (watch)
npm run start:prod     # Mode production
npm run test           # Tests unitaires
npm run test:e2e       # Tests end-to-end
```

---

## 📡 API Endpoints

### Authentification
```
POST   /auth/register    { name, email, phoneNumber, password }
POST   /auth/login       { identifier, password } → { access_token, user }
```

### Utilisateurs (JWT requis)
```
POST   /user            # Créer
GET    /user            # Lister
GET    /user/:id        # Détail
PATCH  /user/:id        # Modifier
DELETE /user/:id        # Supprimer
```

### Alias de Paiement (JWT requis)
```
POST   /alias           { name, accountType, paymentIdentifier }
GET    /alias           # Lister alias utilisateur
GET    /alias/:id       # Détail
PATCH  /alias/:id       # Modifier
DELETE /alias/:id       # Supprimer
```

### Paiements (JWT requis)
```
POST   /paiement        { senderAliasCode, receiverAliasCode, amount }
GET    /paiement/historique              # Tous les paiements
GET    /paiement/historique?status=COMPLETED  # Filtrés
```

---

## 🔄 Exemple Flux Paiement

```bash
# 1. Enregistrement
POST /auth/register
{ "name": "Alice", "email": "alice@ex.com", "phoneNumber": "+33612345678", "password": "Pass123!" }

# 2. Connexion
POST /auth/login
{ "identifier": "alice@ex.com", "password": "Pass123!" }
→ { "access_token": "JWT_TOKEN", "user": {...} }

# 3. Créer alias bancaire
POST /alias
{ "name": "Compte Bancaire", "accountType": "BANK", "paymentIdentifier": "FR14..." }

# 4. Créer alias mobile money
POST /alias
{ "name": "Orange Money", "accountType": "MOBILE_MONEY", "paymentIdentifier": "+33612345678" }

# 5. Initier paiement
POST /paiement
{ "senderAliasCode": "code1", "receiverAliasCode": "code2", "amount": 50 }
→ { "id": 1, "status": "COMPLETED", "amount": 50, ... }

# 6. Consulter historique
GET /paiement/historique
```

---

## 🛡️ Sécurité

✅ **Implémenté**
- JWT sans état
- Validation propriété (utilisateurs n'accèdent qu'à leurs données)
- Validation entrées (class-validator)
- Contraintes uniques BD
- Suppression en cascade
- Gestion erreurs (pas de fuite infos sensibles)

⚠️ **À Implémenter (Production)**
- Hachage mot de passe (bcrypt/argon2)
- Limitation de débit (rate limiting)
- HTTPS/CORS
- Tokens d'actualisation
- Journalisation audit

---

## 📦 Dépendances Clés

```json
{
  "@nestjs/core": "^11.0.1",
  "@nestjs/jwt": "^11.0.2",
  "@nestjs/passport": "^11.0.5",
  "@prisma/client": "^7.8.0",
  "passport-jwt": "^4.0.1",
  "class-validator": "^0.15.1",
  "typescript": "^5.7.3",
  "jest": "^30.0.0"
}
```

---

## 🐛 Limitations (PoC)

1. Mots de passe en texte brut → Utiliser bcrypt
2. Expiration jetons non configurée → Ajouter `expiresIn`
3. SQLite → Utiliser PostgreSQL en production
4. Simulation paiement moquée (90% succès) → APIs réelles
5. Service utilisateurs en placeholder

---

## 🎯 Prochaines Étapes

- [ ] Hachage mot de passe (bcrypt)
- [ ] Documentation Swagger/OpenAPI
- [ ] Amélioration simulation paiements
- [ ] Logs structurés (Winston/Pino)
- [ ] Couverture tests 80%+
- [ ] Déploiement cloud (Heroku/AWS)

---

## 📚 Ressources

- [NestJS Docs](https://docs.nestjs.com)
- [JWT Authentication](https://docs.nestjs.com/security/authentication)
- [Prisma ORM](https://www.prisma.io/docs)

---

## 👤 Auteur

**RAYANEBIO** - [GitHub](https://github.com/RAYANEBIO)

**Licence** : UNLICENSED (Projet privé)
