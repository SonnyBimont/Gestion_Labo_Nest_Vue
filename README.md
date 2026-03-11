# Gestion d'inventaire de laboratoire

Application full-stack pour gérer les équipements et consommables d'un laboratoire. Le projet permet de suivre les stocks, associer les articles à des fournisseurs, décrémenter les quantités lors d'une utilisation, et sécuriser l'accès via une authentification JWT.

## Fonctionnalités

- Authentification par identifiant / mot de passe avec génération d'un jeton JWT.
- Création automatique d'un compte administrateur au démarrage du backend.
- Gestion des articles du laboratoire : création, modification, suppression et consultation.
- Décrémentation du stock depuis l'interface pour enregistrer une consommation.
- Gestion des fournisseurs liés aux articles.
- Mise en évidence des stocks faibles via un seuil de réapprovisionnement.
- Interface Vue 3 simple pour se connecter et manipuler l'inventaire.

## Stack technique

- Frontend : Vue 3, TypeScript, Vite, Axios, Vue Router, Pinia
- Backend : NestJS, TypeScript, Sequelize, Passport, JWT, bcrypt, class-validator
- Base de données : PostgreSQL

## Structure du projet

```text
Lab_Gestion_Vue/
├── labo-gestion-backend/   # API NestJS + Sequelize
└── labo-gestion-frontend/  # Interface Vue 3 + Vite
```

## Prérequis

- Node.js 20 minimum
- npm
- PostgreSQL 15+ disponible en local ou via Docker

## Configuration de la base de données

Le backend utilise actuellement une configuration PostgreSQL codée en dur dans `labo-gestion-backend/src/app.module.ts` :

- hôte : `localhost`
- port : `5432`
- utilisateur : `postgres`
- mot de passe : `root`
- base : `gestion_labo`

Exemple de lancement rapide avec Docker :

```bash
docker run --name labo-postgres ^
	-e POSTGRES_USER=postgres ^
	-e POSTGRES_PASSWORD=root ^
	-e POSTGRES_DB=gestion_labo ^
	-p 5432:5432 ^
	-d postgres:15
```

Sous PowerShell, vous pouvez aussi l'écrire sur une seule ligne :

```powershell
docker run --name labo-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=root -e POSTGRES_DB=gestion_labo -p 5432:5432 -d postgres:15
```

## Installation

### 1. Backend

```bash
cd labo-gestion-backend
npm install
```

### 2. Frontend

```bash
cd ../labo-gestion-frontend
npm install
```

## Lancement en développement

Ouvrir deux terminaux.

### Terminal 1 : API NestJS

```bash
cd labo-gestion-backend
npm run start:dev
```

API disponible sur : `http://localhost:3000`

### Terminal 2 : frontend Vue

```bash
cd labo-gestion-frontend
npm run dev
```

Interface disponible sur l'URL affichée par Vite, généralement : `http://localhost:5173`

## Connexion

Au démarrage du backend, un compte administrateur est créé automatiquement s'il n'existe pas déjà.

- utilisateur : `admin`
- mot de passe : `admin123`

Le frontend stocke ensuite le JWT dans le `localStorage` et l'envoie automatiquement dans l'en-tête `Authorization` pour les appels API protégés.

## API principale

### Authentification

- `POST /auth/login` : connexion et récupération du token JWT

Exemple de payload :

```json
{
	"username": "admin",
	"password": "admin123"
}
```

### Articles

- `GET /items`
- `GET /items/:id`
- `POST /items`
- `PATCH /items/:id`
- `DELETE /items/:id`
- `POST /items/:id/decrement`

Exemple de décrémentation :

```json
{
	"amount": 1
}
```

### Fournisseurs

- `GET /suppliers`
- `GET /suppliers/:id`
- `POST /suppliers`
- `PATCH /suppliers/:id`
- `DELETE /suppliers/:id`

Les routes `items` et `suppliers` sont protégées par JWT.

## Scripts utiles

### Backend

- `npm run start:dev` : démarrage en mode développement
- `npm run build` : build de production
- `npm run test` : tests unitaires
- `npm run test:e2e` : tests end-to-end
- `npm run lint` : lint du backend

### Frontend

- `npm run dev` : serveur Vite
- `npm run build` : build de production
- `npm run preview` : prévisualisation du build
- `npm run lint` : lint global
- `npm run format` : formatage Prettier

## Remarques techniques

- Le backend utilise `sequelize-typescript` avec synchronisation automatique du schéma (`sync: { alter: true }`).
- Les modèles Sequelize TypeScript utilisent le mot-clé `declare` pour éviter de masquer les getters/setters Sequelize.
- La clé JWT est actuellement définie en dur dans le projet. Pour un déploiement réel, elle devrait être déplacée dans une variable d'environnement.
- La configuration PostgreSQL est elle aussi codée en dur et gagnerait à être externalisée dans un fichier `.env`.

## Pistes d'amélioration

- Ajouter une gestion complète des utilisateurs depuis l'interface.
- Mettre en place des variables d'environnement pour la configuration sensible.
- Ajouter des tests frontend.
- Découper `App.vue` en composants métier plus petits.
- Ajouter des filtres, de la recherche et un tableau de bord de stock.
