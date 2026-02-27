# Guide d'Installation - Gestion de Stage

## Prérequis

Avant de commencer, assurez-vous que vous avez installé :

- **Node.js** : version 16.x ou supérieure
  - Télécharger depuis : https://nodejs.org/
  - Vérifier l'installation : `node --version`

- **npm** ou **pnpm** : gestionnaire de paquets
  - npm est inclus avec Node.js
  - Vérifier l'installation : `npm --version`
  - (Optionnel) Installer pnpm : `npm install -g pnpm`

- **Git** : pour cloner le projet
  - Télécharger depuis : https://git-scm.com/

## Étapes d'Installation

### 1. Cloner le Projet

```bash
git clone <url-du-repository>
cd Appli-de-gestion-de-stage-main
```

### 2. Installer les Dépendances

#### Avec npm :
```bash
npm install
```

#### Avec pnpm :
```bash
pnpm install
```

### 3. Configuration de l'Environnement

Créer un fichier `.env.local` à la racine du projet :

```
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_supabase
```

### 4. Démarrer le Serveur de Développement

#### Avec npm :
```bash
npm run dev
```

#### Avec pnpm :
```bash
pnpm run dev
```

L'application sera accessible à : **http://localhost:5173**

## Structure du Projet

```
Appli-de-gestion-de-stage-main/
├── src/
│   ├── components/          # Composants React
│   ├── pages/               # Pages de l'application
│   ├── context/             # Contextes React
│   ├── data/                # Fichiers de données JSON
│   ├── layouts/             # Mises en page
│   ├── lib/                 # Utilitaires
│   ├── App.jsx              # Composant principal
│   ├── main.jsx             # Point d'entrée
│   └── index.css            # Styles globaux
├── public/                  # Fichiers publics
├── components/              # Composants UI Shadcn
├── hooks/                   # Custom hooks
├── lib/                     # Utilitaires partagés
├── app/                     # Configuration Next.js (si applicable)
├── package.json             # Dépendances du projet
├── vite.config.js           # Configuration Vite
├── tailwind.config.ts       # Configuration Tailwind CSS
└── tsconfig.json            # Configuration TypeScript
```

## Scripts Disponibles

```bash
# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la build de production
npm run preview

# Linter le code
npm run lint
```

## Fonctionnalités par Rôle

### 👨‍🎓 Étudiant
- Tableau de Bord
- Gestion des conventions de stage
- Suivi des évaluations

### 🏢 Entreprise
- Tableau de Bord
- Gestion des candidatures reçues
- Évaluation des étudiants

### 👨‍💼 Administrateur
- Tableau de Bord
- Gestion des conventions
- Consultation des rapports

## Technologies Utilisées

- **React** : Framework UI
- **Vite** : Bundler et serveur de développement
- **Tailwind CSS** : Framework CSS
- **React Router** : Navigation
- **Shadcn/ui** : Composants UI
- **Supabase** : Base de données (optionnel)

## Dépannage

### Port déjà utilisé
Si le port 5173 est déjà utilisé :
```bash
npm run dev -- --port 3000
```

### Problèmes d'installation des dépendances
```bash
# Supprimer node_modules et réinstaller
rm -r node_modules
npm install
```

### Erreurs de TypeScript
```bash
# Vérifier la configuration TypeScript
npm run build
```

## Support et Aide

En cas de problème :
1. Vérifier les logs de la console
2. S'assurer que tous les prérequis sont installés
3. Consulter la documentation officielle :
   - React : https://react.dev
   - Vite : https://vitejs.dev
   - Tailwind CSS : https://tailwindcss.com

## Déploiement

Pour déployer l'application en production :

```bash
npm run build
```

Les fichiers compilés seront dans le dossier `dist/`

Vous pouvez ensuite déployer ce dossier sur un serveur d'hébergement (Vercel, Netlify, etc.)

---

**Date de création** : 26 février 2026
**Version** : 1.0.0
