# ParkInfo - Gestion de Parc Informatique

Application de gestion de parc informatique développée avec React, TypeScript, et SQLite.

## Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Git

## Installation

1. Clonez le dépôt :
```bash
git clone [URL_DU_REPO]
cd parkinfo
```

2. Installez les dépendances :
```bash
npm install
```

3. Démarrez l'application en mode développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse http://localhost:5173

## Structure de la base de données

L'application utilise SQLite pour la persistance des données. La base de données est automatiquement créée au premier lancement dans le fichier `parkinfo.db`.

### Tables

#### Assets (Équipements)
- id (TEXT PRIMARY KEY)
- name (TEXT)
- type (TEXT)
- status (TEXT)
- user (TEXT)
- installDate (TEXT)
- site (TEXT)
- function (TEXT)
- brand (TEXT)
- model (TEXT)
- serialNumber (TEXT)
- operator (TEXT)
- comments (TEXT)
- deleted (INTEGER)
- ipAddress (TEXT)
- macAddress (TEXT)
- service (TEXT)

#### Users (Utilisateurs)
- id (TEXT PRIMARY KEY)
- site (TEXT)
- firstName (TEXT)
- lastName (TEXT)
- function (TEXT)
- role (TEXT)
- password (TEXT)
- deleted (INTEGER)

## Fonctionnalités

- Gestion des équipements informatiques
- Gestion des utilisateurs
- Recherche globale
- Interface responsive
- Mode sombre/clair
- Filtrage et tri des données
- Gestion des suppressions douces (soft delete)

## Technologies utilisées

- React
- TypeScript
- Vite
- TailwindCSS
- SQLite (better-sqlite3)
- React Router
- Lucide Icons